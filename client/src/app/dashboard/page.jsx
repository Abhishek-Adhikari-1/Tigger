import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useUser, useOrganization } from "@clerk/clerk-react";
import {
  FolderIcon,
  CheckCircleIcon,
  ListTodoIcon,
  AlertTriangleIcon,
  PlusIcon,
  ArrowRightIcon,
  UsersIcon,
  CalendarIcon,
} from "lucide-react";
import { cn } from "../../utils/utils";

const STATUS_COLORS = {
  Planning: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400",
  Active: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400",
  Completed: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
  Hold: "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400",
  Inactive: "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-500",
  Cancelled: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
};

const PRIORITY_COLORS = {
  High: "text-red-500",
  Medium: "text-amber-500",
  Low: "text-emerald-500",
};

export default function DashboardPage() {
  const { user } = useUser();
  const { organization } = useOrganization();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await fetch("/api/projects/dashboard", {
          method: "GET",
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          if (data.success) {
            setDashboardData(data.data);
          }
        }
      } catch (err) {
        console.error("Failed to fetch dashboard:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500" />
      </div>
    );
  }

  const stats = dashboardData || {
    totalProjects: 0,
    completedProjects: 0,
    myTasksCount: 0,
    overdueCount: 0,
    myTasks: [],
    overdueTasks: [],
    recentProjects: [],
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
            Welcome back, {user?.firstName || "User"}
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400">
            Here's what's happening with your projects today
          </p>
        </div>
        <Link
          to="/projects"
          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-medium rounded-lg transition-all shadow-lg shadow-indigo-500/25"
        >
          <PlusIcon className="size-4" />
          New Project
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Projects"
          value={stats.totalProjects}
          subtitle={`projects in ${organization?.name || "Organization"}`}
          icon={FolderIcon}
          iconColor="text-indigo-500"
          iconBg="bg-indigo-50 dark:bg-indigo-900/20"
        />
        <StatCard
          title="Completed Projects"
          value={stats.completedProjects}
          subtitle={`of ${stats.totalProjects} total`}
          icon={CheckCircleIcon}
          iconColor="text-emerald-500"
          iconBg="bg-emerald-50 dark:bg-emerald-900/20"
        />
        <StatCard
          title="My Tasks"
          value={stats.myTasksCount}
          subtitle="assigned to me"
          icon={ListTodoIcon}
          iconColor="text-pink-500"
          iconBg="bg-pink-50 dark:bg-pink-900/20"
        />
        <StatCard
          title="Overdue"
          value={stats.overdueCount}
          subtitle="need attention"
          icon={AlertTriangleIcon}
          iconColor="text-amber-500"
          iconBg="bg-amber-50 dark:bg-amber-900/20"
          highlight={stats.overdueCount > 0}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Project Overview - Takes 2 columns */}
        <div className="lg:col-span-2 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-zinc-900 dark:text-white">
              Project Overview
            </h2>
            <Link
              to="/projects"
              className="text-sm text-indigo-500 hover:text-indigo-600 flex items-center gap-1"
            >
              View all <ArrowRightIcon className="size-4" />
            </Link>
          </div>

          <div className="space-y-4">
            {stats.recentProjects.length === 0 ? (
              <p className="text-zinc-500 dark:text-zinc-400 text-sm py-8 text-center">
                No projects yet. Create your first project!
              </p>
            ) : (
              stats.recentProjects.map((project) => (
                <ProjectCard key={project.projectId} project={project} />
              ))
            )}
          </div>
        </div>

        {/* Right Column - My Tasks & Overdue */}
        <div className="space-y-6">
          {/* Overdue Tasks */}
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <AlertTriangleIcon className="size-5 text-amber-500" />
                <h2 className="font-semibold text-zinc-900 dark:text-white">
                  Overdue
                </h2>
              </div>
              <span
                className={cn(
                  "text-sm px-2 py-0.5 rounded-full",
                  stats.overdueCount > 0
                    ? "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                    : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500"
                )}
              >
                {stats.overdueCount}
              </span>
            </div>

            <div className="space-y-3">
              {stats.overdueTasks.length === 0 ? (
                <div className="text-center py-4">
                  <CheckCircleIcon className="size-8 mx-auto text-emerald-500 mb-2" />
                  <p className="text-zinc-500 dark:text-zinc-400 text-sm">
                    All caught up! No overdue tasks.
                  </p>
                </div>
              ) : (
                stats.overdueTasks.map((task) => (
                  <TaskCard key={task.id} task={task} isOverdue />
                ))
              )}
            </div>
          </div>

          {/* My Tasks */}
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <ListTodoIcon className="size-5 text-pink-500" />
                <h2 className="font-semibold text-zinc-900 dark:text-white">
                  My Tasks
                </h2>
              </div>
              <span className="text-sm bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 px-2 py-0.5 rounded-full">
                {stats.myTasksCount}
              </span>
            </div>

            <div className="space-y-3">
              {stats.myTasks.length === 0 ? (
                <p className="text-zinc-500 dark:text-zinc-400 text-sm py-4 text-center">
                  No tasks assigned to you
                </p>
              ) : (
                stats.myTasks.map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))
              )}
            </div>
          </div>          
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, subtitle, icon: Icon, iconColor, iconBg, highlight }) {
  return (
    <div
      className={cn(
        "p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 transition-all",
        highlight && "ring-2 ring-red-500/20"
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">{title}</p>
          <p className={cn("text-3xl font-bold mt-1", highlight ? "text-red-500" : "text-zinc-900 dark:text-white")}>
            {value}
          </p>
          <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">{subtitle}</p>
        </div>
        <div className={cn("p-2.5 rounded-xl", iconBg)}>
          <Icon className={cn("size-5", iconColor)} />
        </div>
      </div>
    </div>
  );
}

function ProjectCard({ project }) {
  return (
    <Link
      to={`/projects/${project.projectId}`}
      className="block p-4 rounded-lg border border-zinc-100 dark:border-zinc-800 hover:border-zinc-200 dark:hover:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-all"
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1 min-w-0 mr-3">
          <h3 className="font-medium text-zinc-900 dark:text-white truncate">
            {project.name}
          </h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-1">
            {project.description || "No description"}
          </p>
        </div>
        <span className={cn("text-xs px-2 py-1 rounded-full shrink-0", STATUS_COLORS[project.status])}>
          {project.status}
        </span>
      </div>

      <div className="flex items-center gap-4 text-xs text-zinc-400 dark:text-zinc-500 mb-3">
        <span className="flex items-center gap-1">
          <UsersIcon className="size-3.5" />
          {project.team_members?.length || 0} members
        </span>
        <span className="flex items-center gap-1">
          <CalendarIcon className="size-3.5" />
          {project.end_date ? new Date(project.end_date).toLocaleDateString() : "No deadline"}
        </span>
      </div>

      <div>
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-xs text-zinc-500 dark:text-zinc-400">Progress</span>
          <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
            {project.completion_rate}%
          </span>
        </div>
        <div className="w-full h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${project.completion_rate}%`,
              background:
                project.completion_rate === 100
                  ? "#10b981"
                  : project.completion_rate >= 50
                  ? "#6366f1"
                  : project.completion_rate > 0
                  ? "#f59e0b"
                  : "#e5e7eb",
            }}
          />
        </div>
      </div>
    </Link>
  );
}

function TaskCard({ task, isOverdue }) {
  return (
    <Link
      to={`/projects/${task.projectId}?tab=tasks`}
      className="block p-3 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-all"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-zinc-900 dark:text-white truncate">
            {task.title}
          </p>
          <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">
            {task.type} • <span className={PRIORITY_COLORS[task.priority]}>{task.priority}</span> Priority
          </p>
        </div>
        {isOverdue && (
          <span className="text-xs text-red-500 shrink-0">
            {new Date(task.due_date).toLocaleDateString()}
          </span>
        )}
      </div>
    </Link>
  );
}
