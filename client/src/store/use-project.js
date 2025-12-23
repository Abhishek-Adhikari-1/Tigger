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
      });
    } catch (err) {
      set({ error: err.message, loading: false });
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
    });
  } catch (err) {
    useProjectsStore.setState({
      error: err.message || "Something went wrong",
      loading: false,
    });
  }
})();
