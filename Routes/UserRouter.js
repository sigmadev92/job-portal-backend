import express from "express";
import Users from "../Models/Users.js";
import upload from "../Config/multerConfig.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import gererator from "generate-password";
import nodemailer from "nodemailer";
import { auth } from "../middlewares.js";
import {
  authentication,
  getUserDetails,
  registerUser,
  UserLogin,
} from "./contollers/users.js";

dotenv.config();
const UserRouter = express.Router();
let config = {
  service: "gmail",
  auth: {
    user: process.env.MY_EMAIL,
    pass: process.env.APP_PASSWORD,
  },
};
let transporter = nodemailer.createTransport(config);
UserRouter.get("/", (req, res) => {
  res.send("<p>reached Seeker's Route</p>");
});

//ROUTE-1 REGISTRATION
UserRouter.post(
  "/register",
  auth,
  upload.fields([
    { name: "ProfilePic", maxCount: 1 },
    { name: "Resume", maxCount: 1 },
  ]),
  registerUser
);

//ROUTE-2 LOGIN
UserRouter.post("/login", UserLogin);

//ROUTE-3 AUTHENTICATION
UserRouter.get("/auth", authentication);

//ROUTE-4 Get Details of specific user(Key=>UserId)
UserRouter.get("/details/:user_id", getUserDetails);

//The control will come here only if the code entered by user is equal to the
// verification code.
UserRouter.put("/verify-mail/:user_id", async (req, res) => {
  console.log("Arrived here at PUT backend/users/verify-email");

  await Users.updateOne(
    { USER_ID: req.params.user_id },
    { IsMailVerified: true }
  )
    .then(() => res.send({ status: true }))
    .catch((err) => {
      console.log(err);
      res.send({ status: false, message: err.message });
    });
});

UserRouter.get("/forget-password/:email", async (req, res) => {
  console.log("Arrived at GET backend/users/forget-password", req.params.email);
  const UserEmail = await Users.findOne({ Email: req.params.email });
  if (!UserEmail) {
    return res.send({
      status: false,
      message: "ERROR_INVALID_EMAIL",
    });
  }

  ///IF USER FOUND THEN WE HAVE TO SEND A TEMPORARY PASSWORD TO THIS EMAIL and STORE THIS TEMP_PASSWORD in THE DB.

  //step-1 CREATE A TEMPORARY PASSWORD using generate-password library

  const password = gererator.generate({
    length: 10,
    numbers: true,
    uppercase: true,
    lowercase: true,
    symbols: "#$@_",
    strict: true,
  });

  console.log("stp-1 done");
  //step-2 Hash this password
  const hashedPassword = await bcrypt.hash(password, salt);
  try {
    await Users.updateOne(
      { Email: req.params.email },
      { $set: { Password: hashedPassword } }
    );
  } catch (err) {
    console.log(err);
    return res.send({
      status: false,
      message: err.message,
    });
  }

  console.log("step-2 done");

  //Pasword is stored in DB. We have to send it to Email of user using nodemailer

  //Approach-1 with the testing account
  /*
  {
  const testAccount = await nodemailer.createTestAccount();
  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });

  let message = {
    from: "",
    to: "madularscorpian194@gmail.com",
    subject: "password change",
    text: `password is ${password}`,
    html: "",
  };

  transporter
    .sendMail(message)
    .then((info) => {
      return res.status(201).json({
        status: true,
        msg: "you should recieve an email",
        info: info.messageId,
        preview: nodemailer.getTestMessageUrl(info),
      });
    })
    .catch((error) => {
      return res.status(500).json({ error });
    });
  }
    */
  //Approach with a real account

  let message = {
    from: process.env.MY_EMAIL,
    to: req.params.email,
    subject: "Alert! Your Password is Changed",
    html: `<P>Dear ${UserEmail.FullName} <br/>Your new password is ${password}. Do not share it with anyone. You can change it later in dashboard .<br/>Team JobSoft</p>`,
  };

  transporter
    .sendMail(message)
    .then(() => {
      return res.send({
        status: true,
      });
    })
    .catch((err) => {
      console.log(err);
      res.send({
        status: false,
        message: "ERROR_SERVER_TO_MAIL_ERROR",
      });
    });
});

UserRouter.get("/usertype/:user_type", async (req, res) => {
  console.log(`${Date()} `);
  try {
    const response = await Users.find({ UserType: req.params.user_type });
    return res.send({
      status: true,
      data: response,
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: false,
      message: error.message,
    });
  }
});
UserRouter.put("/edit-user/:user_id", async (req, res) => {
  console.log("Arrived at PUT backend/users/edit-user");
  try {
    const response = await Users.updateOne(
      { USER_ID: req.params.user_id },
      req.body
    );
    console.log(response);
    return res.send({
      status: true,
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: false,
      message: error.message,
    });
  }
});

UserRouter.put(
  "/edit-profile-pic",
  upload.single("ProfilePic"),
  async (req, res) => {
    console.log("Arrived on PUT backend/users/edit-profile-pic");
    try {
      return res.send({
        status: true,
      });
    } catch (error) {
      console.log(error);
      res.send({
        status: false,
        message: error.message,
      });
    }
  }
);
export default UserRouter;
