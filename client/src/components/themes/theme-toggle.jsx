import * as React from "react";
import { Moon, Sun, Monitor, Check } from "lucide-react";
import { MoonToSun, SunToMoon } from "./theme-svg";
import { cn } from "../../utils/utils";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { setTheme, resolvedTheme, theme } = useTheme();
  const [key, setKey] = React.useState(0);
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => setKey((prev) => prev + 1), [resolvedTheme]);

  const getIconClasses = (isActive) =>
    cn("mr-2 h-4 w-4", isActive && "stroke-[2.5] text-foreground");

  const getCheckClasses = (isActive) =>
    cn("ml-auto h-4 w-4", isActive && "stroke-[2.5] text-foreground");

  const themeOptions = [
    { name: "Light", icon: Sun, value: "light" },
    { name: "Dark", icon: Moon, value: "dark" },
    { name: "System", icon: Monitor, value: "system" },
  ];

  const handleThemeChange = (newTheme) => {
    if (newTheme !== theme) {
      setTheme(newTheme);
      if (typeof window.applyTheme === "function") {
        window.applyTheme(newTheme);
      }
    }
    setOpen(false);
  };

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="relative w-10 h-10 rounded-full bg-card flex items-center justify-center"
        aria-label="Toggle theme"
      >
        <div className="absolute flex justify-center items-center h-[1.2rem] w-[1.2rem] rotate-0 scale-100 dark:-rotate-90 dark:scale-0">
          <SunToMoon key={`sun${key}`} width="2rem" />
        </div>
        <div className="absolute flex justify-center items-center h-[1.2rem] w-[1.2rem] rotate-90 scale-0 dark:rotate-0 dark:scale-100">
          <MoonToSun key={`moon${key}`} width="2rem" />
        </div>
      </button>

      {open && (
        <div className="absolute right-2 mt-2 w-36 bg-card border border-gray-200 dark:border-gray-800 rounded-md shadow-lg z-50">
          {themeOptions.map((item) => {
            const active = theme === item.value;
            return (
              <button
                key={item.value}
                onClick={() => handleThemeChange(item.value)}
                className={cn(
                  "flex items-center w-full px-3 py-2 text-sm hover:bg-accent rounded-md",
                  active && "font-bold"
                )}
              >
                <item.icon className={getIconClasses(active)} />
                {item.name}
                {active && <Check className={getCheckClasses(true)} />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
