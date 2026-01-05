"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { motion } from "motion/react";
import { useHydrated } from "@/hooks/useHydrated";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const isHydrated = useHydrated();

  if (!isHydrated) {
    return null;
  }

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="p-2.5 rounded-full bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-700 hover:bg-gray-50 dark:hover:bg-gray-800 shadow-sm hover:shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-900 cursor-pointer"
      aria-label="Toggle theme"
    >
      <motion.div
        initial={false}
        animate={{ rotate: theme === "dark" ? 0 : 180 }}
        transition={{ duration: 0.5, type: "spring" }}
      >
        {theme === "dark" ? (
          <Moon size={20} strokeWidth={2} />
        ) : (
          <Sun size={20} strokeWidth={2} />
        )}
      </motion.div>
    </motion.button>
  );
}
