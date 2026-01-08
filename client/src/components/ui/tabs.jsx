import {
  FileStackIcon,
  CalendarIcon,
  BarChart3Icon,
  SettingsIcon,
} from "lucide-react";
import { cn } from "../../utils/utils";

export default function Tabs({ activeTab, onTabClick }) {
  const tabs = [
    { key: "tasks", label: "Tasks", icon: FileStackIcon },
    { key: "calendar", label: "Calendar", icon: CalendarIcon },
    { key: "analytics", label: "Analytics", icon: BarChart3Icon },
    { key: "settings", label: "Settings", icon: SettingsIcon },
  ];

  return (
    <div className="mt-6 max-w-[calc(100dvw-16px)] overflow-x-auto">
      {/* Tab Buttons */}
      <div
        className="relative flex gap-1 rounded-xl p-1
      bg-zinc-100 dark:bg-zinc-900
      border border-zinc-200 dark:border-zinc-800
      overflow-x-auto w-fit"
      >
        {tabs.map((tabItem) => {
          const isActive = activeTab === tabItem.key;
          return (
            <button
              key={tabItem.key}
              onClick={() => onTabClick(tabItem)}
              className={cn(
                `
                relative flex items-center gap-2 px-4 py-2 min-w-20 rounded-lg
                text-sm font-medium whitespace-nowrap transition-all duration-200
              `,
                isActive
                  ? `
                  bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm
                `
                  : `
                  text-zinc-600 dark:text-zinc-400 hover:bg-white/60 dark:hover:bg-zinc-800/60
                `
              )}
            >
              <tabItem.icon
                className={cn(
                  "size-4 shrink-0 transition-colors",
                  isActive
                    ? "text-zinc-900 dark:text-white"
                    : "text-zinc-500 dark:text-zinc-400"
                )}
              />
              {tabItem.label}

              {/* Active underline */}
              {isActive && (
                <span className="absolute inset-x-2 -bottom-1 h-0.5 rounded bg-zinc-900 dark:bg-white" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
