import { create } from "zustand";

const fetchProjects = async (query = "") => {
  const res = await fetch(
    `/api/projects/all?query=${encodeURIComponent(query)}`,
    {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch projects");
  }

  return res.json();
};

const fetchProjectById = async (id = "") => {
  const res = await fetch(`/api/projects/${String(id)}`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch project");
  }

  return res.json();
};

const postProject = async (payload) => {
  const res = await fetch(`/api/projects/`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error("Failed to create project");
  }

  return res.json();
};

const putProject = async (id = "", payload) => {
  const res = await fetch(`/api/projects/${id}`, {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error("Failed to update project");
  }

  return res.json();
};

export const useProjectsStore = create((set, get) => ({
  projects: [],
  currentProject: null,

  loading: true,
  error: null,
  initialized: false,

  refresh: async (query) => {
    if (get().loading) return;

    set({ loading: true, error: null });

    try {
      const data = await fetchProjects(query);

      if (!data.success) {
        throw new Error(data.message);
      }

      set({
        projects: data.data,
        loading: false,
        initialized: true,
      });
    } catch (err) {
      set({
        error: err.message || "Something went wrong",
        loading: false,
      });
    }
  },

  getProjectById: async (id) => {
    set({ loading: true, error: null });

    try {
      const data = await fetchProjectById(id);
      if (!data.success) throw new Error(data.message);

      set({
        currentProject: data.data,
        loading: false,
        error: null,
      });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  createProject: async (payload) => {
    try {
      const data = await postProject(payload);
      if (!data.success) throw new Error(data.message);

      set({
        projects: [...get().projects, data.data],
        error: null,
      });
    } catch (err) {
      set({ error: err.message });
    }
  },

  updateProject: async (id, payload) => {
    try {
      const data = await putProject(id, payload);
      if (!data.success) throw new Error(data.message);

      const updatedProject = data.data;

      set((state) => ({
        projects: state.projects.map((p) =>
          p.projectId === id ? updatedProject : p
        ),
        currentProject:
          state.currentProject?.projectId === id
            ? updatedProject
            : state.currentProject,
        error: null,
      }));
    } catch (err) {
      set({ error: err.message || "Failed to update project" });
      throw err;
    }
  },
}));

(async () => {
  const { initialized, loading } = useProjectsStore.getState();
  if (initialized || loading === false) return;

  try {
    const data = await fetchProjects();

    if (!data.success) {
      throw new Error(data.message);
    }

    useProjectsStore.setState({
      projects: data.data,
      loading: false,
      initialized: true,
      error: null,
    });
  } catch (err) {
    useProjectsStore.setState({
      error: err.message || "Something went wrong",
      loading: false,
    });
  }
})();
