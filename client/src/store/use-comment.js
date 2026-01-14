import { create } from "zustand";

const API_BASE = "/api/comments";

export const useCommentsStore = create((set, get) => ({
  comments: [],
  loading: false,
  error: null,

  /**
   * Fetch all comments for a specific task
   */
  getComments: async (taskId) => {
    if (!taskId) return;

    set({ loading: true, error: null });

    try {
      const res = await fetch(`${API_BASE}/${taskId}`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch comments");
      }

      const data = await res.json();
      set({
        comments: data.data || [],
        loading: false,
        error: null,
      });
    } catch (err) {
      set({
        error: err.message || "Failed to fetch comments",
        loading: false,
      });
    }
  },

  /**
   * Add a new comment to a task
   */
  addComment: async (taskId, content) => {
    if (!taskId || !content?.trim()) return;

    try {
      const res = await fetch(API_BASE, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ taskId, content }),
      });

      if (!res.ok) {
        throw new Error("Failed to add comment");
      }

      const data = await res.json();
      set({
        comments: [...get().comments, data.data],
        error: null,
      });

      return data.data;
    } catch (err) {
      set({ error: err.message || "Failed to add comment" });
      throw err;
    }
  },

  /**
   * Update an existing comment
   */
  updateComment: async (commentId, content) => {
    if (!commentId || !content?.trim()) return;

    try {
      const res = await fetch(`${API_BASE}/${commentId}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
      });

      if (!res.ok) {
        throw new Error("Failed to update comment");
      }

      const data = await res.json();
      set({
        comments: get().comments.map((c) =>
          c.id === commentId ? data.data : c
        ),
        error: null,
      });

      return data.data;
    } catch (err) {
      set({ error: err.message || "Failed to update comment" });
      throw err;
    }
  },

  /**
   * Delete a comment
   */
  deleteComment: async (commentId) => {
    if (!commentId) return;

    try {
      const res = await fetch(`${API_BASE}/${commentId}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error("Failed to delete comment");
      }

      set({
        comments: get().comments.filter((c) => c.id !== commentId),
        error: null,
      });
    } catch (err) {
      set({ error: err.message || "Failed to delete comment" });
      throw err;
    }
  },

  /**
   * Clear comments when leaving the page
   */
  clearComments: () => {
    set({ comments: [], loading: false, error: null });
  },
}));
