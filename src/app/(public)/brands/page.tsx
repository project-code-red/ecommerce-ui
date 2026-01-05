'use client';

import { Suspense, useMemo } from 'react';
import Link from 'next/link';
import { useProducts } from '@/services/queries/productQueries';
import { PageShell, LoadingState } from '@/components/common';
import Image from 'next/image';

function BrandsContent() {
  const { data: allProducts, isLoading } = useProducts(undefined, 1, 1000);

  // Extract unique brands from products
  const brands = useMemo(() => {
    if (!allProducts?.data) return [];
    
    const brandSet = new Set<string>();
    allProducts.data.forEach((product) => {
      const brand = product.specifications?.Brand;
      if (brand && typeof brand === 'string' && brand.trim()) {
        brandSet.add(brand.trim());
      }
    });
    
    return Array.from(brandSet).sort();
  }, [allProducts]);

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <PageShell title="All Brands">
      {brands.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No brands found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
          {brands.map((brand) => {
            // Find a product with this brand to use its image
            const brandProduct = allProducts?.data.find(
              (p) => p.specifications?.Brand === brand
            );
            
            return (
              <Link
                key={brand}
                href={`/products?search=${encodeURIComponent(brand)}`}
                className="group bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-4 sm:p-6 flex flex-col items-center justify-center text-center min-h-[120px] sm:min-h-[140px]"
              >
                {brandProduct?.images?.[0] ? (
                  <div className="relative w-16 h-16 sm:w-20 sm:h-20 mb-3 sm:mb-4">
                    <Image
                      src={brandProduct.images[0]}
                      alt={brand}
                      fill
                      className="object-contain rounded"
                    />
                  </div>
                ) : (
                  <div className="w-16 h-16 sm:w-20 sm:h-20 mb-3 sm:mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl sm:text-3xl font-bold text-gray-400">
                      {brand.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <span className="text-sm sm:text-base font-medium text-gray-900 group-hover:text-primary transition-colors line-clamp-2">
                  {brand}
                </span>
              </Link>
            );
          })}
        </div>
      )}
    </PageShell>
  );
}

export default function BrandsPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <BrandsContent />
    </Suspense>
  );
}

