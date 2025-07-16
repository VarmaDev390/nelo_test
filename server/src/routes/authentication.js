import express from "express";

import { AuthController } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", AuthController.registerUser);
router.post("/login", AuthController.logInUser);
router.post("/logout", AuthController.logOutUser);

export default router;
