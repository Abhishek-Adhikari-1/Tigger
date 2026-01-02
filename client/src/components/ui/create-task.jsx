import { useOrganization } from "@clerk/react-router";
import { ChevronDownIcon, PlusIcon, XIcon } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createTaskSchema } from "../../utils/validators/task.validators";
import { useTasksStore } from "../../store/use-task";
import { cn } from "../../utils/utils";

export const CreateTask = ({ text = "Create Task", className, projectId }) => {
  const {
    memberships: { data: memberships },
  } = useOrganization({
    memberships: {
      infinite: true,
      keepPreviousData: true,
    },
  });

  const { createTask } = useTasksStore();

  const form = useForm({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      title: "",
      description: "",
      priority: "Medium",
      status: "Todo",
      type: "Task",
      due_date: "",
      assignee: "",
      projectId: projectId || "",
    },
  });

  const [open, setOpen] = useState(false);

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

  const onSubmit = (data) => {
    const payload = data;
    console.log("FORM DATA:", payload);

    createTask(payload).then(() => {
      closeModal();
    });
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setOpen(true)}
        className={cn(
          "flex items-center px-5 py-2 text-sm rounded bg-linear-to-br from-indigo-500 to-indigo-600 text-white hover:opacity-90 transition",
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
                Create New Task
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

            {/* Body */}
            <div className="space-y-3">
              {/* Task Title Input */}
              <div>
                <label htmlFor="task-title" className="text-sm">
                  Task Title{" "}
                  <span className="text-red-600 dark:text-red-500 select-none">
                    *
                  </span>
                </label>
                <input
                  type="text"
                  id="task-title"
                  placeholder="Enter task title"
                  className="w-full px-3 py-2 text-sm rounded-lg
                  bg-white dark:bg-zinc-900
                  text-gray-900 dark:text-white
                  border border-gray-300 dark:border-zinc-700
                  placeholder-gray-400 dark:placeholder-zinc-500
                  focus:outline-none focus:ring focus:ring-indigo-500"
                  {...form.register("title")}
                />
                {form.formState.errors.title && (
                  <p className="text-xs text-red-600">
                    {form.formState.errors.title.message}
                  </p>
                )}
              </div>

              {/* Task Description */}
              <div>
                <label htmlFor="task-description" className="text-sm">
                  Description
                </label>
                <textarea
                  id="task-description"
                  rows={3}
                  placeholder="Describe the task"
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

              {/* Type & Priority Selectors */}
              <div className="flex justify-center items-center flex-col sm:flex-row gap-4">
                <div className="w-full">
                  <label htmlFor="task-type">
                    Type{" "}
                    <span className="text-red-600 dark:text-red-500 select-none">
                      *
                    </span>
                  </label>

                  <div className="relative w-full">
                    <select
                      id="task-type"
                      className="appearance-none w-full px-3 pr-7 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white text-sm focus-visible:outline-none focus-visible:ring focus-visible:ring-indigo-500"
                      {...form.register("type")}
                    >
                      <option value="Task">Task</option>
                      <option value="Bug">Bug</option>
                      <option value="Feature">Feature</option>
                      <option value="Improvement">Improvement</option>
                      <option value="Other">Other</option>
                    </select>

                    <ChevronDownIcon className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-zinc-400" />
                  </div>
                  {form.formState.errors.type && (
                    <p className="text-xs text-red-600">
                      {form.formState.errors.type.message}
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

              {/* Status & Due Date Input */}
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
                      <option value="Todo">Todo</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Done">Done</option>
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
                  <label htmlFor="due-date" className="text-sm">
                    Due Date
                    <span className="text-red-600 dark:text-red-500 select-none">
                      *
                    </span>
                  </label>
                  <input
                    type="date"
                    id="due-date"
                    placeholder="Enter project name"
                    className="w-full px-3 py-2 text-sm rounded-lg
                      bg-white dark:bg-zinc-900
                      text-gray-900 dark:text-white
                      border border-gray-300 dark:border-zinc-700
                      placeholder-gray-400 dark:placeholder-zinc-500
                      focus:outline-none focus:ring focus:ring-indigo-500"
                    {...form.register("due_date")}
                  />
                  {form.formState.errors.due_date && (
                    <p className="text-xs text-red-600">
                      {form.formState.errors.due_date.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Assignee Input */}
              <div className="w-full">
                <label htmlFor="assignee">
                  Assignee{" "}
                  <span className="text-red-600 dark:text-red-500 select-none">
                    *
                  </span>
                </label>

                <div className="relative w-full">
                  <select
                    id="assignee"
                    className="appearance-none w-full px-3 pr-7 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white text-sm focus-visible:outline-none focus-visible:ring focus-visible:ring-indigo-500"
                    {...form.register("assignee")}
                  >
                    <option value="" disabled>
                      Select an Assignee
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

                {form.formState.errors.assignee && (
                  <p className="text-xs text-red-600">
                    {form.formState.errors.assignee.message}
                  </p>
                )}
              </div>

              {/* Hidden Project ID Input */}
              <div className="w-full hidden">
                <input
                  type="text"
                  id="project-id"
                  value={projectId}
                  {...form.register("projectId")}
                  hidden
                />
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
                Create Task
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};
