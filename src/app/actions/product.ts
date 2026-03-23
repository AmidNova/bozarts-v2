"use server";

import { requireArtisan } from "@/lib/auth-guard";
import { productRepository } from "@/lib/repositories/product";
import { CreateProductSchema, UpdateProductSchema } from "@/lib/schemas/product";
import { ok, fail, type ActionResult } from "@/lib/action-result";
import { revalidatePath } from "next/cache";

export async function createProduct(
  formData: FormData
): Promise<ActionResult<{ id: string }>> {
  const auth = await requireArtisan();
  if (!auth.authenticated) return fail(auth.error);

  const raw = {
    name: formData.get("name"),
    description: formData.get("description") || undefined,
    price: formData.get("price"),
    imageUrl: formData.get("imageUrl") || undefined,
    category: formData.get("category") || undefined,
    inStock: formData.get("inStock") ?? true,
  };

  const parsed = CreateProductSchema.safeParse(raw);
  if (!parsed.success) {
    return fail(parsed.error.issues[0]?.message ?? "Données invalides");
  }

  try {
    const product = await productRepository.create(auth.user.id, parsed.data);
    revalidatePath("/products");
    revalidatePath("/my-products");
    return ok({ id: product.id });
  } catch {
    return fail("Erreur lors de la création du produit");
  }
}

export async function updateProduct(
  productId: string,
  formData: FormData
): Promise<ActionResult<{ id: string }>> {
  const auth = await requireArtisan();
  if (!auth.authenticated) return fail(auth.error);

  const raw = {
    name: formData.get("name") || undefined,
    description: formData.get("description") || undefined,
    price: formData.get("price") || undefined,
    imageUrl: formData.get("imageUrl") || undefined,
    category: formData.get("category") || undefined,
    inStock: formData.get("inStock") ?? undefined,
  };

  const parsed = UpdateProductSchema.safeParse(raw);
  if (!parsed.success) {
    return fail(parsed.error.issues[0]?.message ?? "Données invalides");
  }

  try {
    const product = await productRepository.update(productId, auth.user.id, parsed.data);
    revalidatePath("/products");
    revalidatePath(`/products/${product.id}`);
    revalidatePath("/my-products");
    return ok({ id: product.id });
  } catch {
    return fail("Produit introuvable ou non autorisé");
  }
}

export async function deleteProduct(
  productId: string
): Promise<ActionResult<void>> {
  const auth = await requireArtisan();
  if (!auth.authenticated) return fail(auth.error);

  try {
    await productRepository.delete(productId, auth.user.id);
    revalidatePath("/products");
    revalidatePath("/my-products");
    return ok(undefined);
  } catch {
    return fail("Produit introuvable ou non autorisé");
  }
}
