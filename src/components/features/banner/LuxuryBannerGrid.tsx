"use client";

import { LuxuryBannerCard, LuxuryBannerProps } from "./LuxuryBannerCard";
import { cn } from "@/lib/utils";

interface LuxuryBannerGridProps {
  banners: LuxuryBannerProps[];
  layout?: "editorial" | "carousel";
  className?: string;
}

export function LuxuryBannerGrid({
  banners,
  layout = "editorial",
  className,
}: LuxuryBannerGridProps) {
  if (layout === "carousel") {
    return (
      <div className={cn("relative w-full overflow-hidden", className)}>
        {/* Carousel implementation can be added here if needed */}
        <div className="flex gap-4 md:gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide">
          {banners.map((banner, index) => (
            <div key={index} className="flex-shrink-0 w-full md:w-1/2 lg:w-1/3 snap-start">
              <LuxuryBannerCard {...banner} size="large" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Editorial Layout (Option A - Recommended)
  // Left: One large hero banner
  // Right: 2 stacked medium banners
  if (banners.length >= 3) {
    const [heroBanner, ...otherBanners] = banners;

    return (
      <div className={cn("grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6", className)}>
        {/* Large Hero Banner - Left */}
        <div className="lg:col-span-2">
          <LuxuryBannerCard {...heroBanner} size="large" />
        </div>

        {/* Stacked Medium Banners - Right */}
        <div className="flex flex-col gap-4 md:gap-6">
          {otherBanners.slice(0, 2).map((banner, index) => (
            <LuxuryBannerCard key={index} {...banner} size="medium" />
          ))}
        </div>
      </div>
    );
  }

  // Fallback: Single column for fewer banners
  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6", className)}>
      {banners.map((banner, index) => (
        <LuxuryBannerCard
          key={index}
          {...banner}
          size={index === 0 ? "large" : "medium"}
        />
      ))}
    </div>
  );
}

