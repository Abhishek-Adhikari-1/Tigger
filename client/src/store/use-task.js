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

  getAllTasks: async (projectId) => {
    try {
      const res = await fetch(`/api/tasks/all?projectId=${projectId}`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch tasks");
      }

      const data = await res.json();
      set({
        allTasks: data.data,
        loading: false,
        error: null,
      });
    } catch (err) {
      set({ error: err.message || "Failed to fetch tasks" });
    }
  },

  syncTaskStatus: async (taskId, newStatus, projectId) => {
    const res = await fetch(`/api/tasks/${taskId}?projectId=${projectId}`, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });

    if (!res.ok) {
      throw new Error("Server update failed");
    }
  },

  updateTaskStatusOptimistic: (taskId, newStatus) => {
    const task = get().allTasks.find((t) => t.id === taskId);

    if (!task) return null;

    set({
      allTasks: get().allTasks.map((t) =>
        t.id === taskId ? { ...t, status: newStatus } : t
      ),
    });

    return task.status;
  },

  rollbackTaskStatus: (taskId, prevStatus) => {
    set({
      allTasks: get().allTasks.map((t) =>
        t.id === taskId ? { ...t, status: prevStatus } : t
      ),
    });
  },
}));
