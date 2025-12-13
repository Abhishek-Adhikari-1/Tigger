import {
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { NavLink } from "react-router-dom";
import {
  XIcon,
  LayoutDashboard,
  UsersIcon,
  FolderOpenIcon,
  FileIcon,
  PanelLeftIcon,
  SettingsIcon,
} from "lucide-react";
import { useState } from "react";
import { cn } from "../../utils/utils";
import WorkspaceDropdown from "./workspace-dropdown";
import { OrganizationSwitcher, useClerk } from "@clerk/clerk-react";

const navItems = [
  { name: "Dashboard", path: "/", icon: LayoutDashboard },
  {
    name: "Projects",
    path: "/projects",
    icon: FolderOpenIcon,
    badge: "3",
  },
  { name: "Team", path: "/team", icon: UsersIcon },
  { name: "Posts", path: "/posts", icon: FileIcon },
];

export default function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const SidebarContent = (
    <nav className="flex flex-1 flex-col overflow-y-auto">
      <ul className="space-y-1 flex-1 p-4">
        {navItems.map((item) => (
          <li key={item.name}>
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                cn(
                  "flex select-none group items-center gap-3 px-3 py-2 rounded-md text-sm aria-keyboard-focus",
                  isActive
                    ? "bg-indigo-100 text-indigo-600 dark:text-zinc-100 dark:bg-zinc-900 dark:bg-linear-to-br dark:from-zinc-800 dark:to-zinc-800/50"
                    : "hover:bg-indigo-50 text-indigo-900 dark:hover:bg-zinc-800/50 dark:text-zinc-300"
                )
              }
              onClick={() => setMobileOpen(false)}
            >
              <item.icon className="h-5 w-5 shrink-0" strokeWidth={1.5} />
              <span>{item.name}</span>
              {item.badge && (
                <span className="ml-auto bg-indigo-50 text-indigo-400 dark:text-indigo-300 text-xs font-semibold px-2 py-0.5 rounded-full group-hover:bg-indigo-100/70 dark:group-hover:bg-zinc-700/60 dark:bg-zinc-900 dark:bg-linear-to-br dark:from-zinc-800 dark:to-zinc-800/50 dark:ring-zinc-800">
                  {item.badge}
                </span>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );

  const SecondaryContent = () => {
    const { openOrganizationProfile } = useClerk();
    return (
      <nav className="flex">
        <ul className="space-y-1 flex-1 p-4 w-full">
          <li>
            <button
              className={cn(
                "w-full flex select-none group items-center gap-3 px-3 py-2 rounded-md text-sm aria-keyboard-focus",
                "hover:bg-indigo-50 text-indigo-900 dark:hover:bg-zinc-800/50 dark:text-zinc-300"
              )}
              onClick={() => {
                // setMobileOpen(false);
                openOrganizationProfile();
              }}
            >
              <SettingsIcon className="h-5 w-5 shrink-0" strokeWidth={1.5} />
              <span>Settings</span>
            </button>
          </li>
        </ul>
      </nav>
    );
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col w-68 border-r border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
        <WorkspaceDropdown />
        <hr className="border-gray-200 dark:border-zinc-800" />
        {SidebarContent}
        {SecondaryContent()}
      </aside>

      {/* Mobile Sidebar */}
      <Transition show={mobileOpen}>
        <Dialog className="relative z-40 lg:hidden" onClose={setMobileOpen}>
          <TransitionChild
            enter="transition-opacity duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25 dark:bg-white/20" />
          </TransitionChild>
          <div className="fixed inset-0 flex">
            <TransitionChild
              enter="transition-transform duration-300"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition-transform duration-300"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <DialogPanel className="relative flex flex-col w-64 bg-white dark:bg-zinc-900 shadow-lg">
                <div className="flex items-center justify-between pr-0 py-0 relative">
                  <div className="w-full p-4 pt-9">
                    <WorkspaceDropdown className="m-0 " />
                  </div>
                  <button
                    onClick={() => setMobileOpen(false)}
                    className="text-zinc-400 hover:text-zinc-600 absolute right-3 top-2 cursor-pointer"
                  >
                    <XIcon className="h-6 w-6" />
                  </button>
                </div>
                <hr className="border-gray-200 dark:border-zinc-800" />
                {SidebarContent}
                {SecondaryContent()}
              </DialogPanel>
            </TransitionChild>
          </div>
        </Dialog>
      </Transition>

      {/* Toggle Button for Mobile */}
      <button
        type="button"
        className="lg:hidden z-10 fixed top-2.5 left-2 p-2 rounded-md cursor-pointer bg-zinc-100 dark:bg-zinc-800"
        onClick={() => setMobileOpen(true)}
      >
        <PanelLeftIcon
          className="stroke-zinc-600 dark:stroke-zinc-300 size-5"
          strokeWidth={1.75}
        />
      </button>
    </>
  );
}
