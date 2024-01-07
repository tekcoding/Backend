import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import sendMail from "../utils/sendMail.js";
import { connect } from "../../db/mongodb.js";
import generateOTP from "../utils/generateOTP.js"
import getDateIST from "../utils/getDateIST.js"
import getOTPExpiryTime from "../utils/getOTPExpiryTime.js"
import userSchema from "../../models/userSchema.js";
import { getForgotPasswordEmailOption, getWelcomeEmailOption } from "../utils/constants.js";
import certificateSchema from "../../models/certificateSchema.js";
import CONFIG from "../utils/config.js";
import uploadCertificate from '../utils/imageKitUploadImage.js';

const saltRounds = CONFIG.SALT;
const jwtSecret = CONFIG.JWT_SECRET;
const userCollection = CONFIG.USER_COLLECTION;
const certificateCollection = CONFIG.CERTIFICATE_COLLECTION;
const userValidCol = CONFIG.USER_VALIDATION_COLLECTION;


export const login = async (req, res) => {
    // Check if the user is already logged in. If so, redirect to homepage.
    try {
        const { db } = await connect();
        const { email, password } = req.body;
        const userExist = await db.collection(userCollection).findOne({ email });
        if (typeof password !== 'string') {
            throw new Error('Password must be a string');
        }

        if (userExist && bcrypt.compareSync(password, userExist.password)) {
            let token = jwt.sign({ id: userExist._id, isAdmin: userExist.userType === "admin user", isUser: userExist.userType === "normal user" }, jwtSecret, { expiresIn: '3h' });
            res.status(200).json({ success: true, token, message: "Successfull Logged In" });
        }
        else {
            res.status(400).json({ success: false, message: "Invalid Credentials" });
        }
    } catch (error) {
        console.error("Error in user LOGIN route:", error);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
}

export const signup = async (req, res) => {
    try {
        const { db } = await connect();
        const { firstName, middleName, lastName, email, phoneNo } = req.body;
        const password = bcrypt.hashSync(req.body.password, saltRounds);
        const user = userSchema({ firstName, middleName, lastName, userType: "admin user", email, phoneNo, password });
        if (password) {
            await db.collection(userCollection).insertOne(user);
            if (email) {
                //I want to mail
                sendMail(email, getWelcomeEmailOption(firstName));
            }
            return res.status(200).json({ message: "Admin created" });
        }
        res.status(501).json({ message: "Error in saving Admin info" });

    } catch (error) {
        console.error("Error in Admin SIGNUP route:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export const forgotPassword = async (req, res) => {
    const { db } = await connect()
    const email = req.body.email;
    try {
        const userExist = await db.collection(userCollection).findOne({ email });

        if (!userExist) throw new Error("User Not Exist");
        if (!userExist.email) throw new Error("Email ID not exists");

        const OTP = generateOTP();
        const OTPData = { userID: userExist._id, email: userExist.email, OTP, createdAt: getDateIST(), terminatedAt: getOTPExpiryTime() }
        const userValid = await db.collection(userValidCol).replaceOne({ userID: userExist._id }, OTPData, { upsert: true })

        if (userValid && !userValid.acknowledged)
            throw new Error("Something went wrong try again.")
        sendMail(email, getForgotPasswordEmailOption(userExist.firstName, OTP))
        return res.status(200).json({ success: true, message: "OTP Send Successfully" })
    }
    catch (err) {
        return res.status(501).json({ success: false, message: err.message })
    }

}

export const updatePassword = async (req, res) => {
    const { db } = await connect();
    const { email, OTP } = req.body;
    try {
        const userExist = await db.collection(userValidCol).findOne({ email: email })

        if (!userExist) throw new Error("Invalid request");
        if (!userExist.OTP || userExist.OTP !== OTP) throw new Error("Invalid OTP");
        if (getDateIST().getTime() >= userExist.terminatedAt.getTime()) throw new Error("OTP TimeOut")

        const hashPass = bcrypt.hashSync(req.body.password, saltRounds);
        const newUserData = await db.collection(userCollection).updateOne({ email }, { $set: { password: hashPass } })
        await db.collection(userValidCol).updateOne({ email }, { $set: { OTP: null } })
        if (newUserData && !newUserData.acknowledged) throw new Error("Something went wrong");

        return res.status(200).json({ success: true, message: "Password Updated Successfully" })
    }
    catch (err) {
        return res.status(404).json({ success: false, message: err.message });
    }
}

export const addVerificationCertificate = async (req, res) => {
    const { db } = await connect();
    const { email, userName, dob, phone, courseDetail } = req.body;
    try {

        const userExist = await db.collection(certificateCollection).findOne({ email });
        if (userExist) {
            const courseNewArr = userExist.courseDetails.filter((course) => course.certificateID === courseDetail.certificateID);
            if (courseNewArr.length === 0) {
                const certificateUrl = await uploadCertificate(courseDetail.certificateImg, courseDetail.certificateID, courseDetail.optYear, courseDetail.optMonth);
                courseDetail.certificateIkUrl = certificateUrl;
                await db.collection(certificateCollection).updateOne({ email }, {
                    $addToSet: {
                        courseDetails: courseDetail
                    }
                });
                return res.status(200).json({ success: true, message: "Course details Updated successfully", ImageUrl: courseDetail.certificateIkUrl });
            }
            return res.status(200).json({ success: true, message: "Course details Already Exist" });
        }

        const certificateUrl = await uploadCertificate(courseDetail.certificateImg, courseDetail.certificateID, courseDetail.optYear, courseDetail.optMonth);
        courseDetail.certificateIkUrl = certificateUrl;
        const userData = certificateSchema({ email, userName, dob, phone, courseDetails: [courseDetail] });
        await db.collection(certificateCollection).insertOne(userData);

        return res.status(200).json({ success: true, message: "Course details added successfully", ImageUrl: courseDetail.certificateIkUrl });
    } catch (err) {
        console.log(err)
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}