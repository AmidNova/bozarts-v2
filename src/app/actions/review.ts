"use server";

import { requireAuth, requireAdmin } from "@/lib/auth-guard";
import { reviewRepository } from "@/lib/repositories/review";
import { CreateReviewSchema } from "@/lib/schemas/review";
import { ok, fail, type ActionResult } from "@/lib/action-result";
import { revalidatePath } from "next/cache";

export async function createReview(
  formData: FormData
): Promise<ActionResult<{ id: string }>> {
  const auth = await requireAuth();
  if (!auth.authenticated) return fail(auth.error);

  const parsed = CreateReviewSchema.safeParse({
    productId: formData.get("productId"),
    rating: formData.get("rating"),
    comment: formData.get("comment") || undefined,
  });
  if (!parsed.success) {
    return fail(parsed.error.issues[0]?.message ?? "Données invalides");
  }

  const alreadyReviewed = await reviewRepository.hasReviewed(
    auth.user.id,
    parsed.data.productId
  );
  if (alreadyReviewed) {
    return fail("Vous avez deja donne votre avis sur ce produit");
  }

  try {
    const review = await reviewRepository.create(auth.user.id, parsed.data);
    revalidatePath(`/products/${parsed.data.productId}`);
    return ok({ id: review.id });
  } catch {
    return fail("Erreur lors de la creation de l'avis");
  }
}

export async function approveReview(
  reviewId: string
): Promise<ActionResult<void>> {
  const auth = await requireAdmin();
  if (!auth.authenticated) return fail(auth.error);

  try {
    await reviewRepository.approve(reviewId);
    revalidatePath("/admin/reviews");
    return ok(undefined);
  } catch {
    return fail("Erreur lors de l'approbation de l'avis");
  }
}

export async function deleteReview(
  reviewId: string
): Promise<ActionResult<void>> {
  const auth = await requireAdmin();
  if (!auth.authenticated) return fail(auth.error);

  try {
    await reviewRepository.delete(reviewId);
    revalidatePath("/admin/reviews");
    return ok(undefined);
  } catch {
    return fail("Erreur lors de la suppression de l'avis");
  }
}
