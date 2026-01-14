import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import { Task } from "./task.schema.js";

export const Comment = sequelize.define(
  "comment",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },

    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    author: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    created_by: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    taskId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Task,
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
  },
  { timestamps: true }
);

Task.hasMany(Comment, { foreignKey: "taskId", as: "comments" });
Comment.belongsTo(Task, { foreignKey: "taskId", as: "task" });
