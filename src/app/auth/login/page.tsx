"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { loginSchema, type LoginInput } from "@/schemas/authSchemas";
import { useLogin, useGoogleLogin } from "@/services/queries/authQueries";
import { useToast } from "@/components/ui/ToastProvider";
import { useAuthStore } from "@/store/useAuthStore";
import { cn } from "@/lib/utils";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useToast();
  const login = useLogin();
  const googleLogin = useGoogleLogin();
  const { isAuthenticated } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const redirectTo = searchParams.get("redirect") || "/";
      router.push(redirectTo);
    }
  }, [isAuthenticated, router, searchParams]);

  // Get redirect URL from query params or localStorage
  const getRedirectUrl = () => {
    const redirectParam = searchParams.get("redirect");
    if (redirectParam) return redirectParam;
    
    // Try to get last visited page from localStorage
    if (typeof window !== "undefined") {
      const lastVisited = localStorage.getItem("lastVisitedPage");
      if (lastVisited && lastVisited !== "/login" && lastVisited !== "/register") {
        return lastVisited;
      }
    }
    return "/";
  };

  const onSubmit = (data: LoginInput) => {
    login.mutate(data, {
      onSuccess: () => {
        showToast("Login successful!", "success");
        const redirectTo = getRedirectUrl();
        router.push(redirectTo);
      },
      onError: (error: any) => {
        showToast(error.message || "Login failed", "error");
      },
    });
  };

  const handleGoogleLogin = () => {
    googleLogin.mutate(undefined, {
      onSuccess: () => {
        showToast("Login successful!", "success");
        const redirectTo = getRedirectUrl();
        router.push(redirectTo);
      },
      onError: (error: any) => {
        showToast(error.message || "Login failed", "error");
      },
    });
  };

  if (isAuthenticated) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* Soft Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#F8FAFC] via-[#F1F5F9] to-[#EEF2FF]" />
      
      {/* Radial Gradient Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(26,115,232,0.08),transparent_70%)]" />
      
      {/* Login Card */}
      <div className="relative w-full max-w-[420px] z-10">
        <div 
          className={cn(
            "bg-white/80 backdrop-blur-xl",
            "rounded-2xl shadow-2xl",
            "border border-black/5",
            "p-8 md:p-10",
            "animate-scale-in"
          )}
          style={{
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
          }}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl md:text-[28px] font-bold text-secondary mb-2 tracking-tight">
              Welcome Back
            </h1>
            <p className="text-sm md:text-base text-gray-500 font-normal">
              Sign in to your account to continue
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-secondary">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <Mail className="h-5 w-5" />
                </div>
                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  className={cn(
                    "w-full h-12 pl-12 pr-4",
                    "rounded-xl border",
                    "bg-white/50 backdrop-blur-sm",
                    "text-sm text-secondary",
                    "placeholder:text-gray-400",
                    "transition-all duration-200",
                    "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary",
                    "disabled:cursor-not-allowed disabled:opacity-50",
                    errors.email
                      ? "border-red-300 focus:ring-red-200 focus:border-red-400"
                      : "border-gray-200 hover:border-gray-300"
                  )}
                  {...register("email")}
                />
              </div>
              {errors.email && (
                <p className="text-sm text-red-600 font-medium mt-1.5">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-secondary">
                Password
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className={cn(
                    "w-full h-12 pl-12 pr-12",
                    "rounded-xl border",
                    "bg-white/50 backdrop-blur-sm",
                    "text-sm text-secondary",
                    "placeholder:text-gray-400",
                    "transition-all duration-200",
                    "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary",
                    "disabled:cursor-not-allowed disabled:opacity-50",
                    errors.password
                      ? "border-red-300 focus:ring-red-200 focus:border-red-400"
                      : "border-gray-200 hover:border-gray-300"
                  )}
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-600 font-medium mt-1.5">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Forgot Password Link */}
            <div className="flex justify-end">
              <Link
                href="/auth/forgot-password"
                className="text-sm text-gray-600 hover:text-primary hover:underline transition-colors duration-200"
              >
                Forgot Password?
              </Link>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={login.isPending}
              className={cn(
                "w-full h-12",
                "rounded-xl font-semibold text-white text-base",
                "bg-gradient-to-r from-primary to-indigo-600",
                "shadow-lg shadow-primary/25",
                "hover:shadow-xl hover:shadow-primary/30",
                "hover:-translate-y-0.5",
                "active:translate-y-0 active:scale-[0.98]",
                "transition-all duration-200",
                "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0",
                login.isPending && "cursor-wait"
              )}
            >
              {login.isPending ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Signing in...
                </span>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-8 flex items-center">
            <div className="flex-1 border-t border-gray-200" />
            <span className="px-4 text-sm text-gray-500 font-medium">OR</span>
            <div className="flex-1 border-t border-gray-200" />
          </div>

          {/* Google Login Button */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={googleLogin.isPending}
            className={cn(
              "w-full h-12",
              "rounded-xl font-medium text-secondary text-sm",
              "border-2 border-gray-200 bg-white/50 backdrop-blur-sm",
              "hover:bg-gray-50 hover:border-gray-300",
              "active:scale-[0.98]",
              "transition-all duration-200",
              "focus:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-offset-2",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              "flex items-center justify-center gap-3"
            )}
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            {googleLogin.isPending ? "Connecting..." : "Continue with Google"}
          </button>

          {/* Register Link */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link
                href="/auth/register"
                className="text-primary font-semibold hover:text-primary-600 hover:underline transition-colors duration-200"
              >
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center px-4 py-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#F8FAFC] via-[#F1F5F9] to-[#EEF2FF]" />
        <div className="relative z-10">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
          </div>
        </div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}

