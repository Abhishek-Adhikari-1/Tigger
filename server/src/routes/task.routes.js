import express from "express";
import { validateBody } from "../middlewares/validate_body.middleware.js";
import { createTaskSchema } from "../utils/validators/task.validators.js";
import { TaskController } from "../controllers/task.controller.js";

const router = express.Router();

router.post("/", validateBody(createTaskSchema), TaskController.createTask);

router.get("/my", TaskController.getMyTasks);

router.get("/all", TaskController.getAllTasks);

router.get("/:taskId", TaskController.getTaskById);

router.delete("/:taskId", TaskController.deleteTask);

router.put("/:taskId", TaskController.updateTask);

export { router as taskRoutes };
