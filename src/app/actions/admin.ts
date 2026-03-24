"use server";

import { requireAdmin } from "@/lib/auth-guard";
import { userRepository } from "@/lib/repositories/user";
import { orderRepository } from "@/lib/repositories/order";
import { productRepository } from "@/lib/repositories/product";
import { eventRepository } from "@/lib/repositories/event";
import { cmsRepository } from "@/lib/repositories/cms";
import { CreateCguSchema, CreateFaqSchema } from "@/lib/schemas/admin";
import { ok, fail, type ActionResult } from "@/lib/action-result";
import { revalidatePath } from "next/cache";
import type { UserRole, UserStatus } from "@/generated/prisma/client";

// ─── User management ────────────────────────────────────────────

export async function updateUserStatus(
  userId: string,
  status: UserStatus
): Promise<ActionResult<void>> {
  const auth = await requireAdmin();
  if (!auth.authenticated) return fail(auth.error);

  if (userId === auth.user.id) {
    return fail("Vous ne pouvez pas modifier votre propre statut");
  }

  try {
    await userRepository.updateStatus(userId, status);
    revalidatePath("/admin/users");
    return ok(undefined);
  } catch {
    return fail("Erreur lors de la mise a jour du statut");
  }
}

export async function updateUserRole(
  userId: string,
  role: UserRole
): Promise<ActionResult<void>> {
  const auth = await requireAdmin();
  if (!auth.authenticated) return fail(auth.error);

  if (userId === auth.user.id) {
    return fail("Vous ne pouvez pas modifier votre propre role");
  }

  try {
    await userRepository.updateRole(userId, role);
    revalidatePath("/admin/users");
    return ok(undefined);
  } catch {
    return fail("Erreur lors de la mise a jour du role");
  }
}

// ─── Product management ─────────────────────────────────────────

export async function deleteProductAdmin(
  productId: string
): Promise<ActionResult<void>> {
  const auth = await requireAdmin();
  if (!auth.authenticated) return fail(auth.error);

  try {
    await productRepository.deleteAdmin(productId);
    revalidatePath("/admin/products");
    return ok(undefined);
  } catch {
    return fail("Erreur lors de la suppression du produit");
  }
}

export async function toggleProductStock(
  productId: string,
  inStock: boolean
): Promise<ActionResult<void>> {
  const auth = await requireAdmin();
  if (!auth.authenticated) return fail(auth.error);

  try {
    await productRepository.updateStock(productId, inStock);
    revalidatePath("/admin/products");
    return ok(undefined);
  } catch {
    return fail("Erreur lors de la mise a jour du stock");
  }
}

// ─── Order management ───────────────────────────────────────────

export async function updateOrderStatusAdmin(
  orderId: string,
  status: string
): Promise<ActionResult<void>> {
  const auth = await requireAdmin();
  if (!auth.authenticated) return fail(auth.error);

  try {
    await orderRepository.updateStatus(
      orderId,
      status as import("@/generated/prisma/client").OrderStatus
    );
    revalidatePath("/admin/orders");
    return ok(undefined);
  } catch {
    return fail("Erreur lors de la mise a jour du statut");
  }
}

// ─── Event management ───────────────────────────────────────────

export async function deleteEventAdmin(
  eventId: string
): Promise<ActionResult<void>> {
  const auth = await requireAdmin();
  if (!auth.authenticated) return fail(auth.error);

  try {
    await eventRepository.deleteAdmin(eventId);
    revalidatePath("/admin/events");
    return ok(undefined);
  } catch {
    return fail("Erreur lors de la suppression de l'evenement");
  }
}

// ─── CMS: CGU ───────────────────────────────────────────────────

export async function createCgu(
  formData: FormData
): Promise<ActionResult<{ id: string }>> {
  const auth = await requireAdmin();
  if (!auth.authenticated) return fail(auth.error);

  const parsed = CreateCguSchema.safeParse({
    title: formData.get("title"),
    content: formData.get("content"),
  });
  if (!parsed.success) {
    return fail(parsed.error.issues[0]?.message ?? "Donnees invalides");
  }

  try {
    const section = await cmsRepository.createCgu(parsed.data);
    revalidatePath("/admin/cgu");
    return ok({ id: section.id });
  } catch {
    return fail("Erreur lors de la creation de la section");
  }
}

export async function updateCgu(
  id: string,
  formData: FormData
): Promise<ActionResult<void>> {
  const auth = await requireAdmin();
  if (!auth.authenticated) return fail(auth.error);

  const data: Record<string, string> = {};
  const title = formData.get("title");
  const content = formData.get("content");
  if (typeof title === "string" && title) data.title = title;
  if (typeof content === "string" && content) data.content = content;

  try {
    await cmsRepository.updateCgu(id, data);
    revalidatePath("/admin/cgu");
    return ok(undefined);
  } catch {
    return fail("Erreur lors de la mise a jour de la section");
  }
}

export async function deleteCgu(id: string): Promise<ActionResult<void>> {
  const auth = await requireAdmin();
  if (!auth.authenticated) return fail(auth.error);

  try {
    await cmsRepository.deleteCgu(id);
    revalidatePath("/admin/cgu");
    return ok(undefined);
  } catch {
    return fail("Erreur lors de la suppression de la section");
  }
}

export async function reorderCgu(
  orderedIds: string[]
): Promise<ActionResult<void>> {
  const auth = await requireAdmin();
  if (!auth.authenticated) return fail(auth.error);

  try {
    await cmsRepository.reorderCgu(orderedIds);
    revalidatePath("/admin/cgu");
    return ok(undefined);
  } catch {
    return fail("Erreur lors du reordonnement");
  }
}

// ─── CMS: FAQ ───────────────────────────────────────────────────

export async function createFaq(
  formData: FormData
): Promise<ActionResult<{ id: string }>> {
  const auth = await requireAdmin();
  if (!auth.authenticated) return fail(auth.error);

  const parsed = CreateFaqSchema.safeParse({
    question: formData.get("question"),
    answerTitle: formData.get("answerTitle"),
    answerContent: formData.get("answerContent"),
  });
  if (!parsed.success) {
    return fail(parsed.error.issues[0]?.message ?? "Donnees invalides");
  }

  try {
    const entry = await cmsRepository.createFaq(parsed.data);
    revalidatePath("/admin/faq");
    return ok({ id: entry.id });
  } catch {
    return fail("Erreur lors de la creation de l'entree");
  }
}

export async function updateFaq(
  id: string,
  formData: FormData
): Promise<ActionResult<void>> {
  const auth = await requireAdmin();
  if (!auth.authenticated) return fail(auth.error);

  const data: Record<string, string> = {};
  const question = formData.get("question");
  const answerTitle = formData.get("answerTitle");
  const answerContent = formData.get("answerContent");
  if (typeof question === "string" && question) data.question = question;
  if (typeof answerTitle === "string" && answerTitle) data.answerTitle = answerTitle;
  if (typeof answerContent === "string" && answerContent) data.answerContent = answerContent;

  try {
    await cmsRepository.updateFaq(id, data);
    revalidatePath("/admin/faq");
    return ok(undefined);
  } catch {
    return fail("Erreur lors de la mise a jour de l'entree");
  }
}

export async function deleteFaq(id: string): Promise<ActionResult<void>> {
  const auth = await requireAdmin();
  if (!auth.authenticated) return fail(auth.error);

  try {
    await cmsRepository.deleteFaq(id);
    revalidatePath("/admin/faq");
    return ok(undefined);
  } catch {
    return fail("Erreur lors de la suppression de l'entree");
  }
}

export async function reorderFaq(
  orderedIds: string[]
): Promise<ActionResult<void>> {
  const auth = await requireAdmin();
  if (!auth.authenticated) return fail(auth.error);

  try {
    await cmsRepository.reorderFaq(orderedIds);
    revalidatePath("/admin/faq");
    return ok(undefined);
  } catch {
    return fail("Erreur lors du reordonnement");
  }
}
