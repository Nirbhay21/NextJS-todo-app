"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles,
  LogOut,
  User as UserIcon,
  LogIn,
  UserPlus,
} from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useState, useEffect, useRef } from "react";
import { authClient } from "@/lib/auth-client";

export default function Navbar() {
  const { data: session, isPending: isUserLoading } = authClient.useSession();
  const router = useRouter();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    };

    if (isProfileOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isProfileOpen]);

  const handleLogout = async () => {
    try {
      await authClient.signOut();
      setIsProfileOpen(false);
      toast.success("Logged out successfully");
      router.push("/login");
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  const user = session?.user;

  return (
    <nav className="fixed inset-x-0 top-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <motion.div
            whileHover={{ scale: 1.05, rotate: 5 }}
            className="size-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/30"
          >
            <Sparkles size={22} className="text-white" />
          </motion.div>

          <h1 className="text-2xl font-black tracking-tighter text-gray-900 dark:text-white">
            Tasks<span className="text-indigo-600">.</span>
          </h1>
        </Link>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <div className="h-6 w-px bg-gray-200 dark:bg-gray-800" />

          {isUserLoading ? (
            <div className="w-24 h-9 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-xl" />
          ) : user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 border border-transparent hover:border-gray-200 dark:hover:border-gray-700 active:scale-95 group"
              >
                <span className="hidden sm:block text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">
                  {user.name.split(" ")[0]}
                </span>
                <div className="size-9 rounded-xl bg-linear-to-br from-indigo-500 to-violet-500 p-[2px] shadow-md shadow-indigo-500/20">
                  <div className="size-full bg-white dark:bg-gray-900 rounded-[10px] flex items-center justify-center overflow-hidden">
                    <UserIcon size={18} className="text-indigo-500" />
                  </div>
                </div>
              </button>

              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 10, x: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10, x: 10 }}
                    className="absolute right-0 mt-3 w-56 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-2xl p-2 z-10"
                  >
                    <div className="px-4 py-3 mb-2 border-b border-gray-100 dark:border-gray-800">
                      <p className="text-xs font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-1">
                        Signed in as
                      </p>
                      <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
                        {user.name}
                      </p>
                      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 truncate mt-0.5">
                        {user.email}
                      </p>
                    </div>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors font-bold text-sm text-left group"
                    >
                      <LogOut
                        size={18}
                        className="group-hover:-translate-x-1 transition-transform"
                      />
                      Log out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                onClick={() => setIsProfileOpen(false)}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-sm font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all border border-gray-200 dark:border-gray-800 hover:border-indigo-500/30"
              >
                <LogIn size={16} />
                <span className="hidden sm:inline">Login</span>
              </Link>
              <Link
                href="/signup"
                className="flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-sm font-black text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-500/25 transition-all hover:-translate-y-0.5"
              >
                <UserPlus size={16} />
                Start Free
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
