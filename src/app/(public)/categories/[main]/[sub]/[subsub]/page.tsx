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

function SubSubCategoryContent({ params }: { params: Promise<{ main: string; sub: string; subsub: string }> }) {
  const { main, sub, subsub } = use(params);
  const { filters, searchQuery, updateFilters, updateSearch, removeFilter, clearAllFilters } = useProductFilters();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const searchParams = useSearchParams();
  const [localSearch, setLocalSearch] = useState(searchQuery || "");
  const page = parseInt(searchParams.get("page") || "1");

  const category = categories.find((c) => c.slug === main);
  const subCategory = category?.subCategories?.find((sc) => sc.slug === sub);
  const subSubCategory = subCategory?.subSubCategories?.find((ssc) => ssc.slug === subsub);

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
      subSubCategory: subSubCategory?.name,
    },
    1,
    10000
  );

  // Client-side filtering
  const filteredProducts = useMemo(() => {
    if (!allProductsData?.data) return [];

    let filtered: Product[] = allProductsData.data;

    // Filter by subSubCategory if available
    if (subSubCategory?.name) {
      filtered = filtered.filter((p) => {
        // Check if product matches subSubCategory by name or slug
        const productSubSub = p.subSubCategory?.toLowerCase();
        const targetSubSub = subSubCategory.name.toLowerCase();
        const targetSlug = subSubCategory.slug.toLowerCase();
        
        return (
          productSubSub === targetSubSub ||
          productSubSub === targetSlug ||
          p.name.toLowerCase().includes(targetSubSub) ||
          p.name.toLowerCase().includes(targetSlug) ||
          p.subCategory?.toLowerCase().includes(targetSubSub)
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
          p.subCategory.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
          p.subSubCategory?.toLowerCase().includes(debouncedSearch.toLowerCase())
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
  }, [allProductsData, filters, debouncedSearch, subSubCategory]);

  // Pagination
  const itemsPerPage = 20;
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, page]);

  if (!category || !subCategory || !subSubCategory) {
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
    { label: subCategory.name, href: `/categories/${main}/${sub}` },
    { label: subSubCategory.name },
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
            <h1 className="text-3xl font-bold text-gray-900 mb-1">{subSubCategory.name}</h1>
            <p className="text-sm text-gray-600">
              {filteredProducts.length.toLocaleString()} items
            </p>
          </div>
          <div className="flex items-center gap-2">
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
      <div className="px-4 sm:px-6 lg:px-8 py-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder="Search products..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="flex-1 max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          {/* Mobile Filter Button */}
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="lg:hidden flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Filter className="h-4 w-4" />
            <span>Filters</span>
          </button>
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
          <div className="lg:hidden fixed inset-0 z-50">
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => setMobileFiltersOpen(false)}
            />
            <div className="absolute left-0 top-0 bottom-0 w-80 bg-white shadow-xl overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between z-10">
                <h2 className="text-lg font-bold">Filters</h2>
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="p-6">
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
        <div className="flex-1 px-4 sm:px-6 lg:px-8 py-6">
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
    </div>
  );
}

export default function SubSubCategoryPage({ params }: { params: Promise<{ main: string; sub: string; subsub: string }> }) {
  return (
    <Suspense fallback={<div className="px-4 py-8">Loading...</div>}>
      <SubSubCategoryContent params={params} />
    </Suspense>
  );
}

