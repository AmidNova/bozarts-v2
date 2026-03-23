import { z } from "zod";

export const UpdateProfileSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  firstName: z.string().min(1).max(100).optional(),
  description: z.string().max(2000).optional(),
  address: z.string().max(500).optional(),
  phone: z
    .string()
    .regex(/^[+]?[\d\s()-]{6,20}$/, "Numéro de téléphone invalide")
    .optional(),
  image: z.string().url("URL invalide").optional(),
});

export type UpdateProfileInput = z.infer<typeof UpdateProfileSchema>;
