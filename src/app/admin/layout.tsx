"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, initialized } = useAuthStore();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Wait for auth to initialize
    if (!initialized) {
      return;
    }

    setIsChecking(false);

    // Check if user is authenticated and has admin role
    if (!user) {
      const redirectUrl = encodeURIComponent(window.location.pathname);
      router.push(`/auth/login?redirect=${redirectUrl}`);
      return;
    }

    if (!["super_admin", "admin", "staff"].includes(user.role)) {
      // User doesn't have admin access, redirect to home
      router.push("/");
      return;
    }
  }, [user, initialized, router]);

  // Show loading while checking auth
  if (isChecking || !initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show nothing if user doesn't have access (redirecting)
  if (!user || !["super_admin", "admin", "staff"].includes(user.role)) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="bg-secondary text-white shadow-md">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/admin/dashboard" className="text-xl font-bold">
              Admin Panel
            </Link>
            <div className="flex items-center space-x-6">
              <Link href="/admin/dashboard" className="hover:text-gray-300">
                Dashboard
              </Link>
              <Link href="/admin/products" className="hover:text-gray-300">
                Products
              </Link>
              <Link href="/admin/orders" className="hover:text-gray-300">
                Orders
              </Link>
              <Link href="/admin/categories" className="hover:text-gray-300">
                Categories
              </Link>
              <Link href="/admin/banners" className="hover:text-gray-300">
                Banners
              </Link>
              <Link href="/admin/coupons" className="hover:text-gray-300">
                Coupons
              </Link>
              <Link href="/admin/users" className="hover:text-gray-300">
                Users
              </Link>
              <Link href="/" className="hover:text-gray-300">
                Back to Store
              </Link>
            </div>
          </div>
        </div>
      </nav>
      <main>{children}</main>
    </div>
  );
}

