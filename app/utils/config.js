import dotenv from 'dotenv';
dotenv.config()

const CONFIG =  {
        JWT_SECRET: process.env.JWT_SECRET,
        MONGO_URL: process.env.MONGO_URL,
        EMAIL: process.env.EMAIL,
        EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,
        CLIENT_ID: process.env.CLIENT_ID,
        CLIENT_SECRET: process.env.CLIENT_SECRET,
        PORT: process.env.PORT,
        DB_NAME: process.env.DB_NAME,
        IK_NAME: process.env.IK_NAME,
        USER_COLLECTION: process.env.USER_COLLECTION,
        CERTIFICATE_COLLECTION: process.env.CERTIFICATE_COLLECTION,
        USER_VALIDATION_COLLECTION: process.env.USER_VALIDATION_COLLECTION,
        IK_PUBLIC_KEY: process.env.IK_PUBLIC_KEY,
        IK_PRIVATE_KEY: process.env.IK_PRIVATE_KEY,
        OTP_VALID_MIN: process.env.OTP_VALID_MIN,
        SALT: process.env.SALT,
        IK_CERTFICATE_FOLDER: process.env.IK_CERTFICATE_FOLDER,
}

export default CONFIG;