"use client";

import { use } from "react";
import { useOrder, useCancelOrder } from "@/services/queries/orderQueries";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import Image from "next/image";
import { useToast } from "@/components/ui/ToastProvider";
import { useRouter } from "next/navigation";

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: order, isLoading } = useOrder(id);
  const cancelOrder = useCancelOrder();
  const { showToast } = useToast();
  const router = useRouter();

  if (isLoading) {
    return <div className="px-4 py-8">Loading...</div>;
  }

  if (!order) {
    return <div className="px-4 py-8">Order not found</div>;
  }

  const canCancel = ["order_placed", "packed"].includes(order.status);

  const handleCancel = () => {
    if (confirm("Are you sure you want to cancel this order?")) {
      cancelOrder.mutate(id, {
        onSuccess: () => {
          showToast("Order cancelled successfully", "success");
          router.refresh();
        },
      });
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">Order Details</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold mb-4">Order Items</h2>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center space-x-4">
                  <div className="relative w-20 h-20 flex-shrink-0">
                    <Image
                      src={item.productImage}
                      alt={item.productName}
                      fill
                      className="object-cover rounded"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{item.productName}</h3>
                    {item.size && <p className="text-sm text-gray-600">Size: {item.size}</p>}
                    {item.color && <p className="text-sm text-gray-600">Color: {item.color}</p>}
                    <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{formatCurrency(item.price * item.quantity)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold mb-4">Shipping Address</h2>
            <p>{order.address.name}</p>
            <p>{order.address.addressLine1}</p>
            {order.address.addressLine2 && <p>{order.address.addressLine2}</p>}
            <p>
              {order.address.city}, {order.address.state} {order.address.pincode}
            </p>
            <p>{order.address.country}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold mb-4">Order Timeline</h2>
            <div className="space-y-2">
              {order.timeline.map((event, idx) => (
                <div key={idx} className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <div>
                    <p className="font-medium">{event.status.replace(/_/g, " ").toUpperCase()}</p>
                    <p className="text-sm text-gray-600">{formatDateTime(event.timestamp)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatCurrency(order.subtotal)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-{formatCurrency(order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Delivery</span>
                <span>{formatCurrency(order.delivery)}</span>
              </div>
            </div>
            <div className="border-t pt-4 mb-4">
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>{formatCurrency(order.total)}</span>
              </div>
            </div>
            <div className="mb-4">
              <Badge variant="info">{order.status.replace(/_/g, " ").toUpperCase()}</Badge>
            </div>
            {canCancel && (
              <Button variant="danger" className="w-full" onClick={handleCancel}>
                Cancel Order
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

