import { prisma } from "@/lib/prisma";
import type { CreateReviewInput } from "@/lib/schemas/review";

export const reviewRepository = {
  async create(authorId: string, data: CreateReviewInput) {
    const product = await prisma.product.findUnique({
      where: { id: data.productId },
      select: { artisanId: true },
    });

    if (!product) throw new Error("Produit introuvable");

    return prisma.review.create({
      data: {
        rating: data.rating,
        comment: data.comment,
        authorId,
        targetId: product.artisanId,
        productId: data.productId,
      },
    });
  },

  async findByProductId(productId: string) {
    return prisma.review.findMany({
      where: { productId, approved: true },
      include: {
        author: { select: { id: true, name: true, firstName: true, image: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  },

  async findPendingReviews() {
    return prisma.review.findMany({
      where: { approved: false },
      include: {
        author: { select: { id: true, name: true, firstName: true } },
        product: { select: { id: true, name: true } },
        target: { select: { id: true, name: true, firstName: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  },

  async approve(id: string) {
    return prisma.review.update({
      where: { id },
      data: { approved: true },
    });
  },

  async delete(id: string) {
    return prisma.review.delete({ where: { id } });
  },

  async findByTargetId(targetId: string) {
    return prisma.review.findMany({
      where: { targetId },
      include: {
        author: { select: { id: true, name: true, firstName: true, image: true } },
        product: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  },

  /** Check if user already reviewed this product */
  async hasReviewed(authorId: string, productId: string) {
    const count = await prisma.review.count({
      where: { authorId, productId },
    });
    return count > 0;
  },
};
