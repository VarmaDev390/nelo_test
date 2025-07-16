import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { generateAccessToken } from "../utils/jwt.js";
import bcrypt from "bcryptjs";
import logger from "../utils/logger.js";
import dotenv from "dotenv";
import User from "../models/users.js";
import { AuthService } from "../services/authServices.js";

dotenv.config();

passport.use(
  "signup",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true, // Allows us to pass the request to the callback
    },
    async (req, email, password, done) => {
      try {
        const { name } = req.body;
        const user = await AuthService.registerUser({ name, email, password });
        return done(null, user);
      } catch (error) {
        logger.error(`Error during user registration: ${error.message}`);
        return done(null, false, { message: error.message });
      }
    }
  )
);

passport.use(
  "login",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      try {
        const user = await AuthService.loginUser({ email, password });
        return done(null, user);
      } catch (error) {
        return done(null, false, { message: error.message });
      }
    }
  )
);

passport.use(
  "jwt",
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.ACCESS_TOKEN_SECRET,
    },
    async (payload, done) => {
      try {
        const user = await User.findById(payload.id);
        if (user) {
          return done(null, user);
        }
        return done(null, false);
      } catch (error) {
        return done(error, false);
      }
    }
  )
);
