import Post from "../models/posts.js";
import logger from "../utils/logger.js";

export class PostService {
  static async getPosts({ page = 1, limit = 10 }) {
    try {
      const skip = (page - 1) * limit;
      const posts = await Post.find()
        .populate("author", "name email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      const total = await Post.countDocuments();

      return {
        posts,
        total,
        page,
        pages: Math.ceil(total / limit),
      };
    } catch (error) {
      logger.error(`Error fetching posts: ${error.message}`);
      throw new Error("Could not retrieve posts.");
    }
  }

  static async createPost({ title, content, author }) {
    try {
      const newPost = new Post({ title, content, author });
      await newPost.save();
      return newPost;
    } catch (error) {
      logger.error(`Error creating post: ${error.message}`);
      throw new Error("Could not create post.");
    }
  }

  static async getPostByID(id) {
    try {
      const post = await Post.findById(id).populate("author", "name email");
      if (!post) {
        throw new Error("Post not found.");
      }
      return post;
    } catch (error) {
      if (error.kind === "ObjectId") {
        throw new Error("Invalid post ID format.");
      }
      throw new Error(error.message || "Could not retrieve post.");
    }
  }
}
