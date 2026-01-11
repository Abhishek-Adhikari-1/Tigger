import {
  ChevronDownIcon,
  FolderOpenIcon,
  PlusIcon,
  SearchIcon,
} from "lucide-react";
import { useState, useMemo } from "react";
import { Link } from "react-router-dom";

import Card from "../../components/ui/card";
import { useProjectsStore } from "../../store/use-project";
import { cn, statusColors } from "../../utils/utils";
import { useDebouncedCallback } from "../../hooks/use-debounced-callback";
import { CreateProject } from "../../components/ui/create-project";

export default function ProjectsPage() {
  const { projects, loading } = useProjectsStore();

  const [searchData, setSearchData] = useState(null);
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");

  const isSearching = searchData !== null;
  const baseList = isSearching ? searchData : projects;

  // Filter the list based on status and priority
  const list = useMemo(() => {
    return baseList?.filter((p) => {
      const matchesStatus = statusFilter === "All" || p.status === statusFilter;
      const matchesPriority = priorityFilter === "All" || p.priority === priorityFilter;
      return matchesStatus && matchesPriority;
    });
  }, [baseList, statusFilter, priorityFilter]);

  const debouncedSearch = useDebouncedCallback(async (value) => {
    if (!value) {
      setSearchData(null);
      return;
    }

    try {
      const response = await fetch(
        `/api/projects/all?query=${encodeURIComponent(value)}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch projects");
      }

      const data = await response.json();

      if (data.success) {
        setSearchData(data.data || []);
      } else {
        setSearchData([]);
      }
    } catch (err) {
      console.error(err);
      setSearchData([]);
    }
  }, 500);

  return (
    <div className="space-y-6 py-3 px-2 md:px-4 md:py-4 xl:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white mb-1">
            Projects
          </h1>
          <p className="text-gray-500 dark:text-zinc-400 text-sm">
            Manage and track your projects
          </p>
        </div>

        <CreateProject text="New Project" />
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex w-full">
          <div className="relative w-full max-w-md">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-zinc-400 w-4 h-4" />

            <input
              type="search"
              onChange={(e) => {
                const value = e.target.value.trim();
                debouncedSearch(value);
              }}
              className="w-full pl-10 text-sm pr-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-400 focus:ring focus:ring-indigo-500 outline-none"
              placeholder="Search projects..."
            />
          </div>
        </div>

        <div className="flex flex-row gap-4">
          <div className="relative max-w-min">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
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
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
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
        {list?.map((p) => (
          <ProjectCard key={p.projectId} p={p} />
        ))}
      </div>

      {!loading && isSearching && searchData.length === 0 && (
        <NoProjectsFound message="No projects match your search" />
      )}

      {!loading && !isSearching && projects.length === 0 && (
        <NoProjectsFound message="No projects found" />
      )}
    </div>
  );
}

function ProjectCard({ p }) {
  return (
    <Link to={`/projects/${p.projectId}`}>
      <Card className="h-full flex flex-col justify-between">
        <div className="mb-3 flex-1">
          <h3 className="font-semibold text-gray-900 dark:text-zinc-200 truncate">
            {p.name}
          </h3>
          <p className="text-sm text-gray-500 dark:text-zinc-400 line-clamp-2">
            {p.description || "No description"}
          </p>
        </div>

        <div className="flex justify-between items-center">
          <span
            className={cn(
              "px-2 py-0.5 rounded text-xs",
              statusColors[p.status]
            )}
          >
            {p.status}
          </span>
          <span className="text-xs text-gray-500 capitalize">
            {p.priority} priority
          </span>
        </div>
      </Card>
    </Link>
  );
}

function NoProjectsFound({ message }) {
  return (
    <div className="py-16 flex flex-col items-center">
      <div className="w-24 h-24 mx-auto mb-6 bg-indigo-100 dark:bg-zinc-800 rounded-full flex items-center justify-center">
        <FolderOpenIcon className="w-12 h-12 text-indigo-400" />
      </div>

      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
        {message}
      </h3>

      <p className="text-sm text-gray-500 dark:text-zinc-400 mb-6">
        Try a different keyword or create a new project
      </p>

      <CreateProject
        className={
          "inline-flex items-center gap-1.5 bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded text-sm"
        }
      />
    </div>
  );
}
