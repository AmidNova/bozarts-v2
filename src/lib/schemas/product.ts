import { z } from "zod";
import {
  PRODUCT_NAME_MAX,
  PRODUCT_DESCRIPTION_MAX,
  PRODUCT_PRICE_MIN,
  PRODUCT_PRICE_MAX,
} from "@/lib/constants";

export const ProductCategory = z.enum([
  "CERAMIQUE",
  "MOBILIER",
  "BIJOUX",
  "TEXTILE",
  "PEINTURE",
  "SCULPTURE",
  "AUTRE",
]);

export type ProductCategory = z.infer<typeof ProductCategory>;

export const CreateProductSchema = z.object({
  name: z.string().min(1, "Le nom est requis").max(PRODUCT_NAME_MAX),
  description: z.string().max(PRODUCT_DESCRIPTION_MAX).optional(),
  price: z.coerce
    .number()
    .min(PRODUCT_PRICE_MIN, "Le prix minimum est 0.01€")
    .max(PRODUCT_PRICE_MAX),
  imageUrl: z.string().url("URL invalide").optional(),
  category: ProductCategory.default("AUTRE"),
  inStock: z.coerce.boolean().default(true),
});

export type CreateProductInput = z.infer<typeof CreateProductSchema>;

export const UpdateProductSchema = CreateProductSchema.partial();

export type UpdateProductInput = z.infer<typeof UpdateProductSchema>;

export const ProductFilterSchema = z.object({
  search: z.string().optional(),
  category: ProductCategory.optional(),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
  inStock: z.coerce.boolean().optional(),
  artisanId: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});

export type ProductFilter = z.infer<typeof ProductFilterSchema>;
