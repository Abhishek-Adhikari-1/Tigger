import express from "express";
import { validateBody } from "../middlewares/validate_body.middleware.js";
import { createTaskSchema } from "../utils/validators/task.validators.js";
import { TaskController } from "../controllers/task.controller.js";

const router = express.Router();

router.post("/", validateBody(createTaskSchema), TaskController.createTask);

export { router as taskRoutes };
