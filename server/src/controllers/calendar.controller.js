import { Project } from "../schema/project.schema.js";
import { Task } from "../schema/task.schema.js";
import { Op } from "sequelize";

const getCalendarEvents = async (req, res) => {
  try {
    const { orgId, userId } = req.clerk;
    const { startDate, endDate } = req.query;

    if (!orgId) {
      return res.status(400).json({
        success: false,
        message: "No organization selected",
      });
    }

    // Parse dates
    const start = startDate ? new Date(startDate) : new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const end = endDate ? new Date(endDate) : new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);

    // Fetch projects within date range
    const projects = await Project.findAll({
      where: {
        orgId,
        [Op.or]: [
          {
            start_date: { [Op.between]: [start, end] },
          },
          {
            end_date: { [Op.between]: [start, end] },
          },
          {
            [Op.and]: [
              { start_date: { [Op.lte]: start } },
              { end_date: { [Op.gte]: end } },
            ],
          },
        ],
      },
      attributes: ["projectId", "name", "description", "status", "priority", "start_date", "end_date"],
    });

    // Fetch tasks within date range
    const tasks = await Task.findAll({
      where: {
        due_date: { [Op.between]: [start, end] },
      },
      include: [
        {
          model: Project,
          as: "project",
          where: { orgId },
          attributes: ["projectId", "name"],
        },
      ],
      attributes: ["id", "title", "status", "priority", "type", "due_date", "projectId", "assignee"],
    });

    // Format events
    const projectEvents = projects.map((project) => ({
      id: project.projectId,
      type: "project",
      title: project.name,
      description: project.description,
      startDate: project.start_date,
      endDate: project.end_date,
      status: project.status,
      priority: project.priority,
      link: `/projects/${project.projectId}`,
    }));

    const taskEvents = tasks.map((task) => ({
      id: task.id,
      type: "task",
      title: task.title,
      taskType: task.type,
      date: task.due_date,
      status: task.status,
      priority: task.priority,
      projectId: task.projectId,
      projectName: task.project?.name,
      assignee: task.assignee,
      link: `/projects/${task.projectId}?tab=tasks`,
    }));

    return res.status(200).json({
      success: true,
      data: {
        projects: projectEvents,
        tasks: taskEvents,
      },
    });
  } catch (error) {
    console.error("Error in getCalendarEvents controller:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch calendar events",
    });
  }
};

export const CalendarController = {
  getCalendarEvents,
};
