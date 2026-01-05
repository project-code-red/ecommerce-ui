export type OrderStatus =
  | "order_placed"
  | "packed"
  | "shipped"
  | "out_for_delivery"
  | "delivered"
  | "cancelled"
  | "returned"
  | "refund_completed";

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  quantity: number;
  size?: string;
  color?: string;
  price: number;
  mrp: number;
}

export interface OrderAddress {
  name: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

export interface OrderPayment {
  method: "stripe" | "cod" | "upi" | "wallet";
  transactionId?: string;
  status: "pending" | "completed" | "failed" | "refunded";
  amount: number;
}

export interface OrderTimelineEvent {
  status: OrderStatus;
  timestamp: string;
  message?: string;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  address: OrderAddress;
  payment: OrderPayment;
  status: OrderStatus;
  subtotal: number;
  discount: number;
  delivery: number;
  total: number;
  couponCode?: string;
  couponDiscount?: number;
  timeline: OrderTimelineEvent[];
  createdAt: string;
  updatedAt: string;
}

