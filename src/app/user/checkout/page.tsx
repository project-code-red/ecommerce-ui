"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  useCart,
  useApplyCoupon,
  useRemoveCoupon,
} from "@/services/queries/cartQueries";
import { useCreateOrder } from "@/services/queries/orderQueries";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/components/ui/ToastProvider";

export default function CheckoutPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const { data: cart } = useCart();
  const createOrder = useCreateOrder();
  const applyCoupon = useApplyCoupon();
  const removeCoupon = useRemoveCoupon();
  const [paymentMethod, setPaymentMethod] = useState("stripe");
  const [couponCode, setCouponCode] = useState("");

  // console.log("cart", cart);
  if (!cart || cart.items.length === 0) {
    router.push("/cart");
    return null;
  }

  const handlePlaceOrder = () => {
    createOrder.mutate(
      { addressId: "addr-1", paymentMethod },
      {
        onSuccess: (order) => {
          showToast("Order placed successfully!", "success");
          router.push(`/user/orders/${order.id}`);
        },
        onError: (error: any) => {
          showToast(error.message || "Failed to place order", "error");
        },
      }
    );
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold mb-4">Shipping Address</h2>
            <div className="space-y-4">
              <Input label="Name" defaultValue="John Doe" />
              <Input label="Phone" defaultValue="9876543210" />
              <Input label="Address Line 1" defaultValue="123 Main Street" />
              <Input label="City" defaultValue="Mumbai" />
              <Input label="State" defaultValue="Maharashtra" />
              <Input label="Pincode" defaultValue="400001" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold mb-4">Payment Method</h2>
            <div className="space-y-4">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="payment"
                  value="stripe"
                  checked={paymentMethod === "stripe"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span>Pay with Stripe (Demo)</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="payment"
                  value="cod"
                  checked={paymentMethod === "cod"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span>Cash on Delivery</span>
              </label>
              {paymentMethod === "stripe" && (
                <div className="mt-4 p-4 border rounded space-y-4">
                  <Input
                    label="Card Number"
                    placeholder="4242 4242 4242 4242"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <Input label="Expiry" placeholder="MM/YY" />
                    <Input label="CVV" placeholder="123" />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>

            {/* Coupon Code */}
            <div className="mb-4 pb-4 border-b">
              {cart.couponCode ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      Coupon Applied:
                    </span>
                    <span className="text-sm font-semibold text-green-600">
                      {cart.couponCode}
                    </span>
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
                    onChange={(e) =>
                      setCouponCode(e.target.value.toUpperCase())
                    }
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
                            showToast(
                              error.message || "Invalid coupon code",
                              "error"
                            );
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
            <Button
              className="w-full"
              onClick={handlePlaceOrder}
              isLoading={createOrder.isPending}
            >
              Place Order
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
