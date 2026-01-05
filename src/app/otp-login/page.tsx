"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { otpLoginSchema, type OtpLoginInput } from "@/schemas/authSchemas";
import { useOtpLogin } from "@/services/queries/authQueries";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/components/ui/ToastProvider";

export default function OtpLoginPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const otpLogin = useOtpLogin();
  const [requiresOtp, setRequiresOtp] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OtpLoginInput>({
    resolver: zodResolver(otpLoginSchema),
  });

  const onSubmit = (data: OtpLoginInput) => {
    if (!requiresOtp) {
      // First step: send OTP
      otpLogin.mutate(
        { phone: data.phone },
        {
          onSuccess: (result) => {
            if ("requiresOtp" in result) {
              setRequiresOtp(true);
              setPhoneNumber(data.phone);
              showToast("OTP sent to your phone!", "success");
            } else {
              showToast("Login successful!", "success");
              // Redirect based on role
              const role = result.user.role;
              if (["super_admin", "admin", "staff"].includes(role)) {
                router.push("/admin/dashboard");
              } else {
                router.push("/");
              }
              setTimeout(() => {
                router.refresh();
              }, 100);
            }
          },
          onError: (error: any) => {
            showToast(error.message || "Failed to send OTP", "error");
          },
        }
      );
    } else {
      // Second step: verify OTP
      otpLogin.mutate(
        { phone: phoneNumber, otp: data.otp },
        {
          onSuccess: (result) => {
            if ("user" in result) {
              showToast("Login successful!", "success");
              // Redirect based on role
              const role = result.user.role;
              if (["super_admin", "admin", "staff"].includes(role)) {
                router.push("/admin/dashboard");
              } else {
                router.push("/");
              }
              setTimeout(() => {
                router.refresh();
              }, 100);
            }
          },
          onError: (error: any) => {
            showToast(error.message || "Invalid OTP", "error");
          },
        }
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center mb-8">Login with OTP</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {!requiresOtp ? (
            <>
              <Input
                label="Phone Number"
                type="tel"
                placeholder="9876543210"
                {...register("phone")}
                error={errors.phone?.message}
              />
              <Button type="submit" className="w-full" isLoading={otpLogin.isPending}>
                Send OTP
              </Button>
              <div className="text-center text-sm text-gray-600">
                <p>We'll send a 6-digit OTP to your phone number</p>
              </div>
            </>
          ) : (
            <>
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">
                  OTP sent to <span className="font-semibold">{phoneNumber}</span>
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setRequiresOtp(false);
                    setPhoneNumber("");
                  }}
                  className="text-sm text-primary hover:underline"
                >
                  Change phone number
                </button>
              </div>
              <Input
                label="Enter OTP"
                type="text"
                placeholder="123456"
                maxLength={6}
                {...register("otp")}
                error={errors.otp?.message}
              />
              <Button type="submit" className="w-full" isLoading={otpLogin.isPending}>
                Verify OTP
              </Button>
              <div className="text-center text-sm text-gray-600">
                <p>Enter the 6-digit OTP sent to your phone</p>
                <p className="mt-2">
                  <button
                    type="button"
                    onClick={() => {
                      otpLogin.mutate(
                        { phone: phoneNumber },
                        {
                          onSuccess: () => {
                            showToast("OTP resent!", "success");
                          },
                        }
                      );
                    }}
                    className="text-primary hover:underline"
                  >
                    Resend OTP
                  </button>
                </p>
              </div>
            </>
          )}
        </form>
        <div className="mt-6 text-center text-sm">
          <span className="text-gray-600">Or </span>
          <Link href="/login" className="text-primary hover:underline">
            login with email
          </Link>
        </div>
        <div className="mt-4 text-center text-sm">
          <span className="text-gray-600">Don't have an account? </span>
          <Link href="/register" className="text-primary hover:underline">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}

