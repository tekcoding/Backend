const generateOTP = () => {
    let otp = "";
    for (let index = 0; index < 6; index++) { 
        otp += (Math.floor(Math.random() * 10)).toString();
    }
    return otp;
}

export default generateOTP;