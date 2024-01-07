import mongoose from "mongoose";
import CONFIG from "../app/utils/config.js";

const userCollection = CONFIG.USER_COLLECTION;
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique:true,
        require:true
    },
    userType:{
        type: String,
        enum: ["normal user", "admin user"],
        default: "normal user"
    },
    emailVerified:{
        type: Boolean,
        default: false
    },
    phoneVerified:{
        type: Boolean,
        default: false
    },
    phoneNo: {
        type: String,
        unique:true,
    },
    firstName: {
        type:String
    },
    middleName: {
        type:String
    },
    lastName: {
        type:String
    },
    password: {
        type: String,
    },
    socialProvider: {
        type: String,
        enum: ["Website", "Google"],
        default: "Website"
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    }
},{
    timestamps:true
})

export default mongoose.model(userCollection,userSchema);