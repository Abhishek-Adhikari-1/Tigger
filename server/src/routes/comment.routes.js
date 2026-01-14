import express from "express";
import { CommentController } from "../controllers/comment.controller.js";

const router = express.Router();

// Create a new comment
router.post("/", CommentController.createComment);

// Get all comments for a task
router.get("/:taskId", CommentController.getCommentsByTask);

// Update a comment
router.put("/:commentId", CommentController.updateComment);

// Delete a comment
router.delete("/:commentId", CommentController.deleteComment);

export { router as commentRoutes };
