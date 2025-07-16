import passport from "passport";
import logger from "../utils/logger.js";

export const authenticateUser = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user, info) => {
    if (err) {
      logger.error("JWT Authentication Error:", err);
      return next(err);
    }
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    req.user = user;
    return next();
  })(req, res, next);
};
