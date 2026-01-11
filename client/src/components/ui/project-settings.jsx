import { useOrganization } from "@clerk/react-router";
import { ChevronDownIcon, PlusIcon, XIcon, TrashIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateProjectSchema } from "../../utils/validators/project.validator";
import { useProjectsStore } from "../../store/use-project";
import { toDateInputValue } from "../../utils/utils";
import AvatarImage from "./avatar";
import toast from "react-hot-toast";
import { useState } from "react";

export default function ProjectSettings() {
  const {
    memberships: { data: memberships },
  } = useOrganization({
    memberships: {
      infinite: true,
      keepPreviousData: true,
    },
  });

  const { updateProject, currentProject } = useProjectsStore();
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [teamMembers, setTeamMembers] = useState(currentProject?.team_members ?? []);

  // Get members that are not already in the team
  const availableMembers = memberships?.filter(
    (m) => !teamMembers.includes(m?.publicUserData?.userId)
  );

  const handleAddMember = async (userId) => {
    const newTeamMembers = [...teamMembers, userId];
    
    try {
      await updateProject(currentProject?.projectId, { team_members: newTeamMembers });
      setTeamMembers(newTeamMembers);
      setIsAddMemberOpen(false);
      toast.success("Team member added");
    } catch (err) {
      toast.error(err.message || "Failed to add team member");
    }
  };

  const handleRemoveMember = async (userId) => {
    const newTeamMembers = teamMembers.filter((id) => id !== userId);
    
    try {
      await updateProject(currentProject?.projectId, { team_members: newTeamMembers });
      setTeamMembers(newTeamMembers);
      toast.success("Team member removed");
    } catch (err) {
      toast.error(err.message || "Failed to remove team member");
    }
  };

  const form = useForm({
    resolver: zodResolver(updateProjectSchema),
    defaultValues: {
      name: currentProject?.name ?? "",
      description: currentProject?.description ?? "",
      priority: currentProject?.priority ?? "Medium",
      status: currentProject?.status ?? "Open",
      start_date: currentProject?.start_date
        ? toDateInputValue(currentProject?.start_date)
        : "",
      end_date: currentProject?.end_date
        ? toDateInputValue(currentProject?.end_date)
        : "",
      project_manager: currentProject?.project_manager ?? "",
      team_members: currentProject?.team_members ?? [],
    },
  });

  const buildUpdatePayload = (data) => {
    const payload = {};

    // Always send all provided values (since we're using PUT now)
    Object.keys(data).forEach((key) => {
      if (key === "team_members") return;
      
      if (data[key] !== undefined && data[key] !== "") {
        payload[key] = data[key];
      }
    });

    // Convert dates to ISO format
    if (payload.start_date) {
      payload.start_date = new Date(payload.start_date).toISOString();
    }

    if (payload.end_date) {
      payload.end_date = new Date(payload.end_date).toISOString();
    }

    return payload;
  };

  const onSubmit = async (data) => {
    if (!currentProject?.projectId) {
      toast.error("No project selected");
      return;
    }

    const payload = buildUpdatePayload(data);

    try {
      await updateProject(currentProject?.projectId, payload);
      toast.success("Project updated successfully");
    } catch (err) {
      toast.error(err.message || "Failed to update project");
    }
  };

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="relative w-full rounded-lg p-6 
              bg-white dark:bg-zinc-900
              border border-gray-200 dark:border-zinc-800 max-sm:h-full max-sm:rounded-none overflow-y-auto lg:col-span-2"
      >
        {/* Body */}
        <div className="space-y-3">
          {/* Project Name Input */}
          <div>
            <label htmlFor="project-name" className="text-sm">
              Project Name{" "}
              <span className="text-red-600 dark:text-red-500 select-none">
                *
              </span>
            </label>
            <input
              type="text"
              id="project-name"
              placeholder="Enter project name"
              className="w-full px-3 py-2 text-sm rounded-lg
                  bg-white dark:bg-zinc-900
                  text-gray-900 dark:text-white
                  border border-gray-300 dark:border-zinc-700
                  placeholder-gray-400 dark:placeholder-zinc-500
                  focus:outline-none focus:ring focus:ring-indigo-500"
              {...form.register("name")}
            />
            {form.formState.errors.name && (
              <p className="text-xs text-red-600">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>

          {/* Project Description */}
          <div>
            <label htmlFor="project-description" className="text-sm">
              Description
            </label>
            <textarea
              id="project-description"
              rows={3}
              placeholder="Describe your project"
              className="w-full px-3 py-2 text-sm rounded-lg resize-y max-h-40 min-h-[38px]
                    bg-white dark:bg-zinc-900
                    text-gray-900 dark:text-white
                    border border-gray-300 dark:border-zinc-700
                    placeholder-gray-400 dark:placeholder-zinc-500
                    focus:outline-none focus:ring focus:ring-indigo-500"
              {...form.register("description")}
            />
            {form.formState.errors.description && (
              <p className="text-xs text-red-600">
                {form.formState.errors.description.message}
              </p>
            )}
          </div>

          {/* Status & Priority Selectors */}
          <div className="flex justify-center items-center flex-col sm:flex-row gap-4">
            <div className="w-full">
              <label htmlFor="project-status">
                Status{" "}
                <span className="text-red-600 dark:text-red-500 select-none">
                  *
                </span>
              </label>

              <div className="relative w-full">
                <select
                  id="project-status"
                  className="appearance-none w-full px-3 pr-7 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white text-sm focus-visible:outline-none focus-visible:ring focus-visible:ring-indigo-500"
                  {...form.register("status")}
                >
                  <option value="Active">Active</option>
                  <option value="Planning">Planning</option>
                  <option value="Completed">Completed</option>
                  <option value="Hold">On Hold</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Cancelled">Cancelled</option>
                </select>

                <ChevronDownIcon className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-zinc-400" />
              </div>
              {form.formState.errors.status && (
                <p className="text-xs text-red-600">
                  {form.formState.errors.status.message}
                </p>
              )}
            </div>

            <div className="w-full">
              <label htmlFor="project-priority">
                Priority{" "}
                <span className="text-red-600 dark:text-red-500 select-none">
                  *
                </span>
              </label>

              <div className="relative w-full">
                <select
                  id="project-priority"
                  className="appearance-none w-full px-3 pr-7 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white text-sm focus-visible:outline-none focus-visible:ring focus-visible:ring-indigo-500"
                  {...form.register("priority")}
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>

                <ChevronDownIcon className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-zinc-400" />
              </div>
              {form.formState.errors.priority && (
                <p className="text-xs text-red-600">
                  {form.formState.errors.priority.message}
                </p>
              )}
            </div>
          </div>

          {/* Start Date & End Date Input */}
          <div className="flex justify-center items-center flex-col sm:flex-row gap-4">
            <div className="w-full">
              <label htmlFor="start-date" className="text-sm">
                Start Date
                <span className="text-red-600 dark:text-red-500 select-none">
                  *
                </span>
              </label>
              <input
                type="date"
                id="start-date"
                placeholder="Enter project name"
                className="w-full px-3 py-2 text-sm rounded-lg
                      bg-white dark:bg-zinc-900
                      text-gray-900 dark:text-white
                      border border-gray-300 dark:border-zinc-700
                      placeholder-gray-400 dark:placeholder-zinc-500
                      focus:outline-none focus:ring focus:ring-indigo-500"
                {...form.register("start_date")}
              />
              {form.formState.errors.start_date && (
                <p className="text-xs text-red-600">
                  {form.formState.errors.start_date.message}
                </p>
              )}
            </div>

            <div className="w-full">
              <label htmlFor="end-date" className="text-sm">
                End Date
                <span className="text-red-600 dark:text-red-500 select-none">
                  *
                </span>
              </label>
              <input
                type="date"
                id="end-date"
                placeholder="Enter project name"
                className="w-full px-3 py-2 text-sm rounded-lg
                      bg-white dark:bg-zinc-900
                      text-gray-900 dark:text-white
                      border border-gray-300 dark:border-zinc-700
                      placeholder-gray-400 dark:placeholder-zinc-500
                      focus:outline-none focus:ring focus:ring-indigo-500"
                {...form.register("end_date")}
              />
              {form.formState.errors.end_date && (
                <p className="text-xs text-red-600">
                  {form.formState.errors.end_date.message}
                </p>
              )}
            </div>
          </div>

          {/* Project Manager Input */}
          <div className="w-full">
            <label htmlFor="project-manager">
              Project Manager{" "}
              <span className="text-red-600 dark:text-red-500 select-none">
                *
              </span>
            </label>

            <div className="relative w-full">
              <select
                id="project-manager"
                className="appearance-none w-full px-3 pr-7 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white text-sm focus-visible:outline-none focus-visible:ring focus-visible:ring-indigo-500"
                {...form.register("project_manager")}
              >
                <option value="" disabled>
                  Select a Project Manager
                </option>
                {memberships?.map((m) => (
                  <option
                    key={m?.publicUserData?.userId}
                    value={m?.publicUserData?.userId}
                  >
                    {m?.publicUserData?.identifier}
                  </option>
                ))}
              </select>

              <ChevronDownIcon className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-zinc-400" />
            </div>

            {form.formState.errors.project_manager && (
              <p className="text-xs text-red-600">
                {form.formState.errors.project_manager.message}
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            type="submit"
            className="px-4 py-2 text-sm rounded
                  bg-indigo-600 hover:bg-indigo-700
                  text-white"
          >
            Update Project
          </button>
        </div>
      </form>

      <div
        className="relative w-full max-w-lg rounded-lg p-6 
              bg-white dark:bg-zinc-900
              border border-gray-200 dark:border-zinc-800 max-sm:h-full max-sm:rounded-none overflow-y-auto"
      >
        <div className="flex items-center justify-between gap-4 mb-4">
          <h2 className="text-lg font-medium text-zinc-900 dark:text-zinc-300">
            Team Members{" "}
            <span className="text-sm text-zinc-600 dark:text-zinc-400">
              ({teamMembers?.length || 0})
            </span>
          </h2>
          <button
            type="button"
            onClick={() => setIsAddMemberOpen(!isAddMemberOpen)}
            className="p-2 rounded-lg border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            {isAddMemberOpen ? (
              <XIcon className="size-4 text-zinc-900 dark:text-zinc-300" />
            ) : (
              <PlusIcon className="size-4 text-zinc-900 dark:text-zinc-300" />
            )}
          </button>
        </div>

        {/* Add Member Dropdown */}
        {isAddMemberOpen && (
          <div className="mb-4 p-3 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50">
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-3">
              Select a member to add:
            </p>
            {availableMembers?.length === 0 ? (
              <p className="text-sm text-zinc-500 dark:text-zinc-500 italic">
                No available members to add
              </p>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {availableMembers?.map((m) => (
                  <button
                    key={m?.publicUserData?.userId}
                    type="button"
                    onClick={() => handleAddMember(m?.publicUserData?.userId)}
                    className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors"
                  >
                    <AvatarImage
                      name={`${m?.publicUserData?.firstName} ${m?.publicUserData?.lastName}`}
                      src={m?.publicUserData?.imageUrl}
                      className="cursor-pointer"
                    />
                    <div className="flex flex-col items-start">
                      <span className="text-sm text-zinc-900 dark:text-zinc-200">
                        {m?.publicUserData?.firstName} {m?.publicUserData?.lastName}
                      </span>
                      <span className="text-xs text-zinc-500 dark:text-zinc-400">
                        {m?.publicUserData?.identifier}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Team Members List */}
        <div className="space-y-4">
          {teamMembers?.length === 0 ? (
            <p className="text-sm text-zinc-500 dark:text-zinc-500 italic text-center py-4">
              No team members yet
            </p>
          ) : (
            teamMembers?.map((id) => {
              const member = memberships?.find((fm) => id === fm?.publicUserData?.userId);
              
              if (!member) return null;

              return (
                <ProjectMemberCard 
                  key={id} 
                  assignee={member} 
                  onRemove={() => handleRemoveMember(id)}
                />
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

function ProjectMemberCard({ assignee, onRemove }) {
  return (
    <div className="flex flex-row items-center">
      <AvatarImage
        name={
          assignee
            ? `${assignee?.publicUserData.firstName} ${assignee?.publicUserData.lastName}`
            : null
        }
        src={assignee?.publicUserData.imageUrl}
        className="cursor-default"
      />
      <div className="ml-3 flex flex-col flex-1">
        <span className="text-sm text-zinc-900 dark:text-zinc-300">
          {assignee?.publicUserData.firstName} {assignee?.publicUserData.lastName}
        </span>
        <span className="text-xs text-zinc-500 dark:text-zinc-400">
          {assignee?.publicUserData.identifier}
        </span>
      </div>
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-zinc-400 hover:text-red-500 transition-colors"
          title="Remove member"
        >
          <TrashIcon className="size-4" />
        </button>
      )}
    </div>
  );
}
