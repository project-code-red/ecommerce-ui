"use client";

import Link from "next/link";
import { ProductImage } from "@/components/ui/ProductImage";
import { Heart } from "lucide-react";
import { formatCurrency, getProductUrl } from "@/lib/utils";
import { Product } from "@/types/product";
import { useIsInWishlist, useAddToWishlist, useRemoveFromWishlist } from "@/services/queries/wishlistQueries";
import { useToast } from "@/components/ui/ToastProvider";
import { cn } from "@/lib/utils";

interface ProductCardMinimalProps {
  product: Product;
  className?: string;
}

export function ProductCardMinimal({ product, className }: ProductCardMinimalProps) {
  const { data: isInWishlist } = useIsInWishlist(product.id);
  const addToWishlist = useAddToWishlist();
  const removeFromWishlist = useRemoveFromWishlist();
  const { showToast } = useToast();

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isInWishlist) {
      removeFromWishlist.mutate(product.id, {
        onSuccess: () => {
          showToast("Removed from wishlist", "success");
        },
      });
    } else {
      addToWishlist.mutate(product.id, {
        onSuccess: () => {
          showToast("Added to wishlist", "success");
        },
      });
    }
  };

  const isBestseller = product.ratingCount > 100 && product.rating > 4;
  const isLatestStyle = product.createdAt && 
    new Date(product.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  return (
    <Link 
      href={getProductUrl(product.slug, product.id)} 
      className={cn("group block h-full", className)}
    >
      <div className="bg-white rounded-lg overflow-hidden relative h-full flex flex-col">
        {/* Image Container - Slim, Tall */}
        <div className="relative aspect-[3/4] overflow-hidden bg-gray-50">
          <ProductImage
            src={product.images[0] || ""}
            alt={product.name}
            fill
            className="group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          />
          
          {/* Labels */}
          <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
            {isBestseller && (
              <span className="px-2 py-0.5 bg-primary text-white text-xs font-semibold rounded">
                Bestseller
              </span>
            )}
            {isLatestStyle && (
              <span className="px-2 py-0.5 bg-accent text-white text-xs font-semibold rounded">
                Latest Style
              </span>
            )}
          </div>

          {/* Discount Badge */}
          {product.discountPercentage > 0 && (
            <span className="absolute top-2 right-2 px-2 py-0.5 bg-accent text-white text-xs font-semibold rounded z-10">
              {product.discountPercentage}% OFF
            </span>
          )}

          {/* Wishlist Button - Fade in on hover */}
          <button
            onClick={handleWishlistToggle}
            className={cn(
              "absolute top-2 right-2 p-2 bg-white/90 hover:bg-white rounded-full shadow-md transition-all duration-200 z-10",
              "opacity-0 group-hover:opacity-100"
            )}
            aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart
              className={cn(
                "h-4 w-4 transition-colors",
                isInWishlist ? "fill-red-500 text-red-500" : "text-gray-600"
              )}
            />
          </button>
        </div>

        {/* Product Info - Minimal Padding */}
        <div className="p-3 flex-1 flex flex-col">
          {/* Brand Name - Small, Muted */}
          <p className="text-xs text-gray-500 mb-1 uppercase tracking-wide">
            {product.category}
          </p>

          {/* Product Title - 2-line clamp */}
          <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-2 group-hover:text-primary transition-colors min-h-[2.5rem]">
            {product.name}
          </h3>

          {/* Price Section */}
          <div className="mt-auto space-y-0.5">
            <div className="flex items-baseline gap-2">
              <span className="text-base font-semibold text-gray-900">
                {formatCurrency(product.price)}
              </span>
              {product.mrp > product.price && (
                <span className="text-xs text-gray-500 line-through">
                  {formatCurrency(product.mrp)}
                </span>
              )}
            </div>
            {product.discountPercentage > 0 && (
              <span className="text-xs font-medium text-accent">
                {product.discountPercentage}% OFF
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

