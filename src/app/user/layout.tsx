"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { MainNavbar } from "@/components/layout/MainNavbar";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/features/cart/CartDrawer";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, initialized } = useAuthStore();

  // Store last visited page
  useEffect(() => {
    if (typeof window !== "undefined" && pathname) {
      // Don't store auth pages or admin pages as last visited
      if (
        !pathname.startsWith("/auth") &&
        !pathname.startsWith("/login") &&
        !pathname.startsWith("/register") &&
        !pathname.startsWith("/admin")
      ) {
        localStorage.setItem("lastVisitedPage", pathname);
      }
    }
  }, [pathname]);

  useEffect(() => {
    if (!initialized) return;
    
    if (!isAuthenticated) {
      // Store current path as redirect URL
      if (typeof window !== "undefined" && pathname) {
        const redirectUrl = encodeURIComponent(pathname);
        router.push(`/auth/login?redirect=${redirectUrl}`);
      } else {
        router.push("/auth/login");
      }
    }
  }, [isAuthenticated, initialized, router, pathname]);

  if (!initialized || !isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <MainNavbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <CartDrawer />
    </div>
  );
}

