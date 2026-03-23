"use server";

import { requireAuth } from "@/lib/auth-guard";
import { cartRepository } from "@/lib/repositories/cart";
import { AddToCartSchema, UpdateCartSchema, RemoveFromCartSchema } from "@/lib/schemas/cart";
import { ok, fail, type ActionResult } from "@/lib/action-result";
import { revalidatePath } from "next/cache";

export async function addToCart(
  formData: FormData
): Promise<ActionResult<{ id: string }>> {
  const auth = await requireAuth();
  if (!auth.authenticated) return fail(auth.error);

  const parsed = AddToCartSchema.safeParse({
    productId: formData.get("productId"),
    quantity: formData.get("quantity") ?? 1,
  });
  if (!parsed.success) {
    return fail(parsed.error.issues[0]?.message ?? "Données invalides");
  }

  try {
    const item = await cartRepository.addItem(
      auth.user.id,
      parsed.data.productId,
      parsed.data.quantity
    );
    revalidatePath("/cart");
    return ok({ id: item.id });
  } catch {
    return fail("Erreur lors de l'ajout au panier");
  }
}

export async function updateCartQuantity(
  formData: FormData
): Promise<ActionResult<void>> {
  const auth = await requireAuth();
  if (!auth.authenticated) return fail(auth.error);

  const parsed = UpdateCartSchema.safeParse({
    cartItemId: formData.get("cartItemId"),
    quantity: formData.get("quantity"),
  });
  if (!parsed.success) {
    return fail(parsed.error.issues[0]?.message ?? "Données invalides");
  }

  try {
    await cartRepository.updateQuantity(parsed.data.cartItemId, auth.user.id, parsed.data.quantity);
    revalidatePath("/cart");
    return ok(undefined);
  } catch {
    return fail("Erreur lors de la mise à jour du panier");
  }
}

export async function removeFromCart(
  formData: FormData
): Promise<ActionResult<void>> {
  const auth = await requireAuth();
  if (!auth.authenticated) return fail(auth.error);

  const parsed = RemoveFromCartSchema.safeParse({
    cartItemId: formData.get("cartItemId"),
  });
  if (!parsed.success) {
    return fail(parsed.error.issues[0]?.message ?? "Données invalides");
  }

  try {
    await cartRepository.removeItem(parsed.data.cartItemId, auth.user.id);
    revalidatePath("/cart");
    return ok(undefined);
  } catch {
    return fail("Erreur lors de la suppression");
  }
}

export async function clearCart(): Promise<ActionResult<void>> {
  const auth = await requireAuth();
  if (!auth.authenticated) return fail(auth.error);

  try {
    await cartRepository.clear(auth.user.id);
    revalidatePath("/cart");
    return ok(undefined);
  } catch {
    return fail("Erreur lors du vidage du panier");
  }
}
