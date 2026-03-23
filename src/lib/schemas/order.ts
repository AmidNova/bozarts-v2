import { z } from "zod";

export const OrderStatus = z.enum([
  "PENDING",
  "CONFIRMED",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
]);

export type OrderStatus = z.infer<typeof OrderStatus>;

export const CreateOrderSchema = z.object({
  shippingAddress: z.string().min(1, "L'adresse de livraison est requise"),
});

export type CreateOrderInput = z.infer<typeof CreateOrderSchema>;

export const UpdateOrderStatusSchema = z.object({
  orderId: z.string().min(1, "Order ID requis"),
  status: OrderStatus,
});

export type UpdateOrderStatusInput = z.infer<typeof UpdateOrderStatusSchema>;

export const OrderFilterSchema = z.object({
  status: OrderStatus.optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});

export type OrderFilter = z.infer<typeof OrderFilterSchema>;
