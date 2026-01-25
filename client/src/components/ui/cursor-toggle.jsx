import { useEffect } from "react";
import { MousePointer2 } from "lucide-react";
import { useCursor } from "../../context/CursorContext";
import { cn } from "../../utils/utils";

export function CursorToggle({ className }) {
  const { customCursor, toggleCursor } = useCursor();

  // Keyboard shortcut: Ctrl + M
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key.toLowerCase() === "m") {
        e.preventDefault();
        toggleCursor();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [toggleCursor]);

  return (
    <button
      onClick={toggleCursor}
      title={`${customCursor ? "Disable" : "Enable"} custom cursor (Ctrl+M)`}
      className={cn(
        "group relative flex items-center gap-1.5 h-7 pl-1.5 pr-2.5 rounded-full transition-all duration-300 ease-out",
        customCursor
          ? "bg-indigo-500/15 dark:bg-indigo-400/15 border border-indigo-400/40 dark:border-indigo-400/30 hover:bg-indigo-500/25 dark:hover:bg-indigo-400/25"
          : "bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-700",
        className,
      )}
    >
      {/* Icon with animated dot indicator */}
      <span className="relative flex items-center justify-center w-4 h-4">
        <MousePointer2
          className={cn(
            "w-3.5 h-3.5 transition-colors duration-300",
            customCursor
              ? "text-indigo-600 dark:text-indigo-400"
              : "text-zinc-400 dark:text-zinc-500",
          )}
        />
        {/* Active dot pulse */}
        <span
          className={cn(
            "absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full transition-all duration-300",
            customCursor
              ? "bg-emerald-400 scale-100 opacity-100"
              : "bg-transparent scale-0 opacity-0",
          )}
        />
      </span>

      {/* Label */}
      <span
        className={cn(
          "text-[10px] font-semibold uppercase tracking-wider leading-none transition-colors duration-300 select-none",
          customCursor
            ? "text-indigo-600 dark:text-indigo-400"
            : "text-zinc-400 dark:text-zinc-500",
        )}
      >
        {customCursor ? "On" : "Off"}
      </span>
    </button>
  );
}
