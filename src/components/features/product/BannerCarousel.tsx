"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Banner } from "@/types/banner";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface BannerCarouselProps {
  banners: Banner[];
  autoSlideInterval?: number;
}

export function BannerCarousel({
  banners,
  autoSlideInterval = 5000,
}: BannerCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const activeBanners = banners
    .filter((b) => b.isActive)
    .sort((a, b) => a.order - b.order);

  if (activeBanners.length === 0) return null;

  const resetAutoSlide = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    // Auto-slide will restart via useEffect
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    resetAutoSlide();
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? activeBanners.length - 1 : prev - 1
    );
    resetAutoSlide();
  };

  const goToNext = () => {
    setCurrentIndex((prev) =>
      prev === activeBanners.length - 1 ? 0 : prev + 1
    );
    resetAutoSlide();
  };

  // Auto-play functionality
  useEffect(() => {
    if (activeBanners.length <= 1 || isPaused) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      return;
    }

    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) =>
        prev === activeBanners.length - 1 ? 0 : prev + 1
      );
    }, autoSlideInterval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [activeBanners.length, isPaused, autoSlideInterval]);

  const currentBanner = activeBanners[currentIndex];

  return (
    <div
      className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Banner Image with Mobile Responsive Cropping */}
      <Link href={currentBanner.link || "/products"} className="block h-full">
        <div className="absolute inset-0">
          <Image
            src={currentBanner.image}
            alt={currentBanner.title}
            fill
            className="object-cover object-center md:object-cover"
            priority={currentIndex === 0}
            sizes="100vw"
          />
          {/* Gradient Overlay for Readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/20" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/30" />
        </div>
      </Link>

      {/* Banner Content with Large Bold Typography */}
      <div className="relative z-10 h-full flex items-center">
        <div className="px-4 sm:px-6 lg:px-8 xl:px-12 w-full">
          <div className="max-w-3xl">
            <div className="text-white space-y-4 md:space-y-6">
              {/* Prominent Discount Text */}
              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-tight tracking-tight">
                UP TO 75% OFF
              </h1>
              {currentBanner.title && (
                <p className="text-xl sm:text-2xl md:text-3xl font-semibold text-white/90">
                  {currentBanner.title}
                </p>
              )}
              {currentBanner.link && (
                <div className="pt-2">
                  <Link href={currentBanner.link}>
                    <Button
                      size="lg"
                      className="text-base md:text-lg px-8 py-6 font-semibold shadow-lg hover:shadow-xl transition-all"
                    >
                      {currentBanner.linkText || "Shop Now"}
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Arrows - Always Visible */}
      {activeBanners.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              goToPrevious();
            }}
            className="absolute left-4 md:left-6 top-1/2 transform -translate-y-1/2 z-20 bg-white/90 hover:bg-white backdrop-blur-sm rounded-full p-2.5 md:p-3 shadow-lg hover:shadow-xl transition-all"
            aria-label="Previous banner"
          >
            <ChevronLeft className="h-5 w-5 md:h-6 md:w-6 text-gray-900" />
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              goToNext();
            }}
            className="absolute right-4 md:right-6 top-1/2 transform -translate-y-1/2 z-20 bg-white/90 hover:bg-white backdrop-blur-sm rounded-full p-2.5 md:p-3 shadow-lg hover:shadow-xl transition-all"
            aria-label="Next banner"
          >
            <ChevronRight className="h-5 w-5 md:h-6 md:w-6 text-gray-900" />
          </button>
        </>
      )}

      {/* Minimal Pagination Dots */}
      {activeBanners.length > 1 && (
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20 flex items-center space-x-2">
          {activeBanners.map((_, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                goToSlide(index);
              }}
              className={cn(
                "rounded-full transition-all duration-300",
                index === currentIndex
                  ? "w-8 h-2 bg-white shadow-md"
                  : "w-2 h-2 bg-white/50 hover:bg-white/75"
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

