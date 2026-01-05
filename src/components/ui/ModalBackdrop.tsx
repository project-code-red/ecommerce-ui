"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface ModalBackdropProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  closeOnClickOutside?: boolean;
}

export function ModalBackdrop({
  isOpen,
  onClose,
  children,
  className,
  closeOnClickOutside = true,
}: ModalBackdropProps) {
  const backdropRef = useRef<HTMLDivElement>(null);

  // Handle ESC key
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    // Prevent body scroll when modal is open
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  // Focus trap
  useEffect(() => {
    if (!isOpen) return;

    const focusableElements = backdropRef.current?.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    if (!focusableElements || focusableElements.length === 0) return;

    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    document.addEventListener("keydown", handleTab);
    firstElement?.focus();

    return () => {
      document.removeEventListener("keydown", handleTab);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      ref={backdropRef}
      className={cn(
        "fixed inset-0 z-[100]",
        // Desktop: centered
        "md:flex md:items-center md:justify-center",
        // Mobile: bottom aligned
        "flex items-end justify-center",
        "bg-black/40 backdrop-blur-sm",
        "animate-fade-in",
        className
      )}
      onClick={closeOnClickOutside ? onClose : undefined}
      role="dialog"
      aria-modal="true"
      aria-label="Promotional offer"
    >
      <div onClick={(e) => e.stopPropagation()} className="w-full md:w-auto">
        {children}
      </div>
    </div>
  );
}

