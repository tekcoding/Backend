import config from "./config.js";
import nodemailer from "nodemailer";

const email = config.EMAIL;
const password = config.EMAIL_PASSWORD;

const sendMail = async (userEmail, option) => {
  let data = {
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: email,
      pass: password,
    },
    tls: {
      rejectUnauthorized: false,
    },
  }
  try {
    let transporter = nodemailer.createTransport(data);
    await transporter.sendMail({
      from: email,
      to: userEmail,
      subject: option.subject,
      html: option.html,
    });
    return true;
  } catch (err) {
    return false;
  }
};
export default sendMail;
