import CONFIG from "./config.js";

const OTPMin = CONFIG.OTP_VALID_MIN;

const getOTPExpiryTime = () => {
    const totalSec = Date.now()+(5*60*60 + 30*60)*1000;
    const date = new Date(totalSec + OTPMin*60*1000);
    return date;
}

export default getOTPExpiryTime;