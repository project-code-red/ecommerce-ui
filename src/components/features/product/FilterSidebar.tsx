"use client";

import { useState, useMemo } from "react";
import { ChevronDown, ChevronUp, Search, X } from "lucide-react";
import { ProductFilters } from "@/types/product";
import { Product } from "@/types/product";
import { formatCurrency } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface FilterSidebarProps {
  filters: ProductFilters;
  products: Product[];
  onFiltersChange: (filters: ProductFilters) => void;
  className?: string;
}

interface FilterSection {
  id: string;
  title: string;
  isOpen: boolean;
}

export function FilterSidebar({
  filters,
  products,
  onFiltersChange,
  className,
}: FilterSidebarProps) {
  const [openSections, setOpenSections] = useState<Set<string>>(
    new Set(["gender", "category", "price", "size", "brand"])
  );
  const [brandSearch, setBrandSearch] = useState("");
  const [colorSearch, setColorSearch] = useState("");

  const toggleSection = (sectionId: string) => {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(sectionId)) {
        next.delete(sectionId);
      } else {
        next.add(sectionId);
      }
      return next;
    });
  };

  // Extract unique values from products
  const availableBrands = useMemo(() => {
    const brands = new Set<string>();
    products.forEach((p) => {
      if (p.category) brands.add(p.category);
    });
    return Array.from(brands).sort();
  }, [products]);

  const availableSizes = useMemo(() => {
    const sizes = new Set<string>();
    products.forEach((p) => {
      p.variants.sizes?.forEach((s) => sizes.add(s));
    });
    return Array.from(sizes).sort();
  }, [products]);

  const availableColors = useMemo(() => {
    const colors = new Set<string>();
    products.forEach((p) => {
      p.variants.colors?.forEach((c) => colors.add(c));
    });
    return Array.from(colors).sort();
  }, [products]);

  const priceRange = useMemo(() => {
    if (products.length === 0) return { min: 0, max: 10000 };
    const prices = products.map((p) => p.price);
    return {
      min: Math.min(...prices),
      max: Math.max(...prices),
    };
  }, [products]);

  // Filter brands and colors by search
  const filteredBrands = useMemo(() => {
    if (!brandSearch) return availableBrands;
    return availableBrands.filter((brand) =>
      brand.toLowerCase().includes(brandSearch.toLowerCase())
    );
  }, [availableBrands, brandSearch]);

  const filteredColors = useMemo(() => {
    if (!colorSearch) return availableColors;
    return availableColors.filter((color) =>
      color.toLowerCase().includes(colorSearch.toLowerCase())
    );
  }, [availableColors, colorSearch]);

  const handleMultiSelect = (
    key: "sizes" | "colors",
    value: string
  ) => {
    const current = filters[key] || [];
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    onFiltersChange({ ...filters, [key]: updated.length > 0 ? updated : undefined });
  };

  const handlePriceChange = (type: "min" | "max", value: number) => {
    onFiltersChange({
      ...filters,
      [type === "min" ? "minPrice" : "maxPrice"]: value,
    });
  };

  const handlePresetPrice = (preset: { min?: number; max?: number }) => {
    onFiltersChange({
      ...filters,
      minPrice: preset.min,
      maxPrice: preset.max,
    });
  };

  const FilterSection = ({
    id,
    title,
    children,
  }: {
    id: string;
    title: string;
    children: React.ReactNode;
  }) => {
    const isOpen = openSections.has(id);
    return (
      <div className="border-b border-gray-200 last:border-0">
        <button
          onClick={() => toggleSection(id)}
          className="w-full flex items-center justify-between py-4 text-left"
        >
          <h3 className="font-semibold text-gray-900">{title}</h3>
          {isOpen ? (
            <ChevronUp className="h-4 w-4 text-gray-500" />
          ) : (
            <ChevronDown className="h-4 w-4 text-gray-500" />
          )}
        </button>
        {isOpen && <div className="pb-4">{children}</div>}
      </div>
    );
  };

  return (
    <aside
      className={cn(
        "sticky top-[56px] md:top-[100px] h-[calc(100vh-56px)] md:h-[calc(100vh-100px)] overflow-y-auto bg-white",
        !className?.includes("border-0") && "border-r border-gray-200",
        className
      )}
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-gray-900">Filters</h2>
          <button
            onClick={() => onFiltersChange({})}
            className="text-sm text-primary hover:text-primary/80 font-medium"
          >
            Clear All
          </button>
        </div>

        <div className="space-y-0">
          {/* Gender */}
          <FilterSection id="gender" title="Gender">
            <div className="space-y-2">
              {["Men", "Women", "Kids", "Unisex"].map((gender) => (
                <label
                  key={gender}
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={filters.category === gender}
                    onChange={() =>
                      onFiltersChange({
                        ...filters,
                        category: filters.category === gender ? undefined : gender,
                      })
                    }
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span className="text-sm text-gray-700">{gender}</span>
                </label>
              ))}
            </div>
          </FilterSection>

          {/* Category */}
          <FilterSection id="category" title="Category">
            <div className="space-y-2">
              {["Clothing", "Footwear", "Accessories", "Beauty"].map((cat) => (
                <label
                  key={cat}
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={filters.subCategory === cat}
                    onChange={() =>
                      onFiltersChange({
                        ...filters,
                        subCategory: filters.subCategory === cat ? undefined : cat,
                      })
                    }
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span className="text-sm text-gray-700">{cat}</span>
                </label>
              ))}
            </div>
          </FilterSection>

          {/* Brand - Searchable */}
          <FilterSection id="brand" title="Brand">
            <div className="space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search brand..."
                  value={brandSearch}
                  onChange={(e) => setBrandSearch(e.target.value)}
                  className="w-full pl-10 pr-8 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                {brandSearch && (
                  <button
                    onClick={() => setBrandSearch("")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    <X className="h-4 w-4 text-gray-400" />
                  </button>
                )}
              </div>
              <div className="max-h-48 overflow-y-auto space-y-2">
                {filteredBrands.length > 0 ? (
                  filteredBrands.map((brand) => (
                    <label
                      key={brand}
                      className="flex items-center space-x-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={filters.category === brand}
                        onChange={() =>
                          onFiltersChange({
                            ...filters,
                            category: filters.category === brand ? undefined : brand,
                          })
                        }
                        className="rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <span className="text-sm text-gray-700">{brand}</span>
                    </label>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No brands found</p>
                )}
              </div>
            </div>
          </FilterSection>

          {/* Price - Slider + Presets */}
          <FilterSection id="price" title="Price">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.minPrice || ""}
                    onChange={(e) =>
                      handlePriceChange("min", parseFloat(e.target.value) || 0)
                    }
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <span className="text-gray-500">-</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.maxPrice || ""}
                    onChange={(e) =>
                      handlePriceChange("max", parseFloat(e.target.value) || 0)
                    }
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-gray-500 mb-2">Quick Select:</p>
                {[
                  { label: "Under ₹500", max: 500 },
                  { label: "₹500 - ₹1,000", min: 500, max: 1000 },
                  { label: "₹1,000 - ₹2,500", min: 1000, max: 2500 },
                  { label: "₹2,500 - ₹5,000", min: 2500, max: 5000 },
                  { label: "Above ₹5,000", min: 5000 },
                ].map((preset) => (
                  <button
                    key={preset.label}
                    onClick={() => handlePresetPrice(preset)}
                    className="w-full text-left px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 rounded transition-colors"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          </FilterSection>

          {/* Discount */}
          <FilterSection id="discount" title="Discount">
            <div className="space-y-2">
              {[
                { label: "10% and above", min: 10 },
                { label: "20% and above", min: 20 },
                { label: "30% and above", min: 30 },
                { label: "40% and above", min: 40 },
                { label: "50% and above", min: 50 },
              ].map((discount) => (
                <label
                  key={discount.label}
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span className="text-sm text-gray-700">{discount.label}</span>
                </label>
              ))}
            </div>
          </FilterSection>

          {/* Product Label */}
          <FilterSection id="label" title="Product Label">
            <div className="space-y-2">
              {["Bestseller", "Latest Style", "New Arrival"].map((label) => (
                <label
                  key={label}
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span className="text-sm text-gray-700">{label}</span>
                </label>
              ))}
            </div>
          </FilterSection>

          {/* Size - Multi-select */}
          <FilterSection id="size" title="Size">
            <div className="space-y-2">
              {availableSizes.map((size) => (
                <label
                  key={size}
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={filters.sizes?.includes(size) || false}
                    onChange={() => handleMultiSelect("sizes", size)}
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span className="text-sm text-gray-700">{size}</span>
                </label>
              ))}
            </div>
          </FilterSection>

          {/* Color - Swatches + Search */}
          <FilterSection id="color" title="Color">
            <div className="space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search color..."
                  value={colorSearch}
                  onChange={(e) => setColorSearch(e.target.value)}
                  className="w-full pl-10 pr-8 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                {colorSearch && (
                  <button
                    onClick={() => setColorSearch("")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    <X className="h-4 w-4 text-gray-400" />
                  </button>
                )}
              </div>
              <div className="max-h-48 overflow-y-auto space-y-2">
                {filteredColors.length > 0 ? (
                  filteredColors.map((color) => {
                    const colorMap: Record<string, string> = {
                      red: "#EF4444",
                      blue: "#3B82F6",
                      green: "#10B981",
                      black: "#000000",
                      white: "#FFFFFF",
                      yellow: "#FBBF24",
                      pink: "#EC4899",
                      purple: "#A855F7",
                      orange: "#F97316",
                      gray: "#6B7280",
                    };
                    const colorHex = colorMap[color.toLowerCase()] || "#6B7280";
                    return (
                      <label
                        key={color}
                        className="flex items-center space-x-2 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={filters.colors?.includes(color) || false}
                          onChange={() => handleMultiSelect("colors", color)}
                          className="rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <div
                          className="w-4 h-4 rounded-full border border-gray-300"
                          style={{ backgroundColor: colorHex }}
                        />
                        <span className="text-sm text-gray-700">{color}</span>
                      </label>
                    );
                  })
                ) : (
                  <p className="text-sm text-gray-500">No colors found</p>
                )}
              </div>
            </div>
          </FilterSection>

          {/* Additional Filters */}
          <FilterSection id="material" title="Material">
            <div className="space-y-2">
              {["Cotton", "Polyester", "Silk", "Denim", "Wool"].map((material) => (
                <label
                  key={material}
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span className="text-sm text-gray-700">{material}</span>
                </label>
              ))}
            </div>
          </FilterSection>

          <FilterSection id="sleeve" title="Sleeve Type">
            <div className="space-y-2">
              {["Full Sleeve", "Half Sleeve", "Sleeveless", "3/4 Sleeve"].map((sleeve) => (
                <label
                  key={sleeve}
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span className="text-sm text-gray-700">{sleeve}</span>
                </label>
              ))}
            </div>
          </FilterSection>

          <FilterSection id="pattern" title="Pattern">
            <div className="space-y-2">
              {["Solid", "Striped", "Printed", "Checked", "Floral"].map((pattern) => (
                <label
                  key={pattern}
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span className="text-sm text-gray-700">{pattern}</span>
                </label>
              ))}
            </div>
          </FilterSection>

          <FilterSection id="fit" title="Fit">
            <div className="space-y-2">
              {["Regular", "Slim", "Loose", "Oversized"].map((fit) => (
                <label
                  key={fit}
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span className="text-sm text-gray-700">{fit}</span>
                </label>
              ))}
            </div>
          </FilterSection>

          <FilterSection id="occasion" title="Occasion">
            <div className="space-y-2">
              {["Casual", "Formal", "Party", "Sports", "Wedding"].map((occasion) => (
                <label
                  key={occasion}
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span className="text-sm text-gray-700">{occasion}</span>
                </label>
              ))}
            </div>
          </FilterSection>
        </div>
      </div>
    </aside>
  );
}

