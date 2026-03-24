"use server";

import { requireAuth, requireArtisan } from "@/lib/auth-guard";
import { eventRepository } from "@/lib/repositories/event";
import { CreateEventSchema, UpdateEventSchema } from "@/lib/schemas/event";
import { ok, fail, type ActionResult } from "@/lib/action-result";
import { revalidatePath } from "next/cache";

export async function createEvent(
  formData: FormData
): Promise<ActionResult<{ id: string }>> {
  const auth = await requireArtisan();
  if (!auth.authenticated) return fail(auth.error);

  const parsed = CreateEventSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    startDate: formData.get("startDate"),
    endDate: formData.get("endDate"),
    location: formData.get("location"),
    imageUrl: formData.get("imageUrl") || undefined,
  });
  if (!parsed.success) {
    return fail(parsed.error.issues[0]?.message ?? "Données invalides");
  }

  try {
    const event = await eventRepository.create(auth.user.id, parsed.data);
    revalidatePath("/events");
    return ok({ id: event.id });
  } catch {
    return fail("Erreur lors de la creation de l'evenement");
  }
}

export async function updateEvent(
  eventId: string,
  formData: FormData
): Promise<ActionResult<{ id: string }>> {
  const auth = await requireArtisan();
  if (!auth.authenticated) return fail(auth.error);

  const parsed = UpdateEventSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    startDate: formData.get("startDate"),
    endDate: formData.get("endDate"),
    location: formData.get("location"),
    imageUrl: formData.get("imageUrl") || undefined,
  });
  if (!parsed.success) {
    return fail(parsed.error.issues[0]?.message ?? "Données invalides");
  }

  try {
    const event = await eventRepository.update(eventId, auth.user.id, parsed.data);
    revalidatePath("/events");
    revalidatePath(`/events/${eventId}`);
    revalidatePath("/my-events");
    return ok({ id: event.id });
  } catch {
    return fail("Erreur lors de la mise a jour de l'evenement");
  }
}

export async function deleteEvent(
  eventId: string
): Promise<ActionResult<void>> {
  const auth = await requireArtisan();
  if (!auth.authenticated) return fail(auth.error);

  try {
    await eventRepository.delete(eventId, auth.user.id);
    revalidatePath("/events");
    revalidatePath("/my-events");
    return ok(undefined);
  } catch {
    return fail("Erreur lors de la suppression de l'evenement");
  }
}

export async function registerForEvent(
  eventId: string
): Promise<ActionResult<void>> {
  const auth = await requireAuth();
  if (!auth.authenticated) return fail(auth.error);

  const event = await eventRepository.findById(eventId);
  if (!event) return fail("Evenement introuvable");

  if (new Date() > event.endDate) {
    return fail("Cet evenement est termine");
  }

  const alreadyRegistered = await eventRepository.isRegistered(eventId, auth.user.id);
  if (alreadyRegistered) {
    return fail("Vous etes deja inscrit");
  }

  try {
    await eventRepository.register(eventId, auth.user.id);
    revalidatePath(`/events/${eventId}`);
    return ok(undefined);
  } catch {
    return fail("Erreur lors de l'inscription");
  }
}

export async function unregisterFromEvent(
  eventId: string
): Promise<ActionResult<void>> {
  const auth = await requireAuth();
  if (!auth.authenticated) return fail(auth.error);

  try {
    await eventRepository.unregister(eventId, auth.user.id);
    revalidatePath(`/events/${eventId}`);
    return ok(undefined);
  } catch {
    return fail("Erreur lors de la desinscription");
  }
}
