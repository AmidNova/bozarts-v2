"use server";

import { requireAuth } from "@/lib/auth-guard";
import { orderRepository } from "@/lib/repositories/order";
import { CreateOrderSchema, UpdateOrderStatusSchema } from "@/lib/schemas/order";
import { ok, fail, type ActionResult } from "@/lib/action-result";
import { revalidatePath } from "next/cache";

export async function createOrder(
  formData: FormData
): Promise<ActionResult<{ id: string }>> {
  const auth = await requireAuth();
  if (!auth.authenticated) return fail(auth.error);

  const parsed = CreateOrderSchema.safeParse({
    shippingAddress: formData.get("shippingAddress"),
  });
  if (!parsed.success) {
    return fail(parsed.error.issues[0]?.message ?? "Données invalides");
  }

  try {
    const order = await orderRepository.createFromCart(
      auth.user.id,
      parsed.data.shippingAddress
    );
    revalidatePath("/cart");
    revalidatePath("/orders");
    return ok({ id: order.id });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Erreur lors de la commande";
    return fail(message);
  }
}

export async function updateOrderStatus(
  formData: FormData
): Promise<ActionResult<void>> {
  const auth = await requireAuth();
  if (!auth.authenticated) return fail(auth.error);

  if (auth.user.role !== "ARTISAN" && auth.user.role !== "ADMIN") {
    return fail("Non autorisé");
  }

  const parsed = UpdateOrderStatusSchema.safeParse({
    orderId: formData.get("orderId"),
    status: formData.get("status"),
  });
  if (!parsed.success) {
    return fail(parsed.error.issues[0]?.message ?? "Données invalides");
  }

  try {
    if (auth.user.role === "ARTISAN") {
      const order = await orderRepository.findById(parsed.data.orderId);
      if (!order) return fail("Commande introuvable");

      const hasOwnProducts = order.items.some(
        (item) => item.product.artisan.id === auth.user.id
      );
      if (!hasOwnProducts) return fail("Non autorisé");
    }

    await orderRepository.updateStatus(parsed.data.orderId, parsed.data.status);
    revalidatePath("/orders");
    revalidatePath("/my-orders");
    return ok(undefined);
  } catch {
    return fail("Erreur lors de la mise à jour du statut");
  }
}

export async function cancelOrder(
  orderId: string
): Promise<ActionResult<void>> {
  const auth = await requireAuth();
  if (!auth.authenticated) return fail(auth.error);

  const order = await orderRepository.findById(orderId);
  if (!order) return fail("Commande introuvable");

  if (order.clientId !== auth.user.id && auth.user.role !== "ADMIN") {
    return fail("Non autorisé");
  }

  if (order.status === "DELIVERED" || order.status === "CANCELLED") {
    return fail("Impossible d'annuler cette commande");
  }

  try {
    await orderRepository.updateStatus(orderId, "CANCELLED");
    revalidatePath("/orders");
    revalidatePath("/my-orders");
    return ok(undefined);
  } catch {
    return fail("Erreur lors de l'annulation");
  }
}
