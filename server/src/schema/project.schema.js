import { DataTypes, ENUM } from "sequelize";
import { sequelize } from "../config/db.js";

export const Project = sequelize.define(
  "project",
  {
    projectId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },

    orgId: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    priority: {
      type: ENUM("Low", "Medium", "High"),
      allowNull: false,
      defaultValue: "Low",
    },

    status: {
      type: ENUM(
        "Planning",
        "Active",
        "Completed",
        "Hold",
        "Inactive",
        "Cancelled"
      ),
      allowNull: false,
      defaultValue: "Planning",
    },

    start_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },

    end_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },

    project_manager: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    team_members: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
      defaultValue: [],
    },

    created_by: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["orgId", "name", "project_manager", "start_date", "end_date"],
      },
    ],
  }
);
