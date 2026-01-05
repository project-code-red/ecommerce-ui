"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { MainNavbar } from "@/components/layout/MainNavbar";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/features/cart/CartDrawer";
import { OfferPopupWrapper } from "@/components/features/popup/OfferPopupWrapper";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Store last visited page for redirect after login
  useEffect(() => {
    if (typeof window !== "undefined" && pathname) {
      // Don't store auth pages as last visited
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

  return (
    <div className="min-h-screen flex flex-col">
      <MainNavbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <CartDrawer />
      <OfferPopupWrapper />
    </div>
  );
}

