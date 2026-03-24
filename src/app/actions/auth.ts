"use server";

import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { RegisterSchema } from "@/lib/schemas/auth";
import { ok, fail, type ActionResult } from "@/lib/action-result";

export async function register(
  formData: FormData
): Promise<ActionResult<{ id: string }>> {
  const parsed = RegisterSchema.safeParse({
    name: formData.get("name"),
    firstName: formData.get("firstName"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
    role: formData.get("role"),
  });

  if (!parsed.success) {
    return fail(parsed.error.issues[0]?.message ?? "Donnees invalides");
  }

  const { name, firstName, email, password, role } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return fail("Un compte avec cet email existe deja");
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: {
        name,
        firstName,
        email,
        password: hashedPassword,
        role,
      },
    });
    return ok({ id: user.id });
  } catch {
    return fail("Erreur lors de la creation du compte");
  }
}
