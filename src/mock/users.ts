import { User, Address, PaymentMethod } from "@/types/user";

const addresses: Address[] = [
  {
    id: "addr-1",
    name: "John Doe",
    phone: "9876543210",
    addressLine1: "123 Main Street",
    addressLine2: "Apartment 4B",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400001",
    country: "India",
    isDefault: true,
    type: "home",
  },
  {
    id: "addr-2",
    name: "John Doe",
    phone: "9876543210",
    addressLine1: "456 Office Complex",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400002",
    country: "India",
    isDefault: false,
    type: "work",
  },
];

const paymentMethods: PaymentMethod[] = [
  {
    id: "pm-1",
    type: "card",
    last4: "4242",
    brand: "visa",
    isDefault: true,
  },
  {
    id: "pm-2",
    type: "upi",
    isDefault: false,
  },
];

export const users: User[] = [
  {
    id: "user-1",
    name: "John Doe",
    email: "john@example.com",
    phone: "9876543210",
    role: "user",
    addresses,
    paymentMethods,
    createdAt: new Date("2024-01-15").toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "user-2",
    name: "Jane Smith",
    email: "jane@example.com",
    phone: "9876543211",
    role: "user",
    addresses: [
      {
        ...addresses[0],
        id: "addr-3",
        name: "Jane Smith",
        isDefault: true,
      },
    ],
    paymentMethods: [paymentMethods[0]],
    createdAt: new Date("2024-02-20").toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "admin-1",
    name: "Admin User",
    email: "admin@example.com",
    phone: "9876543212",
    role: "super_admin",
    addresses: [],
    paymentMethods: [],
    createdAt: new Date("2024-01-01").toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "admin-2",
    name: "Staff User",
    email: "staff@example.com",
    phone: "9876543213",
    role: "admin",
    addresses: [],
    paymentMethods: [],
    createdAt: new Date("2024-01-10").toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const currentUserId = "user-1";

