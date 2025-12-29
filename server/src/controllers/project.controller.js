import { Project } from "../schema/project.schema.js";
import { Op, Sequelize } from "sequelize";

const createProject = async (req, res) => {
  try {
    const { orgId, userId: created_by, orgRole } = req.clerk;

    if (!orgId) {
      return res.status(400).json({
        success: false,
        message: "No organization selected",
      });
    }

    if (!["org:admin", "org:moderator"].includes(orgRole)) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to create a project",
      });
    }

    const {
      name,
      description,
      priority,
      status,
      start_date,
      end_date,
      project_manager,
      team_members = [],
    } = req?.body || {};

    const project = await Project.create({
      orgId,
      name,
      description,
      priority,
      status,
      start_date,
      end_date,
      project_manager,
      team_members,
      created_by,
    });

    res.status(200).json({
      success: true,
      message: "Project created successfully",
      data: {
        projectId: project.projectId,
        orgId: project.orgId,
        name: project.name,
        description: project.description,
        priority: project.priority,
        status: project.status,
        start_date: start_date,
        end_date: end_date,
        project_manager: project_manager,
        team_members: team_members,
      },
    });
  } catch (error) {
    console.error("Error in createProject controller: ", error);

    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({
        success: false,
        message:
          "A project with the same name, project manager, start date, and end date already exists",
      });
    }

    res.status(500).json({
      success: false,
      message: error.message || "Failed to create project",
    });
  }
};

const getAllProjects = async (req, res) => {
  try {
    const { orgId } = req.clerk;

    if (!orgId) {
      return res.status(400).json({
        success: false,
        message: "No organization selected",
      });
    }

    const { query } = req?.query || {};
    var projects = [];

    if (!query) {
      projects = await Project.findAll({ where: { orgId } });
    } else {
      projects = await Project.findAll({
        where: {
          orgId,
          [Op.or]: [
            { name: { [Op.iLike]: `%${query}%` } },
            { description: { [Op.iLike]: `%${query}%` } },

            Sequelize.where(Sequelize.cast(Sequelize.col("status"), "text"), {
              [Op.iLike]: `%${query}%`,
            }),

            Sequelize.where(Sequelize.cast(Sequelize.col("priority"), "text"), {
              [Op.iLike]: `%${query}%`,
            }),

            { project_manager: { [Op.iLike]: `%${query}%` } },

            {
              team_members: {
                [Op.contains]: [query],
              },
            },
          ],
        },
      });
    }

    const formattedProjects = projects?.map((project) => ({
      projectId: project.projectId,
      name: project.name,
      description: project.description,
      priority: project.priority,
      status: project.status,
      start_date: project.start_date,
      end_date: project.end_date,
      project_manager: project.project_manager,
      team_members: project.team_members,
    }));

    res.status(200).json({
      success: true,
      data: formattedProjects,
    });
  } catch (error) {
    console.error("Error in getAllProjects controller: ", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch projects",
    });
  }
};

const getProjectById = async (req, res) => {
  try {
    const { projectId } = req?.params || {};

    const project = await Project.findOne({ where: { projectId } });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    res.status(200).json({
      success: true,
      data: {
        orgId: project.orgId,
        name: project.name,
        description: project.description,
        priority: project.priority,
        status: project.status,
        start_date: project.start_date,
        end_date: project.end_date,
        project_manager: project.project_manager,
        team_members: project.team_members,
      },
    });
  } catch (error) {
    console.error("Error in getProjectById controller: ", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch project",
    });
  }
};

const deleteProject = async (req, res) => {
  try {
    const { projectId } = req?.params || {};
    const { orgId, orgRole } = req.clerk;

    if (!orgId) {
      return res.status(400).json({
        success: false,
        message: "No organization selected",
      });
    }

    if (!["org:admin", "org:moderator"].includes(orgRole)) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this project",
      });
    }

    await Project.destroy({ where: { projectId } });

    res.status(200).json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error) {
    console.error("Error in deleteProject controller: ", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to delete project",
    });
  }
};

const updateProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { orgId, orgRole, userId: currentUserId } = req.clerk;

    if (!orgId) {
      return res.status(400).json({
        success: false,
        message: "No organization selected",
      });
    }

    const isAdmin = ["org:admin", "org:moderator"].includes(orgRole);

    const project = await Project.findOne({ where: { projectId, orgId } });

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
        message: "You are not authorized to update this project",
      });
    }

    const updates = {};
    const allowedFields = [
      "name",
      "description",
      "priority",
      "status",
      "start_date",
      "end_date",
      "project_manager",
      "team_members",
    ];

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid fields provided for update",
      });
    }

    if (!isAdmin && updates.project_manager) {
      return res.status(403).json({
        success: false,
        message: "Only admins or moderators can change the project manager",
      });
    }

    await project.update(updates);

    return res.status(200).json({
      success: true,
      message: "Project updated successfully",
      data: {
        projectId: project.projectId,
        orgId: project.orgId,
        name: project.name,
        description: project.description,
        priority: project.priority,
        status: project.status,
        start_date: project.start_date,
        end_date: project.end_date,
        project_manager: project.project_manager,
        team_members: project.team_members,
      },
    });
  } catch (error) {
    console.error("Error in updateProject controller:", error);

    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({
        success: false,
        message:
          "A project with the same name, project manager, start date, and end date already exists",
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update project",
    });
  }
};

export const ProjectController = {
  createProject,
  getAllProjects,
  getProjectById,
  deleteProject,
  updateProject,
};
