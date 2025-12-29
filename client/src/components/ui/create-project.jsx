import { useOrganization } from "@clerk/react-router";
import { ChevronDownIcon, PlusIcon, XIcon } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createProjectSchema } from "../../utils/validators/project.validator";
import { useProjectsStore } from "../../store/use-project";
import { cn } from "../../utils/utils";

export const CreateProject = ({ text = "Create Project", className }) => {
  const {
    organization: activeOrg,
    memberships: { data: memberships },
  } = useOrganization({
    memberships: {
      infinite: true,
      keepPreviousData: true,
    },
  });

  const { createProject } = useProjectsStore();

  const form = useForm({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      name: "",
      description: "",
      priority: "Medium",
      status: "Planning",
      start_date: new Date().toISOString().split("T")[0],
      end_date: "",
      project_manager: "",
      team_members: [],
    },
  });

  const [open, setOpen] = useState(false);

  const teamMembers =
    useWatch({
      control: form.control,
      name: "team_members",
    }) ?? [];

  const closeModal = useCallback(() => {
    setOpen(false);
    form.reset();
  }, [form]);

  useEffect(() => {
    if (!open) return;

    const handleEsc = (e) => {
      if (e.key === "Escape") closeModal();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleEsc);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleEsc);
    };
  }, [open, closeModal]);

  const addTeamMember = (userId) => {
    if (!userId) return;

    const member = memberships?.find((m) => m.publicUserData.userId === userId);

    if (!member) return;

    if (teamMembers.some((m) => m.userId === userId)) return;

    form.setValue("team_members", [
      ...teamMembers,
      {
        userId,
        identifier: member.publicUserData.identifier,
      },
    ]);
  };

  const removeTeamMember = (userId) => {
    form.setValue(
      "team_members",
      teamMembers.filter((m) => m.userId !== userId)
    );
  };

  const onSubmit = (data) => {
    const payload = {
      ...data,
      team_members: data.team_members.map((m) => m.userId),
    };
    console.log("FORM DATA:", payload);

    createProject(payload).then(() => {
      closeModal();
    });
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setOpen(true)}
        className={cn(
          "flex items-center px-5 py-2 text-sm rounded bg-linear-to-br from-indigo-500 to-indigo-600 text-yellow-300text-white hover:opacity-90 transition",
          className
        )}
      >
        <PlusIcon className="size-4 mr-2" />
        {text}
      </button>

      {/* Modal */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          role="dialog"
          aria-modal="true"
        >
          {/* Overlay */}
          <div
            className="absolute inset-0
              bg-black/40 dark:bg-black/70
              backdrop-blur-sm dark:backdrop-blur-[2px]"
            onClick={() => closeModal()}
          />

          {/* Modal Content */}
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="relative w-full max-w-lg rounded-xl p-6 shadow-lg
              bg-white dark:bg-zinc-900
              border border-gray-200 dark:border-zinc-800 max-sm:h-full max-sm:rounded-none overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Create New Project
              </h2>

              <button
                onClick={() => closeModal()}
                className="p-1 rounded
                  hover:bg-gray-100 dark:hover:bg-zinc-800
                  text-gray-500 dark:text-zinc-400"
              >
                <XIcon className="size-4" />
              </button>
            </div>

            {/* Organization Info */}
            {activeOrg && (
              <p className="text-sm text-gray-600 dark:text-zinc-400 mb-6 -mt-3">
                In workspace:{" "}
                <span className="font-medium text-indigo-600 dark:text-indigo-400">
                  {activeOrg.name}
                </span>
              </p>
            )}

            {/* Body */}
            <div className="space-y-3">
              {/* Project Name Input */}
              <div>
                <label htmlFor="project-name" className="text-sm">
                  Project Name
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

              {/* Team Members Input */}
              <div className="w-full">
                <label htmlFor="team-members">
                  Team Members{" "}
                  <span className="text-red-600 dark:text-red-500 select-none">
                    *
                  </span>
                </label>

                {/* Selected Tags */}
                {teamMembers.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-2">
                    {teamMembers.map((member) => (
                      <span
                        key={member.userId}
                        className="flex items-center gap-1 px-2 py-1 text-xs rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300"
                      >
                        {member.identifier}
                        <button
                          type="button"
                          onClick={() => removeTeamMember(member.userId)}
                          className="hover:text-red-600"
                        >
                          <XIcon className="size-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                {/* Select Input */}
                <div className="relative w-full">
                  <select
                    id="team-members"
                    defaultValue=""
                    onChange={(e) => addTeamMember(e.target.value)}
                    className="appearance-none w-full px-3 pr-7 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white text-sm focus-visible:outline-none focus-visible:ring focus-visible:ring-indigo-500"
                    // {...form.register("team_members")}
                  >
                    <option value="" disabled>
                      Add team member
                    </option>

                    {memberships?.map((m) => {
                      const userId = m.publicUserData.userId;
                      const isSelected = teamMembers.some(
                        (tm) => tm.userId === userId
                      );

                      return (
                        <option
                          key={userId}
                          value={userId}
                          disabled={isSelected}
                        >
                          {m.publicUserData.identifier}
                        </option>
                      );
                    })}
                  </select>

                  <ChevronDownIcon className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-zinc-400" />
                </div>

                {form.formState.errors.team_members && (
                  <p className="text-xs text-red-600">
                    {form.formState.errors.team_members.message}
                  </p>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => closeModal()}
                className="px-4 py-2 text-sm rounded
                  border border-gray-300 dark:border-zinc-700
                  text-gray-700 dark:text-zinc-300
                  hover:bg-gray-100 dark:hover:bg-zinc-800"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="px-4 py-2 text-sm rounded
                  bg-indigo-600 hover:bg-indigo-700
                  text-white"
              >
                Create Project
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};
