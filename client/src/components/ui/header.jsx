import { UserButton } from "@clerk/react-router";
import { ThemeToggle } from "../themes/theme-toggle";

export default function Header() {
  return (
    <header className="flex bg-white dark:bg-zinc-900 items-center justify-between px-2 py-2 pl-14 lg:pl-4 sticky top-0 left-0 border-b border-gray-200 dark:border-zinc-800 min-h-14">
      {/* Left section */}
      <div className="flex items-center gap-4 min-w-0 flex-1">
        <h1 className="text-lg lg:text-xl font-bold text-slate-800 dark:text-slate-200">
          Tigger
        </h1>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-3">
        <ThemeToggle className="size-8 rounded-md" innerIconSize="1rem" />
        <UserButton />
      </div>
    </header>
  );
}
