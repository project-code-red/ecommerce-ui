"use client";

import { X } from "lucide-react";
import { ProductFilters } from "@/types/product";
import { formatCurrency } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface FilterChipsProps {
  filters: ProductFilters;
  onRemoveFilter: (key: keyof ProductFilters, value?: string | number) => void;
  onClearAll: () => void;
  className?: string;
}

export function FilterChips({
  filters,
  onRemoveFilter,
  onClearAll,
  className,
}: FilterChipsProps) {
  const activeFilters: Array<{ key: keyof ProductFilters; label: string; value?: string | number }> = [];

  // Price range
  if (filters.minPrice || filters.maxPrice) {
    const min = filters.minPrice ? formatCurrency(filters.minPrice) : "0";
    const max = filters.maxPrice ? formatCurrency(filters.maxPrice) : "∞";
    activeFilters.push({
      key: "minPrice",
      label: `Price: ${min} - ${max}`,
    });
  }

  // Sizes
  if (filters.sizes && filters.sizes.length > 0) {
    filters.sizes.forEach((size) => {
      activeFilters.push({ key: "sizes", label: `Size: ${size}`, value: size });
    });
  }

  // Colors
  if (filters.colors && filters.colors.length > 0) {
    filters.colors.forEach((color) => {
      activeFilters.push({ key: "colors", label: `Color: ${color}`, value: color });
    });
  }

  // Brand
  if (filters.category) {
    activeFilters.push({ key: "category", label: filters.category });
  }

  // Subcategory
  if (filters.subCategory) {
    activeFilters.push({ key: "subCategory", label: filters.subCategory });
  }

  // Rating
  if (filters.minRating) {
    activeFilters.push({ key: "minRating", label: `Rating: ${filters.minRating}+` });
  }

  if (activeFilters.length === 0) return null;

  return (
    <div className={cn("flex flex-wrap items-center gap-2 mb-4", className)}>
      <span className="text-sm text-gray-600 font-medium">Filters:</span>
      {activeFilters.map((filter, index) => (
        <button
          key={`${filter.key}-${index}`}
          onClick={() => onRemoveFilter(filter.key, filter.value)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm rounded-full transition-colors group"
        >
          <span>{filter.label}</span>
          <X className="h-3.5 w-3.5 group-hover:text-gray-900" />
        </button>
      ))}
      {activeFilters.length > 1 && (
        <button
          onClick={onClearAll}
          className="text-sm text-primary hover:text-primary/80 font-medium transition-colors"
        >
          Clear All
        </button>
      )}
    </div>
  );
}

