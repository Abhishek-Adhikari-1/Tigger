import { create } from "zustand";

const fetchProjects = async () => {
  const res = await fetch("/api/projects/all", {
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch projects");
  }

  return res.json();
};

export const useProjectsStore = create((set, get) => ({
  projects: [],
  loading: true,
  error: null,
  initialized: false,

  refresh: async () => {
    if (get().loading) return;

    set({ loading: true, error: null });

    try {
      const data = await fetchProjects();

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
