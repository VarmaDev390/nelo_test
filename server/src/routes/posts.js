import express from "express";
import { PostController } from "../controllers/postController.js";
import { authenticateUser } from "../middlewares/authenticateUser.js";

const router = express.Router();

router.get("/", authenticateUser, PostController.getPosts);
router.post("/", authenticateUser, PostController.createPost);
router.get("/:id", authenticateUser, PostController.getPostByID);

export default router;
