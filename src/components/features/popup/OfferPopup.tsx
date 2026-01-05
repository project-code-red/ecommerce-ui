"use client";

import { useState, useRef, useEffect } from "react";
import { X, Check, Truck, CreditCard, RotateCcw } from "lucide-react";
import Link from "next/link";
import { ModalBackdrop } from "@/components/ui/ModalBackdrop";
import { CountdownTimer } from "./CountdownTimer";
import { cn } from "@/lib/utils";

interface OfferPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onDismiss: () => void;
}

export function OfferPopup({ isOpen, onClose, onDismiss }: OfferPopupProps) {
  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);
  const startYRef = useRef(0);
  const currentYRef = useRef(0);

  // Swipe down to dismiss (mobile only)
  useEffect(() => {
    if (!isOpen || !popupRef.current) return;

    const popup = popupRef.current;

    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      startYRef.current = touch.clientY;
      currentYRef.current = touch.clientY;
      setIsDragging(true);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging) return;
      const touch = e.touches[0];
      currentYRef.current = touch.clientY;
      const deltaY = currentYRef.current - startYRef.current;
      
      // Only allow downward drag
      if (deltaY > 0) {
        setDragY(deltaY);
      }
    };

    const handleTouchEnd = () => {
      if (!isDragging) return;
      
      const threshold = 100; // Minimum drag distance to dismiss
      if (dragY > threshold) {
        onClose();
      }
      
      // Reset
      setDragY(0);
      setIsDragging(false);
    };

    popup.addEventListener("touchstart", handleTouchStart);
    popup.addEventListener("touchmove", handleTouchMove);
    popup.addEventListener("touchend", handleTouchEnd);

    return () => {
      popup.removeEventListener("touchstart", handleTouchStart);
      popup.removeEventListener("touchmove", handleTouchMove);
      popup.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isOpen, isDragging, dragY, onClose]);
  const handleShopNow = () => {
    onDismiss();
    // Navigation will happen via Link
  };

  const handleMaybeLater = () => {
    onClose();
  };

  return (
    <ModalBackdrop isOpen={isOpen} onClose={onClose} closeOnClickOutside={true}>
      <div
        ref={popupRef}
        className={cn(
          "relative w-full",
          // Desktop: centered modal
          "md:max-w-[520px] lg:max-w-[600px]",
          "bg-gradient-to-b from-background to-background-secondary",
          "rounded-2xl md:rounded-2xl shadow-2xl",
          "animate-scale-in",
          // Mobile: bottom sheet style
          "fixed bottom-0 left-0 right-0",
          "rounded-t-3xl rounded-b-none",
          "max-h-[85vh] overflow-y-auto",
          // Desktop: centered
          "md:relative md:bottom-auto md:left-auto md:right-auto",
          "md:mx-4 md:my-8",
          "md:max-h-[90vh]",
          // Drag transition
          "transition-transform duration-200 ease-out",
          isDragging && "transition-none"
        )}
        style={{
          transform: dragY > 0 ? `translateY(${dragY}px)` : undefined,
        }}
        role="dialog"
        aria-labelledby="offer-title"
        aria-describedby="offer-description"
      >
        {/* Swipe Indicator - Mobile Only */}
        <div className="md:hidden flex justify-center pt-3 pb-2 relative">
          <div className="w-12 h-1 bg-gray-300 rounded-full" />
          {/* Close Button - Mobile: positioned near swipe indicator */}
          <button
            onClick={onClose}
            className={cn(
              "absolute top-2 right-4",
              "p-2 rounded-full",
            "text-gray-500 hover:text-secondary hover:bg-gray-100",
            "transition-colors duration-200",
            "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            )}
            aria-label="Close offer popup"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Close Button - Desktop */}
        <button
          onClick={onClose}
          className={cn(
            "hidden md:block absolute top-4 right-4 z-10",
            "p-2 rounded-full",
            "text-gray-500 hover:text-secondary hover:bg-gray-100",
            "transition-colors duration-200",
            "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          )}
          aria-label="Close offer popup"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Content */}
        <div className="p-6 md:p-8">
          {/* Top Section - Badge */}
          <div className="flex items-start justify-between mb-4">
            <span
              className={cn(
                "inline-block px-3 py-1.5 rounded-full",
                "text-xs font-bold uppercase tracking-wider",
                "bg-accent text-white"
              )}
            >
              LIMITED TIME OFFER
            </span>
          </div>

          {/* Main Headline */}
          <div className="mb-6">
            <h2
              id="offer-title"
              className={cn(
                "text-4xl md:text-5xl font-bold mb-2",
                "text-secondary leading-tight"
              )}
            >
              Get Flat 30% OFF
            </h2>
            <p
              id="offer-description"
              className="text-lg md:text-xl text-gray-600 font-medium"
            >
              On your first order
            </p>
          </div>

          {/* Offer Details */}
          <div className="mb-6 space-y-3">
            <div className="flex items-center gap-3 text-gray-700">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-50 flex items-center justify-center">
                <Check className="h-4 w-4 text-primary" />
              </div>
              <div className="flex items-center gap-2">
                <Truck className="h-5 w-5 text-gray-500" />
                <span className="text-sm md:text-base">Free Shipping</span>
              </div>
            </div>

            <div className="flex items-center gap-3 text-gray-700">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-50 flex items-center justify-center">
                <Check className="h-4 w-4 text-primary" />
              </div>
              <div className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-gray-500" />
                <span className="text-sm md:text-base">COD Available</span>
              </div>
            </div>

            <div className="flex items-center gap-3 text-gray-700">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-50 flex items-center justify-center">
                <Check className="h-4 w-4 text-primary" />
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw className="h-5 w-5 text-gray-500" />
                <span className="text-sm md:text-base">Easy Returns</span>
              </div>
            </div>
          </div>

          {/* Optional Countdown Timer */}
          <div className="mb-6 pb-6 border-b border-gray-200">
            <CountdownTimer duration={3600} />
          </div>

          {/* CTA Section */}
          <div className="space-y-3 md:space-y-3">
            {/* Mobile: Sticky CTA wrapper */}
            <div className="md:contents">
              <Link
                href="/products"
                onClick={handleShopNow}
                className={cn(
                  "block w-full text-center",
                  "px-6 py-4 rounded-lg",
                  "bg-primary text-white",
                  "font-semibold text-base md:text-lg",
                  "hover:bg-primary-600 active:bg-primary-700",
                  "transition-colors duration-200",
                  "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                  "shadow-md hover:shadow-lg",
                  // Mobile: sticky positioning
                  "md:static"
                )}
              >
                Shop Now
              </Link>
            </div>

            <button
              onClick={handleMaybeLater}
              className={cn(
                "block w-full text-center",
                "px-4 py-2 rounded-lg",
                "text-sm text-gray-500 hover:text-secondary",
                "transition-colors duration-200",
                "focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
              )}
            >
              Maybe later
            </button>
          </div>
        </div>
      </div>
    </ModalBackdrop>
  );
}

