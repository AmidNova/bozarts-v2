import { z } from "zod";
import { CART_QUANTITY_MIN, CART_QUANTITY_MAX } from "@/lib/constants";

export const AddToCartSchema = z.object({
  productId: z.string().min(1, "Product ID requis"),
  quantity: z.coerce
    .number()
    .int()
    .min(CART_QUANTITY_MIN)
    .max(CART_QUANTITY_MAX)
    .default(1),
});

export type AddToCartInput = z.infer<typeof AddToCartSchema>;

export const UpdateCartSchema = z.object({
  cartItemId: z.string().min(1, "Cart item ID requis"),
  quantity: z.coerce
    .number()
    .int()
    .min(CART_QUANTITY_MIN)
    .max(CART_QUANTITY_MAX),
});

export type UpdateCartInput = z.infer<typeof UpdateCartSchema>;

export const RemoveFromCartSchema = z.object({
  cartItemId: z.string().min(1, "Cart item ID requis"),
});

export type RemoveFromCartInput = z.infer<typeof RemoveFromCartSchema>;
