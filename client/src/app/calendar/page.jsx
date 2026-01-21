import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  CalendarIcon,
  FolderIcon,
  CheckCircle2Icon,
  XIcon,
} from "lucide-react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isWithinInterval,
  parseISO,
} from "date-fns";
import { cn } from "../../utils/utils";
import { useCalendarStore } from "../../store/use-calendar";

const PRIORITY_COLORS = {
  High: "bg-red-500",
  Medium: "bg-amber-500",
  Low: "bg-emerald-500",
};

const STATUS_COLORS = {
  Todo: "bg-zinc-400",
  "In Progress": "bg-amber-400",
  Done: "bg-emerald-400",
};

const PROJECT_STATUS_COLORS = {
  Planning: "from-zinc-400 to-zinc-500",
  Active: "from-indigo-500 to-purple-500",
  Completed: "from-emerald-500 to-teal-500",
  Hold: "from-amber-400 to-orange-500",
  Inactive: "from-zinc-400 to-zinc-500",
  Cancelled: "from-red-400 to-rose-500",
};

export default function CalendarPage() {
  const {
    events,
    currentDate,
    loading,
    fetchEvents,
    nextMonth,
    prevMonth,
    goToToday,
  } = useCalendarStore();

  const [selectedEvent, setSelectedEvent] = useState(null);

  // Calculate calendar grid days
  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });

    return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  }, [currentDate]);

  // Fetch events when month changes
  useEffect(() => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });

    fetchEvents(calendarStart, calendarEnd);
  }, [currentDate, fetchEvents]);

  // Get events for a specific day
  const getEventsForDay = (day) => {
    const tasks =
      events.tasks?.filter((task) => {
        const taskDate = parseISO(task.date);
        return isSameDay(taskDate, day);
      }) || [];

    const projects =
      events.projects?.filter((project) => {
        const start = parseISO(project.startDate);
        const end = parseISO(project.endDate);
        return isWithinInterval(day, { start, end });
      }) || [];

    return { tasks, projects };
  };

  const today = new Date();
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500">
            <CalendarIcon className="size-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
              Calendar
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400">
              View your project timelines and task deadlines
            </p>
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={goToToday}
            className="px-3 py-1.5 text-sm font-medium rounded-lg border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 transition-colors"
          >
            Today
          </button>
          <div className="flex items-center gap-1">
            <button
              onClick={prevMonth}
              className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 transition-colors"
            >
              <ChevronLeftIcon className="size-5" />
            </button>
            <span className="text-lg font-semibold text-zinc-900 dark:text-white min-w-[180px] text-center">
              {format(currentDate, "MMMM yyyy")}
            </span>
            <button
              onClick={nextMonth}
              className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 transition-colors"
            >
              <ChevronRightIcon className="size-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mb-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-2 rounded bg-gradient-to-r from-indigo-500 to-purple-500" />
          <span className="text-zinc-600 dark:text-zinc-400">Projects</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-red-500" />
          <span className="text-zinc-600 dark:text-zinc-400">
            High Priority
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-amber-500" />
          <span className="text-zinc-600 dark:text-zinc-400">
            Medium Priority
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="text-zinc-600 dark:text-zinc-400">Low Priority</span>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
        {/* Week Days Header */}
        <div className="grid grid-cols-7 border-b border-zinc-200 dark:border-zinc-800">
          {weekDays.map((day) => (
            <div
              key={day}
              className="p-3 text-center text-sm font-medium text-zinc-500 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-800/50"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        {loading ? (
          <div className="flex items-center justify-center h-96">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500" />
          </div>
        ) : (
          <div className="grid grid-cols-7">
            {calendarDays.map((day, index) => {
              const { tasks, projects } = getEventsForDay(day);
              const isCurrentMonth = isSameMonth(day, currentDate);
              const isToday = isSameDay(day, today);

              return (
                <div
                  key={index}
                  className={cn(
                    "min-h-[120px] p-2 border-b border-r border-zinc-100 dark:border-zinc-800 transition-colors",
                    !isCurrentMonth && "bg-zinc-50 dark:bg-zinc-900/50",
                    isToday && "bg-indigo-50 dark:bg-indigo-950/30",
                  )}
                >
                  {/* Day Number */}
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className={cn(
                        "text-sm font-medium",
                        isToday
                          ? "w-7 h-7 flex items-center justify-center rounded-full bg-indigo-500 text-white"
                          : isCurrentMonth
                            ? "text-zinc-900 dark:text-white"
                            : "text-zinc-400 dark:text-zinc-600",
                      )}
                    >
                      {format(day, "d")}
                    </span>
                  </div>

                  {/* Events */}
                  <div className="space-y-1">
                    {/* Project Bars */}
                    {projects.slice(0, 2).map((project) => (
                      <button
                        key={project.id}
                        onClick={() =>
                          setSelectedEvent({ ...project, eventType: "project" })
                        }
                        className={cn(
                          "w-full text-left text-xs px-1.5 py-0.5 rounded truncate text-white font-medium bg-gradient-to-r transition-transform hover:scale-[1.02]",
                          PROJECT_STATUS_COLORS[project.status] ||
                            "from-indigo-500 to-purple-500",
                        )}
                      >
                        {project.title}
                      </button>
                    ))}

                    {/* Task Dots */}
                    <div className="flex flex-wrap gap-1">
                      {tasks.slice(0, 4).map((task) => (
                        <button
                          key={task.id}
                          onClick={() =>
                            setSelectedEvent({ ...task, eventType: "task" })
                          }
                          className={cn(
                            "w-2 h-2 rounded-full transition-transform hover:scale-150",
                            PRIORITY_COLORS[task.priority] || "bg-zinc-400",
                          )}
                          title={task.title}
                        />
                      ))}
                      {tasks.length > 4 && (
                        <span className="text-xs text-zinc-400 dark:text-zinc-500">
                          +{tasks.length - 4}
                        </span>
                      )}
                    </div>

                    {/* More indicator */}
                    {projects.length > 2 && (
                      <span className="text-xs text-zinc-400 dark:text-zinc-500">
                        +{projects.length - 2} more
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Event Detail Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 dark:bg-black/70">
          <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-2xl max-w-md w-full border border-zinc-200 dark:border-zinc-800 overflow-hidden">
            {/* Modal Header */}
            <div
              className={cn(
                "p-4 bg-gradient-to-r text-white",
                selectedEvent.eventType === "project"
                  ? PROJECT_STATUS_COLORS[selectedEvent.status] ||
                      "from-indigo-500 to-purple-500"
                  : "from-pink-500 to-rose-500",
              )}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  {selectedEvent.eventType === "project" ? (
                    <FolderIcon className="size-5" />
                  ) : (
                    <CheckCircle2Icon className="size-5" />
                  )}
                  <span className="text-sm font-medium uppercase tracking-wider opacity-90">
                    {selectedEvent.eventType === "project"
                      ? "Project"
                      : selectedEvent.taskType || "Task"}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="p-1 rounded-full hover:bg-white/20 transition-colors"
                >
                  <XIcon className="size-5" />
                </button>
              </div>
              <h3 className="text-xl font-bold mt-2">{selectedEvent.title}</h3>
            </div>

            {/* Modal Content */}
            <div className="p-4 space-y-4">
              {selectedEvent.description && (
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  {selectedEvent.description}
                </p>
              )}

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-zinc-500 dark:text-zinc-400 block mb-1">
                    Status
                  </span>
                  <span
                    className={cn(
                      "inline-block px-2 py-0.5 rounded-full text-xs font-medium",
                      selectedEvent.status === "Done" ||
                        selectedEvent.status === "Completed"
                        ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
                        : selectedEvent.status === "In Progress" ||
                            selectedEvent.status === "Active"
                          ? "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"
                          : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400",
                    )}
                  >
                    {selectedEvent.status}
                  </span>
                </div>

                <div>
                  <span className="text-zinc-500 dark:text-zinc-400 block mb-1">
                    Priority
                  </span>
                  <span
                    className={cn(
                      "inline-block px-2 py-0.5 rounded-full text-xs font-medium",
                      selectedEvent.priority === "High"
                        ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                        : selectedEvent.priority === "Medium"
                          ? "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"
                          : "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400",
                    )}
                  >
                    {selectedEvent.priority}
                  </span>
                </div>

                {selectedEvent.eventType === "project" && (
                  <>
                    <div>
                      <span className="text-zinc-500 dark:text-zinc-400 block mb-1">
                        Start Date
                      </span>
                      <span className="text-zinc-900 dark:text-white">
                        {format(
                          parseISO(selectedEvent.startDate),
                          "MMM d, yyyy",
                        )}
                      </span>
                    </div>
                    <div>
                      <span className="text-zinc-500 dark:text-zinc-400 block mb-1">
                        End Date
                      </span>
                      <span className="text-zinc-900 dark:text-white">
                        {format(parseISO(selectedEvent.endDate), "MMM d, yyyy")}
                      </span>
                    </div>
                  </>
                )}

                {selectedEvent.eventType === "task" && (
                  <>
                    <div>
                      <span className="text-zinc-500 dark:text-zinc-400 block mb-1">
                        Due Date
                      </span>
                      <span className="text-zinc-900 dark:text-white">
                        {format(parseISO(selectedEvent.date), "MMM d, yyyy")}
                      </span>
                    </div>
                    {selectedEvent.projectName && (
                      <div>
                        <span className="text-zinc-500 dark:text-zinc-400 block mb-1">
                          Project
                        </span>
                        <span className="text-zinc-900 dark:text-white">
                          {selectedEvent.projectName}
                        </span>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Actions */}
              <div className="pt-2 flex gap-2">
                <Link
                  to={selectedEvent.link}
                  onClick={() => setSelectedEvent(null)}
                  className="flex-1 px-4 py-2 text-center text-sm font-medium rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white transition-all"
                >
                  View Details
                </Link>
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="px-4 py-2 text-sm font-medium rounded-lg border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
