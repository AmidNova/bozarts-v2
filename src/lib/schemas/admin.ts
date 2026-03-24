import { z } from "zod";

// ─── User filters & actions ──────────────────────────────────────

export const UserRole = z.enum(["CLIENT", "ARTISAN", "ADMIN"]);
export const UserStatus = z.enum(["ACTIVE", "SUSPENDED", "PENDING"]);

export const AdminUserFilterSchema = z.object({
  search: z.string().optional(),
  role: UserRole.optional(),
  status: UserStatus.optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});

export type AdminUserFilter = z.infer<typeof AdminUserFilterSchema>;

// ─── CMS: CGU ────────────────────────────────────────────────────

export const CreateCguSchema = z.object({
  title: z.string().min(1, "Le titre est requis").max(255),
  content: z.string().min(1, "Le contenu est requis"),
});

export type CreateCguInput = z.infer<typeof CreateCguSchema>;

export const UpdateCguSchema = CreateCguSchema.partial();

export type UpdateCguInput = z.infer<typeof UpdateCguSchema>;

// ─── CMS: FAQ ────────────────────────────────────────────────────

export const CreateFaqSchema = z.object({
  question: z.string().min(1, "La question est requise").max(500),
  answerTitle: z.string().min(1, "Le titre de reponse est requis").max(255),
  answerContent: z.string().min(1, "Le contenu de reponse est requis"),
});

export type CreateFaqInput = z.infer<typeof CreateFaqSchema>;

export const UpdateFaqSchema = CreateFaqSchema.partial();

export type UpdateFaqInput = z.infer<typeof UpdateFaqSchema>;
