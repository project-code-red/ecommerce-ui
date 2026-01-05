import { Notification } from "@/types/notification";

export const notifications: Notification[] = [
  {
    id: "notif-1",
    type: "order",
    title: "Order Delivered",
    message: "Your order #order-001 has been delivered successfully.",
    link: "/orders/order-001",
    read: false,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "notif-2",
    type: "promo",
    title: "Special Offer",
    message: "Get 20% off on all Men's clothing. Use code MEN20",
    link: "/categories/men",
    read: false,
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "notif-3",
    type: "order",
    title: "Order Shipped",
    message: "Your order #order-002 has been shipped and is on its way.",
    link: "/orders/order-002",
    read: true,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "notif-4",
    type: "offer",
    title: "Flash Sale",
    message: "Limited time offer! Up to 50% off on Electronics.",
    link: "/categories/electronics",
    read: false,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "notif-5",
    type: "system",
    title: "Welcome Bonus",
    message: "Welcome! Get ₹100 off on your first order.",
    link: "/products",
    read: true,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

