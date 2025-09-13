import nodemailer from "nodemailer";
import { USER_MAIL } from "../config/env.js";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: USER_MAIL,
    pass: USER_PASS,
  },
});

async function sendTheMail({ subject, receiver, htmlContent }) {
  await transporter.sendMail({
    subject,
    from: USER_MAIL,
    to: receiver,
    html: htmlContent,
  });
}

export default sendTheMail;
