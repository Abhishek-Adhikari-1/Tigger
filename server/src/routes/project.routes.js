import express from "express";
import { ProjectController } from "../controllers/project.controller.js";
import { validateBody } from "../middlewares/validate_body.middleware.js";
import { createProjectSchema, updateProjectSchema } from "../utils/validators/project.validator.js";

const router = express.Router();

router.post(
  "/",
  validateBody(createProjectSchema),
  ProjectController.createProject
);

router.get("/all", ProjectController.getAllProjects);

router.get("/:projectId", ProjectController.getProjectById);

router.delete("/:projectId", ProjectController.deleteProject);

router.put("/:projectId", validateBody(updateProjectSchema), ProjectController.updateProject);

export { router as projectRoutes };
