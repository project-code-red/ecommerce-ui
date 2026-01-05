"use client";

import Link from "next/link";
import { Product } from "@/types/product";
import { ProductCardHomepage } from "@/components/features/product/ProductCardHomepage";
import { Button } from "@/components/ui/Button";
import { ArrowRight } from "lucide-react";
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
      <section className={cn("px-4 sm:px-6 lg:px-8 py-12 bg-background", className)}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
            <div className="h-10 w-24 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
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
    <section className={cn("px-4 sm:px-6 lg:px-8 py-12 bg-background", className)}>
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-secondary">
            {title}
          </h2>
          <Link href={viewAllLink}>
            <Button
              variant="outline"
              className="flex items-center gap-2 text-primary border-primary hover:bg-primary-50"
            >
              View All
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
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

