"use client";

import { Suspense, useMemo, useState, useEffect } from "react";
import { use } from "react";
import Link from "next/link";
import { useProducts } from "@/services/queries/productQueries";
import { ProductGridMinimal } from "@/components/features/product/ProductGridMinimal";
import { FilterSidebar } from "@/components/features/product/FilterSidebar";
import { FilterChips } from "@/components/features/product/FilterChips";
import { Breadcrumb } from "@/components/features/product/Breadcrumb";
import { categories } from "@/mock/categories";
import { Select } from "@/components/ui/Select";
import { useSearchParams } from "next/navigation";
import { useProductFilters } from "@/hooks/useProductFilters";
import { useDebounce } from "@/hooks/useDebounce";
import { Product } from "@/types/product";
import { ArrowUpDown, Filter, X } from "lucide-react";

function SubCategoryContent({ params }: { params: Promise<{ main: string; sub: string }> }) {
  const { main, sub } = use(params);
  const { filters, searchQuery, updateFilters, updateSearch, removeFilter, clearAllFilters } = useProductFilters();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [mobileSortOpen, setMobileSortOpen] = useState(false);
  const searchParams = useSearchParams();
  const [localSearch, setLocalSearch] = useState(searchQuery || "");
  const page = parseInt(searchParams.get("page") || "1");

  const category = categories.find((c) => c.slug === main);
  const subCategory = category?.subCategories?.find((sc) => sc.slug === sub);

  // Sync local search when URL changes
  useEffect(() => {
    setLocalSearch(searchQuery);
  }, [searchQuery]);

  const debouncedSearch = useDebounce(localSearch, 300);

  // Sync local search with URL
  useEffect(() => {
    if (debouncedSearch !== searchQuery) {
      updateSearch(debouncedSearch);
    }
  }, [debouncedSearch, searchQuery, updateSearch]);

  // Fetch all products for client-side filtering
  const { data: allProductsData, isLoading: isLoadingAll } = useProducts(
    {
      category: category?.name,
      subCategory: subCategory?.name,
    },
    1,
    10000
  );

  // Client-side filtering
  const filteredProducts = useMemo(() => {
    if (!allProductsData?.data) return [];

    let filtered: Product[] = allProductsData.data;

    // Filter by subCategory if available (additional client-side filtering)
    if (subCategory?.name) {
      const subCategoryLower = subCategory.name.toLowerCase();
      filtered = filtered.filter((p) => {
        const productSubCategory = p.subCategory?.toLowerCase() || "";
        return (
          productSubCategory === subCategoryLower ||
          productSubCategory.includes(subCategoryLower) ||
          subCategoryLower.includes(productSubCategory) ||
          // Also check product name for subcategory keywords
          p.name.toLowerCase().includes(subCategoryLower)
        );
      });
    }

    // Search filter
    if (debouncedSearch) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
          p.description.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
          p.category.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
          p.subCategory.toLowerCase().includes(debouncedSearch.toLowerCase())
      );
    }

    // Price filter
    if (filters.minPrice) {
      filtered = filtered.filter((p) => p.price >= filters.minPrice!);
    }
    if (filters.maxPrice) {
      filtered = filtered.filter((p) => p.price <= filters.maxPrice!);
    }

    // Size filter
    if (filters.sizes && filters.sizes.length > 0) {
      filtered = filtered.filter((p) =>
        filters.sizes!.some((size) => p.variants.sizes?.includes(size))
      );
    }

    // Color filter
    if (filters.colors && filters.colors.length > 0) {
      filtered = filtered.filter((p) =>
        filters.colors!.some((color) => p.variants.colors?.includes(color))
      );
    }

    // Rating filter
    if (filters.minRating) {
      filtered = filtered.filter((p) => p.rating >= filters.minRating!);
    }

    // Sort
    const sorted = [...filtered];
    switch (filters.sortBy || "popularity") {
      case "price-low":
        sorted.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        sorted.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        sorted.sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return dateB - dateA;
        });
        break;
      case "rating":
        sorted.sort((a, b) => b.rating - a.rating);
        break;
      default:
        sorted.sort((a, b) => b.ratingCount - a.ratingCount);
    }

    return sorted;
  }, [allProductsData, filters, debouncedSearch, subCategory]);

  // Pagination
  const itemsPerPage = 20;
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, page]);

  if (!category || !subCategory) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-4">Category not found</h1>
        <Link href="/">
          <button className="px-4 py-2 bg-primary text-white rounded">Go Home</button>
        </Link>
      </div>
    );
  }

  const sortOptions = [
    { value: "popularity", label: "Popularity" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "newest", label: "New Arrivals" },
    { value: "rating", label: "Highest Rated" },
  ];

  // Breadcrumb items
  const breadcrumbItems = [
    { label: category.name, href: `/categories/${main}` },
    { label: subCategory.name },
  ];

  return (
    <div className="bg-white min-h-screen">
      {/* Breadcrumb */}
      <div className="px-4 sm:px-6 lg:px-8 py-4 border-b border-gray-200">
        <Breadcrumb items={breadcrumbItems} />
      </div>

      {/* Page Header */}
      <div className="px-4 sm:px-6 lg:px-8 py-6 border-b border-gray-200">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">{subCategory.name}</h1>
            <p className="text-sm text-gray-600">
              {filteredProducts.length.toLocaleString()} items
            </p>
          </div>
          <div className="hidden lg:flex items-center gap-2">
            <ArrowUpDown className="h-4 w-4 text-gray-500" />
            <Select
              options={sortOptions}
              value={filters.sortBy || "popularity"}
              onChange={(e) => {
                updateFilters({ ...filters, sortBy: e.target.value as any });
              }}
              className="w-48"
            />
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="px-4 sm:px-6 lg:px-8 py-3 sm:py-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder="Search products..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="flex-1 max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>

      {/* Main Layout: Sidebar + Grid */}
      <div className="flex relative">
        {/* Filter Sidebar - Desktop */}
        <div className="hidden lg:block w-80 flex-shrink-0">
          <FilterSidebar
            filters={filters}
            products={allProductsData?.data || []}
            onFiltersChange={updateFilters}
          />
        </div>

        {/* Mobile Filter Drawer */}
        {mobileFiltersOpen && (
          <div className="lg:hidden fixed inset-0 z-[80]">
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => setMobileFiltersOpen(false)}
            />
            <div className="absolute left-0 top-0 bottom-0 w-80 bg-white shadow-xl overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between z-10">
                <h2 className="text-lg font-bold">Filters</h2>
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg min-w-[44px] min-h-[44px] flex items-center justify-center"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="p-6 pb-24">
                <FilterSidebar
                  filters={filters}
                  products={allProductsData?.data || []}
                  onFiltersChange={(newFilters) => {
                    updateFilters(newFilters);
                    setMobileFiltersOpen(false);
                  }}
                  className="!sticky !top-0 !h-auto !border-0"
                />
              </div>
            </div>
          </div>
        )}

        {/* Product Grid */}
        <div className="flex-1 px-4 sm:px-6 lg:px-8 py-6 pb-24 lg:pb-6">
          {/* Filter Chips */}
          <FilterChips
            filters={filters}
            onRemoveFilter={removeFilter}
            onClearAll={clearAllFilters}
          />

          {/* Products */}
          <ProductGridMinimal
            products={paginatedProducts}
            isLoading={isLoadingAll}
          />

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex justify-center items-center gap-2">
              <button
                onClick={() => {
                  const params = new URLSearchParams(searchParams.toString());
                  params.set("page", Math.max(1, page - 1).toString());
                  window.location.href = `${window.location.pathname}?${params.toString()}`;
                }}
                disabled={page === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              <span className="text-sm text-gray-600">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => {
                  const params = new URLSearchParams(searchParams.toString());
                  params.set("page", Math.min(totalPages, page + 1).toString());
                  window.location.href = `${window.location.pathname}?${params.toString()}`;
                }}
                disabled={page === totalPages}
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Sticky Bottom Bar - Mobile Only: Filter & Sort */}
      <div className={`lg:hidden fixed bottom-0 left-0 right-0 z-[60] bg-white border-t-2 border-gray-200 shadow-[0_-4px_12px_rgba(0,0,0,0.1)] safe-area-inset-bottom transition-transform duration-200 ${mobileFiltersOpen ? 'translate-y-full' : ''}`}>
        <div className="px-4 py-2.5">
          <div className="flex items-center gap-2.5">
            {/* Filter Button */}
            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 text-sm font-semibold bg-primary text-white rounded-lg hover:bg-primary-600 active:scale-[0.98] transition-all duration-200 h-[44px]"
            >
              <Filter className="h-4 w-4" />
              <span>Filters</span>
            </button>

            {/* Sort Button */}
            <button
              onClick={() => setMobileSortOpen(true)}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 text-sm font-semibold bg-white border-2 border-gray-300 text-gray-900 rounded-lg hover:bg-gray-50 hover:border-gray-400 active:scale-[0.98] transition-all duration-200 h-[44px]"
            >
              <ArrowUpDown className="h-4 w-4" />
              <span>Sort</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Sort Modal */}
      {mobileSortOpen && (
        <div className="lg:hidden fixed inset-0 z-[70]">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileSortOpen(false)}
          />
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-2xl max-h-[60vh] overflow-y-auto safe-area-inset-bottom">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between z-10">
              <h2 className="text-lg font-bold">Sort By</h2>
              <button
                onClick={() => setMobileSortOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg min-w-[44px] min-h-[44px] flex items-center justify-center"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-4 pb-6">
              {sortOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    updateFilters({ ...filters, sortBy: option.value as any });
                    setMobileSortOpen(false);
                  }}
                  className={`w-full text-left px-4 py-3 rounded-lg mb-2 transition-all duration-200 min-h-[44px] flex items-center justify-between ${
                    (filters.sortBy || "popularity") === option.value
                      ? "bg-primary/10 text-primary font-semibold border-2 border-primary"
                      : "bg-gray-50 hover:bg-gray-100 border-2 border-transparent"
                  }`}
                >
                  <span className="text-sm">{option.label}</span>
                  {(filters.sortBy || "popularity") === option.value && (
                    <span className="text-primary text-lg">✓</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function SubCategoryPage({ params }: { params: Promise<{ main: string; sub: string }> }) {
  return (
    <Suspense fallback={<div className="px-4 py-8">Loading...</div>}>
      <SubCategoryContent params={params} />
    </Suspense>
  );
}

