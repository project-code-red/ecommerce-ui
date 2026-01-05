"use client";

import { use } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import { useProduct, useProducts } from "@/services/queries/productQueries";
import { useAddToCart } from "@/services/queries/cartQueries";
import { useIsInWishlist, useAddToWishlist, useRemoveFromWishlist } from "@/services/queries/wishlistQueries";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Select } from "@/components/ui/Select";
import { useState } from "react";
import { useToast } from "@/components/ui/ToastProvider";
import { ProductCard } from "@/components/features/product/ProductCard";

export default function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const router = useRouter();
  const { data: product, isLoading } = useProduct(slug);
  const { data: relatedProducts } = useProducts({ category: product?.category }, 1, 4);
  const addToCart = useAddToCart();
  const { data: isInWishlist } = useIsInWishlist(product?.id || "");
  const addToWishlist = useAddToWishlist();
  const removeFromWishlist = useRemoveFromWishlist();
  const { showToast } = useToast();
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedImage, setSelectedImage] = useState(0);

  if (isLoading) {
    return <div className="px-4 py-8">Loading...</div>;
  }

  if (!product) {
    return <div className="px-4 py-8">Product not found</div>;
  }

  const handleAddToCart = () => {
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
        },
      }
    );
  };

  const handleBuyNow = () => {
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
        },
      }
    );
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        {/* Image Gallery */}
        <div>
          <div className="relative aspect-square mb-3 sm:mb-4 bg-gray-100 rounded-lg overflow-hidden">
            <Image
              src={product.images[selectedImage]}
              alt={product.name}
              fill
              className="object-cover"
            />
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
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 text-gray-900 break-words">
            {product.name}
          </h1>
          <div className="flex flex-wrap items-center gap-2 sm:gap-4 mb-3 sm:mb-4">
            <span className="text-2xl sm:text-3xl font-bold text-primary">{formatCurrency(product.price)}</span>
            {product.mrp > product.price && (
              <>
                <span className="text-lg sm:text-xl text-gray-500 line-through">
                  {formatCurrency(product.mrp)}
                </span>
                <Badge variant="warning" className="text-xs sm:text-sm">
                  {product.discountPercentage}% OFF
                </Badge>
              </>
            )}
          </div>
          <div className="flex items-center flex-wrap gap-2 sm:gap-2 mb-4 sm:mb-6">
            <span className="text-sm sm:text-base">⭐ {product.rating.toFixed(1)}</span>
            <span className="text-xs sm:text-sm text-gray-500">({product.ratingCount} reviews)</span>
          </div>

          {/* Variants */}
          {product.variants.sizes && product.variants.sizes.length > 0 && (
            <div className="mb-4 sm:mb-5">
              <label className="block text-xs sm:text-sm font-medium mb-2 text-gray-700">Size</label>
              <div className="flex flex-wrap gap-2">
                {product.variants.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-3 sm:px-4 py-2 text-sm sm:text-base border rounded-lg transition-colors min-h-[44px] ${
                      selectedSize === size 
                        ? "border-primary bg-primary/10 text-primary font-semibold" 
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {product.variants.colors && product.variants.colors.length > 0 && (
            <div className="mb-4 sm:mb-5">
              <label className="block text-xs sm:text-sm font-medium mb-2 text-gray-700">Color</label>
              <div className="flex flex-wrap gap-2">
                {product.variants.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-3 sm:px-4 py-2 text-sm sm:text-base border rounded-lg transition-colors min-h-[44px] ${
                      selectedColor === color 
                        ? "border-primary bg-primary/10 text-primary font-semibold" 
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6 sm:mb-8">
            <Button 
              onClick={handleAddToCart} 
              isLoading={addToCart.isPending} 
              className="flex-1 w-full sm:w-auto text-sm sm:text-base"
              size="md"
            >
              Add to Cart
            </Button>
            <Button 
              variant="secondary" 
              onClick={handleBuyNow} 
              isLoading={addToCart.isPending} 
              className="flex-1 w-full sm:w-auto text-sm sm:text-base"
              size="md"
            >
              Buy Now
            </Button>
            <button
              onClick={() => {
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
              }}
              className={`p-3 sm:p-3.5 border rounded-lg transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center ${
                isInWishlist
                  ? "border-red-500 bg-red-50 text-red-500"
                  : "border-gray-300 hover:border-primary"
              }`}
              aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
            >
              <Heart className={`h-5 w-5 sm:h-6 sm:w-6 ${isInWishlist ? "fill-current" : ""}`} />
            </button>
          </div>

          {/* Product Details */}
          <div className="border-t pt-4 sm:pt-6 space-y-4 sm:space-y-5">
            <div>
              <h3 className="font-semibold text-sm sm:text-base mb-2 text-gray-900">Delivery</h3>
              <p className="text-sm sm:text-base text-gray-600">{product.deliveryEstimate}</p>
            </div>
            <div>
              <h3 className="font-semibold text-sm sm:text-base mb-2 text-gray-900">Returns</h3>
              <p className="text-sm sm:text-base text-gray-600">{product.returnInfo}</p>
            </div>
            <div>
              <h3 className="font-semibold text-sm sm:text-base mb-2 text-gray-900">Description</h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{product.description}</p>
            </div>
            {product.features && product.features.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Features</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  {product.features.map((feature, idx) => (
                    <li key={idx}>{feature}</li>
                  ))}
                </ul>
              </div>
            )}
            {product.specifications && Object.keys(product.specifications).length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Specifications</h3>
                <div className="space-y-2">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="text-gray-600">{key}:</span>
                      <span className="font-medium">{String(value)}</span>
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
        <div className="mt-8 sm:mt-12 border-t pt-6 sm:pt-8">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 sm:mb-6 text-gray-900">Customer Reviews</h2>
          <div className="space-y-4 sm:space-y-6">
            {product.reviews.map((review) => (
              <div key={review.id} className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4 mb-2">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-sm sm:text-base text-gray-900">{review.username}</span>
                      {review.verified && (
                        <Badge variant="success" className="text-xs">Verified Purchase</Badge>
                      )}
                    </div>
                    <div className="flex items-center space-x-1 mt-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span key={i} className={`text-sm sm:text-base ${i < review.rating ? "text-yellow-400" : "text-gray-300"}`}>
                          ⭐
                        </span>
                      ))}
                    </div>
                  </div>
                  <span className="text-xs sm:text-sm text-gray-500 whitespace-nowrap">{formatDate(review.date)}</span>
                </div>
                <p className="text-sm sm:text-base text-gray-700 mt-2 leading-relaxed">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Related Products */}
      {relatedProducts && relatedProducts.data.length > 0 && (
        <div className="mt-8 sm:mt-12 border-t pt-6 sm:pt-8">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 sm:mb-6 text-gray-900">Related Products</h2>
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
    </div>
  );
}

