"use server";

import { requireAuth } from "@/lib/auth-guard";
import { messageRepository } from "@/lib/repositories/message";
import { SendMessageSchema } from "@/lib/schemas/message";
import { ok, fail, type ActionResult } from "@/lib/action-result";
import { revalidatePath } from "next/cache";

export async function sendMessage(
  formData: FormData
): Promise<ActionResult<{ id: string }>> {
  const auth = await requireAuth();
  if (!auth.authenticated) return fail(auth.error);

  const parsed = SendMessageSchema.safeParse({
    receiverId: formData.get("receiverId"),
    subject: formData.get("subject") || undefined,
    content: formData.get("content"),
  });
  if (!parsed.success) {
    return fail(parsed.error.issues[0]?.message ?? "Données invalides");
  }

  if (parsed.data.receiverId === auth.user.id) {
    return fail("Vous ne pouvez pas vous envoyer un message");
  }

  try {
    const message = await messageRepository.send(auth.user.id, parsed.data);
    revalidatePath("/messages");
    revalidatePath(`/messages/${parsed.data.receiverId}`);
    return ok({ id: message.id });
  } catch {
    return fail("Erreur lors de l'envoi du message");
  }
}
