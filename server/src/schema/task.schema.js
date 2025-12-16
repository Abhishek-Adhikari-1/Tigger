import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import { Project } from "./project.schema.js";

export const Task = sequelize.define(
  "task",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },

    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    due_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    status: {
      type: DataTypes.ENUM("Todo", "In Progress", "Done"),
      allowNull: false,
      defaultValue: "Todo",
    },

    type: {
      type: DataTypes.ENUM("Task", "Bug", "Feature", "Improvement", "Other"),
      allowNull: false,
      defaultValue: "Task",
    },

    priority: {
      type: DataTypes.ENUM("Low", "Medium", "High"),
      allowNull: false,
      defaultValue: "Medium",
    },

    assignee: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    created_by: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    projectId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Project,
        key: "projectId",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
  },
  { timestamps: true }
);

Project.hasMany(Task, { foreignKey: "projectId", as: "tasks" });
Task.belongsTo(Project, { foreignKey: "projectId", as: "project" });
