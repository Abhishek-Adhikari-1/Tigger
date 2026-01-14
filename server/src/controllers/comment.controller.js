import { Comment } from "../schema/comment.schema.js";
import { Task } from "../schema/task.schema.js";
import { Project } from "../schema/project.schema.js";

/**
 * Create a new comment on a task
 */
const createComment = async (req, res) => {
  try {
    const { orgId, userId } = req.clerk;
    const { taskId, content } = req.body;

    if (!orgId) {
      return res.status(400).json({
        success: false,
        message: "No organization selected",
      });
    }

    if (!taskId || !content?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Task ID and content are required",
      });
    }

    // Verify the task exists and belongs to a project in this org
    const task = await Task.findOne({
      where: { id: taskId },
      include: [
        {
          model: Project,
          as: "project",
          where: { orgId },
          attributes: [],
        },
      ],
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    const comment = await Comment.create({
      taskId,
      content: content.trim(),
      author: userId,
      created_by: userId,
    });

    return res.status(201).json({
      success: true,
      message: "Comment created successfully",
      data: {
        id: comment.id,
        taskId: comment.taskId,
        content: comment.content,
        author: comment.author,
        createdAt: comment.createdAt,
        updatedAt: comment.updatedAt,
      },
    });
  } catch (error) {
    console.error("Error in createComment controller:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to create comment",
    });
  }
};

/**
 * Get all comments for a specific task
 */
const getCommentsByTask = async (req, res) => {
  try {
    const { orgId } = req.clerk;
    const { taskId } = req.params;

    if (!orgId) {
      return res.status(400).json({
        success: false,
        message: "No organization selected",
      });
    }

    // Verify the task exists and belongs to this org
    const task = await Task.findOne({
      where: { id: taskId },
      include: [
        {
          model: Project,
          as: "project",
          where: { orgId },
          attributes: [],
        },
      ],
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    const comments = await Comment.findAll({
      where: { taskId },
      order: [["createdAt", "ASC"]],
    });

    const formattedComments = comments.map((comment) => ({
      id: comment.id,
      taskId: comment.taskId,
      content: comment.content,
      author: comment.author,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
    }));

    return res.status(200).json({
      success: true,
      data: formattedComments,
    });
  } catch (error) {
    console.error("Error in getCommentsByTask controller:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch comments",
    });
  }
};

/**
 * Update an existing comment (author only)
 */
const updateComment = async (req, res) => {
  try {
    const { orgId, userId, orgRole } = req.clerk;
    const { commentId } = req.params;
    const { content } = req.body;

    if (!orgId) {
      return res.status(400).json({
        success: false,
        message: "No organization selected",
      });
    }

    if (!content?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Content is required",
      });
    }

    const comment = await Comment.findOne({
      where: { id: commentId },
      include: [
        {
          model: Task,
          as: "task",
          include: [
            {
              model: Project,
              as: "project",
              where: { orgId },
              attributes: [],
            },
          ],
        },
      ],
    });

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    // Only the author or admin can update
    const isAdmin = ["org:admin", "org:moderator"].includes(orgRole);
    if (comment.author !== userId && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "You can only edit your own comments",
      });
    }

    await comment.update({ content: content.trim() });

    return res.status(200).json({
      success: true,
      message: "Comment updated successfully",
      data: {
        id: comment.id,
        taskId: comment.taskId,
        content: comment.content,
        author: comment.author,
        createdAt: comment.createdAt,
        updatedAt: comment.updatedAt,
      },
    });
  } catch (error) {
    console.error("Error in updateComment controller:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update comment",
    });
  }
};

/**
 * Delete a comment (author or admin only)
 */
const deleteComment = async (req, res) => {
  try {
    const { orgId, userId, orgRole } = req.clerk;
    const { commentId } = req.params;

    if (!orgId) {
      return res.status(400).json({
        success: false,
        message: "No organization selected",
      });
    }

    const comment = await Comment.findOne({
      where: { id: commentId },
      include: [
        {
          model: Task,
          as: "task",
          include: [
            {
              model: Project,
              as: "project",
              where: { orgId },
              attributes: [],
            },
          ],
        },
      ],
    });

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    // Only the author or admin can delete
    const isAdmin = ["org:admin", "org:moderator"].includes(orgRole);
    if (comment.author !== userId && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "You can only delete your own comments",
      });
    }

    await comment.destroy();

    return res.status(200).json({
      success: true,
      message: "Comment deleted successfully",
    });
  } catch (error) {
    console.error("Error in deleteComment controller:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to delete comment",
    });
  }
};

export const CommentController = {
  createComment,
  getCommentsByTask,
  updateComment,
  deleteComment,
};
