import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(1, "Mot de passe requis"),
});

export type LoginInput = z.infer<typeof LoginSchema>;

export const RegisterSchema = z
  .object({
    name: z.string().min(1, "Le nom est requis").max(100),
    firstName: z.string().min(1, "Le prenom est requis").max(100),
    email: z.string().email("Email invalide"),
    password: z
      .string()
      .min(8, "Le mot de passe doit contenir au moins 8 caracteres")
      .max(100),
    confirmPassword: z.string(),
    role: z.enum(["CLIENT", "ARTISAN"], {
      error: "Choisissez un role",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

export type RegisterInput = z.infer<typeof RegisterSchema>;
