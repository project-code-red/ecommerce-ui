"use client";

import React, { useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  position?: "left" | "right";
  size?: "sm" | "md" | "lg";
}

export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  title,
  children,
  position = "right",
  size = "md",
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizes = {
    sm: "w-80",
    md: "w-96",
    lg: "w-[500px]",
  };

  const positions = {
    left: "left-0",
    right: "right-0",
  };

  return (
    <div className="fixed inset-0 z-[100]">
      <div
        className="fixed inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
      />
      <div
        className={cn(
          "fixed top-0 h-full bg-white shadow-xl transition-transform",
          positions[position],
          sizes[size],
          isOpen ? "translate-x-0" : position === "right" ? "translate-x-full" : "-translate-x-full"
        )}
      >
        {(title || true) && (
          <div className="flex items-center justify-between p-6 border-b">
            {title && <h2 className="text-xl font-semibold">{title}</h2>}
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        )}
        <div className="p-6 overflow-y-auto h-[calc(100%-80px)]">{children}</div>
      </div>
    </div>
  );
};

