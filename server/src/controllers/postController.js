import logger from "../utils/logger.js";
import { PostService } from "../services/postServices.js";

export class PostController {
  static async getPosts(req, res, next) {
    // logger.info(`inside PostController.getPosts`);
    try {
      const { page = 1, limit = 5 } = req.query;
      const data = await PostService.getPosts({
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
      });
      res.status(200).json(data);
    } catch (error) {
      logger.error(`Get Posts Controller Error: ${error.message}`);
      res.status(500).json({ message: "Failed to retrieve posts." });
    }
  }
  static async createPost(req, res, next) {
    try {
      console.log("req.body", req.body);
      const { title, content } = req.body;
      // req.user is attached by the authenticateJWT middleware
      const author = req.user.id;
      const newPost = await PostService.createPost({ title, content, author });
      res.status(201).json(newPost);
    } catch (error) {
      logger.error(`Create Post Controller Error: ${error.message}`);
      res.status(400).json({ message: "Failed to create post." });
    }
  }

  static async getPostByID(req, res, next) {
    logger.info(`inside PostController.getPostByID`);
    try {
      const { id } = req.params;
      console.log("postid", id);
      const post = await PostService.getPostByID(id);
      res.status(200).json(post);
    } catch (error) {
      logger.error(`Get Post By ID Controller Error: ${error.message}`);
      if (error.message.includes("not found")) {
        return res.status(404).json({ message: error.message });
      }
      if (error.message.includes("Invalid post ID")) {
        return res.status(400).json({ message: error.message });
      }
      res.status(500).json({ message: "Failed to retrieve post." });
    }
  }
}
