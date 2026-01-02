import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProjectsStore } from "../../../store/use-project";
import { CreateProject } from "../../../components/ui/create-project";
import { ChevronLeftIcon } from "lucide-react";
import { cn, statusColors } from "../../../utils/utils";
import { CreateTask } from "../../../components/ui/create-task";

export default function ProjectPageSpecific() {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const { currentProject, getProjectById, loading, error } = useProjectsStore();

  useEffect(() => {
    if (!projectId) return;
    getProjectById(projectId);
  }, [projectId, getProjectById]);

  if (loading) {
    return <div>Loading project...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!currentProject) {
    return <div>No project found</div>;
  }

  return (
    <div className="py-3 px-2 md:px-4 md:py-4 xl:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <div className="flex flex-row gap-3 items-center">
            <button
              onClick={() => navigate("/projects")}
              className="p-1 rounded
                  hover:bg-gray-100 dark:hover:bg-zinc-800
                  text-gray-500 dark:text-zinc-400 cursor-pointer"
            >
              <ChevronLeftIcon className="size-4" />
            </button>
            <h1 className="text-xl font-medium text-gray-900 dark:text-white mb-1">
              {currentProject.name}
            </h1>
            <span
              className={cn(
                "px-2 py-0.5 rounded text-xs ml-3",
                statusColors[currentProject.status]
              )}
            >
              {currentProject.status}
            </span>
          </div>
          <p className="text-gray-500 dark:text-zinc-400 text-sm">
            Manage and track your projects
          </p>
        </div>

        <CreateTask projectId={projectId} />
      </div>
      <p className="text-gray-500">{currentProject.description}</p>

      <div className="mt-4">
        <h2 className="font-medium">Tasks</h2>

        {currentProject.tasks?.length === 0 && (
          <p className="text-sm text-gray-400">No tasks yet</p>
        )}

        {currentProject.tasks?.map((task) => (
          <div key={task.taskId} className="border p-2 rounded mb-2">
            <p className="font-medium">{task.title}</p>
            <p className="text-sm text-gray-500">{task.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
