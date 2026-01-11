import { useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useProjectsStore } from "../../../store/use-project";
import { ChevronLeftIcon, ZapIcon } from "lucide-react";
import { cn, statusColors } from "../../../utils/utils";
import { CreateTask } from "../../../components/ui/create-task";
import { useTasksStore } from "../../../store/use-task";
import { ProjectTasksKanban } from "../../../components/ui/project-tasks-kanban";
import Tabs from "../../../components/ui/tabs";
import CalanderView from "../../../components/ui/calander-view";
import ProjectSettings from "../../../components/ui/project-settings";
import ProjectAnalytics from "../../../components/ui/project-analytics";

export default function ProjectPageSpecific() {
  const { projectId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") ?? "tasks";

  const navigate = useNavigate();

  const { currentProject, getProjectById, loading, error } = useProjectsStore();
  const {
    allTasks,
    getAllTasks,
    updateTaskStatusOptimistic,
    rollbackTaskStatus,
    syncTaskStatus,
  } = useTasksStore();

  useEffect(() => {
    if (!projectId) return;
    getProjectById(projectId);
    getAllTasks(projectId);
  }, [projectId, getProjectById, getAllTasks]);

  if (loading) {
    return <div>Loading project...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!currentProject) {
    return <div>No project found</div>;
  }

  const handleStatusChange = async ({ taskId, newStatus }) => {
    const prevStatus = updateTaskStatusOptimistic(taskId, newStatus);

    try {
      await syncTaskStatus(taskId, newStatus, projectId);
    } catch (err) {
      rollbackTaskStatus(taskId, prevStatus);
      console.error("Failed to update task:", err);
    }
  };

  return (
    <div className="py-3 px-2 md:px-4 md:py-4 xl:p-6">
      <div className="py-3 px-2 md:px-4 md:py-4 xl:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start lg:items-center gap-6">
          <div className="flex-1 min-w-0">
            <div className="flex flex-row flex-wrap gap-3 items-center">
              <button
                onClick={() => navigate("/projects")}
                className="p-1 rounded
              hover:bg-gray-100 dark:hover:bg-zinc-800
              text-gray-500 dark:text-zinc-400 cursor-pointer"
              >
                <ChevronLeftIcon className="size-4" />
              </button>

              <h1 className="text-xl font-medium text-gray-900 dark:text-white mb-1 truncate max-w-full">
                {currentProject.name}
              </h1>

              <span
                className={cn(
                  "px-2 py-0.5 rounded text-xs",
                  "sm:ml-3",
                  statusColors[currentProject.status]
                )}
              >
                {currentProject.status}
              </span>
            </div>
          </div>

          <div className="shrink-0">
            <CreateTask projectId={projectId} />
          </div>
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-2 sm:flex flex-wrap gap-6 mt-5">
        {[
          {
            label: "Total Tasks",
            value: allTasks.length,
            color: "text-zinc-600 dark:text-white",
          },
          {
            label: "Completed",
            value: allTasks.filter((t) => t.status === "Done").length,
            color: "text-emerald-500 dark:text-emerald-400",
          },
          {
            label: "In Progress",
            value: allTasks.filter((t) => t.status === "In Progress").length,
            color: "text-amber-500 dark:text-amber-400",
          },
          {
            label: "Team Members",
            value: currentProject.team_members?.length || 0,
            color: "text-blue-500 dark:text-blue-400",
          },
        ].map((card, idx) => (
          <div
            key={idx}
            className=" dark:bg-linear-to-br dark:from-zinc-800/70 dark:to-zinc-900/50 border border-zinc-200 dark:border-zinc-800 flex justify-between sm:min-w-60 p-4 py-2.5 rounded"
          >
            <div>
              <div className="text-sm text-zinc-600 dark:text-zinc-400">
                {card.label}
              </div>
              <div className={`text-2xl font-bold ${card.color}`}>
                {card.value}
              </div>
            </div>
            <ZapIcon className={`size-4 ${card.color}`} />
          </div>
        ))}
      </div>

      <div>
        <Tabs
          activeTab={activeTab}
          onTabClick={(tabItem) => setSearchParams({ tab: tabItem.key })}
        />

        <div className="mt-6">
          {activeTab === "tasks" && (
            <div>
              <ProjectTasksKanban
                tasks={allTasks}
                onStatusChange={handleStatusChange}
              />
            </div>
          )}
          {activeTab === "calendar" && (
            <div>
              <CalanderView />
            </div>
          )}
          {activeTab === "analytics" && (
            <ProjectAnalytics tasks={allTasks} project={currentProject} />
          )}
          {activeTab === "settings" && (
            <div>
              <ProjectSettings />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
