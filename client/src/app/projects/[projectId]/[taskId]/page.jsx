import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useOrganization, useUser } from "@clerk/react-router";
import {
  ChevronLeftIcon,
  CalendarIcon,
  UserIcon,
  SendIcon,
  TrashIcon,
  EditIcon,
  XIcon,
  CheckIcon,
  ClockIcon,
  MessageCircleIcon,
  AlertCircleIcon,
} from "lucide-react";
import { cn, typeIcons, priorityColors } from "../../../../utils/utils";
import { useTasksStore } from "../../../../store/use-task";
import { useCommentsStore } from "../../../../store/use-comment";
import AvatarImage from "../../../../components/ui/avatar";

const taskStatusColors = {
  Todo: "bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-200",
  "In Progress":
    "bg-amber-200 dark:bg-amber-900 text-amber-800 dark:text-amber-200",
  Done: "bg-emerald-200 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200",
};

export default function TaskDetailPage() {
  const { projectId, taskId } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();

  const {
    memberships: { data: memberships },
  } = useOrganization({
    memberships: {
      infinite: true,
      keepPreviousData: true,
    },
  });

  // Task state
  const [task, setTask] = useState(null);
  const [taskLoading, setTaskLoading] = useState(true);
  const [taskError, setTaskError] = useState(null);

  // Comment input
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Edit state
  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState("");

  // Comments store
  const {
    comments,
    loading: commentsLoading,
    error: commentsError,
    getComments,
    addComment,
    updateComment,
    deleteComment,
    clearComments,
  } = useCommentsStore();

  // Fetch task
  useEffect(() => {
    const fetchTask = async () => {
      setTaskLoading(true);
      try {
        const res = await fetch(`/api/tasks/${taskId}?projectId=${projectId}`, {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });

        if (!res.ok) throw new Error("Failed to fetch task");

        const data = await res.json();
        setTask(data.data);
        setTaskError(null);
      } catch (err) {
        setTaskError(err.message || "Failed to load task");
      } finally {
        setTaskLoading(false);
      }
    };

    if (projectId && taskId) {
      fetchTask();
      getComments(taskId);
    }

    return () => clearComments();
  }, [projectId, taskId, getComments, clearComments]);

  // Get assignee info
  const assignee = memberships?.find(
    (m) => m.publicUserData.userId === task?.assignee
  );

  // Submit new comment
  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || submitting) return;

    setSubmitting(true);
    try {
      await addComment(taskId, newComment);
      setNewComment("");
    } catch (err) {
      console.error("Failed to add comment:", err);
    } finally {
      setSubmitting(false);
    }
  };

  // Start editing
  const startEdit = (comment) => {
    setEditingId(comment.id);
    setEditContent(comment.content);
  };

  // Cancel edit
  const cancelEdit = () => {
    setEditingId(null);
    setEditContent("");
  };

  // Save edit
  const saveEdit = async (commentId) => {
    if (!editContent.trim()) return;

    try {
      await updateComment(commentId, editContent);
      cancelEdit();
    } catch (err) {
      console.error("Failed to update comment:", err);
    }
  };

  // Delete comment
  const handleDelete = async (commentId) => {
    try {
      await deleteComment(commentId);
    } catch (err) {
      console.error("Failed to delete comment:", err);
    }
  };

  // Get user info from memberships
  const getUserInfo = (userId) => {
    const member = memberships?.find((m) => m.publicUserData.userId === userId);
    if (member) {
      return {
        name: `${member.publicUserData.firstName || ""} ${
          member.publicUserData.lastName || ""
        }`.trim(),
        imageUrl: member.publicUserData.imageUrl,
      };
    }
    return { name: "Unknown User", imageUrl: null };
  };

  // Format date
  const formatDate = (dateStr) => {
    if (!dateStr) return "Not set";
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Format time ago
  const formatTimeAgo = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return formatDate(dateStr);
  };

  if (taskLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-zinc-500 dark:text-zinc-400">Loading task...</p>
        </div>
      </div>
    );
  }

  if (taskError) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3 text-red-500">
          <AlertCircleIcon className="w-10 h-10" />
          <p>{taskError}</p>
          <button
            onClick={() => navigate(`/projects/${projectId}`)}
            className="mt-2 px-4 py-2 rounded-lg bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-600 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-zinc-500 dark:text-zinc-400">Task not found</p>
      </div>
    );
  }

  const TypeIcon = typeIcons[task.type]?.icon;

  return (
    <div className="py-4 px-3 md:px-6 md:py-6 xl:px-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate(`/projects/${projectId}`)}
          className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors mb-4 group"
        >
          <ChevronLeftIcon className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Project
        </button>

        <div className="flex flex-wrap items-start gap-3 mb-4">
          <h1 className="text-2xl md:text-3xl font-semibold text-zinc-900 dark:text-white flex-1">
            {task.title}
          </h1>

          <span
            className={cn(
              "px-3 py-1 rounded-full text-sm font-medium shrink-0",
              taskStatusColors[task.status]
            )}
          >
            {task.status}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description Card */}
          <div className="bg-white dark:bg-zinc-800/50 rounded-xl border border-zinc-200 dark:border-zinc-700/50 p-5 backdrop-blur-sm">
            <h2 className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-3">
              Description
            </h2>
            <p className="text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap">
              {task.description || "No description provided."}
            </p>
          </div>

          {/* Discussion Section */}
          <div className="bg-white dark:bg-zinc-800/50 rounded-xl border border-zinc-200 dark:border-zinc-700/50 overflow-hidden backdrop-blur-sm">
            <div className="px-5 py-4 border-b border-zinc-200 dark:border-zinc-700/50 flex items-center gap-2">
              <MessageCircleIcon className="w-5 h-5 text-zinc-500 dark:text-zinc-400" />
              <h2 className="font-medium text-zinc-900 dark:text-white">
                Discussion
              </h2>
              <span className="ml-auto text-sm text-zinc-500 dark:text-zinc-400">
                {comments.length}{" "}
                {comments.length === 1 ? "comment" : "comments"}
              </span>
            </div>

            {/* Comments List */}
            <div className="divide-y divide-zinc-100 dark:divide-zinc-700/50 max-h-[500px] overflow-y-auto">
              {commentsLoading ? (
                <div className="p-8 text-center text-zinc-500 dark:text-zinc-400">
                  Loading comments...
                </div>
              ) : comments.length === 0 ? (
                <div className="p-8 text-center text-zinc-500 dark:text-zinc-400">
                  <MessageCircleIcon className="w-10 h-10 mx-auto mb-3 opacity-50" />
                  <p>No comments yet. Start the discussion!</p>
                </div>
              ) : (
                comments.map((comment) => {
                  const authorInfo = getUserInfo(comment.author);
                  const isOwn = comment.author === user?.id;

                  return (
                    <div
                      key={comment.id}
                      className="p-4 hover:bg-zinc-50 dark:hover:bg-zinc-700/30 transition-colors group"
                    >
                      <div className="flex gap-3">
                        <AvatarImage
                          src={authorInfo.imageUrl}
                          name={authorInfo.name}
                          size={36}
                          className="shrink-0"
                        />

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-sm text-zinc-900 dark:text-white">
                              {authorInfo.name}
                            </span>
                            <span className="text-xs text-zinc-400 dark:text-zinc-500">
                              {formatTimeAgo(comment.createdAt)}
                            </span>
                            {comment.updatedAt !== comment.createdAt && (
                              <span className="text-xs text-zinc-400 dark:text-zinc-500 italic">
                                (edited)
                              </span>
                            )}
                          </div>

                          {editingId === comment.id ? (
                            <div className="space-y-2">
                              <textarea
                                value={editContent}
                                onChange={(e) => setEditContent(e.target.value)}
                                className="w-full px-3 py-2 text-sm rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                                rows={3}
                                autoFocus
                              />
                              <div className="flex gap-2">
                                <button
                                  onClick={() => saveEdit(comment.id)}
                                  className="px-3 py-1.5 text-xs rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors flex items-center gap-1"
                                >
                                  <CheckIcon className="w-3 h-3" />
                                  Save
                                </button>
                                <button
                                  onClick={cancelEdit}
                                  className="px-3 py-1.5 text-xs rounded-lg bg-zinc-200 dark:bg-zinc-600 hover:bg-zinc-300 dark:hover:bg-zinc-500 transition-colors flex items-center gap-1"
                                >
                                  <XIcon className="w-3 h-3" />
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <p className="text-sm text-zinc-600 dark:text-zinc-300 whitespace-pre-wrap">
                              {comment.content}
                            </p>
                          )}
                        </div>

                        {/* Actions */}
                        {isOwn && editingId !== comment.id && (
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => startEdit(comment)}
                              className="p-1.5 rounded hover:bg-zinc-200 dark:hover:bg-zinc-600 transition-colors"
                              title="Edit"
                            >
                              <EditIcon className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
                            </button>
                            <button
                              onClick={() => handleDelete(comment.id)}
                              className="p-1.5 rounded hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                              title="Delete"
                            >
                              <TrashIcon className="w-4 h-4 text-red-500" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Add Comment Form */}
            <form
              onSubmit={handleSubmitComment}
              className="p-4 border-t border-zinc-200 dark:border-zinc-700/50 bg-zinc-50 dark:bg-zinc-800/80"
            >
              <div className="flex gap-3">
                <AvatarImage
                  src={user?.imageUrl}
                  name={user?.fullName}
                  size={36}
                  className="shrink-0"
                />
                <div className="flex-1 relative">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Write a comment..."
                    className="w-full px-4 py-3 pr-12 text-sm rounded-xl border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                    rows={2}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                        handleSubmitComment(e);
                      }
                    }}
                  />
                  <button
                    type="submit"
                    disabled={!newComment.trim() || submitting}
                    className="absolute right-3 bottom-3 p-2 rounded-lg bg-primary text-white hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105 active:scale-95"
                    title="Send (Ctrl+Enter)"
                  >
                    <SendIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Task Details Card */}
          <div className="bg-white dark:bg-zinc-800/50 rounded-xl border border-zinc-200 dark:border-zinc-700/50 p-5 backdrop-blur-sm space-y-4">
            <h3 className="font-medium text-zinc-900 dark:text-white mb-4">
              Details
            </h3>

            {/* Type */}
            <div>
              <label className="text-xs text-zinc-500 dark:text-zinc-400 block mb-1">
                Type
              </label>
              <div className="flex items-center gap-2">
                {TypeIcon && (
                  <TypeIcon
                    className={cn("w-4 h-4", typeIcons[task.type]?.color)}
                  />
                )}
                <span className="text-sm text-zinc-900 dark:text-white">
                  {task.type}
                </span>
              </div>
            </div>

            {/* Priority */}
            <div>
              <label className="text-xs text-zinc-500 dark:text-zinc-400 block mb-1">
                Priority
              </label>
              <span
                className={cn(
                  "inline-block px-2.5 py-0.5 rounded-full text-xs font-medium",
                  priorityColors[task.priority]
                )}
              >
                {task.priority}
              </span>
            </div>

            {/* Assignee */}
            <div>
              <label className="text-xs text-zinc-500 dark:text-zinc-400 block mb-1">
                Assignee
              </label>
              {assignee ? (
                <div className="flex items-center gap-2">
                  <AvatarImage
                    src={assignee.publicUserData.imageUrl}
                    name={`${assignee.publicUserData.firstName} ${assignee.publicUserData.lastName}`}
                    size={24}
                  />
                  <span className="text-sm text-zinc-900 dark:text-white">
                    {assignee.publicUserData.firstName}{" "}
                    {assignee.publicUserData.lastName}
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-zinc-400 dark:text-zinc-500">
                  <UserIcon className="w-4 h-4" />
                  <span className="text-sm">Unassigned</span>
                </div>
              )}
            </div>

            {/* Due Date */}
            <div>
              <label className="text-xs text-zinc-500 dark:text-zinc-400 block mb-1">
                Due Date
              </label>
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-zinc-400" />
                <span className="text-sm text-zinc-900 dark:text-white">
                  {formatDate(task.due_date)}
                </span>
              </div>
            </div>

            {/* Created */}
            <div className="pt-4 border-t border-zinc-200 dark:border-zinc-700/50">
              <label className="text-xs text-zinc-500 dark:text-zinc-400 block mb-1">
                Created
              </label>
              <div className="flex items-center gap-2">
                <ClockIcon className="w-4 h-4 text-zinc-400" />
                <span className="text-sm text-zinc-500 dark:text-zinc-400">
                  {formatDate(task.createdAt)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
