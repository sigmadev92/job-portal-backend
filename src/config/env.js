import { config } from "dotenv";

config();

const PORT = process.env.PORT || 1008;
const MONGO_URI = process.env.MONGO_URI;
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const EXPIRES_IN = process.env.EXPIRES_IN;
const SALT_ROUNDS = process.env.SALT_ROUNDS;
const USER_MAIL = process.env.USER_MAIL;
const USER_PASS = process.env.USER_PASS;

export {
  PORT,
  MONGO_URI,
  JWT_SECRET_KEY,
  EXPIRES_IN,
  SALT_ROUNDS,
  USER_MAIL,
  USER_PASS,
};
