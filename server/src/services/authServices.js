import bcrypt from "bcryptjs";
import User from "../models/users.js";
import logger from "../utils/logger.js";

export class AuthService {
  static async registerUser({ name, email, password }) {
    try {
      if (!name) {
        throw new Error("Name is required.");
      }

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        logger.warn(`Registration attempt with existing email: ${email}`);
        throw new Error("An account with this email already exists.");
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = new User({ name, email, password: hashedPassword });
      await newUser.save();
      logger.info(`New user registered: ${email}`);
      return newUser;
    } catch (error) {
      logger.error(`Error during user registration: ${error.message}`);
      throw error;
    }
  }

  static async loginUser({ email, password }) {
    try {
      const user = await User.findOne({ email });

      if (!user) {
        logger.warn(`Login attempt for non-existent user: ${email}`);
        throw new Error("User not found.");
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        logger.warn(`Failed login attempt for user: ${email}`);
        throw new Error("Incorrect password.");
      }

      logger.info(`User logged in successfully: ${email}`);
      return user;
    } catch (error) {
      logger.error(`Error during user login: ${error.message}`);
      throw error;
    }
  }
}
