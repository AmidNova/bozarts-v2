import { describe, it, expect } from "vitest";
import { prisma } from "@/lib/prisma";
import { productRepository } from "@/lib/repositories/product";
import { reviewRepository } from "@/lib/repositories/review";
import { createProduct, createUser } from "./factories";

describe("productRepository ownership", () => {
  it("lets an artisan update their own product", async () => {
    const artisan = await createUser("ARTISAN");
    const vase = await createProduct(artisan.id, { price: 20 });

    const updated = await productRepository.update(vase.id, artisan.id, { price: 30 });

    expect(Number(updated.price)).toBe(30);
  });

  it("refuses updates and deletes from another artisan", async () => {
    const [owner, other] = await Promise.all([createUser("ARTISAN"), createUser("ARTISAN")]);
    const vase = await createProduct(owner.id, { name: "Vase" });

    await expect(productRepository.update(vase.id, other.id, { name: "Volé" })).rejects.toThrow();
    await expect(productRepository.delete(vase.id, other.id)).rejects.toThrow();

    const stored = await prisma.product.findUnique({ where: { id: vase.id } });
    expect(stored?.name).toBe("Vase");
  });
});

describe("reviewRepository", () => {
  it("attaches the review to the product's artisan and keeps it unapproved", async () => {
    const [client, artisan] = await Promise.all([createUser(), createUser("ARTISAN")]);
    const vase = await createProduct(artisan.id);

    const review = await reviewRepository.create(client.id, { productId: vase.id, rating: 5 });

    expect(review).toMatchObject({ targetId: artisan.id, authorId: client.id, approved: false });
    expect(await reviewRepository.hasReviewed(client.id, vase.id)).toBe(true);
  });

  it("only exposes approved reviews on the product page", async () => {
    const [client, artisan] = await Promise.all([createUser(), createUser("ARTISAN")]);
    const vase = await createProduct(artisan.id);
    const review = await reviewRepository.create(client.id, { productId: vase.id, rating: 4 });

    expect(await reviewRepository.findByProductId(vase.id)).toHaveLength(0);

    await reviewRepository.approve(review.id);
    expect(await reviewRepository.findByProductId(vase.id)).toHaveLength(1);
  });

  it("rejects a review for an unknown product", async () => {
    const client = await createUser();
    await expect(
      reviewRepository.create(client.id, { productId: "missing", rating: 3 }),
    ).rejects.toThrow("Produit introuvable");
  });
});
