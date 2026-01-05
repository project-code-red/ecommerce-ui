'use client';

import { useWishlist } from '@/services/queries/wishlistQueries';
import { ProductGrid } from '@/components/features/product/ProductGrid';
import { LoadingState, EmptyState, PageShell } from '@/components/common';
import { Heart } from 'lucide-react';

export default function WishlistPage() {
  const { data: wishlistItems, isLoading } = useWishlist();

  if (isLoading) {
    return <LoadingState />;
  }

  if (!wishlistItems || wishlistItems.length === 0) {
    return (
      <EmptyState
        icon={<Heart className="h-16 w-16 text-gray-400" />}
        title="Your wishlist is empty"
        description="Start adding items you love to your wishlist"
        action={{
          label: 'Start Shopping',
          href: '/products',
        }}
        variant="card"
      />
    );
  }

  return (
    <PageShell title={`My Wishlist (${wishlistItems.length})`}>
      <ProductGrid products={wishlistItems} isLoading={isLoading} />
    </PageShell>
  );
}

