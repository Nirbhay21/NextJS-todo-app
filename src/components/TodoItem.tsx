"use client";

import { useState, useRef, useEffect } from "react";
import { Check, Trash2, Edit2, X } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import {
  useDeleteTodoMutation,
  useUpdateTodoMutation,
} from "@/features/todos/todoApi";
import { TodoItem as TodoItemType } from "@/types/todo";

interface TodoItemProps {
  todo: TodoItemType;
}

export default function TodoItem({ todo }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  const inputRef = useRef<HTMLInputElement>(null);

  const [updateTodo] = useUpdateTodoMutation();
  const [deleteTodo] = useDeleteTodoMutation();

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleSave = () => {
    if (editText.trim()) {
      updateTodo({
        id: todo._id.toString(),
        text: editText.trim(),
        completed: undefined,
      });
      setIsEditing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSave();
    if (e.key === "Escape") {
      setIsEditing(false);
      setEditText(todo.text); // Reset
    }
  };

  return (
    <motion.li
      layout
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
      whileHover={{ scale: 1.005 }}
      transition={{ layout: { duration: 0.3, type: "spring", bounce: 0.2 } }}
      className={cn(
        "group flex items-center justify-between p-3 sm:p-4 bg-white/50 dark:bg-gray-800/40 hover:bg-white dark:hover:bg-gray-800 rounded-2xl border border-transparent hover:border-indigo-100 dark:hover:border-indigo-900/50 shadow-sm hover:shadow-lg hover:shadow-indigo-500/5 transition-all duration-300",
        todo.completed &&
        "opacity-75 bg-gray-50/50 dark:bg-gray-900/80 hover:bg-gray-50 dark:hover:bg-gray-900/30"
      )}
    >
      <div className="flex items-center flex-1 gap-3 sm:gap-5 overflow-hidden">
        <motion.button
          whileTap={{ scale: 0.85 }}
          onClick={() =>
            updateTodo({
              id: todo._id.toString(),
              text: undefined,
              completed: !todo.completed,
            })
          }
          className={cn(
            "shrink-0 w-6 h-6 sm:w-7 sm:h-7 rounded-full border-[2.5px] flex items-center justify-center transition-all duration-300 cursor-pointer",
            todo.completed
              ? "bg-indigo-500 border-indigo-500 text-white shadow-md shadow-indigo-500/30"
              : "border-gray-300 dark:border-gray-600 hover:border-indigo-400 bg-transparent"
          )}
        >
          <motion.div
            initial={false}
            animate={{
              scale: todo.completed ? 1 : 0,
              opacity: todo.completed ? 1 : 0,
            }}
          >
            <Check size={14} strokeWidth={3.5} />
          </motion.div>
        </motion.button>

        {isEditing ? (
          <input
            ref={inputRef}
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent border-none outline-none text-base sm:text-lg font-medium text-gray-800 dark:text-gray-200 p-0 placeholder-gray-400"
          />
        ) : (
          <span
            onClick={() =>
              updateTodo({
                id: todo._id.toString(),
                text: undefined,
                completed: !todo.completed,
              })
            }
            className={cn(
              "flex-1 text-base sm:text-lg font-medium truncate cursor-pointer select-none transition-all duration-300",
              todo.completed
                ? "text-gray-400 dark:text-gray-500 line-through decoration-2 decoration-indigo-300/50 dark:decoration-indigo-500/30"
                : "text-gray-700 dark:text-gray-200"
            )}
          >
            {todo.text}
          </span>
        )}
      </div>

      <div className="flex items-center gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200 transform translate-x-0 sm:translate-x-2 sm:group-hover:translate-x-0">
        {isEditing ? (
          <button
            onClick={() => setIsEditing(false)}
            className="p-1.5 sm:p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all cursor-pointer"
          >
            <X size={18} />
          </button>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="p-1.5 sm:p-2 text-gray-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-xl transition-all cursor-pointer"
            aria-label="Edit todo"
          >
            <Edit2 size={18} strokeWidth={2} />
          </button>
        )}
        <button
          onClick={() => deleteTodo({ id: todo._id.toString() })}
          className="p-1.5 sm:p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all cursor-pointer"
          aria-label="Delete todo"
        >
          <Trash2 size={18} strokeWidth={2} />
        </button>
      </div>
    </motion.li>
  );
}
