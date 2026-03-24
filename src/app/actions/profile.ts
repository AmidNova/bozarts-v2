"use server";

import { requireAuth } from "@/lib/auth-guard";
import { userRepository } from "@/lib/repositories/user";
import { UpdateProfileSchema } from "@/lib/schemas/profile";
import { ok, fail, type ActionResult } from "@/lib/action-result";
import { revalidatePath } from "next/cache";

export async function updateProfile(
  formData: FormData
): Promise<ActionResult<{ id: string }>> {
  const auth = await requireAuth();
  if (!auth.authenticated) return fail(auth.error);

  const raw = {
    name: formData.get("name") || undefined,
    firstName: formData.get("firstName") || undefined,
    description: formData.get("description") || undefined,
    address: formData.get("address") || undefined,
    phone: formData.get("phone") || undefined,
    image: formData.get("image") || undefined,
  };

  const parsed = UpdateProfileSchema.safeParse(raw);
  if (!parsed.success) {
    return fail(parsed.error.issues[0]?.message ?? "Données invalides");
  }

  try {
    const user = await userRepository.updateProfile(auth.user.id, parsed.data);
    revalidatePath("/profile");
    return ok({ id: user.id });
  } catch {
    return fail("Erreur lors de la mise à jour du profil");
  }
}
