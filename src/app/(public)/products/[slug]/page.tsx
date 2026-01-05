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
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Image Gallery */}
        <div>
          <div className="relative aspect-square mb-4 bg-gray-100 rounded-lg overflow-hidden">
            <Image
              src={product.images[selectedImage]}
              alt={product.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="grid grid-cols-4 gap-2">
            {product.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImage(idx)}
                className={`relative aspect-square rounded overflow-hidden border-2 ${
                  selectedImage === idx ? "border-primary" : "border-transparent"
                }`}
              >
                <Image src={img} alt={`${product.name} ${idx + 1}`} fill className="object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <div className="flex items-center space-x-4 mb-4">
            <span className="text-3xl font-bold text-primary">{formatCurrency(product.price)}</span>
            {product.mrp > product.price && (
              <>
                <span className="text-xl text-gray-500 line-through">
                  {formatCurrency(product.mrp)}
                </span>
                <Badge variant="warning">{product.discountPercentage}% OFF</Badge>
              </>
            )}
          </div>
          <div className="flex items-center space-x-2 mb-6">
            <span>⭐ {product.rating.toFixed(1)}</span>
            <span className="text-gray-500">({product.ratingCount} reviews)</span>
          </div>

          {/* Variants */}
          {product.variants.sizes && product.variants.sizes.length > 0 && (
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Size</label>
              <div className="flex space-x-2">
                {product.variants.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 border rounded ${
                      selectedSize === size ? "border-primary bg-primary/10" : "border-gray-300"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {product.variants.colors && product.variants.colors.length > 0 && (
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Color</label>
              <div className="flex space-x-2">
                {product.variants.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-2 border rounded ${
                      selectedColor === color ? "border-primary bg-primary/10" : "border-gray-300"
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex space-x-4 mb-6">
            <Button onClick={handleAddToCart} isLoading={addToCart.isPending} className="flex-1">
              Add to Cart
            </Button>
            <Button variant="secondary" onClick={handleBuyNow} isLoading={addToCart.isPending} className="flex-1">
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
              className={`p-3 border rounded-lg transition-colors ${
                isInWishlist
                  ? "border-red-500 bg-red-50 text-red-500"
                  : "border-gray-300 hover:border-primary"
              }`}
              aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
            >
              <Heart className={`h-5 w-5 ${isInWishlist ? "fill-current" : ""}`} />
            </button>
          </div>

          {/* Product Details */}
          <div className="border-t pt-6 space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Delivery</h3>
              <p className="text-gray-600">{product.deliveryEstimate}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Returns</h3>
              <p className="text-gray-600">{product.returnInfo}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-gray-600">{product.description}</p>
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
        <div className="mt-12 border-t pt-8">
          <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
          <div className="space-y-6">
            {product.reviews.map((review) => (
              <div key={review.id} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold">{review.username}</span>
                      {review.verified && (
                        <Badge variant="success" className="text-xs">Verified Purchase</Badge>
                      )}
                    </div>
                    <div className="flex items-center space-x-1 mt-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span key={i} className={i < review.rating ? "text-yellow-400" : "text-gray-300"}>
                          ⭐
                        </span>
                      ))}
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">{formatDate(review.date)}</span>
                </div>
                <p className="text-gray-700 mt-2">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Related Products */}
      {relatedProducts && relatedProducts.data.length > 0 && (
        <div className="mt-12 border-t pt-8">
          <h2 className="text-2xl font-bold mb-6">Related Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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

