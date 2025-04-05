import dotenv from "dotenv";

dotenv.config();
const auth = async (req, res, next) => {
  console.log("Middle ware to check userAuth");

  try {
    if (process.env.SECRET_KEY === req.headers.secretkey) {
      // console.log(req.headers);
      // console.log(process.env.SECRET_KEY);
      next();
    } else
      res.send({
        status: false,
        message: "Invalid API KEY",
      });
  } catch (error) {
    console.log(error);
    res.send({
      status: false,
      message: error.message,
    });
  }
};

export { auth };
