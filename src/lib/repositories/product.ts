import { prisma } from "@/lib/prisma";
import { DEFAULT_PAGE_SIZE } from "@/lib/constants";
import type { CreateProductInput, UpdateProductInput, ProductFilter } from "@/lib/schemas/product";

export const productRepository = {
  async findAll(filters: ProductFilter) {
    const {
      search,
      category,
      minPrice,
      maxPrice,
      inStock,
      artisanId,
      page = 1,
      pageSize = DEFAULT_PAGE_SIZE,
    } = filters;

    const where = {
      ...(search && {
        OR: [
          { name: { contains: search, mode: "insensitive" as const } },
          { description: { contains: search, mode: "insensitive" as const } },
        ],
      }),
      ...(category && { category }),
      ...(minPrice !== undefined && { price: { gte: minPrice } }),
      ...(maxPrice !== undefined && {
        price: { ...(minPrice !== undefined ? { gte: minPrice } : {}), lte: maxPrice },
      }),
      ...(inStock !== undefined && { inStock }),
      ...(artisanId && { artisanId }),
    };

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          artisan: {
            select: { id: true, name: true, firstName: true, image: true },
          },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.product.count({ where }),
    ]);

    return {
      products,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  },

  async findById(id: string) {
    return prisma.product.findUnique({
      where: { id },
      include: {
        artisan: {
          select: { id: true, name: true, firstName: true, image: true, description: true },
        },
        reviews: {
          where: { approved: true },
          include: {
            author: { select: { id: true, name: true, firstName: true, image: true } },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });
  },

  async findByArtisanId(artisanId: string) {
    return prisma.product.findMany({
      where: { artisanId },
      orderBy: { createdAt: "desc" },
    });
  },

  async create(artisanId: string, data: CreateProductInput) {
    return prisma.product.create({
      data: {
        ...data,
        artisanId,
      },
    });
  },

  async update(id: string, artisanId: string, data: UpdateProductInput) {
    return prisma.product.update({
      where: { id, artisanId },
      data,
    });
  },

  async delete(id: string, artisanId: string) {
    return prisma.product.delete({
      where: { id, artisanId },
    });
  },

  // ─── Admin methods ──────────────────────────────────────────────

  async deleteAdmin(id: string) {
    return prisma.product.delete({ where: { id } });
  },

  async updateStock(id: string, inStock: boolean) {
    return prisma.product.update({
      where: { id },
      data: { inStock },
    });
  },
};
