import {
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { NavLink, Link } from "react-router-dom";
import {
  XIcon,
  LayoutDashboard,
  UsersIcon,
  FolderOpenIcon,
  PanelLeftIcon,
  SettingsIcon,
  CheckSquareIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  ListTodoIcon,
  BarChart3Icon,
  CalendarIcon,
  Settings2Icon,
} from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "../../utils/utils";
import WorkspaceDropdown from "./workspace-dropdown";
import { useClerk, useUser } from "@clerk/clerk-react";
import { useProjectsStore } from "../../store/use-project";

const navItems = [
  { name: "Dashboard", path: "/", icon: LayoutDashboard },
  { name: "Projects", path: "/projects", icon: FolderOpenIcon },
  { name: "Calendar", path: "/calendar", icon: CalendarIcon },
];

const STATUS_COLORS = {
  Todo: "bg-zinc-400",
  "In Progress": "bg-amber-400",
  Done: "bg-emerald-400",
};

export default function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [myTasks, setMyTasks] = useState([]);
  const [myTasksOpen, setMyTasksOpen] = useState(true);
  const [projectsOpen, setProjectsOpen] = useState(true);
  const [expandedProjects, setExpandedProjects] = useState({});

  const { projects } = useProjectsStore();
  const { user } = useUser();

  // Fetch my tasks
  useEffect(() => {
    const fetchMyTasks = async () => {
      try {
        const res = await fetch("/api/tasks/my", {
          method: "GET",
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          if (data.success) {
            setMyTasks(data.data || []);
          }
        }
      } catch (err) {
        console.error("Failed to fetch my tasks:", err);
      }
    };
    fetchMyTasks();
  }, []);

  const toggleProject = (projectId) => {
    setExpandedProjects((prev) => ({
      ...prev,
      [projectId]: !prev[projectId],
    }));
  };

  // Get recent projects (limit to 5)
  const recentProjects = projects?.slice(0, 5) || [];

  const SidebarContent = (
    <nav className="flex flex-1 flex-col overflow-y-auto">
      {/* Main Navigation */}
      <ul className="space-y-1 p-4">
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
            </NavLink>
          </li>
        ))}
      </ul>

      {/* My Tasks Section */}
      <div className="px-4 py-2">
        <button
          onClick={() => setMyTasksOpen(!myTasksOpen)}
          className="flex items-center justify-between w-full text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
        >
          <div className="flex items-center gap-2">
            <CheckSquareIcon className="size-4" />
            <span>My Tasks</span>
            {myTasks.length > 0 && (
              <span className="text-xs bg-indigo-100 dark:bg-zinc-800 text-indigo-600 dark:text-zinc-300 px-1.5 py-0.5 rounded">
                {myTasks.length}
              </span>
            )}
          </div>
          <ChevronDownIcon
            className={cn(
              "size-4 transition-transform",
              !myTasksOpen && "-rotate-90"
            )}
          />
        </button>

        {myTasksOpen && (
          <ul className="mt-2 space-y-1 pl-2">
            {myTasks.length === 0 ? (
              <li className="text-xs text-zinc-400 dark:text-zinc-500 py-2 pl-4">
                No tasks assigned
              </li>
            ) : (
              myTasks.map((task) => (
                <li key={task.id}>
                  <Link
                    to={`/projects/${task.projectId}?tab=tasks`}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-start gap-2 px-2 py-1.5 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800/50 group"
                  >
                    <span
                      className={cn(
                        "w-2 h-2 rounded-full mt-1.5 shrink-0",
                        STATUS_COLORS[task.status] || "bg-zinc-400"
                      )}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-zinc-700 dark:text-zinc-300 truncate">
                        {task.title}
                      </p>
                      <p className="text-xs text-zinc-400 dark:text-zinc-500 lowercase">
                        {task.status}
                      </p>
                    </div>
                  </Link>
                </li>
              ))
            )}
          </ul>
        )}
      </div>

      <hr className="my-2 border-zinc-200 dark:border-zinc-800" />

      {/* Projects Section */}
      <div className="px-4 py-2 flex-1">
        <div className="flex items-center justify-between mb-2">
          <button
            onClick={() => setProjectsOpen(!projectsOpen)}
            className="flex items-center gap-2 text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider hover:text-zinc-700 dark:hover:text-zinc-300"
          >
            Projects
            <ChevronDownIcon
              className={cn(
                "size-3 transition-transform",
                !projectsOpen && "-rotate-90"
              )}
            />
          </button>
          <Link
            to="/projects"
            onClick={() => setMobileOpen(false)}
            className="text-zinc-400 hover:text-indigo-500"
          >
            <ChevronRightIcon className="size-4" />
          </Link>
        </div>

        {projectsOpen && (
          <ul className="space-y-0.5">
            {recentProjects.length === 0 ? (
              <li className="text-xs text-zinc-400 dark:text-zinc-500 py-2">
                No projects yet
              </li>
            ) : (
              recentProjects.map((project) => (
                <li key={project.projectId}>
                  <button
                    onClick={() => toggleProject(project.projectId)}
                    className="flex items-center gap-2 w-full px-2 py-1.5 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800/50 text-left"
                  >
                    <ChevronDownIcon
                      className={cn(
                        "size-3 text-zinc-400 transition-transform shrink-0",
                        !expandedProjects[project.projectId] && "-rotate-90"
                      )}
                    />
                    <span
                      className={cn(
                        "w-2 h-2 rounded-full shrink-0",
                        project.status === "Active"
                          ? "bg-indigo-500"
                          : project.status === "Completed"
                          ? "bg-emerald-500"
                          : "bg-zinc-400"
                      )}
                    />
                    <span className="text-sm text-zinc-700 dark:text-zinc-300 truncate">
                      {project.name}
                    </span>
                  </button>

                  {expandedProjects[project.projectId] && (
                    <ul className="ml-5 mt-1 space-y-0.5 border-l border-zinc-200 dark:border-zinc-700 pl-2">
                      <li>
                        <Link
                          to={`/projects/${project.projectId}?tab=tasks`}
                          onClick={() => setMobileOpen(false)}
                          className="flex items-center gap-2 px-2 py-1 text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300"
                        >
                          <ListTodoIcon className="size-3.5" />
                          Tasks
                        </Link>
                      </li>
                      <li>
                        <Link
                          to={`/projects/${project.projectId}?tab=analytics`}
                          onClick={() => setMobileOpen(false)}
                          className="flex items-center gap-2 px-2 py-1 text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300"
                        >
                          <BarChart3Icon className="size-3.5" />
                          Analytics
                        </Link>
                      </li>
                      <li>
                        <Link
                          to={`/projects/${project.projectId}?tab=calendar`}
                          onClick={() => setMobileOpen(false)}
                          className="flex items-center gap-2 px-2 py-1 text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300"
                        >
                          <CalendarIcon className="size-3.5" />
                          Calendar
                        </Link>
                      </li>
                      <li>
                        <Link
                          to={`/projects/${project.projectId}?tab=settings`}
                          onClick={() => setMobileOpen(false)}
                          className="flex items-center gap-2 px-2 py-1 text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300"
                        >
                          <Settings2Icon className="size-3.5" />
                          Settings
                        </Link>
                      </li>
                    </ul>
                  )}
                </li>
              ))
            )}
          </ul>
        )}
      </div>
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
              onClick={() => openOrganizationProfile()}
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
      <aside className="hidden lg:flex lg:flex-col w-68 border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
        <WorkspaceDropdown />
        <hr className="border-zinc-200 dark:border-zinc-800" />
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
                <hr className="border-zinc-200 dark:border-zinc-800" />
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
