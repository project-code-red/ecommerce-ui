import { z } from "zod";

export const addressSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(10, "Invalid phone number"),
  addressLine1: z.string().min(5, "Address must be at least 5 characters"),
  addressLine2: z.string().optional(),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  pincode: z.string().min(6, "Pincode must be 6 digits"),
  country: z.string().min(2, "Country is required"),
  isDefault: z.boolean().default(false),
  type: z.enum(["home", "work", "other"]).optional(),
});

export type AddressInput = z.infer<typeof addressSchema>;

