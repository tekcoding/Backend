import mongoose from "mongoose";
import CONFIG from "../app/utils/config.js";

const userValidationCollection = CONFIG.USER_VALIDATION_COLLECTION
const userValidationSchema = new mongoose.Schema({
    email:{
        type:String,
        unique:true
    },
    userID:{
        type:String,
        unique:true
    },
    OTP:{
        type:String,
        length:6
    },
    createdAt:{
        type:Date
    },
    terminatedAt:{
        type:Date
    }
})

export default mongoose.model(userValidationCollection,userValidationSchema);