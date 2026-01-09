"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle2,
  Package,
  ShoppingBag,
  ArrowRight,
  Home,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Confetti } from "@/components/features/order/Confetti";
import { formatCurrency } from "@/lib/utils";
import { useOrder } from "@/services/queries/orderQueries";

function OrderSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const { data: order, isLoading } = useOrder(orderId || "");
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    // Stop confetti after 3 seconds
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative overflow-hidden">
      <Confetti active={showConfetti} duration={3000} />

      <div className="max-w-3xl w-full text-center animate-fade-in-up">
        {/* Success Icon */}
        <div className="mb-6 sm:mb-8 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-20"></div>
            <div className="relative bg-green-500 rounded-full p-4 sm:p-5 md:p-6">
              <CheckCircle2
                className="h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 text-white"
                strokeWidth={2.5}
              />
            </div>
          </div>
        </div>

        {/* Success Message */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 px-2">
          Order Placed Successfully!
        </h1>
        <p className="text-sm sm:text-base md:text-lg text-gray-600 mb-6 sm:mb-8 px-4 max-w-2xl mx-auto">
          Thank you for your purchase. Your order has been confirmed and will be
          processed shortly.
        </p>

        {/* Order Details */}
        {order && (
          <div
            className="bg-white/80 backdrop-blur-sm rounded-lg sm:rounded-xl p-4 sm:p-5 md:p-6 mb-6 sm:mb-8 text-left max-w-xl mx-auto animate-fade-in-up border border-gray-100"
            style={{ animationDelay: "0.2s" }}
          >
            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <Package className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
              <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900">
                Order Details
              </h2>
            </div>
            <div className="space-y-2 sm:space-y-3">
              <div className="flex justify-between items-center text-sm sm:text-base">
                <span className="text-gray-600">Order ID</span>
                <span className="font-semibold text-gray-900">#{order.id}</span>
              </div>
              <div className="flex justify-between items-center text-sm sm:text-base">
                <span className="text-gray-600">Total Amount</span>
                <span className="font-bold text-base sm:text-lg md:text-xl text-primary">
                  {formatCurrency(order.total)}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm sm:text-base">
                <span className="text-gray-600">Items</span>
                <span className="font-semibold text-gray-900">
                  {order.items.length} item(s)
                </span>
              </div>
              <div className="flex justify-between items-center text-sm sm:text-base">
                <span className="text-gray-600">Status</span>
                <span className="px-2 sm:px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs sm:text-sm font-semibold">
                  {order.status.replace(/_/g, " ").toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        )}

        {isLoading && !order && (
          <div className="bg-white/80 backdrop-blur-sm rounded-lg sm:rounded-xl p-4 sm:p-6 mb-6 sm:mb-8 max-w-xl mx-auto animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
          </div>
        )}

        {/* Action Buttons */}
        <div
          className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-stretch sm:items-center mb-6 sm:mb-8 px-4 animate-fade-in-up"
          style={{ animationDelay: "0.4s" }}
        >
          {orderId && (
            <Link
              href={`/user/orders/${orderId}`}
              className="w-full sm:w-auto sm:flex-1 sm:max-w-[200px]"
            >
              <Button
                className="w-full h-11 sm:h-12 text-sm sm:text-base"
                variant="outline"
              >
                <Package className="h-4 w-4 mr-2 flex-shrink-0" />
                <span className="truncate">View Order Details</span>
                <ArrowRight className="h-4 w-4 ml-2 flex-shrink-0" />
              </Button>
            </Link>
          )}
          <Link
            href="/user/orders"
            className="w-full sm:w-auto sm:flex-1 sm:max-w-[200px]"
          >
            <Button
              className="w-full h-11 sm:h-12 text-sm sm:text-base"
              variant="outline"
            >
              <ShoppingBag className="h-4 w-4 mr-2 flex-shrink-0" />
              <span className="truncate">View All Orders</span>
            </Button>
          </Link>
          <Link
            href="/"
            className="w-full sm:w-auto sm:flex-1 sm:max-w-[200px]"
          >
            <Button className="w-full h-11 sm:h-12 text-sm sm:text-base">
              <Home className="h-4 w-4 mr-2 flex-shrink-0" />
              <span className="truncate">Continue Shopping</span>
            </Button>
          </Link>
        </div>

        {/* Additional Info */}
        <div
          className="pt-6 sm:pt-8 border-t border-gray-200 animate-fade-in-up max-w-2xl mx-auto px-4"
          style={{ animationDelay: "0.6s" }}
        >
          <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
            You will receive an email confirmation shortly with your order
            details and tracking information.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      }
    >
      <OrderSuccessContent />
    </Suspense>
  );
}
