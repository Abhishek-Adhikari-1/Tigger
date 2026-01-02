import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const statusColors = {
  Active:
    "bg-indigo-300 dark:bg-indigo-700 text-indigo-700 dark:text-indigo-200",
  Completed:
    "bg-emerald-200 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-300",
  Hold: "bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-300",
  Planning: "bg-blue-200 dark:bg-blue-900 text-blue-900 dark:text-blue-300",
  Cancelled: "bg-red-200 dark:bg-red-900 text-red-950 dark:text-red-300",
  Inactive: "bg-gray-200 dark:bg-zinc-600 text-gray-900 dark:text-zinc-200",
};
