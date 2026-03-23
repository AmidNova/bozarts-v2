import { prisma } from "@/lib/prisma";
import type { UpdateProfileInput } from "@/lib/schemas/profile";

export const userRepository = {
  async findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        firstName: true,
        email: true,
        image: true,
        role: true,
        status: true,
        description: true,
        address: true,
        phone: true,
        createdAt: true,
      },
    });
  },

  /** Public artisan profile — excludes sensitive fields */
  async findArtisanPublicProfile(id: string) {
    return prisma.user.findUnique({
      where: { id, role: "ARTISAN" },
      select: {
        id: true,
        name: true,
        firstName: true,
        image: true,
        description: true,
        createdAt: true,
        products: {
          where: { inStock: true },
          orderBy: { createdAt: "desc" },
          take: 12,
        },
        reviewsReceived: {
          where: { approved: true },
          select: { rating: true },
        },
      },
    });
  },

  async updateProfile(id: string, data: UpdateProfileInput) {
    return prisma.user.update({
      where: { id },
      data,
    });
  },

  async findArtisans(page = 1, pageSize = 20) {
    const where = { role: "ARTISAN" as const, status: "ACTIVE" as const };

    const [artisans, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          name: true,
          firstName: true,
          image: true,
          description: true,
          _count: { select: { products: true } },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.user.count({ where }),
    ]);

    return { artisans, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
  },
};
