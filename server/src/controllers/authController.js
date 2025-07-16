import passport from "passport";
import logger from "../utils/logger.js";
import { generateAccessToken } from "../utils/jwt.js";

export class AuthController {
  static registerUser(req, res, next) {
    return passport.authenticate(
      "signup",
      { session: false },
      (err, user, info) => {
        if (err) {
          logger.error("Error during registration:", err);
          return res
            .status(500)
            .json({ message: "An internal server error occurred." });
        }
        if (!user) {
          return res
            .status(400)
            .json({ message: info.message || "Registration failed." });
        }
        return res.status(201).json({
          message: "User registered successfully.",
          user: { id: user.id, name: user.name, email: user.email },
        });
      }
    )(req, res, next);
  }

  static logInUser(req, res, next) {
    return passport.authenticate(
      "login",
      { session: false },
      (err, user, info) => {
        if (err) {
          logger.error("Error during login:", err);
          return res
            .status(500)
            .json({ message: "An internal server error occurred." });
        }
        if (!user) {
          return res
            .status(401)
            .json({ message: info.message || "Login failed." });
        }

        // Generate JWT
        const payload = { id: user.id, email: user.email };
        const token = generateAccessToken(payload);

        logger.info(`User logged in successfully: ${user.email}`);
        return res.json({
          message: "Login successful.",
          token: `Bearer ${token}`,
          user: { id: user.id, name: user.name, email: user.email },
        });
      }
    )(req, res, next);
  }

  static async logOutUser() {
    try {
    } catch {}
  }
}
