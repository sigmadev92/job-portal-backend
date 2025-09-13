import mongoose from "mongoose";
import { MONGO_URI } from "./env.js";
const dbConnectionMongoose = async () => {
  try {
    await mongoose.connect(MONGO_URI, {});
    console.log("Connected to MongoDB using Mongoose!!");
  } catch (err) {
    console.log(MongoURI);
    console.log(`Error in connecting to the database: ${err}`);
    console.log("error in DB Connection!");
  }
};
export default dbConnectionMongoose;
