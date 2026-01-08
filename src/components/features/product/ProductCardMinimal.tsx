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
          
          {/* Discount Badge */}
          {product.discountPercentage > 0 && (
            <span className="absolute top-2 left-2 px-2 py-0.5 bg-accent text-white text-xs font-semibold rounded z-10">
              {product.discountPercentage}% OFF
            </span>
          )}

          {/* Wishlist Button */}
          <button
            onClick={handleWishlistToggle}
            className={cn(
              "absolute top-2 right-2 p-1.5 bg-white/95 hover:bg-white rounded-full shadow-md transition-all duration-200 z-10"
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
        <div className="p-2 flex-1 flex flex-col">
          {/* Product Title */}
          <h3 className="font-medium text-gray-900 line-clamp-2 mb-1.5 text-sm group-hover:text-primary transition-colors">
            {product.name}
          </h3>

          {/* Price Section */}
          <div className="flex items-baseline gap-1.5 mb-1.5">
            <span className="text-base font-semibold text-gray-900">
              {formatCurrency(product.price)}
            </span>
            {product.mrp > product.price && (
              <>
                <span className="text-xs text-gray-500 line-through">
                  {formatCurrency(product.mrp)}
                </span>
                <span className="text-xs font-medium text-accent">
                  Save {formatCurrency(product.mrp - product.price)}
                </span>
              </>
            )}
          </div>

          {/* Rating Section */}
          {product.ratingCount > 0 && (
            <div className="flex items-center gap-1 text-xs mt-auto">
              <span className="text-yellow-500">★</span>
              <span className="font-medium text-gray-900">
                {product.rating.toFixed(1)}
              </span>
              <span className="text-gray-500">({product.ratingCount})</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

