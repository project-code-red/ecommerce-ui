"use client";

import { use, useEffect } from "react";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { Heart, ShoppingCart, ArrowLeft } from "lucide-react";
import { useProductBySlugAndId, useProducts } from "@/services/queries/productQueries";
import { useAddToCart } from "@/services/queries/cartQueries";
import { useIsInWishlist, useAddToWishlist, useRemoveFromWishlist } from "@/services/queries/wishlistQueries";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Select } from "@/components/ui/Select";
import { useState } from "react";
import { useToast } from "@/components/ui/ToastProvider";
import { ProductCard } from "@/components/features/product/ProductCard";

export default function ProductDetailPage({ params }: { params: Promise<{ slug: string; productId: string }> }) {
  const { slug, productId } = use(params);
  const router = useRouter();
  const pathname = usePathname();
  const { data: product, isLoading } = useProductBySlugAndId(slug, productId);
  const { data: relatedProducts } = useProducts({ category: product?.category }, 1, 4);
  const addToCart = useAddToCart();
  const { data: isInWishlist } = useIsInWishlist(product?.id || "");
  const addToWishlist = useAddToWishlist();
  const removeFromWishlist = useRemoveFromWishlist();
  const { showToast } = useToast();
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedImage, setSelectedImage] = useState(0);
  const [actionType, setActionType] = useState<"addToCart" | "buyNow" | null>(null);

  // Scroll to top when route changes
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);

  if (isLoading) {
    return <div className="px-4 py-8">Loading...</div>;
  }

  if (!product) {
    return <div className="px-4 py-8">Product not found</div>;
  }

  const handleAddToCart = () => {
    setActionType("addToCart");
    addToCart.mutate(
      {
        productId: product.id,
        quantity: 1,
        size: selectedSize || undefined,
        color: selectedColor || undefined,
      },
      {
        onSuccess: () => {
          showToast("Product added to cart!", "success");
          setActionType(null);
        },
        onError: () => {
          setActionType(null);
        },
      }
    );
  };

  const handleBuyNow = () => {
    setActionType("buyNow");
    addToCart.mutate(
      {
        productId: product.id,
        quantity: 1,
        size: selectedSize || undefined,
        color: selectedColor || undefined,
      },
      {
        onSuccess: () => {
          router.push("/user/checkout");
          setActionType(null);
        },
        onError: () => {
          setActionType(null);
        },
      }
    );
  };

  const isAddingToCart = actionType === "addToCart" && addToCart.isPending;
  const isBuyingNow = actionType === "buyNow" && addToCart.isPending;

  const handleBack = () => {
    router.back();
  };

  const handleWishlistToggle = () => {
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
    <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 pb-24 md:pb-8 max-w-7xl mx-auto">
      {/* Back Button */}
      <button
        onClick={handleBack}
        className="group flex items-center gap-2 sm:gap-2.5 mb-4 sm:mb-5 md:mb-6 text-gray-600 hover:text-gray-900 transition-all duration-300 hover:gap-3"
        aria-label="Go back"
      >
        <div className="p-2 sm:p-2.5 rounded-full bg-white/80 backdrop-blur-sm border border-gray-200 group-hover:bg-white group-hover:border-gray-300 group-hover:shadow-md transition-all duration-300 min-w-[44px] min-h-[44px] sm:min-w-[48px] sm:min-h-[48px] flex items-center justify-center">
          <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5 transition-transform duration-300 group-hover:-translate-x-0.5" />
        </div>
        <span className="text-sm sm:text-base font-medium hidden md:inline-block">Back</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        {/* Image Gallery */}
        <div>
          <div className="relative aspect-square mb-3 sm:mb-4 bg-gray-100 rounded-lg overflow-hidden group">
            <Image
              src={product.images[selectedImage]}
              alt={product.name}
              fill
              className="object-cover"
            />
            
            {/* Wishlist Button - Top Right Corner */}
            <button
              onClick={handleWishlistToggle}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 p-2.5 sm:p-3 bg-white/95 backdrop-blur-sm hover:bg-white rounded-full shadow-lg transition-all duration-200 z-20 hover:scale-110 hover:shadow-xl active:scale-95 min-w-[44px] min-h-[44px] sm:min-w-[48px] sm:min-h-[48px] flex items-center justify-center"
              aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
            >
              <Heart
                className={`h-5 w-5 sm:h-6 sm:w-6 transition-colors duration-200 ${
                  isInWishlist ? "fill-red-500 text-red-500" : "text-gray-600 hover:text-red-500"
                }`}
              />
            </button>
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-4 gap-2">
            {product.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImage(idx)}
                className={`relative aspect-square rounded overflow-hidden border-2 transition-colors ${
                  selectedImage === idx ? "border-primary" : "border-transparent hover:border-gray-300"
                }`}
              >
                <Image src={img} alt={`${product.name} ${idx + 1}`} fill className="object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 md:mb-5 text-gray-900 break-words leading-tight">
            {product.name}
          </h1>
          <div className="flex flex-wrap items-baseline gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-5 md:mb-6">
            <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary leading-none">{formatCurrency(product.price)}</span>
            {product.mrp > product.price && (
              <>
                <span className="text-base sm:text-lg md:text-xl text-gray-500 line-through">
                  {formatCurrency(product.mrp)}
                </span>
                <Badge variant="warning" className="text-xs sm:text-sm md:text-base px-2 py-0.5 sm:px-2.5 sm:py-1">
                  {product.discountPercentage}% OFF
                </Badge>
              </>
            )}
          </div>
          <div className="flex items-center flex-wrap gap-2 sm:gap-3 mb-5 sm:mb-6 md:mb-8">
            <div className="flex items-center gap-1.5">
              <span className="text-base sm:text-lg md:text-xl">⭐</span>
              <span className="text-sm sm:text-base md:text-lg font-semibold text-gray-900">{product.rating.toFixed(1)}</span>
            </div>
            <span className="text-xs sm:text-sm md:text-base text-gray-500">({product.ratingCount} reviews)</span>
          </div>

          {/* Variants */}
          {product.variants.sizes && product.variants.sizes.length > 0 && (
            <div className="mb-5 sm:mb-6 md:mb-7">
              <label className="block text-sm sm:text-base md:text-lg font-semibold mb-3 sm:mb-3.5 text-gray-900">Size</label>
              <div className="flex flex-wrap gap-2.5 sm:gap-3">
                {product.variants.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 sm:px-5 md:px-6 py-2.5 sm:py-3 text-sm sm:text-base md:text-lg font-medium border-2 rounded-lg transition-all duration-200 min-h-[48px] sm:min-h-[52px] md:min-h-[56px] ${
                      selectedSize === size 
                        ? "border-primary bg-primary/10 text-primary font-semibold shadow-sm" 
                        : "border-gray-300 hover:border-primary hover:bg-gray-50 active:scale-95"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {product.variants.colors && product.variants.colors.length > 0 && (
            <div className="mb-5 sm:mb-6 md:mb-7">
              <label className="block text-sm sm:text-base md:text-lg font-semibold mb-3 sm:mb-3.5 text-gray-900">Color</label>
              <div className="flex flex-wrap gap-2.5 sm:gap-3">
                {product.variants.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 sm:px-5 md:px-6 py-2.5 sm:py-3 text-sm sm:text-base md:text-lg font-medium border-2 rounded-lg transition-all duration-200 min-h-[48px] sm:min-h-[52px] md:min-h-[56px] ${
                      selectedColor === color 
                        ? "border-primary bg-primary/10 text-primary font-semibold shadow-sm" 
                        : "border-gray-300 hover:border-primary hover:bg-gray-50 active:scale-95"
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Actions - Desktop Only */}
          <div className="hidden md:flex flex-row gap-3 lg:gap-4 mb-8 lg:mb-10">
            <Button 
              onClick={handleAddToCart} 
              isLoading={isAddingToCart}
              disabled={isBuyingNow || isAddingToCart}
              className="flex-1 text-base lg:text-lg font-semibold h-12 lg:h-14"
              size="lg"
            >
              Add to Cart
            </Button>
            <Button 
              variant="secondary" 
              onClick={handleBuyNow} 
              isLoading={isBuyingNow}
              disabled={isBuyingNow || isAddingToCart}
              className="flex-1 text-base lg:text-lg font-semibold h-12 lg:h-14"
              size="lg"
            >
              Buy Now
            </Button>
          </div>

          {/* Product Details */}
          <div className="border-t border-gray-200 pt-5 sm:pt-6 md:pt-8 space-y-5 sm:space-y-6 md:space-y-7">
            <div>
              <h3 className="font-semibold text-base sm:text-lg md:text-xl mb-2 sm:mb-2.5 text-gray-900">Delivery</h3>
              <p className="text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed">{product.deliveryEstimate}</p>
            </div>
            <div>
              <h3 className="font-semibold text-base sm:text-lg md:text-xl mb-2 sm:mb-2.5 text-gray-900">Returns</h3>
              <p className="text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed">{product.returnInfo}</p>
            </div>
            <div>
              <h3 className="font-semibold text-base sm:text-lg md:text-xl mb-2 sm:mb-2.5 text-gray-900">Description</h3>
              <p className="text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed">{product.description}</p>
            </div>
            {product.features && product.features.length > 0 && (
              <div>
                <h3 className="font-semibold text-base sm:text-lg md:text-xl mb-3 sm:mb-3.5 text-gray-900">Features</h3>
                <ul className="list-disc list-inside space-y-2 sm:space-y-2.5 text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed">
                  {product.features.map((feature, idx) => (
                    <li key={idx}>{feature}</li>
                  ))}
                </ul>
              </div>
            )}
            {product.specifications && Object.keys(product.specifications).length > 0 && (
              <div>
                <h3 className="font-semibold text-base sm:text-lg md:text-xl mb-3 sm:mb-3.5 text-gray-900">Specifications</h3>
                <div className="space-y-2.5 sm:space-y-3">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2">
                      <span className="text-sm sm:text-base md:text-lg text-gray-600 font-medium">{key}:</span>
                      <span className="text-sm sm:text-base md:text-lg font-semibold text-gray-900">{String(value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      {product.reviews && product.reviews.length > 0 && (
        <div className="mt-8 sm:mt-10 md:mt-12 lg:mt-16 border-t border-gray-200 pt-6 sm:pt-8 md:pt-10">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-5 sm:mb-6 md:mb-8 text-gray-900">Customer Reviews</h2>
          <div className="space-y-4 sm:space-y-5 md:space-y-6">
            {product.reviews.map((review) => (
              <div key={review.id} className="bg-white rounded-lg shadow-sm p-4 sm:p-5 md:p-6 lg:p-8">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4 mb-3 sm:mb-4">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                      <span className="font-semibold text-base sm:text-lg md:text-xl text-gray-900">{review.username}</span>
                      {review.verified && (
                        <Badge variant="success" className="text-xs sm:text-sm">Verified Purchase</Badge>
                      )}
                    </div>
                    <div className="flex items-center space-x-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span key={i} className={`text-base sm:text-lg md:text-xl ${i < review.rating ? "text-yellow-400" : "text-gray-300"}`}>
                          ⭐
                        </span>
                      ))}
                    </div>
                  </div>
                  <span className="text-xs sm:text-sm md:text-base text-gray-500 whitespace-nowrap">{formatDate(review.date)}</span>
                </div>
                <p className="text-sm sm:text-base md:text-lg text-gray-700 leading-relaxed">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Related Products */}
      {relatedProducts && relatedProducts.data.length > 0 && (
        <div className="mt-8 sm:mt-10 md:mt-12 lg:mt-16 border-t border-gray-200 pt-6 sm:pt-8 md:pt-10 pb-24 md:pb-8">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-5 sm:mb-6 md:mb-8 text-gray-900">Related Products</h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            {relatedProducts.data
              .filter((p) => p.id !== product.id)
              .slice(0, 4)
              .map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
          </div>
        </div>
      )}

      {/* Sticky Bottom Action Bar - Mobile Only */}
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] safe-area-inset-bottom">
        <div className="px-3 py-2.5">
          <div className="flex items-center gap-2">
            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={isBuyingNow || isAddingToCart}
              className={`flex-1 h-[44px] px-3 rounded-lg font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
                isAddingToCart
                  ? "bg-primary-600 text-white cursor-wait"
                  : "bg-primary text-white hover:bg-primary-600 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              }`}
            >
              {isAddingToCart ? (
                <>
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Adding...</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="h-4 w-4" />
                  <span>Add to Cart</span>
                </>
              )}
            </button>

            {/* Buy Now Button */}
            <button
              onClick={handleBuyNow}
              disabled={isBuyingNow || isAddingToCart}
              className={`flex-1 h-[44px] px-3 rounded-lg font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
                isBuyingNow
                  ? "bg-secondary-600 text-white cursor-wait"
                  : "bg-secondary text-white hover:bg-secondary-600 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              }`}
            >
              {isBuyingNow ? (
                <>
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Processing...</span>
                </>
              ) : (
                <span>Buy Now</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

