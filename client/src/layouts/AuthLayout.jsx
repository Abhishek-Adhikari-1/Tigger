import { Outlet } from "react-router-dom";
import { ThemeToggle } from "../components/themes/theme-toggle";

export default function AuthLayout() {
  return (
    <main className="w-full h-dvh relative flex justify-center items-center">
      <div className="absolute top-1 right-1 md:top-2 md:right-2 bg-background">
        <ThemeToggle />
      </div>
      <Outlet />
    </main>
  );
}
