"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterInput } from "@/schemas/authSchemas";
import { useRegister } from "@/services/queries/authQueries";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/components/ui/ToastProvider";
import { useAuthStore } from "@/store/useAuthStore";

export default function RegisterPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const register = useRegister();
  const { isAuthenticated } = useAuthStore();
  
  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  const onSubmit = (data: RegisterInput) => {
    register.mutate(data, {
      onSuccess: () => {
        showToast("Registration successful!", "success");
        router.push("/");
      },
      onError: (error: any) => {
        showToast(error.message || "Registration failed", "error");
      },
    });
  };

  if (isAuthenticated) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-8">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-lg p-8 animate-scale-in">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-secondary mb-2">Create Account</h1>
            <p className="text-gray-600 text-sm">Sign up to get started</p>
          </div>

          {/* Register Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Input
              label="Full Name"
              placeholder="Enter your full name"
              {...registerField("name")}
              error={errors.name?.message}
            />

            <Input
              label="Email Address"
              type="email"
              placeholder="Enter your email"
              {...registerField("email")}
              error={errors.email?.message}
            />

            <Input
              label="Phone Number (Optional)"
              type="tel"
              placeholder="Enter your phone number"
              {...registerField("phone")}
              error={errors.phone?.message}
            />

            <Input
              label="Password"
              type="password"
              placeholder="Create a password"
              {...registerField("password")}
              error={errors.password?.message}
            />

            <Input
              label="Confirm Password"
              type="password"
              placeholder="Confirm your password"
              {...registerField("confirmPassword")}
              error={errors.confirmPassword?.message}
            />

            <Button 
              type="submit" 
              className="w-full" 
              isLoading={register.isPending}
              disabled={register.isPending}
            >
              Create Account
            </Button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center text-sm">
            <span className="text-gray-600">Already have an account? </span>
            <Link 
              href="/auth/login" 
              className="text-primary hover:text-primary-hover font-semibold transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

