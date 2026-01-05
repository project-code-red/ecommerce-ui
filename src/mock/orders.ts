import { Order, OrderStatus } from "@/types/order";
import { products } from "./products";

const orderStatuses: OrderStatus[] = [
  "order_placed",
  "packed",
  "shipped",
  "out_for_delivery",
  "delivered",
  "cancelled",
  "returned",
  "refund_completed",
];

const generateTimeline = (status: OrderStatus, createdAt: string): Order["timeline"] => {
  const timeline: Order["timeline"] = [];
  const statusIndex = orderStatuses.indexOf(status);

  for (let i = 0; i <= statusIndex; i++) {
    const eventStatus = orderStatuses[i];
    const daysAgo = statusIndex - i;
    timeline.push({
      status: eventStatus,
      timestamp: new Date(
        new Date(createdAt).getTime() + daysAgo * 24 * 60 * 60 * 1000
      ).toISOString(),
    });
  }

  return timeline;
};

export const orders: Order[] = [
  {
    id: "order-001",
    userId: "user-1",
    items: [
      {
        id: "item-1",
        productId: products[0].id,
        productName: products[0].name,
        productImage: products[0].images[0],
        quantity: 2,
        size: "L",
        color: "Blue",
        price: products[0].price,
        mrp: products[0].mrp,
      },
      {
        id: "item-2",
        productId: products[1].id,
        productName: products[1].name,
        productImage: products[1].images[0],
        quantity: 1,
        size: "M",
        color: "Black",
        price: products[1].price,
        mrp: products[1].mrp,
      },
    ],
    address: {
      name: "John Doe",
      phone: "9876543210",
      addressLine1: "123 Main Street",
      addressLine2: "Apartment 4B",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400001",
      country: "India",
    },
    payment: {
      method: "stripe",
      transactionId: "txn_123456789",
      status: "completed",
      amount: products[0].price * 2 + products[1].price + 50,
    },
    status: "delivered",
    subtotal: products[0].price * 2 + products[1].price,
    discount: 200,
    delivery: 50,
    total: products[0].price * 2 + products[1].price - 200 + 50,
    timeline: generateTimeline("delivered", new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()),
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "order-002",
    userId: "user-1",
    items: [
      {
        id: "item-3",
        productId: products[5].id,
        productName: products[5].name,
        productImage: products[5].images[0],
        quantity: 1,
        size: "XL",
        color: "Red",
        price: products[5].price,
        mrp: products[5].mrp,
      },
    ],
    address: {
      name: "John Doe",
      phone: "9876543210",
      addressLine1: "123 Main Street",
      addressLine2: "Apartment 4B",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400001",
      country: "India",
    },
    payment: {
      method: "cod",
      status: "pending",
      amount: products[5].price + 50,
    },
    status: "shipped",
    subtotal: products[5].price,
    discount: 0,
    delivery: 50,
    total: products[5].price + 50,
    timeline: generateTimeline("shipped", new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()),
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "order-003",
    userId: "user-1",
    items: [
      {
        id: "item-4",
        productId: products[10].id,
        productName: products[10].name,
        productImage: products[10].images[0],
        quantity: 3,
        size: "M",
        color: "Black",
        price: products[10].price,
        mrp: products[10].mrp,
      },
    ],
    address: {
      name: "John Doe",
      phone: "9876543210",
      addressLine1: "456 Office Complex",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400002",
      country: "India",
    },
    payment: {
      method: "stripe",
      transactionId: "txn_987654321",
      status: "completed",
      amount: products[10].price * 3 + 50 - 150,
    },
    status: "order_placed",
    subtotal: products[10].price * 3,
    discount: 150,
    delivery: 50,
    couponCode: "SAVE150",
    couponDiscount: 150,
    total: products[10].price * 3 + 50 - 150,
    timeline: generateTimeline("order_placed", new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()),
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "order-004",
    userId: "user-2",
    items: [
      {
        id: "item-5",
        productId: products[20].id,
        productName: products[20].name,
        productImage: products[20].images[0],
        quantity: 1,
        price: products[20].price,
        mrp: products[20].mrp,
      },
    ],
    address: {
      name: "Jane Smith",
      phone: "9876543211",
      addressLine1: "123 Main Street",
      city: "Delhi",
      state: "Delhi",
      pincode: "110001",
      country: "India",
    },
    payment: {
      method: "upi",
      transactionId: "upi_123456",
      status: "completed",
      amount: products[20].price + 50,
    },
    status: "cancelled",
    subtotal: products[20].price,
    discount: 0,
    delivery: 50,
    total: products[20].price + 50,
    timeline: generateTimeline("cancelled", new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()),
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

