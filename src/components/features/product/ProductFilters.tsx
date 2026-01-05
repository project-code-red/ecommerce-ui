"use client";

import { useState } from "react";
import { ProductFilters as ProductFiltersType } from "@/types/product";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { formatCurrency } from "@/lib/utils";

interface ProductFiltersProps {
  filters: ProductFiltersType;
  onFiltersChange: (filters: ProductFiltersType) => void;
  availableSizes?: string[];
  availableColors?: string[];
}

export function ProductFilters({
  filters,
  onFiltersChange,
  availableSizes = [],
  availableColors = [],
}: ProductFiltersProps) {
  const [minPrice, setMinPrice] = useState(filters.minPrice?.toString() || "");
  const [maxPrice, setMaxPrice] = useState(filters.maxPrice?.toString() || "");
  const [selectedSizes, setSelectedSizes] = useState<string[]>(filters.sizes || []);
  const [selectedColors, setSelectedColors] = useState<string[]>(filters.colors || []);
  const [minRating, setMinRating] = useState(filters.minRating?.toString() || "");

  const handleSizeToggle = (size: string) => {
    const updated = selectedSizes.includes(size)
      ? selectedSizes.filter((s) => s !== size)
      : [...selectedSizes, size];
    setSelectedSizes(updated);
    onFiltersChange({ ...filters, sizes: updated.length > 0 ? updated : undefined });
  };

  const handleColorToggle = (color: string) => {
    const updated = selectedColors.includes(color)
      ? selectedColors.filter((c) => c !== color)
      : [...selectedColors, color];
    setSelectedColors(updated);
    onFiltersChange({ ...filters, colors: updated.length > 0 ? updated : undefined });
  };

  const handlePriceApply = () => {
    onFiltersChange({
      ...filters,
      minPrice: minPrice ? parseFloat(minPrice) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
    });
  };

  const handleRatingChange = (rating: string) => {
    setMinRating(rating);
    onFiltersChange({
      ...filters,
      minRating: rating ? parseFloat(rating) : undefined,
    });
  };

  const handleClearFilters = () => {
    setMinPrice("");
    setMaxPrice("");
    setSelectedSizes([]);
    setSelectedColors([]);
    setMinRating("");
    onFiltersChange({});
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Filters</h3>
        <Button variant="ghost" size="sm" onClick={handleClearFilters}>
          Clear All
        </Button>
      </div>

      {/* Price Range */}
      <div>
        <h4 className="font-medium mb-3">Price Range</h4>
        <div className="space-y-2">
          <Input
            type="number"
            placeholder="Min Price"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
          />
          <Input
            type="number"
            placeholder="Max Price"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
          <Button variant="outline" size="sm" className="w-full" onClick={handlePriceApply}>
            Apply
          </Button>
        </div>
      </div>

      {/* Sizes */}
      {availableSizes.length > 0 && (
        <div>
          <h4 className="font-medium mb-3">Size</h4>
          <div className="flex flex-wrap gap-2">
            {availableSizes.map((size) => (
              <button
                key={size}
                onClick={() => handleSizeToggle(size)}
                className={`px-3 py-1 rounded border text-sm transition-colors ${
                  selectedSizes.includes(size)
                    ? "bg-primary text-white border-primary"
                    : "bg-white border-gray-300 hover:border-primary"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Colors */}
      {availableColors.length > 0 && (
        <div>
          <h4 className="font-medium mb-3">Color</h4>
          <div className="flex flex-wrap gap-2">
            {availableColors.map((color) => (
              <button
                key={color}
                onClick={() => handleColorToggle(color)}
                className={`px-3 py-1 rounded border text-sm transition-colors ${
                  selectedColors.includes(color)
                    ? "bg-primary text-white border-primary"
                    : "bg-white border-gray-300 hover:border-primary"
                }`}
              >
                {color}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Rating */}
      <div>
        <h4 className="font-medium mb-3">Minimum Rating</h4>
        <div className="space-y-2">
          {[4, 3, 2, 1].map((rating) => (
            <label key={rating} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="rating"
                value={rating}
                checked={minRating === rating.toString()}
                onChange={(e) => handleRatingChange(e.target.value)}
                className="rounded"
              />
              <span className="text-sm">
                {rating}+ ⭐
              </span>
            </label>
          ))}
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              name="rating"
              value=""
              checked={minRating === ""}
              onChange={() => handleRatingChange("")}
              className="rounded"
            />
            <span className="text-sm">All Ratings</span>
          </label>
        </div>
      </div>
    </div>
  );
}

