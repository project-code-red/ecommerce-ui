'use client';

import { Product } from '@/types/product';
import { ProductCard } from './ProductCard';
import { LoadingState } from '@/components/common/LoadingState';
import { EmptyState } from '@/components/common/EmptyState';
import { Package } from 'lucide-react';

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
}

export function ProductGrid({ products, isLoading }: ProductGridProps) {
  if (isLoading) {
    return <LoadingState variant="skeleton" skeletonCount={8} />;
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

