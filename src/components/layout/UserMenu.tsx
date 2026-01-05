"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { User, Package, Heart, MapPin, LogOut, ChevronDown } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { useLogout } from "@/services/queries/authQueries";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/ToastProvider";
import { cn } from "@/lib/utils";

export function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { user, logout: logoutStore } = useAuthStore();
  const logout = useLogout();
  const router = useRouter();
  const { showToast } = useToast();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleLogout = async () => {
    // Close menu immediately
    setIsOpen(false);
    
    try {
      // Call logout mutation
      await logout.mutateAsync(undefined);
      
      // Update auth store (this should already be done in the mutation, but ensure it)
      logoutStore();
      
      // Show success message
      showToast("Logged out successfully", "success");
      
      // Redirect to home with full page reload to clear all state
      window.location.href = "/";
    } catch (error) {
      showToast("Failed to logout", "error");
    }
  };

  if (!user) return null;

  // Get user initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 hover:bg-gray-100 rounded-full flex items-center space-x-2 transition-colors"
        aria-label="User menu"
      >
        {/* Avatar */}
        <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white text-sm font-semibold">
          {getInitials(user.name)}
        </div>
        <span className="hidden md:inline text-sm font-medium text-gray-700">{user.name.split(" ")[0]}</span>
        <ChevronDown className={cn(
          "h-4 w-4 hidden md:inline text-gray-600 transition-transform",
          isOpen && "rotate-180"
        )} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50 animate-slide-down">
          {/* User Info Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white font-semibold">
                {getInitials(user.name)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-secondary text-sm truncate">{user.name}</p>
                <p className="text-xs text-gray-500 truncate">{user.email}</p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            <Link
              href="/user/profile"
              onClick={() => setIsOpen(false)}
              className="flex items-center space-x-3 px-4 py-2.5 hover:bg-gray-50 text-secondary transition-colors"
            >
              <User className="h-4 w-4 text-gray-500" />
              <span className="text-sm">My Profile</span>
            </Link>
            <Link
              href="/user/orders"
              onClick={() => setIsOpen(false)}
              className="flex items-center space-x-3 px-4 py-2.5 hover:bg-gray-50 text-secondary transition-colors"
            >
              <Package className="h-4 w-4 text-gray-500" />
              <span className="text-sm">My Orders</span>
            </Link>
            <Link
              href="/user/wishlist"
              onClick={() => setIsOpen(false)}
              className="flex items-center space-x-3 px-4 py-2.5 hover:bg-gray-50 text-secondary transition-colors"
            >
              <Heart className="h-4 w-4 text-gray-500" />
              <span className="text-sm">Wishlist</span>
            </Link>
            <Link
              href="/user/addresses"
              onClick={() => setIsOpen(false)}
              className="flex items-center space-x-3 px-4 py-2.5 hover:bg-gray-50 text-secondary transition-colors"
            >
              <MapPin className="h-4 w-4 text-gray-500" />
              <span className="text-sm">Addresses</span>
            </Link>
          </div>

          {/* Logout */}
          <div className="border-t border-gray-200 py-2">
            <button
              onClick={handleLogout}
              className="flex items-center space-x-3 px-4 py-2.5 hover:bg-red-50 text-red-600 w-full text-left transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span className="text-sm font-medium">Logout</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

