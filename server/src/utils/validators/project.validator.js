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
      .nonempty({
        error: "Project name cannot be empty",
      })
      .min(3, "Project name is too short")
      .max(100)
      .transform((v) => v.replace(/\s+/g, " ")),

    description: z
      .string({
        error: "Description is required",
      })
      .trim()
      .max(1000, {
        error: "Description is too long",
      })
      .optional()
      .default(""),

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

export const updateProjectSchema = z
  .object({
    name: z
      .string()
      .trim()
      .nonempty({ message: "Project name cannot be empty" })
      .min(3, "Project name is too short")
      .max(100)
      .transform((v) => v.replace(/\s+/g, " "))
      .optional(),

    description: z
      .string()
      .trim()
      .max(1000, { message: "Description is too long" })
      .optional(),

    priority: z.enum(PRIORITIES).optional(),
    status: z.enum(STATUSES).optional(),

    start_date: z.coerce.date().optional(),
    end_date: z.coerce.date().optional(),

    project_manager: z.string().trim().min(1).optional(),

    team_members: z
      .array(z.string().trim().min(1))
      .refine(
        (arr) => new Set(arr).size === arr.length,
        "Duplicate team members are not allowed"
      )
      .optional(),
  })
  .refine(
    ({ start_date, end_date }) => {
      if (start_date && end_date) {
        return start_date <= end_date;
      }
      return true;
    },
    {
      message: "Start date cannot be after end date",
      path: ["start_date"],
    }
  );
