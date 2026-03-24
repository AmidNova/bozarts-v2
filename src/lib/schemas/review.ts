import { z } from "zod";
import { REVIEW_RATING_MIN, REVIEW_RATING_MAX } from "@/lib/constants";

export const CreateReviewSchema = z.object({
  productId: z.string().min(1, "Produit requis"),
  rating: z.coerce
    .number()
    .int()
    .min(REVIEW_RATING_MIN, "Note minimum : 1")
    .max(REVIEW_RATING_MAX, "Note maximum : 5"),
  comment: z.string().max(2000).optional(),
});

export type CreateReviewInput = z.infer<typeof CreateReviewSchema>;
