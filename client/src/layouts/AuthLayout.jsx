import { Outlet } from "react-router-dom";
import { ThemeToggle } from "../components/themes/theme-toggle";

export default function AuthLayout() {
  return (
    <main className="w-full h-dvh relative flex justify-center items-center">
      <div className="absolute top-0 right-0 md:top-2 md:right-2 bg-background">
        <ThemeToggle />
      </div>
      <Outlet />
    </main>
  );
}
