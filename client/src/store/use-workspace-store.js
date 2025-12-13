import { create } from "zustand";
import { dummyWorkspaces } from "../assets/assets";

const savedWorkspaceId = localStorage.getItem("currentWorkspaceId");

export const useWorkspaceStore = create((set, get) => ({
  workspaces: dummyWorkspaces || [],
  currentWorkspace:
    dummyWorkspaces.find((w) => w.id == savedWorkspaceId) || dummyWorkspaces[1],
  loading: false,

  // ---- BASIC SETTERS ----
  setWorkspaces: (ws) => set({ workspaces: ws }),

  setCurrentWorkspace: (workspaceId) => {
    localStorage.setItem("currentWorkspaceId", workspaceId);
    const workspace = get().workspaces.find((w) => w.id === workspaceId);

    set({ currentWorkspace: workspace });
  },

  // ---- CRUD FOR WORKSPACES ----
  addWorkspace: (newWs) =>
    set((state) => {
      const updated = [...state.workspaces, newWs];
      return {
        workspaces: updated,
        currentWorkspace: newWs,
      };
    }),

  updateWorkspace: (updatedWs) =>
    set((state) => {
      const updated = state.workspaces.map((w) =>
        w.id === updatedWs.id ? updatedWs : w
      );

      const sameCurrent =
        state.currentWorkspace?.id === updatedWs.id
          ? updatedWs
          : state.currentWorkspace;

      return {
        workspaces: updated,
        currentWorkspace: sameCurrent,
      };
    }),

  deleteWorkspace: (id) =>
    set((state) => ({
      workspaces: state.workspaces.filter((w) => w.id !== id),
    })),

  // ---- PROJECTS ----
  addProject: (project) =>
    set((state) => {
      const updatedCurrent = {
        ...state.currentWorkspace,
        projects: [...state.currentWorkspace.projects, project],
      };

      const updatedWorkspaces = state.workspaces.map((w) =>
        w.id === state.currentWorkspace.id
          ? { ...w, projects: [...w.projects, project] }
          : w
      );

      return {
        currentWorkspace: updatedCurrent,
        workspaces: updatedWorkspaces,
      };
    }),

  // ---- TASKS ----
  addTask: (task) =>
    set((state) => {
      const wsId = state.currentWorkspace.id;

      const updatedCurrent = {
        ...state.currentWorkspace,
        projects: state.currentWorkspace.projects.map((p) =>
          p.id === task.projectId ? { ...p, tasks: [...p.tasks, task] } : p
        ),
      };

      const updatedWorkspaces = state.workspaces.map((w) =>
        w.id === wsId
          ? {
              ...w,
              projects: w.projects.map((p) =>
                p.id === task.projectId
                  ? { ...p, tasks: [...p.tasks, task] }
                  : p
              ),
            }
          : w
      );

      return {
        currentWorkspace: updatedCurrent,
        workspaces: updatedWorkspaces,
      };
    }),

  updateTask: (task) =>
    set((state) => {
      const wsId = state.currentWorkspace.id;

      const updatedCurrent = {
        ...state.currentWorkspace,
        projects: state.currentWorkspace.projects.map((p) =>
          p.id === task.projectId
            ? {
                ...p,
                tasks: p.tasks.map((t) => (t.id === task.id ? task : t)),
              }
            : p
        ),
      };

      const updatedWorkspaces = state.workspaces.map((w) =>
        w.id === wsId
          ? {
              ...w,
              projects: w.projects.map((p) =>
                p.id === task.projectId
                  ? {
                      ...p,
                      tasks: p.tasks.map((t) => (t.id === task.id ? task : t)),
                    }
                  : p
              ),
            }
          : w
      );

      return {
        currentWorkspace: updatedCurrent,
        workspaces: updatedWorkspaces,
      };
    }),

  deleteTask: (ids, projectId) =>
    set((state) => {
      const wsId = state.currentWorkspace.id;

      const updatedCurrent = {
        ...state.currentWorkspace,
        projects: state.currentWorkspace.projects.map((p) =>
          p.id === projectId
            ? {
                ...p,
                tasks: p.tasks.filter((t) => !ids.includes(t.id)),
              }
            : p
        ),
      };

      const updatedWorkspaces = state.workspaces.map((w) =>
        w.id === wsId
          ? {
              ...w,
              projects: w.projects.map((p) =>
                p.id === projectId
                  ? {
                      ...p,
                      tasks: p.tasks.filter((t) => !ids.includes(t.id)),
                    }
                  : p
              ),
            }
          : w
      );

      return {
        currentWorkspace: updatedCurrent,
        workspaces: updatedWorkspaces,
      };
    }),
}));
