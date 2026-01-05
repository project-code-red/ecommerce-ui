"use client";

import Link from "next/link";
import { ProductImage } from "@/components/ui/ProductImage";
import { Heart } from "lucide-react";
import { formatCurrency, getProductUrl } from "@/lib/utils";
import { Product } from "@/types/product";
import { Badge } from "@/components/ui/Badge";
import { useIsInWishlist, useAddToWishlist, useRemoveFromWishlist } from "@/services/queries/wishlistQueries";
import { useToast } from "@/components/ui/ToastProvider";
import { cn } from "@/lib/utils";

interface ProductCardHomepageProps {
  product: Product;
  variant?: "fashion" | "electronics";
  className?: string;
}

export function ProductCardHomepage({
  product,
  variant = "fashion",
  className,
}: ProductCardHomepageProps) {
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

  const isElectronics = variant === "electronics";
  const discountAmount = product.mrp > product.price ? product.mrp - product.price : 0;

  return (
    <Link 
      href={getProductUrl(product.slug, product.id)} 
      className={cn("group block h-full", className)}
    >
      <div
        className={cn(
          "bg-white rounded-xl shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden relative h-full flex flex-col",
          "transform hover:-translate-y-1.5 border border-gray-100 hover:border-gray-200",
          isElectronics && "bg-gray-50/50"
        )}
      >
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-gray-50">
          <ProductImage
            src={product.images[0] || ""}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          />

          {/* Discount Badge */}
          {product.discountPercentage > 0 && (
            <Badge
              variant="warning"
              className="absolute top-3 left-3 z-10 font-bold text-xs px-2.5 py-1 shadow-lg"
            >
              {product.discountPercentage}% OFF
            </Badge>
          )}

          {/* Wishlist Button */}
          <button
            onClick={handleWishlistToggle}
            className="absolute top-3 right-3 p-2.5 bg-white/95 backdrop-blur-sm hover:bg-white rounded-full shadow-lg transition-all duration-200 z-10 hover:scale-110 hover:shadow-xl"
            aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart
              className={cn(
                "h-4 w-4 transition-colors duration-200",
                isInWishlist ? "fill-red-500 text-red-500" : "text-gray-600 hover:text-red-500"
              )}
            />
          </button>

          {/* Overlay gradient on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Product Info */}
        <div className="p-4 md:p-5 flex-1 flex flex-col">
          {/* Category/Brand */}
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-2 font-medium">
            {product.category}
          </p>

          {/* Product Title */}
          <h3 className="font-semibold text-secondary line-clamp-2 mb-3 text-sm md:text-base leading-snug group-hover:text-primary transition-colors duration-200 min-h-[2.5rem]">
            {product.name}
          </h3>

          {/* Price Section */}
          <div className="flex items-baseline gap-2 mb-3 flex-wrap">
            <span className="text-lg md:text-xl font-bold text-secondary">
              {formatCurrency(product.price)}
            </span>
            {product.mrp > product.price && (
              <>
                <span className="text-sm text-gray-400 line-through">
                  {formatCurrency(product.mrp)}
                </span>
                {discountAmount > 0 && (
                  <span className="text-xs font-semibold text-accent-600 bg-accent-50 px-2 py-0.5 rounded">
                    Save {formatCurrency(discountAmount)}
                  </span>
                )}
              </>
            )}
          </div>

          {/* Electronics-specific info */}
          {isElectronics && (
            <div className="text-xs text-gray-600 mb-3 space-y-1 pb-2 border-b border-gray-100">
              <p className="font-medium">EMI from {formatCurrency(product.price / 6)}/mo</p>
              <p className="text-gray-500">✓ 1 Year Warranty</p>
            </div>
          )}

          {/* Rating Section */}
          <div className="flex items-center gap-2 text-xs mt-auto pt-2">
            <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-md">
              <span className="text-yellow-500 text-sm">★</span>
              <span className="font-bold text-secondary ml-1.5">
                {product.rating.toFixed(1)}
              </span>
            </div>
            <span className="text-gray-500">({product.ratingCount} reviews)</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

