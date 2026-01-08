import {
  CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ClockIcon,
  UserIcon,
} from "lucide-react";
import { useState } from "react";
import {
  format,
  isSameDay,
  isBefore,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  addMonths,
  subMonths,
} from "date-fns";
import { useTasksStore } from "../../store/use-task";
import { cn, typeIcons } from "../../utils/utils";
import { useOrganization, useUser } from "@clerk/react-router";

const priorityBorders = {
  LOW: "border-zinc-300 dark:border-zinc-600",
  MEDIUM: "border-amber-300 dark:border-amber-500",
  HIGH: "border-orange-300 dark:border-orange-500",
};

export default function CalanderView() {
  const { allTasks: tasks } = useTasksStore();

  const { user } = useUser();

  const {
    memberships: { data: memberships },
  } = useOrganization({
    memberships: {
      infinite: true,
      keepPreviousData: true,
    },
  });

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const today = new Date();
  const getTasksForDate = (date) =>
    tasks.filter((task) => isSameDay(task.due_date, date));

  const upcomingTasks = tasks
    .filter(
      (task) =>
        task.due_date &&
        !isBefore(task.due_date, today) &&
        task.status !== "DONE"
    )
    .sort((a, b) => new Date(a.due_date) - new Date(b.due_date))
    .slice(0, 5);

  // const overdueTasks = tasks.filter(
  //   (task) =>
  //     task.due_date && isBefore(task.due_date, today) && task.status !== "DONE"
  // );

  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  });

  const handleMonthChange = (direction) => {
    setCurrentMonth((prev) =>
      direction === "next" ? addMonths(prev, 1) : subMonths(prev, 1)
    );
  };

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* Calendar View */}
      <div className="lg:col-span-2 ">
        <div className="not-dark:bg-white dark:bg-linear-to-br dark:from-zinc-800/70 dark:to-zinc-900/50 border border-zinc-300 dark:border-zinc-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-zinc-900 dark:text-white text-md flex gap-2 items-center max-sm:hidden">
              <CalendarIcon className="size-5" /> Task Calendar
            </h2>
            <div className="flex gap-2 items-center">
              <button onClick={() => handleMonthChange("prev")}>
                <ChevronLeftIcon className="size-5 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white" />
              </button>
              <span className="text-zinc-900 dark:text-white">
                {format(currentMonth, "MMMM yyyy")}
              </span>
              <button onClick={() => handleMonthChange("next")}>
                <ChevronRightIcon className="size-5 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 text-xs text-zinc-600 dark:text-zinc-400 mb-2 text-center">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day}>{day}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {daysInMonth.map((day) => {
              const dayTasks = getTasksForDate(day);
              const isSelected = isSameDay(day, selectedDate);
              const hasOverdue = dayTasks.some(
                (t) => t.status !== "DONE" && isBefore(t.due_date, today)
              );

              return (
                <button
                  key={day}
                  onClick={() => setSelectedDate(day)}
                  className={`sm:h-14 rounded-md flex flex-col items-center justify-center text-sm
                                    ${
                                      isSelected
                                        ? "bg-indigo-200 text-indigo-900 dark:bg-indigo-800 dark:text-white"
                                        : "bg-zinc-50 text-zinc-900 dark:bg-zinc-800/40 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700"
                                    }
                                    ${
                                      hasOverdue
                                        ? "border border-red-300 dark:border-red-500"
                                        : ""
                                    }`}
                >
                  <span>{format(day, "d")}</span>
                  {dayTasks.length > 0 && (
                    <span className="text-[10px] text-indigo-700 dark:text-indigo-400">
                      {dayTasks.length} tasks
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tasks for Selected Day */}
        {getTasksForDate(selectedDate).length > 0 && (
          <div className=" not-dark:bg-white mt-6 dark:bg-linear-to-br dark:from-zinc-800/70 dark:to-zinc-900/50 border border-zinc-300 dark:border-zinc-800 rounded-lg p-4">
            <h3 className="text-zinc-900 dark:text-white text-lg mb-3">
              Tasks for {format(selectedDate, "MMM d, yyyy")}
            </h3>
            <div className="space-y-3">
              {getTasksForDate(selectedDate).map((task) => {
                const assignee = memberships?.find(
                  (user) => user.publicUserData.userId === task.assignee
                );
                return (
                  <div
                    key={task.id}
                    className={`bg-zinc-50 dark:bg-zinc-800/40 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition p-4 rounded border-l-4 ${
                      priorityBorders[task.priority]
                    }`}
                  >
                    <div className="flex justify-between mb-2">
                      <h4 className="text-zinc-900 dark:text-white font-medium">
                        {task.title}
                      </h4>
                      <span
                        className={cn(
                          "px-2 py-0.5 rounded text-xs",
                          typeIcons[task.type]?.color
                        )}
                      >
                        {task.type}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs text-zinc-600 dark:text-zinc-400">
                      <span className="capitalize">
                        {task.priority.toLowerCase()} priority
                      </span>
                      {task.assignee && (
                        <span className="flex items-center gap-1">
                          <UserIcon className="w-3 h-3" />
                          {`${assignee?.publicUserData?.firstName} ${assignee?.publicUserData?.lastName}`}
                          {task.assignee === user.id ? " (You)" : ""}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Right Sidebar */}
      <div className="space-y-6">
        {/* Upcoming Tasks */}
        <div className="bg-white dark:bg-zinc-950 dark:bg-linear-to-br dark:from-zinc-800/70 dark:to-zinc-900/50 border border-zinc-300 dark:border-zinc-800 rounded-lg p-4">
          <h3 className="text-zinc-900 dark:text-white text-sm flex items-center gap-2 mb-3">
            <ClockIcon className="w-4 h-4" /> Upcoming Tasks
          </h3>
          {upcomingTasks.length === 0 ? (
            <p className="text-zinc-500 dark:text-zinc-400 text-sm text-center">
              No upcoming tasks
            </p>
          ) : (
            <div className="space-y-2">
              {upcomingTasks.map((task) => (
                <div
                  key={task.id}
                  className="bg-zinc-50 dark:bg-zinc-800/40 hover:bg-zinc-100 dark:hover:bg-zinc-800 p-3 rounded-lg transition"
                >
                  <div className="flex justify-between items-start text-sm">
                    <span className="text-zinc-900 dark:text-white">
                      {task.title}
                    </span>
                    <span
                      className={cn(
                        "py-0.5 text-xs px-2 rounded bg-zinc-100 dark:bg-zinc-700/50 flex justify-center items-center",
                        typeIcons[task.type]?.color
                      )}
                    >
                      {task.type}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400">
                    {format(task.due_date, "MMM d")}
                    {task.assignee === user.id ? " (You)" : ""}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
