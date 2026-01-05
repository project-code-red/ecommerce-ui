"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { X, CheckCircle2, AlertCircle, Info, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastType = "success" | "error" | "info" | "warning";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    // Return a no-op function during SSR or when not in provider
    return {
      showToast: () => {},
    };
  }
  return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = "info") => {
    const id = Math.random().toString(36).substring(7);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 5000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const typeStyles = {
    success: "bg-white border-2 border-green-500 text-gray-900 shadow-xl",
    error: "bg-white border-2 border-red-500 text-gray-900 shadow-xl",
    info: "bg-white border-2 border-primary text-gray-900 shadow-xl",
    warning: "bg-white border-2 border-accent text-gray-900 shadow-xl",
  };

  const iconStyles = {
    success: "text-green-600",
    error: "text-red-600",
    info: "text-primary",
    warning: "text-accent",
  };

  const icons = {
    success: CheckCircle2,
    error: AlertCircle,
    info: Info,
    warning: AlertTriangle,
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed top-[70px] md:top-[120px] right-2 md:right-4 z-[100] space-y-3 pointer-events-none max-w-[calc(100vw-1rem)]">
        {toasts.map((toast, index) => {
          const Icon = icons[toast.type];
          return (
            <div
              key={toast.id}
              className={cn(
                "flex items-center gap-3 min-w-[280px] md:min-w-[320px] max-w-[calc(100vw-2rem)] md:max-w-md p-4 rounded-xl border-2 shadow-2xl",
                "animate-slide-in-right pointer-events-auto",
                "backdrop-blur-sm bg-white/95",
                typeStyles[toast.type]
              )}
              style={{
                animationDelay: `${index * 50}ms`,
              }}
            >
              {/* Icon */}
              <div className={cn("flex-shrink-0", iconStyles[toast.type])}>
                <Icon className="h-5 w-5" />
              </div>

              {/* Message */}
              <p className="flex-1 text-sm font-semibold text-gray-900">{toast.message}</p>

              {/* Close Button */}
              <button
                onClick={() => removeToast(toast.id)}
                className="flex-shrink-0 p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Close notification"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

