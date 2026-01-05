"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useMemo, useCallback } from "react";
import { ProductFilters } from "@/types/product";

export function useProductFilters() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const filters = useMemo<ProductFilters>(() => {
    const params: ProductFilters = {};

    // Category filters
    if (searchParams.get("category")) {
      params.category = searchParams.get("category") || undefined;
    }
    if (searchParams.get("subCategory")) {
      params.subCategory = searchParams.get("subCategory") || undefined;
    }
    if (searchParams.get("subSubCategory")) {
      params.subSubCategory = searchParams.get("subSubCategory") || undefined;
    }

    // Price
    if (searchParams.get("minPrice")) {
      params.minPrice = parseFloat(searchParams.get("minPrice") || "0");
    }
    if (searchParams.get("maxPrice")) {
      params.maxPrice = parseFloat(searchParams.get("maxPrice") || "0");
    }

    // Sizes
    const sizes = searchParams.get("sizes");
    if (sizes) {
      params.sizes = sizes.split(",");
    }

    // Colors
    const colors = searchParams.get("colors");
    if (colors) {
      params.colors = colors.split(",");
    }

    // Rating
    if (searchParams.get("minRating")) {
      params.minRating = parseFloat(searchParams.get("minRating") || "0");
    }

    // Sort
    const sortBy = searchParams.get("sortBy");
    if (sortBy && ["popularity", "price-low", "price-high", "newest", "rating"].includes(sortBy)) {
      params.sortBy = sortBy as ProductFilters["sortBy"];
    }

    return params;
  }, [searchParams]);

  const searchQuery = useMemo(() => {
    return searchParams.get("search") || "";
  }, [searchParams]);

  const updateFilters = useCallback(
    (newFilters: ProductFilters) => {
      const params = new URLSearchParams(searchParams.toString());

      // Update category filters
      if (newFilters.category) {
        params.set("category", newFilters.category);
      } else {
        params.delete("category");
      }

      if (newFilters.subCategory) {
        params.set("subCategory", newFilters.subCategory);
      } else {
        params.delete("subCategory");
      }

      if (newFilters.subSubCategory) {
        params.set("subSubCategory", newFilters.subSubCategory);
      } else {
        params.delete("subSubCategory");
      }

      // Update price
      if (newFilters.minPrice) {
        params.set("minPrice", newFilters.minPrice.toString());
      } else {
        params.delete("minPrice");
      }

      if (newFilters.maxPrice) {
        params.set("maxPrice", newFilters.maxPrice.toString());
      } else {
        params.delete("maxPrice");
      }

      // Update sizes
      if (newFilters.sizes && newFilters.sizes.length > 0) {
        params.set("sizes", newFilters.sizes.join(","));
      } else {
        params.delete("sizes");
      }

      // Update colors
      if (newFilters.colors && newFilters.colors.length > 0) {
        params.set("colors", newFilters.colors.join(","));
      } else {
        params.delete("colors");
      }

      // Update rating
      if (newFilters.minRating) {
        params.set("minRating", newFilters.minRating.toString());
      } else {
        params.delete("minRating");
      }

      // Update sort
      if (newFilters.sortBy) {
        params.set("sortBy", newFilters.sortBy);
      } else {
        params.delete("sortBy");
      }

      // Reset page when filters change
      params.delete("page");

      router.push(`${pathname}?${params.toString()}`);
    },
    [searchParams, router, pathname]
  );

  const removeFilter = useCallback(
    (key: keyof ProductFilters, value?: string | number) => {
      const updatedFilters = { ...filters };

      if (key === "sizes" && value) {
        updatedFilters.sizes = filters.sizes?.filter((s) => s !== value);
        if (updatedFilters.sizes?.length === 0) {
          delete updatedFilters.sizes;
        }
      } else if (key === "colors" && value) {
        updatedFilters.colors = filters.colors?.filter((c) => c !== value);
        if (updatedFilters.colors?.length === 0) {
          delete updatedFilters.colors;
        }
      } else {
        delete updatedFilters[key];
      }

      updateFilters(updatedFilters);
    },
    [filters, updateFilters]
  );

  const clearAllFilters = useCallback(() => {
    updateFilters({});
  }, [updateFilters]);

  const updateSearch = useCallback(
    (query: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (query) {
        params.set("search", query);
      } else {
        params.delete("search");
      }
      params.delete("page");
      router.push(`${pathname}?${params.toString()}`);
    },
    [searchParams, router, pathname]
  );

  return {
    filters,
    searchQuery,
    updateFilters,
    updateSearch,
    removeFilter,
    clearAllFilters,
  };
}

