import mongoose from "mongoose";
import dotenv from "dotenv";
import logger from "./src/utils/logger.js";

dotenv.config();

const connectDB = async () => {
  try {
    const mongoUrl = process.env.MONGODB_URL;
    // checking mongoDb url is available before connecting to avoid undefined
    if (!mongoUrl) {
      throw new Error("MONGODB_URL environment variable is not defined");
    }
    const client = await mongoose.connect(mongoUrl);
    logger.info(`MongoDB Connected`);
  } catch (err) {
    logger.error(`Error: ${err.message}`);
    process.exit(1); // Exit process with failure
  }
};

export default connectDB;
