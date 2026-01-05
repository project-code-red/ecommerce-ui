"use client";

import { useState, useEffect } from "react";
import { fetchCategoryImage, fetchMultipleCategoryImages, CategoryImageResult } from "@/services/api/categoryImageApi";

/**
 * Hook to fetch category image
 */
export function useCategoryImage(categorySlug: string) {
  const [image, setImage] = useState<CategoryImageResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadImage() {
      try {
        setIsLoading(true);
        setError(null);
        const result = await fetchCategoryImage(categorySlug);
        if (isMounted) {
          setImage(result);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error("Failed to load image"));
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadImage();

    return () => {
      isMounted = false;
    };
  }, [categorySlug]);

  return { image, isLoading, error };
}

/**
 * Hook to fetch multiple category images
 */
export function useMultipleCategoryImages(categorySlugs: string[]) {
  const [images, setImages] = useState<Record<string, CategoryImageResult | null>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadImages() {
      try {
        setIsLoading(true);
        setError(null);
        const results = await fetchMultipleCategoryImages(categorySlugs);
        if (isMounted) {
          setImages(results);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error("Failed to load images"));
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    if (categorySlugs.length > 0) {
      loadImages();
    } else {
      setIsLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, [categorySlugs.join(",")]); // Re-fetch if slugs change

  return { images, isLoading, error };
}

