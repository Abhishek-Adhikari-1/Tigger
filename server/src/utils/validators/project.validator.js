import { z } from "zod";

export const PRIORITIES = ["Low", "Medium", "High"];
export const STATUSES = [
  "Planning",
  "Active",
  "Completed",
  "Hold",
  "Inactive",
  "Cancelled",
];

export const createProjectSchema = z
  .object({
    name: z
      .string({
        error: "Project name is required",
      })
      .trim()
      .min(1, "Project name is required")
      .max(100)
      .transform((v) => v.replace(/\s+/g, " ")),

    description: z.string().trim().max(1000).optional().default(""),

    priority: z.enum(PRIORITIES).default("Low"),
    status: z.enum(STATUSES).default("Planning"),

    start_date: z.coerce.date({
      error: "Invalid start date",
    }),
    end_date: z.coerce.date({
      error: "Invalid end date",
    }),

    project_manager: z
      .string({
        error: "Project manager is required",
      })
      .trim()
      .min(1, "Project manager is required"),

    team_members: z
      .array(z.string().trim().min(1))
      .default([])
      .refine(
        (arr) => new Set(arr).size === arr.length,
        "Duplicate team members are not allowed"
      ),
  })
  .refine(({ start_date, end_date }) => start_date <= end_date, {
    message: "Start date cannot be after end date",
    path: ["start_date"],
  });

export const updateProjectSchema = createProjectSchema.partial();
