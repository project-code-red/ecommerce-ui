import { z } from "zod";

export const productVariantSchema = z.object({
  sizes: z.array(z.string()).optional(),
  colors: z.array(z.string()).optional(),
});

export const productSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  images: z.array(z.string().url()).min(1, "At least one image is required"),
  price: z.number().positive("Price must be positive"),
  mrp: z.number().positive("MRP must be positive"),
  stock: z.number().int().min(0, "Stock cannot be negative"),
  category: z.string().min(1, "Category is required"),
  subCategory: z.string().min(1, "Subcategory is required"),
  subSubCategory: z.string().optional(),
  type: z.string().optional(),
  variants: productVariantSchema,
  specifications: z.record(z.string(), z.union([z.string(), z.number(), z.boolean()])).optional(),
  features: z.array(z.string()).optional(),
  deliveryEstimate: z.string().default("3-5 days"),
  returnInfo: z.string().default("10-day return"),
  codAvailable: z.boolean().default(true),
  isActive: z.boolean().default(true),
}).refine((data) => data.mrp >= data.price, {
  message: "MRP must be greater than or equal to price",
  path: ["mrp"],
});

export type ProductInput = z.infer<typeof productSchema>;

