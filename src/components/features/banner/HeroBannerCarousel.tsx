"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export interface HeroBanner {
  id: string;
  image: string;
  headline: string;
  subtext: string;
  ctaText?: string;
  ctaLink: string;
  discountBadge?: string;
}

interface HeroBannerCarouselProps {
  banners: HeroBanner[];
  autoSlideInterval?: number;
  className?: string;
}

export function HeroBannerCarousel({
  banners,
  autoSlideInterval = 4500,
  className,
}: HeroBannerCarouselProps) {
  // Show loading state if banners array is empty
  if (banners.length === 0) {
    return (
      <div
        className={cn(
          "relative w-full h-[380px] md:h-[420px] rounded-2xl overflow-hidden shadow-lg bg-gray-200 animate-pulse",
          className
        )}
      />
    );
  }
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const touchStartRef = useRef<number | null>(null);
  const touchEndRef = useRef<number | null>(null);

  const minSwipeDistance = 50;

  // Auto-slide functionality
  useEffect(() => {
    if (banners.length <= 1 || isPaused) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      return;
    }

    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
    }, autoSlideInterval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [banners.length, isPaused, autoSlideInterval]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  // Touch handlers for mobile swipe
  const onTouchStart = (e: React.TouchEvent) => {
    touchEndRef.current = null;
    touchStartRef.current = e.targetTouches[0].clientX;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    touchEndRef.current = e.targetTouches[0].clientX;
  };

  const onTouchEnd = () => {
    if (!touchStartRef.current || !touchEndRef.current) return;

    const distance = touchStartRef.current - touchEndRef.current;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      goToNext();
    }
    if (isRightSwipe) {
      goToPrevious();
    }
  };

  if (banners.length === 0) return null;

  const currentBanner = banners[currentIndex];

  return (
    <div
      className={cn(
        "relative w-full h-[380px] md:h-[420px] rounded-3xl overflow-hidden",
        "shadow-2xl border border-gray-200/50",
        "backdrop-blur-sm",
        className
      )}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Banner Image - Enhanced with better quality and lighting */}
      <div className="absolute inset-0">
        {currentBanner.image ? (
          <Image
            src={currentBanner.image}
            alt={currentBanner.headline}
            fill
            className="object-cover"
            priority={currentIndex === 0}
            sizes="100vw"
            quality={95} // High quality for 4K-like clarity
            loading={currentIndex === 0 ? "eager" : "lazy"}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/20 via-primary/10 to-secondary/20" />
        )}
        {/* Enhanced Gradient Overlay - Better contrast and depth */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, rgba(26,115,232,0.75) 0%, rgba(26,115,232,0.60) 30%, rgba(17,17,17,0.80) 70%, rgba(17,17,17,0.90) 100%)",
          }}
        />
        {/* Additional subtle vignette for depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
      </div>

      {/* Content - Enhanced typography and spacing */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-4 sm:px-8 md:px-12 text-center text-white">
        {/* Discount Badge - Enhanced with better shadow and spacing */}
        {currentBanner.discountBadge && (
          <div className="mb-6 animate-fade-in">
            <span className="inline-block px-5 py-2.5 bg-accent text-white text-sm font-bold rounded-full shadow-2xl backdrop-blur-sm border border-accent/20">
              {currentBanner.discountBadge}
            </span>
          </div>
        )}

        {/* Headline - Enhanced with better typography and contrast */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black mb-5 drop-shadow-2xl tracking-tight">
          <span className="bg-gradient-to-r from-white via-white to-white/90 bg-clip-text text-transparent">
            {currentBanner.headline}
          </span>
        </h1>

        {/* Subtext - Enhanced readability */}
        <p className="text-lg md:text-xl lg:text-2xl mb-8 opacity-95 max-w-3xl font-medium leading-relaxed drop-shadow-lg">
          {currentBanner.subtext}
        </p>

        {/* CTA Button - Enhanced with premium styling */}
        <Link href={currentBanner.ctaLink}>
          <Button
            className="bg-primary hover:bg-primary-600 text-white px-10 py-4 text-lg font-bold rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 border-2 border-primary/20 backdrop-blur-sm"
          >
            {currentBanner.ctaText || "Shop Now"}
          </Button>
        </Link>
      </div>

      {/* Navigation Arrows - Enhanced with better visibility */}
      {banners.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-white/25 hover:bg-white/40 backdrop-blur-md rounded-full text-white transition-all duration-300 hover:scale-110 shadow-xl border border-white/20"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-white/25 hover:bg-white/40 backdrop-blur-md rounded-full text-white transition-all duration-300 hover:scale-110 shadow-xl border border-white/20"
            aria-label="Next slide"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </>
      )}

      {/* Dot Indicators */}
      {banners.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={cn(
                "h-2 rounded-full transition-all duration-300",
                index === currentIndex
                  ? "w-8 bg-primary"
                  : "w-2 bg-white/50 hover:bg-white/70"
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

