import Users from "../../Models/Users.js";
import bcrypt from "bcrypt";
import gererator from "generate-password";
import { unlink } from "fs/promises";
import { transporter } from "../../Config/mail.js";

const saltRounds = Number(process.env.SALTROUNDS) || 10;
const salt = await bcrypt.genSalt(saltRounds);

const registerUser = async (req, res) => {
  console.log("Arrived at POST backend/users/register");
  console.log(req.body.Password);
  //DANGER_ALERt
  if (req.body.Email === process.env.MY_EMAIL) {
    deletefiles(req.body.USER_ID);
    console.log("Email same as HOST");
    return res.send({
      status: false,
      message: "ALERT-DANGER",
    });
  }

  if (req.body.isTestData) {
    console.log("TESTING DATA-> REGISTRATION");
    const testUser = await Users.findOne({ Email: req.body.Email });
    if (testUser) {
      const stringBeforeDomain = req.body.Email.split("@")[0];
      const beforeNUmber = stringBeforeDomain.split(".")[0];
      const number = Number(stringBeforeDomain.split(".")[1]) + 1;
      req.body.Email = beforeNUmber + "." + number + "@test.com";
    }
  } else {
    const userExists = await Users.findOne({
      $or: [{ Email: req.body.Email }, { PhoneNumber: req.body.PhoneNumber }],
    });

    if (userExists) {
      deletefiles(req.body.USER_ID);
      console.log("User already registered ");
      return res.send({
        status: false,
        message: "Error: User is already Registered",
      });
    }
  }
  req.body.ProfilePic = req.files.ProfilePic[0].originalname;

  //step-2 If the UserType is seeker then we have to add field for resume.
  if (req.body.UserType === "seeker") {
    req.body.Resume = req.files.Resume[0].originalname;
  }

  if (req.body.isTestData) {
    const newUser = await Users(req.body);
    await newUser.save();
    console.log("user Registered Successfully");
    return res.send({
      status: true,
    });
  }

  try {
    //If user is not already registered
    //step-1 we will add name of profile pic t o ProfilePic field.

    //step-3 Protecting passwords using hashing
    const enteredPassword = req.body.Password;
    const hashedPassword = await bcrypt.hash(enteredPassword, salt);
    if (hashedPassword) {
      console.log("Password hashed successfully");
      req.body.Password = hashedPassword;

      const newUser = await Users(req.body);
      await newUser.save();
      //send a verification mail consisting of verification otp to registered mailId.
      //setp-1 generate an OTP
      const OTP = gererator.generate({
        length: 6,
        numbers: true,
        symbols: "#$@_",
        strict: true,
      });
      let message = {
        from: process.env.MY_EMAIL,
        to: req.body.Email,
        subject: "Verify Your Mail Id",
        html: `<P>Dear ${req.body.FullName} <br/>You have successfully registered with our website JobSoft as a ${req.body.UserType}.As a last step, you are requested to fill this verification code ${OTP} to the verification box provided so that we can verify your mail ID.Your credentials : ${req.body.Email} and password ${enteredPassword} <br/>Team JobSoft</p>`,
      };

      transporter
        .sendMail(message)
        .then(() => {
          console.log(`OTP is ${OTP} sent successfully`);
          return res.send({
            status: true,
            code: OTP,
            USER_ID: req.body.USER_ID,
          });
        })
        .catch((err) => {
          deletefiles(req.body.USER_ID);
          console.log(err);
          res.send({
            status: false,
            message: "ERROR_SERVER_TO_MAIL_ERROR",
          });
        });
    } else {
      console.log("Password can't be hashed due to some error");
      return res.send({
        status: false,
        message: "HASH_ALGO_FAILED",
      });
    }
  } catch (err) {
    deletefiles(req.body.USER_ID);

    console.log(err);
    res.send({
      status: false,
      message: err.message,
    });
  }
};

function deletefiles(user_id) {
  console.info("THIS RAN FOR THE TIME");
  try {
    unlink(
      `C:\\Users\\DELL\\Desktop\\Software\\MERN\\CODSOFT\\Level2\\Task2_JobBoard\\backend\\profilepics\\images-${user_id}.jpg`
    );
    unlink(
      `C:\\Users\\DELL\\Desktop\\Software\\MERN\\CODSOFT\\Level2\\Task2_JobBoard\\backend\\resumes\\resumes-${user_id}.pdf`
    );
  } catch (error) {
    console.log(error);
  }
}

const UserLogin = async (req, res) => {
  console.log("Arrived at POST backend/users/login");
  try {
    const user = await Users.findOne({ Email: req.body.Email });

    if (!user) {
      console.log("Invalid Email");
      return res.send({ status: false, message: "Invalid Email" });
    }
    console.log(user.Password, req.body.Password);
    if (user.isTestData) {
      console.log("LOGIN=>Test Data");
      const isPasswordMatches = req.body.Password === user.Password;
      return res.send({
        status: isPasswordMatches,
        jwt: isPasswordMatches && user._id,
        message: isPasswordMatches || "Invalid Password",
      });
    }
    const isPasswordMatches = await bcrypt.compare(
      req.body.Password,
      user.Password
    );
    return res.send({
      status: isPasswordMatches,
      jwt: isPasswordMatches && user._id,
      message: isPasswordMatches || "Invalid Password",
    });
  } catch (error) {
    console.log("ERROR CAME IN LOGIN  ROUTE");
    console.log(error);
    res.send({
      status: false,
      message: error.message,
    });
  }
};

const authentication = async (req, res) => {
  console.log("Arrived at GET backend/users/authentication");
  console.log(req.headers.auth);

  try {
    const user = await Users.findOne({ _id: req.headers.auth });
    if (user) {
      return res.send({
        status: true,
        data: user,
      });
    }
  } catch (error) {
    console.log(error);
    res.send({
      status: false,
      message: error.message,
    });
  }
};

const getUserDetails = async (req, res) => {
  console.log(`GET backend/users/details/${req.params.user_id}`);
  console.log(req.params);
  try {
    const user = await Users.findOne({ USER_ID: req.params.user_id });
    if (user) {
      return res.send({
        status: true,
        data: user,
      });
    }
  } catch (error) {
    console.log(error);
    res.send({
      status: false,
      message: error.message,
    });
  }
};

export { registerUser, UserLogin, authentication, getUserDetails };
