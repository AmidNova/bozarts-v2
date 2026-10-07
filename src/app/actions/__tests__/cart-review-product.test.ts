import { describe, it, expect, vi, beforeEach } from "vitest";

const mocks = vi.hoisted(() => ({
  requireAuth: vi.fn(),
  requireAdmin: vi.fn(),
  requireArtisan: vi.fn(),
  cartRepository: { addItem: vi.fn(), updateQuantity: vi.fn(), removeItem: vi.fn(), clear: vi.fn() },
  reviewRepository: { hasReviewed: vi.fn(), create: vi.fn(), approve: vi.fn(), delete: vi.fn() },
  productRepository: { create: vi.fn(), update: vi.fn(), delete: vi.fn() },
}));

vi.mock("@/lib/auth-guard", () => ({
  requireAuth: mocks.requireAuth,
  requireAdmin: mocks.requireAdmin,
  requireArtisan: mocks.requireArtisan,
}));
vi.mock("@/lib/repositories/cart", () => ({ cartRepository: mocks.cartRepository }));
vi.mock("@/lib/repositories/review", () => ({ reviewRepository: mocks.reviewRepository }));
vi.mock("@/lib/repositories/product", () => ({ productRepository: mocks.productRepository }));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));

import { addToCart, updateCartQuantity } from "@/app/actions/cart";
import { createReview, approveReview } from "@/app/actions/review";
import { createProduct, updateProduct } from "@/app/actions/product";

const { cartRepository, reviewRepository, productRepository } = mocks;

const user = (id: string, role: string) => ({ authenticated: true, user: { id, role } });
const denied = (error: string) => ({ authenticated: false, error });

const form = (data: Record<string, string>) => {
  const fd = new FormData();
  Object.entries(data).forEach(([k, v]) => fd.append(k, v));
  return fd;
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe("cart actions", () => {
  it("adds an item with quantity 1 by default for the logged-in user", async () => {
    mocks.requireAuth.mockResolvedValue(user("client-1", "CLIENT"));
    cartRepository.addItem.mockResolvedValue({ id: "item-1" });

    const result = await addToCart(form({ productId: "p1" }));

    expect(cartRepository.addItem).toHaveBeenCalledWith("client-1", "p1", 1);
    expect(result).toEqual({ success: true, data: { id: "item-1" } });
  });

  it("rejects an out-of-range quantity before touching the database", async () => {
    mocks.requireAuth.mockResolvedValue(user("client-1", "CLIENT"));
    const result = await updateCartQuantity(form({ cartItemId: "item-1", quantity: "0" }));
    expect(result.success).toBe(false);
    expect(cartRepository.updateQuantity).not.toHaveBeenCalled();
  });

  it("hides database errors behind a user-facing message", async () => {
    mocks.requireAuth.mockResolvedValue(user("client-1", "CLIENT"));
    cartRepository.addItem.mockRejectedValue(new Error("FK violation on product"));
    expect(await addToCart(form({ productId: "p1" }))).toEqual({
      success: false,
      error: "Erreur lors de l'ajout au panier",
    });
  });
});

describe("review actions", () => {
  it("prevents reviewing the same product twice", async () => {
    mocks.requireAuth.mockResolvedValue(user("client-1", "CLIENT"));
    reviewRepository.hasReviewed.mockResolvedValue(true);

    const result = await createReview(form({ productId: "p1", rating: "4" }));

    expect(result).toEqual({
      success: false,
      error: "Vous avez deja donne votre avis sur ce produit",
    });
    expect(reviewRepository.create).not.toHaveBeenCalled();
  });

  it("creates a review with an optional empty comment omitted", async () => {
    mocks.requireAuth.mockResolvedValue(user("client-1", "CLIENT"));
    reviewRepository.hasReviewed.mockResolvedValue(false);
    reviewRepository.create.mockResolvedValue({ id: "review-1" });

    const result = await createReview(form({ productId: "p1", rating: "4", comment: "" }));

    expect(reviewRepository.create).toHaveBeenCalledWith("client-1", {
      productId: "p1",
      rating: 4,
      comment: undefined,
    });
    expect(result).toEqual({ success: true, data: { id: "review-1" } });
  });

  it("only lets admins approve reviews", async () => {
    mocks.requireAdmin.mockResolvedValue(denied("Réservé aux administrateurs"));
    expect(await approveReview("review-1")).toEqual({
      success: false,
      error: "Réservé aux administrateurs",
    });
    expect(reviewRepository.approve).not.toHaveBeenCalled();
  });
});

describe("product actions", () => {
  it("only lets artisans create products", async () => {
    mocks.requireArtisan.mockResolvedValue(denied("Réservé aux artisans"));
    const result = await createProduct(form({ name: "Vase", price: "20" }));
    expect(result).toEqual({ success: false, error: "Réservé aux artisans" });
    expect(productRepository.create).not.toHaveBeenCalled();
  });

  it("creates the product under the artisan's id with parsed values", async () => {
    mocks.requireArtisan.mockResolvedValue(user("artisan-1", "ARTISAN"));
    productRepository.create.mockResolvedValue({ id: "product-1" });

    await createProduct(form({ name: "Vase", price: "20.5", category: "CERAMIQUE" }));

    expect(productRepository.create).toHaveBeenCalledWith(
      "artisan-1",
      expect.objectContaining({ name: "Vase", price: 20.5, category: "CERAMIQUE" }),
    );
  });

  it("reports a failed update (other artisan's product) as not found", async () => {
    mocks.requireArtisan.mockResolvedValue(user("artisan-2", "ARTISAN"));
    productRepository.update.mockRejectedValue(new Error("Record to update not found"));

    const result = await updateProduct("product-1", form({ name: "Volé" }));

    expect(productRepository.update).toHaveBeenCalledWith(
      "product-1",
      "artisan-2",
      expect.objectContaining({ name: "Volé" }),
    );
    expect(result).toEqual({ success: false, error: "Produit introuvable ou non autorisé" });
  });
});
