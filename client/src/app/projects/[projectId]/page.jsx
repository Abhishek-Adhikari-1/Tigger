import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useProjectsStore } from "../../../store/use-project";

export default function ProjectPageSpecific() {
  const { projectId } = useParams();

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
    <div>
      <h1 className="text-xl font-semibold">{currentProject.name}</h1>
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
