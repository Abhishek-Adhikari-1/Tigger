import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";
import { apiLimiter } from "./middlewares/rate_limiter.middleware.js";
import { clerkAuth } from "./middlewares/auth.middleware.js";
import { dbConnection } from "./config/db.js";
import { projectRoutes } from "./routes/project.routes.js";
import { taskRoutes } from "./routes/task.routes.js";
import { commentRoutes } from "./routes/comment.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

const allowedOrigins = ["http://localhost:3000", "http://localhost:5173"];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// app.use(apiLimiter);
app.use(clerkMiddleware());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is up and running",
  });
});

app.use("/api/projects", clerkAuth, projectRoutes);
app.use("/api/tasks", clerkAuth, taskRoutes);
app.use("/api/comments", clerkAuth, commentRoutes);

app.get("/api/protected", clerkAuth, (req, res) => {
  res.status(200).json({
    success: true,
    message: "This is a protected route",
  });
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "The requested route does not exist",
    path: req.originalUrl,
  });
});

app.use((err, req, res, next) => {
  console.error("Error:", err);

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Something went wrong on the server",
  });
});

app.listen(PORT, async () => {
  await dbConnection();
  console.log(`🚀 Server is running on port ${PORT}`);
});
