"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/components/ui/ToastProvider";
import { Mail, CheckCircle } from "lucide-react";

const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const { showToast } = useToast();
  const [emailSent, setEmailSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordInput) => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setEmailSent(true);
      showToast("Password reset link sent to your email!", "success");
    }, 1000);
  };

  if (emailSent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4 py-8">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center animate-scale-in">
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-primary-light p-4">
                <CheckCircle className="h-12 w-12 text-primary" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-secondary mb-3">Check Your Email</h1>
            <p className="text-gray-600 mb-2">
              We've sent a password reset link to
            </p>
            <p className="text-primary font-semibold mb-6">{getValues("email")}</p>
            <p className="text-sm text-gray-500 mb-6">
              Please check your email and click the link to reset your password.
            </p>
            <div className="space-y-3">
              <Link href="/auth/login">
                <Button className="w-full">Back to Login</Button>
              </Link>
              <button
                onClick={() => setEmailSent(false)}
                className="text-sm text-primary hover:text-primary-hover font-medium transition-colors"
              >
                Resend Email
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-8">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-lg p-8 animate-scale-in">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-primary-light p-3">
                <Mail className="h-6 w-6 text-primary" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-secondary mb-2">Forgot Password?</h1>
            <p className="text-gray-600 text-sm">
              Enter your email address and we'll send you a link to reset your password.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Input
              label="Email Address"
              type="email"
              placeholder="Enter your email"
              {...register("email")}
              error={errors.email?.message}
            />

            <Button 
              type="submit" 
              className="w-full" 
              isLoading={isLoading}
              disabled={isLoading}
            >
              Send Reset Link
            </Button>
          </form>

          {/* Back to Login */}
          <div className="mt-6 text-center">
            <Link 
              href="/auth/login" 
              className="text-sm text-primary hover:text-primary-hover font-medium transition-colors"
            >
              ← Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

