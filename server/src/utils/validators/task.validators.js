import { z } from "zod";

export const createTaskSchema = z.object({
  title: z
    .string({
      error: "Task title is required",
    })
    .trim()
    .nonempty({
      error: "Task title cannot be empty",
    })
    .min(2, {
      error: "Task title is too short",
    })
    .max(100)
    .transform((v) => v.replace(/\s+/g, " ")),

  description: z
    .string({
      error: "Description is required",
    })
    .trim()
    .nonempty({
      error: "Description cannot be empty",
    })
    .min(5, {
      error: "Description is too short",
    })
    .max(1000, {
      error: "Description is too long",
    })
    .transform((v) => v.replace(/\s+/g, " ")),

  due_date: z.coerce.date({
    error: "Invalid due date",
  }),

  status: z.enum(["Todo", "In Progress", "Done"]).default("Todo"),
  type: z
    .enum(["Task", "Bug", "Feature", "Improvement", "Other"])
    .default("Task"),
  priority: z.enum(["Low", "Medium", "High"]).default("Medium"),

  assignee: z
    .string({
      error: "Assignee is required",
    })
    .nonempty({
      error: "Assignee cannot be empty",
    })
    .trim(),

  projectId: z
    .uuid({
      error: "Invalid project ID",
    })
    .nonempty({
      error: "Project ID is required",
    })
    .trim(),
});

export const updateTaskSchema = createTaskSchema.partial();
