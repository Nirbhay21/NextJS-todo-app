"use client";

import { useState } from "react";
import TodoInput from "./TodoInput";
import { AnimatePresence, motion } from "motion/react";
import { Sparkles, ClipboardList, LogIn, UserPlus } from "lucide-react";
import TodoItem from "./TodoItem";
import { useGetTodosQuery } from "@/features/todos/todoApi";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";

export default function TodoApp() {
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");

  const { data: session, isPending: isUserLoading } = authClient.useSession();

  const {
    isSuccess,
    isLoading: isTodosLoading,
    isError,
    data: todos,
    refetch,
  } = useGetTodosQuery(undefined, {
    skip: !session?.user,
  });

  // Loading State
  if (isUserLoading || (session?.user && isTodosLoading)) {
    return (
      <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 md:px-8 pt-20 md:pt-24 pb-24">
        {/* Main Card Skeleton */}
        <div className="bg-white dark:bg-black rounded-[2.5rem] shadow-xl border border-gray-100 dark:border-gray-800 p-5 sm:p-8 overflow-hidden relative">
          {/* Header Skeleton */}
          <div className="flex flex-col md:flex-row justify-between gap-4 sm:gap-6 mb-6 sm:mb-10 animate-pulse">
            <div className="flex items-center gap-5">
              {/* Avatar */}
              <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-2xl bg-gray-200 dark:bg-gray-800 shrink-0" />
              <div className="space-y-2.5">
                {/* Greeting */}
                <div className="h-7 sm:h-9 w-40 sm:w-64 bg-gray-200 dark:bg-gray-800 rounded-xl" />
                {/* Task count text */}
                <div className="h-4 sm:h-5 w-32 sm:w-40 bg-gray-100 dark:bg-gray-800/60 rounded-lg" />
              </div>
            </div>
          </div>

          {/* Input Skeleton */}
          <div className="w-full h-12 sm:h-14 md:h-16 rounded-2xl bg-gray-100 dark:bg-gray-800/50 mb-10 animate-pulse" />

          {/* Filters & Stats Skeleton */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-6 border-b border-gray-100 dark:border-gray-800 animate-pulse">
            <div className="w-full sm:w-auto grid grid-cols-3 sm:flex gap-1 p-1 bg-gray-100/50 dark:bg-gray-800/50 rounded-xl">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-8 sm:h-9 w-full sm:w-20 bg-gray-200 dark:bg-gray-700/50 rounded-lg"
                />
              ))}
            </div>
            <div className="hidden sm:flex gap-4">
              <div className="h-4 w-20 bg-gray-200 dark:bg-gray-800 rounded-md" />
              <div className="h-4 w-20 bg-gray-200 dark:bg-gray-800 rounded-md" />
            </div>
          </div>

          {/* Todo Items Skeleton */}
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="flex items-center gap-3 sm:gap-5 p-3 sm:p-4 bg-white/50 dark:bg-gray-800/20 rounded-2xl border border-gray-50 dark:border-gray-800/50 animate-pulse"
              >
                {/* Checkbox Placeholder */}
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gray-200 dark:bg-gray-800 shrink-0 border-2 border-gray-100 dark:border-gray-700" />

                {/* Text Placeholder */}
                <div className="flex-1 space-y-2 py-1">
                  <div className="h-5 sm:h-6 w-3/4 bg-gray-200 dark:bg-gray-800 rounded-lg" />
                </div>

                {/* Action Buttons Placeholder */}
                <div className="flex gap-2 opacity-50">
                  <div className="w-8 h-8 rounded-xl bg-gray-100 dark:bg-gray-800" />
                  <div className="w-8 h-8 rounded-xl bg-gray-100 dark:bg-gray-800" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Not Logged In State (Prioritize this to handle logout immediately)
  if (!session?.user) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl mx-auto px-4 pt-32 pb-24 text-center"
      >
        <div className="bg-white/80 dark:bg-black/80 backdrop-blur-xl rounded-[3rem] p-6 sm:p-12 shadow-2xl border border-gray-100 dark:border-gray-800 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-linear-to-r from-indigo-500 via-purple-500 to-indigo-500" />

          <div className="bg-indigo-50 dark:bg-indigo-500/10 size-16 sm:size-20 rounded-3xl flex items-center justify-center mx-auto mb-6 sm:mb-8 shadow-inner">
            <Sparkles
              size={32}
              className="text-indigo-600 dark:text-indigo-400 sm:w-10 sm:h-10"
            />
          </div>

          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-gray-900 dark:text-white mb-4">
            Your workspace awaits<span className="text-indigo-600">.</span>
          </h2>
          <p className="text-lg text-gray-500 dark:text-gray-400 mb-10 max-w-md mx-auto leading-relaxed">
            Please log in to manage your tasks, track your productivity, and
            sync your workspace across all your devices.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/login"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-2xl shadow-xl shadow-indigo-500/25 transition-all hover:-translate-y-1 active:scale-95"
            >
              <LogIn size={20} />
              Login Now
            </Link>
            <Link
              href="/signup"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-white dark:bg-gray-900 text-gray-900 dark:text-white font-black rounded-2xl border border-gray-200 dark:border-gray-800 hover:border-indigo-500/50 transition-all hover:-translate-y-1 active:scale-95"
            >
              <UserPlus size={20} />
              Create Account
            </Link>
          </div>
        </div>
      </motion.div>
    );
  }

  // Error State
  if (isError) {
    return (
      <div className="w-full max-w-3xl mx-auto px-4 pt-20 pb-24 text-center">
        <div className="bg-white dark:bg-black rounded-[2.5rem] p-12 shadow-xl border border-red-100 dark:border-red-900/20">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Something went wrong
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8">
            We couldn&apos;t load your tasks. Please try again.
          </p>
          <button
            onClick={() => refetch()}
            className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-500 transition-all"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!isSuccess || !todos) {
    return null;
  }

  const activeCount = todos.filter((t) => !t.completed).length;
  const completedCount = todos.length - activeCount;

  const filteredTodos = todos.filter((todo) => {
    if (filter === "active") return !todo.completed;
    if (filter === "completed") return todo.completed;
    return true;
  });

  const initial = session.user.name.charAt(0).toUpperCase();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-3xl mx-auto px-4 sm:px-6 md:px-8 pt-20 md:pt-24 pb-24"
    >
      {/* Action Area */}
      <div className="bg-white dark:bg-black rounded-[2.5rem] shadow-xl border border-gray-100 dark:border-gray-800 p-5 sm:p-8 overflow-hidden relative">
        <div className="flex flex-col md:flex-row justify-between gap-4 sm:gap-6 mb-6 sm:mb-10">
          <div className="flex items-center gap-5">
            <div className="flex h-12 w-12 sm:h-16 sm:w-16 rounded-2xl bg-linear-to-br from-indigo-500 to-purple-600 items-center justify-center text-white text-xl sm:text-3xl font-black shadow-lg shadow-indigo-500/20 shrink-0">
              {initial}
            </div>
            <div className="space-y-0 sm:space-y-0.5">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-gray-900 dark:text-white">
                Hello, {session.user.name.split(" ")[0]}
                <span className="text-indigo-500">.</span>
              </h2>

              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="relative h-6 min-w-50">
                  <AnimatePresence mode="wait">
                    {activeCount === 0 && todos.length > 0 ? (
                      <motion.div
                        key="all-caught-up"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        className="flex items-center mt-2 gap-2 text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-500/10 px-3 py-1 rounded-lg w-fit border border-emerald-100 dark:border-emerald-500/20"
                      >
                        <Sparkles
                          size={14}
                          className="text-yellow-500 fill-yellow-500"
                        />
                        <span className="text-xs uppercase tracking-wider">
                          All caught up
                        </span>
                      </motion.div>
                    ) : (
                      <motion.p
                        key="task-count"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        className="text-sm text-gray-500 dark:text-gray-400 font-medium flex items-center gap-1.5 h-full"
                      >
                        You have{" "}
                        <motion.span
                          key={activeCount}
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="text-indigo-600 dark:text-indigo-400 font-black"
                        >
                          {activeCount}
                        </motion.span>{" "}
                        tasks remaining
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        </div>

        <TodoInput />

        {/* Filters & stats */}
        {todos.length > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-4 mt-10 mb-8 pb-6 border-b border-gray-100 dark:border-gray-800">
            <div className="w-full sm:w-auto bg-gray-100/50 dark:bg-gray-800/50 rounded-xl p-1 gap-1 grid grid-cols-3 sm:flex">
              {(["all", "active", "completed"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={cn(
                    "relative px-3 sm:px-4 py-1.5 sm:py-2 cursor-pointer rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 outline-none focus-visible:ring-2",
                    filter === f
                      ? "text-indigo-600 dark:text-indigo-400 shadow-sm bg-white dark:bg-gray-800"
                      : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-700/50"
                  )}
                >
                  {filter === f && (
                    <motion.div
                      layoutId="activeFilter"
                      className="absolute inset-0 bg-white dark:bg-gray-800 rounded-lg shadow-sm"
                      initial={false}
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 30,
                      }}
                      style={{ zIndex: -1 }}
                    />
                  )}
                  <span className="capitalize relative z-10">{f}</span>
                </button>
              ))}
            </div>

            <div className="flex items-center gap-4 text-sm text-gray-400 dark:text-gray-500 font-medium">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                <span>{activeCount} active</span>
              </div>
              <div className="hidden sm:block w-px h-3 bg-gray-200 dark:bg-gray-700"></div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>{completedCount} completed</span>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 space-y-1">
          <AnimatePresence initial={false} mode="popLayout">
            {filteredTodos.length === 0 ? (
              <motion.div
                key="empty-state"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col items-center justify-center py-16 text-center"
              >
                <div className="bg-gray-100 dark:bg-gray-800/50 p-6 rounded-full mb-6">
                  <ClipboardList
                    size={48}
                    className="text-indigo-400 dark:text-indigo-500/70"
                    strokeWidth={1.5}
                  />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {filter === "completed"
                    ? "No completed tasks yet"
                    : filter === "active"
                    ? "No active tasks"
                    : "No tasks found"}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 max-w-xs mx-auto">
                  {filter === "completed"
                    ? "Finish some tasks to see them here!"
                    : filter === "active"
                    ? "Great job! You've completed all your active tasks."
                    : "It looks like your list is empty. Add a new task above to get started."}
                </p>
              </motion.div>
            ) : (
              <div className="flex flex-col gap-3">
                {filteredTodos.map((todo) => (
                  <TodoItem key={todo._id} todo={todo} />
                ))}
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
