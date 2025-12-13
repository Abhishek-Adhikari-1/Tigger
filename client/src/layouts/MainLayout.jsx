import { Suspense } from "react";
import Sidebar from "../components/ui/sidebar";
import { Outlet } from "react-router-dom";
import LoadingSpinner from "../components/ui/loading";
import Header from "../components/ui/header";

export default function MainLayout() {
  return (
    <div className="flex h-full">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 overflow-y-auto bg-white dark:bg-zinc-950">
          <Suspense fallback={<LoadingSpinner />}>
            <Outlet />
          </Suspense>
        </main>
      </div>
    </div>
  );
}
