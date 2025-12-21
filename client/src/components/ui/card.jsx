import { cn } from "../../utils/utils";

export default function Card({ children, className }) {
  return (
    <div
      className={cn(
        "bg-card bg-linear-to-br from-primary/5 to-card w-full py-4 dark:bg-zinc-950 dark:bg-linear-to-br dark:from-zinc-800/70 dark:to-zinc-900/50 border border-gray-200 dark:border-zinc-800 hover:border-gray-300 dark:hover:border-zinc-700",
        " rounded-lg p-5 group",
        className
      )}
    >
      {children}
    </div>
  );
}
