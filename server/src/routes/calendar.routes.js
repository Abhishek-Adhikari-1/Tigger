import express from "express";
import { CalendarController } from "../controllers/calendar.controller.js";

const router = express.Router();

router.get("/events", CalendarController.getCalendarEvents);

export { router as calendarRoutes };
