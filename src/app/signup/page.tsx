"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import {
  Mail,
  Lock,
  ArrowRight,
  User,
  ShieldCheck,
  Eye,
  EyeOff,
  Chrome,
} from "lucide-react";
import { useSignupMutation } from "@/features/auth/authApi";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// Validation Schema
const signupSchema = z
  .object({
    fullName: z.string().min(2, "Full name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type SignupValues = z.infer<typeof signupSchema>;

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

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  const [signup, { isLoading }] = useSignupMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: SignupValues) => {
    try {
      await signup({
        fullname: data.fullName,
        email: data.email,
        password: data.password,
      }).unwrap();

      toast.success("Account created successfully! Redirecting...");

      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (error: unknown) {
      if (isApiError(error)) {
        const serverError = error.data.error;
        const errorMessage =
          serverError.message || "Something went wrong. Please try again.";

        // Handle DUPLICATE_EMAIL error
        if (
          errorMessage.toLowerCase().includes("exists") ||
          serverError.code === "DUPLICATE_EMAIL"
        ) {
          setError("email", {
            type: "manual",
            message: "This email address is already registered",
          });
        } else if (
          serverError.code === "VALIDATION_ERROR" &&
          serverError.fields
        ) {
          // Handle other server-side validation errors
          Object.keys(serverError.fields).forEach((field) => {
            setError(field as keyof SignupValues, {
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
    <main className="flex-1 w-full min-h-screen relative flex items-center justify-center overflow-hidden px-4 py-18">
      {/* Background mesh/gradients could go here if defined in theme */}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-lg z-10"
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
            Join thousands of productive users today.
          </p>
        </div>

        {/* Signup Card */}
        <div className="bg-white/80 dark:bg-black/80 backdrop-blur-xl rounded-[2.5rem] shadow-2xl border border-gray-100 dark:border-gray-800/50 p-8 md:p-12 relative overflow-hidden">
          {/* Subtle light effect */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/10 blur-3xl rounded-full" />
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-violet-500/10 blur-3xl rounded-full" />

          {/* Primary Social Signup */}
          <div className="flex flex-col gap-6 mb-10">
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center justify-center gap-3 w-full py-4 px-6 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-850 hover:border-indigo-300 dark:hover:border-indigo-700/50 transition-all duration-300 cursor-pointer shadow-sm group"
            >
              <Chrome
                size={20}
                className="text-gray-700 dark:text-gray-300 group-hover:text-indigo-500 transition-colors"
              />
              <span className="text-sm font-bold text-gray-700 dark:text-gray-200">
                Continue with Google
              </span>
            </motion.button>

            <div className="relative flex items-center justify-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-100 dark:border-gray-800/50"></div>
              </div>
              <span className="relative px-6 bg-white dark:bg-[#050505] text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.3em]">
                Or email signup
              </span>
            </div>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {/* Full Name */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1 block">
                Full Name
              </label>
              <div className="relative group">
                <div
                  className={cn(
                    "absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-200",
                    errors.fullName
                      ? "text-red-500"
                      : "text-gray-400 group-focus-within:text-indigo-500"
                  )}
                >
                  <User size={18} />
                </div>
                <input
                  {...register("fullName")}
                  type="text"
                  placeholder="John Doe"
                  className={cn(
                    "w-full pl-11 pr-4 py-4 bg-gray-50/50 dark:bg-gray-900/50 border rounded-2xl outline-none transition-all duration-300 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 font-medium",
                    errors.fullName
                      ? "border-red-500/50 focus:ring-1 focus:ring-red-500/50"
                      : "border-gray-300 dark:border-gray-700 focus:ring-1 focus:ring-indigo-500/50 focus:border-indigo-500/50"
                  )}
                />
              </div>
              {errors.fullName && (
                <p className="text-xs font-bold text-red-500 ml-1 animate-in fade-in slide-in-from-top-1 duration-200">
                  {errors.fullName.message}
                </p>
              )}
            </div>

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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Password */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1 block">
                  Password
                </label>
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
                  <p className="text-[10px] leading-tight font-bold text-red-500 ml-1 animate-in fade-in slide-in-from-top-1 duration-200">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1 block">
                  Confirm
                </label>
                <div className="relative group">
                  <div
                    className={cn(
                      "absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-200",
                      errors.confirmPassword
                        ? "text-red-500"
                        : "text-gray-400 group-focus-within:text-indigo-500"
                    )}
                  >
                    <ShieldCheck size={18} />
                  </div>
                  <input
                    {...register("confirmPassword")}
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className={cn(
                      "w-full pl-11 pr-12 py-4 bg-gray-50/50 dark:bg-gray-900/50 border rounded-2xl outline-none transition-all duration-300 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 font-medium",
                      errors.confirmPassword
                        ? "border-red-500/50 focus:ring-1 focus:ring-red-500/50"
                        : "border-gray-300 dark:border-gray-700 focus:ring-1 focus:ring-indigo-500/50 focus:border-indigo-500/50"
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-indigo-500 transition-colors duration-200"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-[10px] leading-tight font-bold text-red-500 ml-1 animate-in fade-in slide-in-from-top-1 duration-200">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
            </div>

            <div className="pt-4">
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                disabled={isLoading}
                type="submit"
                className="w-full group relative flex items-center justify-center gap-3 bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700 dark:hover:bg-indigo-400 text-white font-black py-4.5 rounded-2xl transition-all duration-300 shadow-xl shadow-indigo-500/20 active:shadow-inner overflow-hidden cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <div className="absolute inset-0 w-full h-full bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] pointer-events-none" />
                <span className="relative z-10 text-base">
                  {isLoading ? "Creating Account..." : "Create Free Account"}
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
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-black text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 transition-colors underline decoration-indigo-500/20 underline-offset-4"
            >
              Log in instead
            </Link>
          </p>

          <p className="mt-8 text-xs text-gray-400 dark:text-gray-500 max-w-sm mx-auto leading-relaxed">
            By joining, you agree to our{" "}
            <Link
              href="#"
              className="font-bold hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              Terms
            </Link>{" "}
            and{" "}
            <Link
              href="#"
              className="font-bold hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </motion.div>
      </motion.div>
    </main>
  );
}
