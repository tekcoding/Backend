import { Schema, model } from "mongoose";
import CONFIG from "../app/utils/config.js";

const certificateCollection = CONFIG.CERTIFICATE_COLLECTION;

const courseDetail = new Schema({
    courseName: {
        type: String,
        required: true,
        enum: ["FullStack Web Development", "Frontend Web Development", "Backend Web Development", "Python Development", "Java Development", "C++ Development", "C Development",]
    },
    optMonth: {
        type: String,
        required: true,
        enum: ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"]
    },
    optYear: {
        type: String,
        required: true
    },
    certificateID: {
        type: String,
        required: true,
        unique: true
    },
    certificateImg: {
        type: String,
        required: true
    },
    certificateIkUrl: {
        type: String,
        required: true,
        unique: true,
    }
}, { _id: false })

const phoneNo = new Schema({
    countryCode: {
        type: String
    },
    phoneNo: {
        type: Number,
        unique: true
    },
}, { _id: false })

const Name = new Schema({
    firstName: {
        type: String,
        require: true
    },
    middleName: {
        type: String,
    },
    lastName: {
        type: String,
        require: true
    },
}, { _id: false })

const certificateSchema = new Schema({
    email: {
        type: String,
        unique: true,
    },
    userName: {
        type: Name,
    },
    dob: {
        type: String,
    },
    phone: {
        type: phoneNo,
    },
    courseDetails: [courseDetail],
    createdAt: {
        type: Date,
        default: Date.now(),
    }
},
    { timestamps: true }
)

export default model(certificateCollection, certificateSchema);