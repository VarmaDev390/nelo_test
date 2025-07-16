import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import passport from "passport";
import connectDB from "./db.js";
import logger from "./src/utils/logger.js";
import authRoutes from "./src/routes/authentication.js";
import postRoutes from "./src/routes/posts.js";
import "./src/config/passport.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors());
app.use(passport.initialize());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/post", postRoutes);

// test route
app.get("/", (req, res) => {
  res.send("API is running...");
});

const startServer = async () => {
  try {
    logger.info("Ensuring database exists...");
    await connectDB(); // Connect to MongoDB
    app.listen(port, () => {
      logger.info(`Server running on port ${port}`);
    });
  } catch (error) {
    logger.error(
      "Error starting server:",
      error instanceof Error ? error.message : "Unknown error"
    );
    process.exit(1);
  }
};

startServer();
