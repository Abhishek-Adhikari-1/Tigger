import * as React from "react";
import { Moon, Sun, Monitor, Check } from "lucide-react";
import { MoonToSun, SunToMoon } from "./theme-svg";
import { cn } from "../../utils/utils";
import { useTheme } from "next-themes";
import Dropdown from "../ui/dropdown";

export function ThemeToggle({ className, innerIconSize = "2rem" }) {
  const { setTheme, resolvedTheme, theme } = useTheme();
  const [key, setKey] = React.useState(0);

  React.useEffect(() => setKey((prev) => prev + 1), [resolvedTheme]);

  const themeOptions = [
    {
      label: "Light",
      value: "light",
      icon: Sun,
    },
    {
      label: "Dark",
      value: "dark",
      icon: Moon,
    },
    {
      label: "System",
      value: "system",
      icon: Monitor,
    },
  ];

  return (
    <Dropdown
      className="inline-block"
      trigger={
        <button
          className={cn(
            "relative size-10 rounded-full bg-card flex items-center justify-center border border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600",
            className
          )}
        >
          {/* Sun to Moon animation */}
          <div className="absolute flex justify-center items-center h-[1.2rem] w-[1.2rem] rotate-0 scale-100 dark:-rotate-90 dark:scale-0">
            <SunToMoon key={`sun${key}`} width={innerIconSize} />
          </div>
          {/* Moon to Sun animation */}
          <div className="absolute flex justify-center items-center h-[1.2rem] w-[1.2rem] rotate-90 scale-0 dark:rotate-0 dark:scale-100">
            <MoonToSun key={`moon${key}`} width={innerIconSize} />
          </div>
        </button>
      }
      items={themeOptions.map((option) => ({
        label: (
          <div className="flex items-center w-full">
            <option.icon className="mr-2 w-4 h-4" />
            {option.label}
            {theme === option.value && (
              <Check className="ml-auto w-4 h-4 stroke-[2.5]" />
            )}
          </div>
        ),
        onClick: () => {
          if (theme !== option.value) {
            setTheme(option.value);
            if (typeof window.applyTheme === "function") {
              window.applyTheme(option.value);
            }
          }
        },
      }))}
    />
  );
}
