"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface OfferStripProps {
  headline: string;
  subtext?: string;
  discountText?: string;
  ctaText?: string;
  ctaLink: string;
  className?: string;
}

export function OfferStrip({
  headline,
  subtext,
  discountText,
  ctaText = "Shop Now",
  ctaLink,
  className,
}: OfferStripProps) {
  return (
    <section
      className={cn(
        "relative w-full py-8 md:py-12 overflow-hidden",
        className
      )}
      style={{
        background: "linear-gradient(90deg, #1A73E8, #111111)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6">
          {/* Content */}
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2">
              {headline}
            </h3>
            {subtext && (
              <p className="text-white/90 text-base md:text-lg mb-2">
                {subtext}
              </p>
            )}
            {discountText && (
              <p className="text-accent text-xl md:text-2xl font-bold">
                {discountText}
              </p>
            )}
          </div>

          {/* CTA Button */}
          <Link href={ctaLink}>
            <Button
              className="bg-white text-primary hover:bg-gray-100 px-6 md:px-8 py-3 text-base md:text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 flex items-center gap-2"
            >
              {ctaText}
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

