import {
  ChevronDownIcon,
  FolderOpenIcon,
  PlusIcon,
  SearchIcon,
} from "lucide-react";
import Card from "../../components/ui/card";
import { useProjectsStore } from "../../store/use-project";
import { cn } from "../../utils/utils";
import { Link } from "react-router-dom";

export default function ProjectsPage() {
  const { projects, loading, error } = useProjectsStore();

  console.log({
    loading,
    error,
    projects,
  });

  const statusColors = {
    Active:
      "bg-indigo-300 dark:bg-indigo-700 text-indigo-700 dark:text-indigo-200",
    Completed:
      "bg-emerald-200 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-300",
    Hold: "bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-300",
    Planning: "bg-blue-200 dark:bg-blue-900 text-blue-900 dark:text-blue-300",
    Cancelled: "bg-red-200 dark:bg-red-900 text-red-950 dark:text-red-300",
    Inactive: "bg-gray-200 dark:bg-zinc-600 text-gray-900 dark:text-zinc-200",
  };

  return (
    <div className="space-y-6 py-3 px-2 md:px-4 md:py-4 xl:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white mb-1">
            {" "}
            Projects{" "}
          </h1>
          <p className="text-gray-500 dark:text-zinc-400 text-sm">
            {" "}
            Manage and track your projects{" "}
          </p>
        </div>
        <div className="max-sm:flex justify-end">
          <button
            // onClick={() => setIsDialogOpen(true)}
            className="flex items-center px-5 py-2 text-sm rounded bg-linear-to-br from-indigo-500 to-indigo-600 text-white hover:opacity-90 transition "
          >
            <PlusIcon className="size-4 mr-2" strokeWidth={2} /> New Project
          </button>
        </div>
        {/* <CreateProjectDialog
          isDialogOpen={isDialogOpen}
          setIsDialogOpen={setIsDialogOpen}
        /> */}
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex w-full">
          <div className="relative w-full max-w-md">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-zinc-400 w-4 h-4" />

            <input
              // onChange={(e) => setSearchTerm(e.target.value)}
              // value={searchTerm}
              className="w-full pl-10 text-sm pr-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-400 focus:ring focus:ring-indigo-500 outline-none"
              placeholder="Search projects..."
            />
          </div>
        </div>

        <div className="flex flex-row gap-4">
          <div className="relative max-w-min">
            <select
              // value={filters.status}
              // onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              name="filter_by_status"
              className="appearance-none px-3 pr-7 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white text-sm focus-visible:outline-none focus-visible:ring focus-visible:ring-indigo-500"
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Planning">Planning</option>
              <option value="Completed">Completed</option>
              <option value="Hold">On Hold</option>
              <option value="Inactive">Inactive</option>
              <option value="Cancelled">Cancelled</option>
            </select>

            <ChevronDownIcon className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-zinc-400" />
          </div>

          <div className="relative max-w-min">
            <select
              // value={filters.status}
              // onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              name="filter_by_priority"
              className="appearance-none px-3 pr-7 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white text-sm focus-visible:outline-none focus-visible:ring focus-visible:ring-indigo-500"
            >
              <option value="All">All Priority</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>

            <ChevronDownIcon className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-zinc-400" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects?.map((p) => (
          <div key={p.projectId}>
            <Link to={`/projects/${p.projectId}`}>
              <Card className={"h-full"}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 dark:text-zinc-200 mb-1 truncate group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors duration-200">
                      {p?.name}
                    </h3>
                    <p className="text-gray-500 dark:text-zinc-400 text-sm line-clamp-2 mb-3">
                      {p?.description || "No description"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <span
                    className={cn(
                      "px-2 py-0.5 rounded text-xs",
                      statusColors[p?.status]
                    )}
                  >
                    {p?.status.replace("_", " ")}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-zinc-500 capitalize">
                    {p?.priority} priority
                  </span>
                </div>
              </Card>
            </Link>
          </div>
        ))}
      </div>

      {!loading && projects?.length === 0 && (
        <div className="mt-4">
          <NoProjectsFound />
        </div>
      )}
      {/* {loading && (
        <div className="mt-4">
          <LoadingSpinner />
        </div>
      )} */}
    </div>
  );
}

function NoProjectsFound() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="col-span-full text-center py-16">
        <div className="w-24 h-24 mx-auto mb-6 bg-indigo-100 dark:bg-zinc-800 rounded-full flex items-center justify-center">
          <FolderOpenIcon className="w-12 h-12 text-indigo-400 dark:text-zinc-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
          No projects found
        </h3>
        <p className="text-gray-500 dark:text-zinc-400 mb-6 text-sm">
          Create your first project to get started
        </p>
        <button className="flex items-center gap-1.5 bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded mx-auto text-sm">
          <PlusIcon className="size-4" />
          Create Project
        </button>
      </div>
    </div>
  );
}
