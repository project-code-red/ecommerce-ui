import { z } from "zod";

export const couponSchema = z.object({
  code: z.string().min(3, "Code must be at least 3 characters").toUpperCase(),
  type: z.enum(["percentage", "fixed"]),
  value: z.number().positive("Value must be positive"),
  minPurchase: z.number().positive().optional(),
  maxDiscount: z.number().positive().optional(),
  applicableTo: z.enum(["all", "category", "product"]),
  applicableIds: z.array(z.string()).optional(),
  validFrom: z.string().or(z.date()),
  validUntil: z.string().or(z.date()),
  usageLimit: z.number().int().positive().optional(),
  description: z.string().optional(),
  isActive: z.boolean().default(true),
}).refine((data) => {
  if (data.type === "percentage" && data.value > 100) {
    return false;
  }
  return true;
}, {
  message: "Percentage discount cannot exceed 100%",
  path: ["value"],
}).refine((data) => {
  const from = new Date(data.validFrom);
  const until = new Date(data.validUntil);
  return until > from;
}, {
  message: "Valid until must be after valid from",
  path: ["validUntil"],
});

export type CouponInput = z.infer<typeof couponSchema>;

