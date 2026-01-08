import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { cn, typeIcons } from "../../utils/utils";
import { useOrganization } from "@clerk/react-router";
import AvatarImage from "./avatar";
import React from "react";
import { Link, useNavigate } from "react-router-dom";

const TASK_COLUMNS = {
  Todo: {
    id: "Todo",
    title: "Todo",
  },
  "In Progress": {
    id: "In Progress",
    title: "In Progress",
  },
  Done: {
    id: "Done",
    title: "Done",
  },
};

export function ProjectTasksKanban({ tasks, onStatusChange }) {
  const {
    memberships: { data: memberships },
  } = useOrganization({
    memberships: {
      infinite: true,
      keepPreviousData: true,
    },
  });

  const navigate = useNavigate();

  const groupedTasks = Object.keys(TASK_COLUMNS).reduce((acc, status) => {
    acc[status] = tasks.filter((t) => t.status === status);
    return acc;
  }, {});

  const handleDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    onStatusChange({
      taskId: draggableId,
      newStatus: destination.droppableId,
    });
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Object.values(TASK_COLUMNS).map((column) => {
          return (
            <Droppable droppableId={column.id} key={column.id}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="
                  rounded-xl p-3
                  bg-zinc-100 dark:bg-zinc-900
                  border border-zinc-200 dark:border-zinc-800
                "
                >
                  <h3 className="font-medium mb-3 text-sm">
                    {column.title} ({groupedTasks[column.id]?.length || 0})
                  </h3>

                  <div className="space-y-3 min-h-[50px]">
                    {groupedTasks[column.id]?.map((task, index) => {
                      const assignee = memberships?.find(
                        (user) => user.publicUserData.userId === task.assignee
                      );

                      return (
                        <Draggable
                          draggableId={task.id}
                          index={index}
                          key={task.id}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              onClick={() =>
                                navigate(
                                  `/projects/${task.projectId}/${task.id}`
                                )
                              }
                              className={cn(
                                `
                            rounded-lg p-3 bg-white dark:bg-zinc-800
                            border border-zinc-200 dark:border-zinc-700
                            shadow-sm cursor-pointer
                            `,
                                snapshot.isDragging && "ring-2 ring-indigo-500"
                              )}
                            >
                              <p className="font-medium text-sm line-clamp-2">
                                {task.title}
                              </p>

                              <p className="text-xs text-zinc-500 mt-1 line-clamp-1">
                                {task.description}
                              </p>

                              <div className="flex justify-between items-center mt-3">
                                <div className="flex gap-2">
                                  <span
                                    className={cn(
                                      "text-xs px-2 rounded bg-zinc-100 dark:bg-zinc-700/50 flex justify-center items-center",
                                      typeIcons[task.type]?.color
                                    )}
                                  >
                                    {typeIcons[task.type]?.icon &&
                                      React.createElement(
                                        typeIcons[task.type].icon,
                                        {
                                          className: "size-3 mr-1 inline",
                                        }
                                      )}
                                    {task.type}
                                  </span>

                                  <span className="text-xs px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-700">
                                    {task.priority}
                                  </span>
                                </div>

                                {/* <span className="text-xs text-zinc-500">
                                  Due{" "}
                                  {new Date(task.due_date).toLocaleDateString()}
                                </span> */}

                                <AvatarImage
                                  name={
                                    assignee
                                      ? `${assignee?.publicUserData.firstName} ${assignee?.publicUserData.lastName}`
                                      : null
                                  }
                                  src={assignee?.publicUserData.imageUrl}
                                  className="cursor-default"
                                  size={27}
                                />
                              </div>
                            </div>
                          )}
                        </Draggable>
                      );
                    })}
                    {provided.placeholder}
                  </div>
                </div>
              )}
            </Droppable>
          );
        })}
      </div>
    </DragDropContext>
  );
}
