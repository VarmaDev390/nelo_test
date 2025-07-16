import express from "express";

import { AuthController } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", AuthController.registerUser);
router.post("/login", AuthController.logInUser);

export default router;
