"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface LuxuryBannerProps {
  title: string;
  subtitle?: string;
  tagline?: string;
  image: string;
  link: string;
  ctaText?: string;
  gradient?: "burgundy" | "wine" | "charcoal" | "brown" | "custom";
  customGradient?: string;
  size?: "large" | "medium" | "small";
  className?: string;
}

const gradientStyles = {
  burgundy: "bg-gradient-to-br from-[#722F37] via-[#5A1F28] to-[#3D1419]",
  wine: "bg-gradient-to-br from-[#6B2C3E] via-[#4A1A2A] to-[#2D0F1A]",
  charcoal: "bg-gradient-to-br from-gray-700 via-gray-800 to-secondary",
  brown: "bg-gradient-to-br from-[#4A3A2A] via-[#3A2A1A] to-[#2A1A0F]",
  custom: "",
};

export function LuxuryBannerCard({
  title,
  subtitle,
  tagline,
  image,
  link,
  ctaText = "Shop Now →",
  gradient = "charcoal",
  customGradient,
  size = "medium",
  className,
}: LuxuryBannerProps) {
  const sizeClasses = {
    large: "h-[600px] md:h-[700px]",
    medium: "h-[400px] md:h-[500px]",
    small: "h-[300px] md:h-[400px]",
  };

  const titleSizeClasses = {
    large: "text-6xl md:text-8xl lg:text-9xl",
    medium: "text-4xl md:text-6xl lg:text-7xl",
    small: "text-3xl md:text-5xl lg:text-6xl",
  };

  const gradientClass = gradient === "custom" && customGradient 
    ? customGradient 
    : gradientStyles[gradient];

  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, []);

  return (
    <Link
      ref={elementRef}
      href={link}
      className={cn(
        "group relative block overflow-hidden cursor-pointer transition-opacity duration-1000",
        sizeClasses[size],
        isVisible ? "opacity-100" : "opacity-0",
        className
      )}
      style={{
        transform: isVisible ? "translateY(0)" : "translateY(30px)",
        transition: "opacity 0.8s ease-out, transform 0.8s ease-out",
      }}
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={size === "large"}
        />
        
        {/* Vignette Overlay - Soft edges with blur fade */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-transparent to-black/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-black/40" />
        
        {/* Dark Gradient Background Overlay */}
        <div className={cn("absolute inset-0 opacity-80", gradientClass)} />
        
        {/* Additional Vignette Blur Effect */}
        <div className="absolute inset-0 backdrop-blur-[1px] opacity-30" />
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 h-full flex flex-col justify-end p-6 md:p-8 lg:p-12">
        <div className="space-y-3 md:space-y-4 lg:space-y-6 max-w-2xl">
          {/* Tagline - Small, Elegant */}
          {tagline && (
            <p className="text-xs md:text-sm uppercase tracking-[0.2em] text-white/80 font-light">
              {tagline}
            </p>
          )}

          {/* Title - Large, Editorial, Uppercase */}
          <h2
            className={cn(
              "font-serif font-bold uppercase tracking-tight leading-[0.9] text-white",
              titleSizeClasses[size]
            )}
            style={{
              fontFamily: "var(--font-playfair), var(--font-cinzel), 'Georgia', serif",
              textShadow: "0 2px 20px rgba(0,0,0,0.5), 0 4px 40px rgba(0,0,0,0.3)",
            }}
          >
            {title}
          </h2>

          {/* Subtitle - Medium, Refined */}
          {subtitle && (
            <p className="text-base md:text-lg lg:text-xl text-white/90 font-light max-w-md">
              {subtitle}
            </p>
          )}

          {/* CTA Button - Elegant Arrow Animation */}
          <div className="pt-2 md:pt-4">
            <div className="inline-flex items-center gap-2 px-6 py-3 md:px-8 md:py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-sm hover:bg-white/20 transition-all duration-300 group-hover:translate-x-2">
              <span className="text-sm md:text-base font-medium text-white uppercase tracking-wider">
                {ctaText.replace(" →", "")}
              </span>
              <ArrowRight className="h-4 w-4 md:h-5 md:w-5 text-white transition-transform duration-300 group-hover:translate-x-1" />
            </div>
          </div>
        </div>
      </div>

      {/* Hover Shadow Elevation */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div className="absolute inset-0 shadow-2xl" style={{
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05)",
        }} />
      </div>
    </Link>
  );
}

