"use client";

import Link from "next/link";
import { ProductImage } from "@/components/ui/ProductImage";
import { Heart, ShoppingCart } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { Product } from "@/types/product";
import { Badge } from "@/components/ui/Badge";
import { useIsInWishlist, useAddToWishlist, useRemoveFromWishlist } from "@/services/queries/wishlistQueries";
import { useAddToCart } from "@/services/queries/cartQueries";
import { useToast } from "@/components/ui/ToastProvider";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

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
  const addToCart = useAddToCart();
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

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart.mutate(
      {
        productId: product.id,
        quantity: 1,
      },
      {
        onSuccess: () => {
          showToast("Product added to cart!", "success");
        },
      }
    );
  };

  const isElectronics = variant === "electronics";

  return (
    <div className={cn("group h-full", className)}>
      <div
        className={cn(
          "bg-white rounded-xl md:rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden relative h-full flex flex-col",
          "transform hover:-translate-y-1",
          isElectronics && "bg-gray-50"
        )}
      >
          {/* Image Container */}
          <div className="relative aspect-square overflow-hidden bg-gray-100">
            <Link href={`/products/${product.slug}`} className="block w-full h-full">
              <ProductImage
                src={product.images[0] || ""}
                alt={product.name}
                fill
                className="group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              />
            </Link>

            {/* Discount Badge */}
            {product.discountPercentage > 0 && (
              <Badge
                variant="warning"
                className="absolute top-3 left-3 z-10 font-bold text-xs"
              >
                {product.discountPercentage}% OFF
              </Badge>
            )}

            {/* Wishlist Button */}
            <button
              onClick={handleWishlistToggle}
              className="absolute top-3 right-3 p-2 bg-white/90 hover:bg-white rounded-full shadow-md transition-all duration-200 z-10 hover:scale-110 opacity-0 group-hover:opacity-100"
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

          {/* Product Info */}
          <div className="p-4 flex-1 flex flex-col">
            {/* Brand/Category */}
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
              {product.category}
            </p>

            {/* Product Title - Clickable */}
            <Link href={`/products/${product.slug}`}>
              <h3 className="font-semibold text-secondary line-clamp-2 mb-2 text-sm md:text-base group-hover:text-primary transition-colors min-h-[2.5rem]">
                {product.name}
              </h3>
            </Link>

            {/* Price Section */}
            <div className="flex items-baseline gap-2 mb-3 flex-wrap">
              <span className="text-lg md:text-xl font-bold text-secondary">
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

            {/* Electronics-specific info */}
            {isElectronics && (
              <div className="text-xs text-gray-600 mb-3 space-y-1">
                <p>EMI starting from {formatCurrency(product.price / 6)}/month</p>
                <p>1 Year Warranty</p>
              </div>
            )}

            {/* Rating Section */}
            <div className="flex items-center gap-2 text-xs mb-3">
              <div className="flex items-center">
                <span className="text-yellow-500">★</span>
                <span className="font-semibold text-secondary ml-1">
                  {product.rating.toFixed(1)}
                </span>
              </div>
              <span className="text-gray-500">({product.ratingCount})</span>
            </div>

            {/* Add to Cart Button */}
            <Button
              onClick={handleAddToCart}
              className="w-full bg-primary hover:bg-primary-600 text-white py-2 text-sm font-semibold rounded-lg transition-all duration-200 hover:shadow-md"
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Add to Cart
            </Button>
          </div>
        </div>
    </div>
  );
}

