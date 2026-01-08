"use client";

import { Product } from "@/types/product";
import { ProductCardMinimal } from "./ProductCardMinimal";
import { LoadingState } from "@/components/common/LoadingState";
import { EmptyState } from "@/components/common/EmptyState";
import { Package } from "lucide-react";
import { Skeleton } from "@/components/ui/Skeleton";

interface ProductGridMinimalProps {
  products: Product[];
  isLoading?: boolean;
}

export function ProductGridMinimal({ products, isLoading }: ProductGridMinimalProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-3">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="bg-white rounded-lg overflow-hidden">
            <Skeleton className="aspect-[3/4] w-full" />
            <div className="p-2 space-y-2">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-20" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <EmptyState
        icon={<Package className="h-16 w-16 text-gray-400" />}
        title="No products found"
        description="Try adjusting your filters or search terms"
        variant="minimal"
      />
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-3">
      {products.map((product) => (
        <ProductCardMinimal key={product.id} product={product} />
      ))}
    </div>
  );
}

