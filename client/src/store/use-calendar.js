import { create } from "zustand";

const fetchCalendarEvents = async (startDate, endDate) => {
  const params = new URLSearchParams();
  if (startDate) params.append("startDate", startDate.toISOString());
  if (endDate) params.append("endDate", endDate.toISOString());

  const res = await fetch(`/api/calendar/events?${params.toString()}`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch calendar events");
  }

  return res.json();
};

export const useCalendarStore = create((set, get) => ({
  events: { projects: [], tasks: [] },
  currentDate: new Date(),
  view: "month",
  loading: false,
  error: null,

  fetchEvents: async (startDate, endDate) => {
    set({ loading: true, error: null });

    try {
      const data = await fetchCalendarEvents(startDate, endDate);

      if (!data.success) {
        throw new Error(data.message);
      }

      set({
        events: data.data,
        loading: false,
      });
    } catch (err) {
      set({
        error: err.message || "Something went wrong",
        loading: false,
      });
    }
  },

  setCurrentDate: (date) => {
    set({ currentDate: date });
  },

  setView: (view) => {
    set({ view });
  },

  nextMonth: () => {
    const current = get().currentDate;
    set({
      currentDate: new Date(current.getFullYear(), current.getMonth() + 1, 1),
    });
  },

  prevMonth: () => {
    const current = get().currentDate;
    set({
      currentDate: new Date(current.getFullYear(), current.getMonth() - 1, 1),
    });
  },

  goToToday: () => {
    set({ currentDate: new Date() });
  },
}));
