"use client";

import { useState, useEffect } from "react";
import { HeroBanner } from "@/components/features/banner/HeroBannerCarousel";
import { heroBannersConfig, bannerCategoryMap } from "@/mock/heroBanners";
import { fetchBannerImage, fetchCompositeBannerImage } from "@/services/api/categoryImageApi";

/**
 * Hook to fetch hero banners with DummyJSON product images
 * Enhanced with composite category support for better image selection
 */
export function useHeroBanners() {
  const [banners, setBanners] = useState<HeroBanner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadBanners() {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch images for each banner in parallel
        const bannerPromises = heroBannersConfig.map(async (config) => {
          const categories = bannerCategoryMap[config.id];
          if (!categories || categories.length === 0) {
            // Fallback if no category mapping
            return {
              ...config,
              image: "",
            };
          }

          // If multiple categories, use composite fetch; otherwise single category
          const imageData = categories.length > 1
            ? await fetchCompositeBannerImage(categories)
            : await fetchBannerImage(categories[0]);

          return {
            ...config,
            image: imageData?.image || "",
          };
        });

        const loadedBanners = await Promise.all(bannerPromises);

        if (isMounted) {
          setBanners(loadedBanners);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error("Failed to load banners"));
          // Set fallback banners on error
          setBanners(
            heroBannersConfig.map((config) => ({
              ...config,
              image: "",
            }))
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadBanners();

    return () => {
      isMounted = false;
    };
  }, []);

  return { banners, isLoading, error };
}

