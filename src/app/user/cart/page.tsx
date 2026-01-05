"use client";

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { useCart, useUpdateCartItem, useRemoveFromCart, useApplyCoupon, useRemoveCoupon } from '@/services/queries/cartQueries';
import { formatCurrency, getProductUrl } from '@/lib/utils';
import { Button, Input } from '@/components/ui';
import { useToast } from '@/components/ui/ToastProvider';
import { LoadingState, EmptyState, PageShell } from '@/components/common';

export default function CartPage() {
  const { data: cart, isLoading } = useCart();
  const updateQuantity = useUpdateCartItem();
  const removeItem = useRemoveFromCart();
  const applyCoupon = useApplyCoupon();
  const removeCoupon = useRemoveCoupon();
  const { showToast } = useToast();
  const [couponCode, setCouponCode] = useState("");

  if (isLoading) {
    return <LoadingState />;
  }

  if (!cart || cart.items.length === 0) {
    return (
      <EmptyState
        icon={<ShoppingCart className="h-16 w-16 text-gray-400" />}
        title="Your cart is empty"
        description="Add items to your cart to continue shopping"
        action={{
          label: 'Continue Shopping',
          href: '/products',
        }}
      />
    );
  }

  return (
    <PageShell title="Shopping Cart">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
        <div className="lg:col-span-2 space-y-3 sm:space-y-4">
          {cart.items.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow-sm p-3 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0">
                <Image
                  src={item.product.image}
                  alt={item.product.name}
                  fill
                  className="object-cover rounded"
                />
              </div>
              <div className="flex-1 min-w-0">
                <Link href={getProductUrl(item.product.slug, item.product.id)}>
                  <h3 className="font-semibold text-sm sm:text-base hover:text-primary line-clamp-2">{item.product.name}</h3>
                </Link>
                {item.size && <p className="text-xs sm:text-sm text-gray-600">Size: {item.size}</p>}
                {item.color && <p className="text-xs sm:text-sm text-gray-600">Color: {item.color}</p>}
                <p className="text-base sm:text-lg font-semibold text-primary mt-1 sm:mt-2">
                  {formatCurrency(item.price)}
                </p>
              </div>
              <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() =>
                      updateQuantity.mutate({ itemId: item.id, quantity: item.quantity - 1 })
                    }
                    className="w-8 h-8 sm:w-9 sm:h-9 border border-gray-300 rounded flex items-center justify-center text-sm sm:text-base hover:bg-gray-50 active:scale-95 transition-all"
                  >
                    -
                  </button>
                  <span className="w-10 sm:w-12 text-center text-sm sm:text-base">{item.quantity}</span>
                  <button
                    onClick={() =>
                      updateQuantity.mutate({ itemId: item.id, quantity: item.quantity + 1 })
                    }
                    className="w-8 h-8 sm:w-9 sm:h-9 border border-gray-300 rounded flex items-center justify-center text-sm sm:text-base hover:bg-gray-50 active:scale-95 transition-all"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() => removeItem.mutate(item.id)}
                  className="text-xs sm:text-sm text-red-600 hover:text-red-800 font-medium px-2 py-1 hover:bg-red-50 rounded transition-colors"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 sticky top-4">
            <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">Order Summary</h2>
            
            {/* Coupon Code */}
            <div className="mb-3 sm:mb-4 pb-3 sm:pb-4 border-b">
              {cart.couponCode ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm text-gray-600">Coupon Applied:</span>
                    <span className="text-xs sm:text-sm font-semibold text-green-600">{cart.couponCode}</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full h-[36px] sm:h-[40px] text-xs sm:text-sm"
                    onClick={() => {
                      removeCoupon.mutate(undefined, {
                        onSuccess: () => {
                          showToast("Coupon removed", "success");
                        },
                      });
                    }}
                  >
                    Remove Coupon
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Input
                    placeholder="Enter coupon code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    className="text-xs sm:text-sm h-[36px] sm:h-[40px]"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full h-[36px] sm:h-[40px] text-xs sm:text-sm"
                    onClick={() => {
                      if (couponCode.trim()) {
                        applyCoupon.mutate(couponCode.trim(), {
                          onSuccess: () => {
                            showToast("Coupon applied successfully", "success");
                            setCouponCode("");
                          },
                          onError: (error: any) => {
                            showToast(error.message || "Invalid coupon code", "error");
                          },
                        });
                      }
                    }}
                    isLoading={applyCoupon.isPending}
                  >
                    Apply Coupon
                  </Button>
                </div>
              )}
            </div>

            <div className="space-y-2 mb-3 sm:mb-4">
              <div className="flex justify-between text-sm sm:text-base">
                <span>Subtotal</span>
                <span>{formatCurrency(cart.subtotal)}</span>
              </div>
              {cart.discount > 0 && (
                <div className="flex justify-between text-green-600 text-sm sm:text-base">
                  <span>Discount</span>
                  <span>-{formatCurrency(cart.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm sm:text-base">
                <span>Delivery</span>
                <span>{formatCurrency(cart.delivery)}</span>
              </div>
            </div>
            <div className="border-t pt-3 sm:pt-4 mb-3 sm:mb-4">
              <div className="flex justify-between text-base sm:text-lg font-bold">
                <span>Total</span>
                <span>{formatCurrency(cart.total)}</span>
              </div>
            </div>
            <Link href="/user/checkout" className="block">
              <Button className="w-full h-[44px] sm:h-[48px] text-sm sm:text-base">Proceed to Checkout</Button>
            </Link>
          </div>
        </div>
      </div>
    </PageShell>
  );
}

