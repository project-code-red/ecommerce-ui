"use client";

import Link from "next/link";
import { ProductImage } from "@/components/ui/ProductImage";
import { Heart } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { Product } from "@/types/product";
import { Badge } from "@/components/ui/Badge";
import { useIsInWishlist, useAddToWishlist, useRemoveFromWishlist } from "@/services/queries/wishlistQueries";
import { useToast } from "@/components/ui/ToastProvider";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
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
    <Link href={`/products/${product.slug}`} className="group block h-full">
      <div className="bg-white rounded-lg shadow-card hover:shadow-card-hover transition-all duration-200 overflow-hidden relative h-full flex flex-col card-hover">
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          <ProductImage
            src={product.images[0] || ""}
            alt={product.name}
            fill
            className="group-hover:scale-110 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {/* Discount Badge */}
          {product.discountPercentage > 0 && (
            <Badge variant="warning" className="absolute top-3 left-3 z-10 font-bold">
              {product.discountPercentage}% OFF
            </Badge>
          )}
          {/* Wishlist Button */}
          <button
            onClick={handleWishlistToggle}
            className="absolute top-3 right-3 p-2 bg-white/95 hover:bg-white rounded-full shadow-md transition-all duration-200 z-10 hover:scale-110"
            aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart
              className={`h-5 w-5 transition-colors ${
                isInWishlist ? "fill-red-500 text-red-500" : "text-gray-600 hover:text-red-500"
              }`}
            />
          </button>
        </div>

        {/* Product Info */}
        <div className="p-4 flex-1 flex flex-col">
          <h3 className="font-semibold text-secondary line-clamp-2 mb-3 text-base group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          
          {/* Price Section */}
          <div className="flex items-baseline space-x-2 mb-3">
            <span className="text-xl font-bold text-secondary">
              {formatCurrency(product.price)}
            </span>
            {product.mrp > product.price && (
              <>
                <span className="text-sm text-gray-500 line-through">
                  {formatCurrency(product.mrp)}
                </span>
                <span className="text-xs font-medium text-accent">
                  Save {formatCurrency(product.mrp - product.price)}
                </span>
              </>
            )}
          </div>

          {/* Rating Section */}
          <div className="flex items-center space-x-1 text-sm mt-auto">
            <div className="flex items-center">
              <span className="text-yellow-500">★</span>
              <span className="font-semibold text-secondary ml-1">
                {product.rating.toFixed(1)}
              </span>
            </div>
            <span className="text-gray-500">({product.ratingCount})</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

