"use client";

'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { useCart, useUpdateCartItem, useRemoveFromCart, useApplyCoupon, useRemoveCoupon } from '@/services/queries/cartQueries';
import { formatCurrency } from '@/lib/utils';
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {cart.items.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow-sm p-4 flex items-center space-x-4">
              <div className="relative w-24 h-24 flex-shrink-0">
                <Image
                  src={item.product.image}
                  alt={item.product.name}
                  fill
                  className="object-cover rounded"
                />
              </div>
              <div className="flex-1">
                <Link href={`/products/${item.product.slug}`}>
                  <h3 className="font-semibold hover:text-primary">{item.product.name}</h3>
                </Link>
                {item.size && <p className="text-sm text-gray-600">Size: {item.size}</p>}
                {item.color && <p className="text-sm text-gray-600">Color: {item.color}</p>}
                <p className="text-lg font-semibold text-primary mt-2">
                  {formatCurrency(item.price)}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() =>
                    updateQuantity.mutate({ itemId: item.id, quantity: item.quantity - 1 })
                  }
                  className="w-8 h-8 border rounded flex items-center justify-center"
                >
                  -
                </button>
                <span className="w-12 text-center">{item.quantity}</span>
                <button
                  onClick={() =>
                    updateQuantity.mutate({ itemId: item.id, quantity: item.quantity + 1 })
                  }
                  className="w-8 h-8 border rounded flex items-center justify-center"
                >
                  +
                </button>
              </div>
              <button
                onClick={() => removeItem.mutate(item.id)}
                className="text-red-600 hover:text-red-800"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            
            {/* Coupon Code */}
            <div className="mb-4 pb-4 border-b">
              {cart.couponCode ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Coupon Applied:</span>
                    <span className="text-sm font-semibold text-green-600">{cart.couponCode}</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
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
                    className="text-sm"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
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

            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatCurrency(cart.subtotal)}</span>
              </div>
              {cart.discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-{formatCurrency(cart.discount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Delivery</span>
                <span>{formatCurrency(cart.delivery)}</span>
              </div>
            </div>
            <div className="border-t pt-4 mb-4">
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>{formatCurrency(cart.total)}</span>
              </div>
            </div>
            <Link href="/user/checkout" className="block">
              <Button className="w-full">Proceed to Checkout</Button>
            </Link>
          </div>
        </div>
      </div>
    </PageShell>
  );
}

