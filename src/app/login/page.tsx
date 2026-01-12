"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { Mail, Lock, ArrowRight, Chrome, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";

// Validation Schema
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginValues = z.infer<typeof loginSchema>;

interface ApiErrorResponse {
  data: {
    error: {
      message?: string;
      code?: string;
      fields?: Record<string, string>;
    };
  };
}

function isApiError(error: unknown): error is ApiErrorResponse {
  if (typeof error !== "object" || error === null || !("data" in error)) {
    return false;
  }
  const data = (error as Record<string, unknown>).data;
  return (
    typeof data === "object" &&
    data !== null &&
    "error" in data &&
    typeof (data as Record<string, unknown>).error === "object"
  );
}

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const [isProviderLoading, setIsProviderLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleGoogleSignIn = async () => {
    await authClient.signIn.social(
      {
        provider: "google",
        callbackURL: "/",
        newUserCallbackURL: "/",
      },
      {
        onRequest: () => {
          setIsProviderLoading(true);
        },
        onError: () => {
          setIsProviderLoading(false);
          toast.error("Failed to redirect to Google sign-in");
        },
      }
    );
  };

  const onSubmit = async (data: LoginValues) => {
    try {
      await authClient.signIn.email(
        {
          email: data.email,
          password: data.password,

          callbackURL: "/",
        },
        {
          onRequest: () => {
            setIsLoading(true);
          },
          onSuccess: () => {
            setIsLoading(false);
            toast.success("Welcome back! Redirecting...");
            setTimeout(() => {
              router.push("/");
            }, 500);
          },
          onError: (error) => {
            setIsLoading(false);
            toast.error(
              error.error.message || "Login failed. Please try again."
            );
          },
        }
      );
    } catch (error: unknown) {
      if (isApiError(error)) {
        const serverError = error.data.error;
        const errorMessage =
          serverError.message || "Something went wrong. Please try again.";

        if (serverError.code === "INVALID_CREDENTIALS") {
          setError("email", { type: "manual", message: "" });
          setError("password", {
            type: "manual",
            message: "Invalid email or password",
          });
        } else if (
          serverError.code === "VALIDATION_ERROR" &&
          serverError.fields
        ) {
          Object.keys(serverError.fields).forEach((field) => {
            setError(field as keyof LoginValues, {
              type: "server",
              message: serverError.fields?.[field],
            });
          });
        }
        toast.error(errorMessage);
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  };

  return (
    <main className="flex-1 w-full min-h-screen relative flex items-center justify-center overflow-hidden px-4 pt-16">
      {/* Background glass effects */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-violet-500/10 blur-[120px] rounded-full" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md z-10"
      >
        {/* Logo/Title */}
        <div className="text-center mb-10">
          <Link href="/" className="inline-block">
            <motion.h1
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="text-5xl font-black tracking-tighter text-gray-900 dark:text-white mb-3"
            >
              Tasks<span className="text-indigo-600">.</span>
            </motion.h1>
          </Link>
          <p className="text-gray-500 dark:text-gray-400 font-medium text-lg">
            Welcome back! Please enter your details.
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white/80 dark:bg-black/80 backdrop-blur-xl rounded-[2.5rem] shadow-2xl border border-gray-100 dark:border-gray-800/50 p-8 md:p-12 relative overflow-hidden">
          {/* Subtle light effect */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/10 blur-3xl rounded-full" />

          <motion.button
            whileHover={{
              scale: !isProviderLoading ? 1.02 : 1,
              y: !isProviderLoading ? -2 : 0,
            }}
            whileTap={{ scale: !isProviderLoading ? 0.98 : 1 }}
            disabled={isProviderLoading}
            onClick={handleGoogleSignIn}
            className="flex items-center justify-center gap-3 w-full py-4 px-6 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-850 hover:border-indigo-300 dark:hover:border-indigo-700/50 transition-all duration-300 cursor-pointer shadow-sm group disabled:opacity-60"
          >
            {isProviderLoading ? (
              // Loader (spinner)
              <div className="w-5 h-5 border-2 border-gray-700 border-t-transparent rounded-full animate-spin" />
            ) : (
              <Chrome
                size={20}
                className="text-gray-700 dark:text-gray-300 group-hover:text-indigo-500 transition-colors dark:group-hover:text-black"
              />
            )}

            <span className="text-sm font-bold text-gray-700 dark:text-gray-200 dark:group-hover:text-black">
              {isProviderLoading ? "Connecting..." : "Continue with Google"}
            </span>
          </motion.button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-100 dark:border-gray-800/50"></div>
            </div>
            <div className="relative flex justify-center text-[10px] uppercase tracking-[0.3em] font-black text-gray-400 dark:text-gray-500">
              <span className="bg-white dark:bg-[#050505] px-4">
                Or continue with
              </span>
            </div>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1 block">
                Email Address
              </label>
              <div className="relative group">
                <div
                  className={cn(
                    "absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-200",
                    errors.email
                      ? "text-red-500"
                      : "text-gray-400 group-focus-within:text-indigo-500"
                  )}
                >
                  <Mail size={18} />
                </div>
                <input
                  {...register("email")}
                  type="email"
                  placeholder="name@company.com"
                  className={cn(
                    "w-full pl-11 pr-4 py-4 bg-gray-50/50 dark:bg-gray-900/50 border rounded-2xl outline-none transition-all duration-300 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 font-medium",
                    errors.email
                      ? "border-red-500/50 focus:ring-1 focus:ring-red-500/50"
                      : "border-gray-300 dark:border-gray-700 focus:ring-1 focus:ring-indigo-500/50 focus:border-indigo-500/50"
                  )}
                />
              </div>
              {errors.email && (
                <p className="text-xs font-bold text-red-500 ml-1 animate-in fade-in slide-in-from-top-1 duration-200">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <div className="flex items-center justify-between ml-1">
                <label className="text-sm font-bold text-gray-700 dark:text-gray-300">
                  Password
                </label>
                <Link
                  href="#"
                  className="text-xs font-black text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative group">
                <div
                  className={cn(
                    "absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-200",
                    errors.password
                      ? "text-red-500"
                      : "text-gray-400 group-focus-within:text-indigo-500"
                  )}
                >
                  <Lock size={18} />
                </div>
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className={cn(
                    "w-full pl-11 pr-12 py-4 bg-gray-50/50 dark:bg-gray-900/50 border rounded-2xl outline-none transition-all duration-300 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 font-medium",
                    errors.password
                      ? "border-red-500/50 focus:ring-1 focus:ring-red-500/50"
                      : "border-gray-300 dark:border-gray-700 focus:ring-1 focus:ring-indigo-500/50 focus:border-indigo-500/50"
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-indigo-500 transition-colors duration-200"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs font-bold text-red-500 ml-1 animate-in fade-in slide-in-from-top-1 duration-200">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="pt-2">
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                disabled={isLoading}
                type="submit"
                className="w-full group relative flex items-center justify-center gap-3 bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700 dark:hover:bg-indigo-400 text-white font-black py-4.5 rounded-2xl transition-all duration-300 shadow-xl shadow-indigo-500/20 active:shadow-inner overflow-hidden cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <div className="absolute inset-0 w-full h-full bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] pointer-events-none" />
                <span className="relative z-10 text-base">
                  {isLoading ? "Logging in..." : "Login to Workspace"}
                </span>
                {!isLoading && (
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  >
                    <ArrowRight size={20} />
                  </motion.div>
                )}
              </motion.button>
            </div>
          </form>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-10 text-center"
        >
          <p className="text-gray-500 dark:text-gray-400 font-medium">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="font-black text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 transition-colors underline decoration-indigo-500/20 underline-offset-4"
            >
              Start for free
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </main>
  );
}
