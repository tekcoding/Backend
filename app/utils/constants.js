import { welcomeHTML, forgotPassHTML } from "../email/email.js";

export const getForgotPasswordEmailOption = (username, otp) => {
    let forgotHtml = forgotPassHTML.replace('{{userName}}', username);
    forgotHtml = forgotHtml.replace('{{OTP}}', otp);
    const forgotPasswordTemplate = {
        subject: "Tek Coding | Forgot password OTP",
        html: forgotHtml
    }
    return forgotPasswordTemplate
}


export const getWelcomeEmailOption = (username) => {
    let welcomeHtml = welcomeHTML.replace('{{userName}}', username)
    const welcomeTemplate = {
        subject: "Welcome to Tek Coding",
        html: welcomeHtml
    }
    return welcomeTemplate
}

