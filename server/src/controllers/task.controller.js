import { Project } from "../schema/project.schema.js";
import { Task } from "../schema/task.schema.js";
import { Op, Sequelize } from "sequelize";

const createTask = async (req, res) => {
  try {
    const { orgId, userId: currentUserId, orgRole } = req.clerk;
    const {
      title,
      description,
      due_date,
      status,
      type,
      priority,
      assignee,
      projectId,
    } = req?.body || {};

    if (!orgId) {
      return res.status(400).json({
        success: false,
        message: "No organization selected",
      });
    }

    const isAdmin = ["org:admin", "org:moderator"].includes(orgRole);

    const project = await Project.findOne({ where: { projectId } });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    const isManager = project.project_manager === currentUserId;

    if (!isAdmin && !isManager) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to create a task",
      });
    }

    const task = await Task.create({
      title,
      description,
      due_date,
      status,
      type,
      priority,
      assignee,
      projectId: project.projectId,
      created_by: currentUserId,
    });

    res.status(200).json({
      success: true,
      message: "Task created successfully",
      data: {
        id: task.id,
        title: task.title,
        description: task.description,
        due_date: task.due_date,
        status: task.status,
        type: task.type,
        priority: task.priority,
        assignee: task.assignee,
        projectId: task.projectId,
      },
    });
  } catch (error) {
    console.error("Error in createTask controller: ", error);

    res.status(500).json({
      success: false,
      message: error.message || "Failed to create task",
    });
  }
};

const getAllTasks = async (req, res) => {
  try {
    const { orgId } = req.clerk;

    if (!orgId) {
      return res.status(400).json({
        success: false,
        message: "No organization selected",
      });
    }

    const { query, status, type, priority, projectId } = req?.query || {};
    const taskWhere = {};

    if (query) {
      taskWhere[Op.or] = [
        { title: { [Op.iLike]: `%${query}%` } },
        { description: { [Op.iLike]: `%${query}%` } },
      ];
    }

    if (status) taskWhere.status = status;
    if (type) taskWhere.type = type;
    if (priority) taskWhere.priority = priority;

    const project = await Project.findOne({
      where: { projectId, orgId },
      attributes: [],
      include: [
        {
          model: Task,
          as: "tasks",
          where: Object.keys(taskWhere).length ? taskWhere : undefined,
          required: false,
        },
      ],
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    const formattedTasks = project?.tasks?.map((task) => ({
      id: task.id,
      title: task.title,
      description: task.description,
      due_date: task.due_date,
      status: task.status,
      type: task.type,
      priority: task.priority,
      assignee: task.assignee,
      projectId: task.projectId,
    }));

    res.status(200).json({
      success: true,
      data: formattedTasks,
    });
  } catch (error) {
    console.error("Error in getAllTasks controller: ", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch tasks",
    });
  }
};

const getTaskById = async (req, res) => {
  try {
    const { orgId } = req.clerk;
    const { taskId } = req?.params || {};
    const { projectId } = req?.query || {};

    if (!orgId) {
      return res.status(400).json({
        success: false,
        message: "No organization selected",
      });
    }

    const task = await Task.findOne({
      where: { id: taskId, projectId },
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

    return res.status(200).json({
      success: true,
      data: {
        id: task.id,
        title: task.title,
        description: task.description,
        due_date: task.due_date,
        status: task.status,
        type: task.type,
        priority: task.priority,
        assignee: task.assignee,
        projectId: task.projectId,
      },
    });
  } catch (error) {
    console.error("Error in getTaskById:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch task",
    });
  }
};

const deleteTask = async (req, res) => {
  try {
    const { orgId, orgRole } = req.clerk;
    const { taskId } = req?.params || {};
    const { projectId } = req?.query || {};

    if (!orgId) {
      return res.status(400).json({
        success: false,
        message: "No organization selected",
      });
    }
    const isAdmin = ["org:admin", "org:moderator"].includes(orgRole);

    const project = await Project.findOne({
      where: { projectId, orgId },
      attributes: ["projectId"],
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    const isManager = project.project_manager === currentUserId;

    if (!isAdmin && !isManager) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete a task",
      });
    }

    const deletedCount = await Task.destroy({
      where: {
        id: taskId,
        projectId: project.projectId,
      },
    });

    if (!deletedCount) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    console.error("Error in deleteTask controller:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to delete task",
    });
  }
};

const updateTask = async (req, res) => {
  try {
    const { orgId, userId, orgRole } = req.clerk;
    const { taskId } = req?.params || {};
    const { projectId } = req?.query || {};

    if (!orgId) {
      return res.status(400).json({
        success: false,
        message: "No organization selected",
      });
    }

    const project = await Project.findOne({
      where: { projectId, orgId },
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    const isAdmin = ["org:admin", "org:moderator"].includes(orgRole);
    const isManager = project.project_manager === userId;

    // Admin / Manager → full access
    const adminAllowedFields = [
      "title",
      "description",
      "due_date",
      "status",
      "type",
      "priority",
      "assignee",
    ];

    // Others → status only
    const userAllowedFields = ["status"];

    const allowedFields =
      isAdmin || isManager ? adminAllowedFields : userAllowedFields;

    const updates = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    if (!Object.keys(updates).length) {
      return res.status(403).json({
        success: false,
        message:
          isAdmin || isManager
            ? "No valid fields provided"
            : "You are only allowed to update task status",
      });
    }

    const [affectedCount] = await Task.update(updates, {
      where: { id: taskId, projectId: project.projectId },
    });

    if (affectedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: affectedCount,
      message: "Task updated successfully",
    });
  } catch (error) {
    console.error("Error in updateTask controller:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update task",
    });
  }
};

const getMyTasks = async (req, res) => {
  try {
    const { orgId, userId } = req.clerk;

    if (!orgId) {
      return res.status(400).json({
        success: false,
        message: "No organization selected",
      });
    }

    // Find all tasks assigned to the current user across all projects in the org
    const tasks = await Task.findAll({
      where: { assignee: userId },
      include: [
        {
          model: Project,
          as: "project",
          where: { orgId },
          attributes: ["projectId", "name"],
        },
      ],
      order: [["updatedAt", "DESC"]],
      limit: 10,
    });

    const formattedTasks = tasks.map((task) => ({
      id: task.id,
      title: task.title,
      status: task.status,
      priority: task.priority,
      projectId: task.projectId,
      projectName: task.project?.name,
    }));

    return res.status(200).json({
      success: true,
      data: formattedTasks,
    });
  } catch (error) {
    console.error("Error in getMyTasks controller:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch tasks",
    });
  }
};

export const TaskController = {
  createTask,
  getAllTasks,
  getTaskById,
  deleteTask,
  updateTask,
  getMyTasks,
};
