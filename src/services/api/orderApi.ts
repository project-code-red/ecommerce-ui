import { Order, OrderStatus } from "@/types/order";
import { orders } from "@/mock/orders";
import { cartApi } from "./cartApi";
import { currentUserId } from "@/mock/users";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const orderApi = {
  getAll: async (): Promise<Order[]> => {
    await delay(300);
    return orders.filter((o) => o.userId === currentUserId);
  },

  getById: async (id: string): Promise<Order> => {
    await delay(200);
    const order = orders.find((o) => o.id === id && o.userId === currentUserId);
    if (!order) {
      throw new Error("Order not found");
    }
    return order;
  },

  create: async (addressId: string, paymentMethod: string): Promise<Order> => {
    await delay(500);
    const cart = await cartApi.get();
    if (cart.items.length === 0) {
      throw new Error("Cart is empty");
    }

    // Mock address
    const address = {
      name: "John Doe",
      phone: "9876543210",
      addressLine1: "123 Main Street",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400001",
      country: "India",
    };

    const newOrder: Order = {
      id: `order-${String(orders.length + 1).padStart(3, "0")}`,
      userId: currentUserId,
      items: cart.items.map((item) => ({
        id: `item-${Date.now()}-${Math.random()}`,
        productId: item.productId,
        productName: item.product.name,
        productImage: item.product.image,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
        price: item.price,
        mrp: item.product.mrp,
      })),
      address,
      payment: {
        method: paymentMethod as any,
        transactionId: paymentMethod !== "cod" ? `txn_${Date.now()}` : undefined,
        status: paymentMethod === "cod" ? "pending" : "completed",
        amount: cart.total,
      },
      status: "order_placed",
      subtotal: cart.subtotal,
      discount: cart.discount,
      delivery: cart.delivery,
      total: cart.total,
      couponCode: cart.couponCode,
      couponDiscount: cart.couponDiscount,
      timeline: [
        {
          status: "order_placed",
          timestamp: new Date().toISOString(),
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    orders.push(newOrder);
    await cartApi.clear();
    return newOrder;
  },

  updateStatus: async (id: string, status: OrderStatus): Promise<Order> => {
    await delay(300);
    const order = orders.find((o) => o.id === id);
    if (!order) {
      throw new Error("Order not found");
    }
    order.status = status;
    order.timeline.push({
      status,
      timestamp: new Date().toISOString(),
    });
    order.updatedAt = new Date().toISOString();
    return order;
  },

  cancel: async (id: string): Promise<Order> => {
    return orderApi.updateStatus(id, "cancelled");
  },
};

