import { create } from "zustand";

const postTasks = async (payload) => {
  const res = await fetch(`/api/tasks/`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error("Failed to create task");
  }

  return res.json();
};

export const useTasksStore = create((set, get) => ({
  allTasks: [],
  currentProject: null,
  loading: true,
  error: null,

  createTask: async (taskData) => {
    try {
      const data = await postTasks(taskData);
      set({
        allTasks: [...get().allTasks, data.data],
        error: null,
      });
    } catch (err) {
      set({ error: err.message || "Failed to create task" });
    }
  },
}));
