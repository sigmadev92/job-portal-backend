import nodemailer from "nodemailer";
let config = {
  service: "gmail",
  auth: {
    user: process.env.MY_EMAIL,
    pass: process.env.APP_PASSWORD,
  },
};
export const transporter = nodemailer.createTransport(config);
