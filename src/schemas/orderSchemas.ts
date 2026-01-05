import { z } from "zod";

export const orderStatusUpdateSchema = z.object({
  status: z.enum([
    "order_placed",
    "packed",
    "shipped",
    "out_for_delivery",
    "delivered",
    "cancelled",
    "returned",
    "refund_completed",
  ]),
  message: z.string().optional(),
});

export type OrderStatusUpdateInput = z.infer<typeof orderStatusUpdateSchema>;

