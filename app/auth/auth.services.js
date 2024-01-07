import config from "../utils/config.js";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import sendMail from "../utils/sendMail.js";
import { connect } from "../../db/mongodb.js";
import generateOTP from "../utils/generateOTP.js"
import getDateIST from "../utils/getDateIST.js"
import getOTPExpiryTime from "../utils/getOTPExpiryTime.js"
import verifyGoogleLoginToken from "../utils/verifyGoogleLoginToken.js";
import userSchema from "../../models/userSchema.js";

const saltRounds = config.SALT;
const jwtSecret = config.JWT_SECRET || config.JWT_SECRET_SEC;
const userCollection = config.USER_COLLECTION;
const userValidCol = config.USER_VALIDATION_COLLECTION;

export const login = async (req, res) => {
    // Check if the user is already logged in. If so, redirect to homepage.
    try {
        const { db } = await connect();
        const { email, password } = req.body;
        const userExist = await db.collection(userCollection).findOne({ email })

        if (typeof password !== 'string') {
            throw new Error('Password must be a string');
        }

        if (userExist && bcrypt.compareSync(password, userExist.password)) {
            let token = jwt.sign(userExist, jwtSecret);
            res.status(200).json({ success: true, token, message: "Successfull Logged In" });
        }
        else {
            res.status(501).json({ message: "Invalid Credentials" });
        }
    } catch (error) {
        console.error("Error in user LOGIN route:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export const signup = async (req, res) => {
    try {
        const { db } = await connect();
        const { firstName, middleName, lastName, email, phoneNo } = req.body;
        const password = bcrypt.hashSync(req.body.password, saltRounds);
        const user = userSchema({ firstName, middleName, lastName, email, phoneNo, password });
        if (password) {
            await db.collection(userCollection).insertOne(user);
            if (email) {
                //I want to mail
                // sendMail(email,"Greeting","Hello");
            }
            return res.status(200).json({ message: "User created" });
        }
        res.status(501).json({ message: "Error in saving User info" });

    } catch (error) {
        console.error("Error in user SIGNUP route:", error);
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
        const OTPData = { userID: userExist._id, userName: userExist.email, OTP, createdAt: getDateIST(), terminatedAt: getOTPExpiryTime() }
        const userValid = await db.collection(userValidCol).replaceOne({ userID: userExist._id }, OTPData, { upsert: true })

        if (userValid && !userValid.acknowledged)
            throw new Error("Something went wrong try again.")
        sendMail(userExist.email, `forgot password`, `Your OTP is ${OTP}`)
        return res.status(200).json({ message: "OTP Send Successfully" })
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

        return res.status(200).json({ success: true, message: "Password Change Successfully" })
    }
    catch (err) {
        return res.status(404).json({ success: false, message: err.message });
    }
}

export const updateData = async (req, res) => {
    const { db } = await connect();
    try {
        const { firstName, middleName, lastName, password, phoneNo, email } = req.body;
        const filter = { email };
        let fields = {};

        if (firstName !== null && firstName !== undefined) fields = { ...fields, firstName };
        if (middleName !== null && middleName !== undefined) fields = { ...fields, middleName };
        if (lastName !== null && lastName !== undefined) fields = { ...fields, lastName };
        if (password !== null && password !== undefined) fields = { ...fields, password };
        if (phoneNo !== null && phoneNo !== undefined) fields = { ...fields, phoneNo };
        if (email !== null && email !== undefined) fields = { ...fields, email };

        const update = { $set: fields }

        const user = await db.collection(userCollection).findOne(filter)
        if (!user) {
            return res.status(404).json({ message: "User Not Found" });
        }

        const result = await db.collection(userCollection).updateOne(filter, update)
        // console.log(result)
        res.status(200).json({ message: "User updated" });

    } catch (error) {
        console.error("Error in user PATCH route:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export const socialSignupWithGoogle = async (req, res) => {
    const {db} = await connect();
    try {
        const payload = await verifyGoogleLoginToken(req.body.token);
        const firstName = payload.given_name;
        const lastName = payload.family_name;
        const email = payload.email;
        const user = userSchema({
            firstName,
            lastName,
            email,
            emailVerified: true,
            socialProvider: "Google"
        })
        const result = await db.collection(userCollection).insertOne(user);
        res.status(200).json({ message: "User updated" });
    } catch (error) {
        console.error("Error in login by google route:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}