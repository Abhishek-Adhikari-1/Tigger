import { useState, useRef, useMemo } from "react";
import { ChevronsUpDown, Check, Plus } from "lucide-react";
import useClickOutside from "../../hooks/use-click-outside";
import {
  useClerk,
  useOrganizationList,
  useOrganization,
} from "@clerk/react-router";
import { cn } from "../../utils/utils";
import { useProjectsStore } from "../../store/use-project";
import { useTasksStore } from "../../store/use-task";

function WorkspaceDropdown({ className }) {
  const {
    openCreateOrganization,
    organization: activeOrg,
    setActive,
  } = useClerk();
  const {
    userMemberships: { data: workspaces },
    isLoaded,
  } = useOrganizationList({
    userMemberships: {
      keepPreviousData: true,
    },
  });

  const { refresh: refreshProjects } = useProjectsStore();
  const { refresh: refreshTasks } = useTasksStore();

  const { membership } = useOrganization();

  const [isOpen, setIsOpen] = useState(false);

  const dropdownRef = useRef(null);
  useClickOutside(dropdownRef, () => setIsOpen(false));

  const workspaceList = useMemo(() => {
    if (!workspaces) return [];

    let updatedList = [...workspaces];

    if (
      membership &&
      !updatedList.some((w) => w.organization.id === membership.organization.id)
    ) {
      updatedList.push(membership);
    }

    updatedList.sort((a, b) =>
      a.organization.id === activeOrg?.id
        ? -1
        : b.organization.id === activeOrg?.id
        ? 1
        : 0
    );

    return updatedList;
  }, [workspaces, membership, activeOrg]);

  const onSelectWorkspace = async (id) => {
    await setActive({ organization: id });
    setIsOpen(false);
  };

  if (!isLoaded) return null;

  return (
    <div className={cn("relative m-4", className)} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full p-3 rounded hover:bg-gray-100 dark:hover:bg-zinc-800 flex flex-row items-center"
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <img
            src={activeOrg?.imageUrl}
            alt={activeOrg?.name}
            className="w-8 h-8 rounded shadow"
          />

          <div className="flex flex-col flex-1 min-w-0">
            <p className="font-semibold text-sm truncate text-slate-800 dark:text-slate-200 text-start">
              {activeOrg?.name}
            </p>

            <p className="text-xs text-gray-500 dark:text-zinc-400 truncate text-start">
              {workspaceList.length > 1
                ? `${workspaceList.length} workspaces`
                : `${workspaceList.length} workspace`}
            </p>
          </div>
        </div>

        <ChevronsUpDown className="w-5 h-5 shrink-0 text-gray-500 dark:text-zinc-400" />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-64 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-lg shadow-sm top-full left-0 overflow-hidden">
          <div className="p-2 space-y-2">
            <p className="text-xs text-gray-500 uppercase px-2">Workspaces</p>

            <div className="max-h-96 overflow-y-auto">
              {workspaceList.map(({ organization: ws, roleName }) => {
                const isActive = activeOrg?.id === ws.id;
                return (
                  <div
                    key={ws.id}
                    className={cn(
                      isActive &&
                        "sticky top-0 left-0 bg-white dark:bg-zinc-900"
                    )}
                  >
                    <div
                      {...(!isActive && {
                        onClick: async () => {
                          await onSelectWorkspace(ws.id);
                          await refreshProjects();
                          await refreshTasks();
                        },
                      })}
                      className={cn(
                        "flex items-center gap-3 p-2 rounded",
                        !isActive &&
                          "cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-800 select-none"
                      )}
                    >
                      <img
                        src={ws.imageUrl}
                        alt={ws.name}
                        className={cn("w-6 h-6 rounded")}
                      />
                      <div className="flex-1 min-w-0">
                        <p
                          className="text-sm font-medium truncate"
                          {...(isActive && {
                            title: activeOrg?.name,
                          })}
                        >
                          {ws.name}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {isActive
                            ? roleName
                            : `${ws.membersCount} member${
                                ws.membersCount > 1 ? "s" : ""
                              }`}
                        </p>
                      </div>
                      {isActive && <Check className="w-4 h-4 text-blue-600" />}
                    </div>
                    {isActive && workspaceList.length > 1 && (
                      <hr className="text-zinc-300 dark:text-zinc-700 mb-1" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <hr className="text-zinc-300 dark:text-zinc-700" />

          <button
            onClick={() => openCreateOrganization()}
            className="p-2 w-full cursor-pointer hover:bg-blue-100/45 dark:hover:bg-blue-950/30 select-none group rounded-br-lg rounded-bl-lg"
          >
            <p className="flex items-center text-xs gap-2 my-1 text-blue-500 dark:text-blue-400 group-hover:text-blue-600 dark:group-hover:text-blue-500">
              <Plus className="w-4 h-4" /> Create Workspace
            </p>
          </button>
        </div>
      )}
    </div>
  );
}

export default WorkspaceDropdown;
