import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config({ path: "../../env" });

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

export const generateAccessToken = (payload) => {
  if (!accessTokenSecret) {
    throw new Error("ACCESS_TOKEN_SECRET is not defined");
  }
  return jwt.sign(payload, accessTokenSecret, { expiresIn: "7d" });
};

export const verifyAccessToken = (token) => {
  if (!accessTokenSecret) {
    throw new Error("ACCESS_TOKEN_SECRET is not defined");
  }
  return jwt.verify(token, accessTokenSecret);
};
