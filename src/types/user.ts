export type UserRole = "super_admin" | "admin" | "staff" | "delivery_staff" | "user";

export interface Address {
  id: string;
  name: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  isDefault: boolean;
  type?: "home" | "work" | "other";
}

export interface PaymentMethod {
  id: string;
  type: "card" | "upi" | "wallet";
  last4?: string;
  brand?: string;
  isDefault: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  addresses: Address[];
  paymentMethods: PaymentMethod[];
  createdAt: string;
  updatedAt: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  token?: string;
}

