"use client";

import { use } from "react";
import { useAdminOrder, useUpdateOrderStatus } from "@/services/queries/adminQueries";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import Image from "next/image";
import { useToast } from "@/components/ui/ToastProvider";
import { useRouter } from "next/navigation";
import { OrderStatus } from "@/types/order";

const statusColors: Record<string, "default" | "success" | "warning" | "danger" | "info"> = {
  order_placed: "info",
  packed: "info",
  shipped: "info",
  out_for_delivery: "warning",
  delivered: "success",
  cancelled: "danger",
  returned: "warning",
  refund_completed: "success",
};

const statusOptions: { value: OrderStatus; label: string }[] = [
  { value: "order_placed", label: "Order Placed" },
  { value: "packed", label: "Packed" },
  { value: "shipped", label: "Shipped" },
  { value: "out_for_delivery", label: "Out for Delivery" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
  { value: "returned", label: "Returned" },
  { value: "refund_completed", label: "Refund Completed" },
];

export default function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: order, isLoading } = useAdminOrder(id);
  const updateStatus = useUpdateOrderStatus();
  const { showToast } = useToast();
  const router = useRouter();

  if (isLoading) {
    return <div className="px-4 py-8">Loading...</div>;
  }

  if (!order) {
    return <div className="px-4 py-8">Order not found</div>;
  }

  const handleStatusUpdate = (newStatus: OrderStatus) => {
    updateStatus.mutate(
      { id, status: newStatus },
      {
        onSuccess: () => {
          showToast("Order status updated successfully", "success");
        },
        onError: () => {
          showToast("Failed to update order status", "error");
        },
      }
    );
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Order #{order.id}</h1>
        <Button variant="outline" onClick={() => router.push("/admin/orders")}>
          Back to Orders
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Order Items</h2>
            </div>
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
            <div className="space-y-1">
              <p className="font-medium">{order.address.name}</p>
              <p>{order.address.addressLine1}</p>
              {order.address.addressLine2 && <p>{order.address.addressLine2}</p>}
              <p>
                {order.address.city}, {order.address.state} {order.address.pincode}
              </p>
              <p>{order.address.country}</p>
              <p className="mt-2">Phone: {order.address.phone}</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold mb-4">Order Timeline</h2>
            <div className="space-y-3">
              {order.timeline.map((event, idx) => (
                <div key={idx} className="flex items-start space-x-3">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="font-medium">{event.status.replace(/_/g, " ").toUpperCase()}</p>
                    <p className="text-sm text-gray-600">{formatDateTime(event.timestamp)}</p>
                    {event.message && <p className="text-sm text-gray-500 mt-1">{event.message}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1 space-y-6">
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
              <Badge variant={statusColors[order.status] || "default"}>
                {order.status.replace(/_/g, " ").toUpperCase()}
              </Badge>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Update Status</label>
                <Select
                  options={statusOptions}
                  value={order.status}
                  onChange={(e) => handleStatusUpdate(e.target.value as OrderStatus)}
                />
              </div>
              <div className="text-sm text-gray-600">
                <p>Payment: {order.payment.method}</p>
                <p>Order Date: {formatDateTime(order.createdAt)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

