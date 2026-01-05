"use client";

import { useState } from "react";
import { Plus, Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { useAddTodoMutation } from "@/features/todos/todoApi";

export default function TodoInput() {
  const [text, setText] = useState("");

  const [addTodo, { isLoading }] = useAddTodoMutation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim() && !isLoading) {
      addTodo({ text: text.trim() });
      setText("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative group z-10">
      <div className="relative flex items-center">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="What needs to be done?"
          disabled={isLoading}
          className="w-full h-12 sm:h-14 md:h-16 pl-4 pr-12 sm:pl-6 sm:pr-16 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border-2 border-transparent focus:bg-white dark:focus:bg-gray-800 focus:border-indigo-500/30 hover:bg-white dark:hover:bg-gray-800 transition-all duration-300 placeholder:text-gray-400 dark:placeholder:text-gray-500 text-base sm:text-lg text-gray-900 dark:text-white shadow-sm focus:shadow-xl focus:shadow-indigo-500/5 outline-none disabled:opacity-70 disabled:cursor-not-allowed"
        />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          disabled={!text.trim() || isLoading}
          className="absolute right-2 sm:right-3 p-2 sm:p-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/30 disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed transition-all cursor-pointer"
        >
          {isLoading ? (
            <Loader2 size={22} className="animate-spin" />
          ) : (
            <Plus size={22} strokeWidth={3} />
          )}
        </motion.button>
      </div>
    </form>
  );
}
