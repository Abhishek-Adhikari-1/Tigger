import { clsx } from "clsx";
import {
  BugIcon,
  GitCommitIcon,
  MessageSquareIcon,
  SquareIcon,
  ZapIcon,
} from "lucide-react";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function toDateInputValue(date) {
  if (!date) return "";
  return new Date(date).toISOString().split("T")[0];
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

export const typeIcons = {
  Bug: { icon: BugIcon, color: "text-red-600 dark:text-red-400" },
  Feature: { icon: ZapIcon, color: "text-blue-600 dark:text-blue-400" },
  Task: { icon: SquareIcon, color: "text-green-600 dark:text-green-400" },
  Improvement: {
    icon: GitCommitIcon,
    color: "text-purple-600 dark:text-purple-400",
  },
  Other: {
    icon: MessageSquareIcon,
    color: "text-amber-600 dark:text-amber-400",
  },
};

export const priorityColors = {
  Low: "bg-green-200 dark:bg-green-900 text-green-900 dark:text-green-300",
  Medium: "bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-300",
  High: "bg-red-200 dark:bg-red-900 text-red-950 dark:text-red-300",
};
