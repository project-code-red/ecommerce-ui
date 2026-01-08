"use client";

import { Product } from "@/types/product";
import { ProductCardHomepage } from "@/components/features/product/ProductCardHomepage";
import { cn } from "@/lib/utils";

interface TrendingProductsSectionProps {
  title: string;
  products: Product[];
  viewAllLink: string;
  isLoading?: boolean;
  className?: string;
}

export function TrendingProductsSection({
  title,
  products,
  viewAllLink,
  isLoading = false,
  className,
}: TrendingProductsSectionProps) {
  if (isLoading) {
    return (
      <section className={cn("px-4 sm:px-6 lg:px-8 py-8 md:py-12 bg-background", className)}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6 md:mb-8">
            <div className="h-7 md:h-8 lg:h-9 w-48 bg-gray-200 rounded animate-pulse" />
            <div className="h-10 w-24 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-3">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-96 bg-gray-100 rounded-xl animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <section className={cn("px-4 sm:px-6 lg:px-8 py-8 md:py-12 bg-background", className)}>
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="mb-6 md:mb-8">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-secondary">
            {title}
          </h2>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-3">
          {products.slice(0, 8).map((product) => {
            // Determine variant based on product category
            const variant =
              product.category === "Electronics" ? "electronics" : "fashion";
            return (
              <ProductCardHomepage
                key={product.id}
                product={product}
                variant={variant}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}

