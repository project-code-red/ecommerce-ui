'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useProducts } from '@/services/queries/productQueries';
import { ProductGrid } from '@/components/features/product/ProductGrid';
import { SortDropdown, Pagination, PageShell, SectionHeader, LoadingState } from '@/components/common';
import { SORT_OPTIONS } from '@/lib/constants';

function ProductsContent() {
  const searchParams = useSearchParams();
  const category = searchParams.get('category') || undefined;
  const subCategory = searchParams.get('subCategory') || undefined;
  const searchQuery = searchParams.get('search') || undefined;
  
  // Validate sortBy to match ProductFilters type
  const sortByParam = searchParams.get('sortBy');
  const validSortOptions = ['popularity', 'price-low', 'price-high', 'newest', 'rating'] as const;
  const sortBy: (typeof validSortOptions)[number] = 
    sortByParam && validSortOptions.includes(sortByParam as any)
      ? (sortByParam as (typeof validSortOptions)[number])
      : 'popularity';
  
  const page = parseInt(searchParams.get('page') || '1');

  // Get all products for client-side filtering when search is used
  const { data: allProducts } = useProducts(undefined, 1, 1000);

  // Filter products based on search query
  let filteredData = allProducts;
  if (searchQuery && allProducts) {
    const filtered = allProducts.data.filter(
      (product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.subCategory.toLowerCase().includes(searchQuery.toLowerCase())
    );
    filteredData = {
      ...allProducts,
      data: filtered,
      total: filtered.length,
      totalPages: Math.ceil(filtered.length / 20),
    };
  }

  const { data, isLoading } = searchQuery
    ? { data: filteredData, isLoading: !allProducts }
    : useProducts(
        {
          category,
          subCategory,
          sortBy,
        },
        page,
        20
      );

  return (
    <PageShell
      title={searchQuery ? `Search Results for "${searchQuery}"` : 'All Products'}
      headerActions={
        <SortDropdown 
          options={SORT_OPTIONS} 
          value={sortBy} 
          className="w-full sm:w-48 text-sm sm:text-base" 
        />
      }
    >
      <ProductGrid products={data?.data || []} isLoading={isLoading} />
      {data && data.totalPages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={data.totalPages}
          baseUrl="/products"
          className="mt-8"
        />
      )}
    </PageShell>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <ProductsContent />
    </Suspense>
  );
}

