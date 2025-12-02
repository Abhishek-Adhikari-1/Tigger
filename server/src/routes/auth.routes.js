import express from "express";
import { loginLimiter } from "../middlewares/rate_limiter.js";
import { loginController } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/login", loginLimiter, loginController);

export default router;
