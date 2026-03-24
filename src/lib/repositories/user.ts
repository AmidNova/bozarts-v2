import { prisma } from "@/lib/prisma";
import { DEFAULT_PAGE_SIZE } from "@/lib/constants";
import type { UpdateProfileInput } from "@/lib/schemas/profile";
import type { UserRole, UserStatus } from "@/generated/prisma/client";

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

  // ─── Admin methods ──────────────────────────────────────────────

  async findAllForAdmin(filters: {
    search?: string;
    role?: UserRole;
    status?: UserStatus;
    page?: number;
    pageSize?: number;
  }) {
    const { search, role, status, page = 1, pageSize = DEFAULT_PAGE_SIZE } = filters;

    const where = {
      ...(search && {
        OR: [
          { name: { contains: search, mode: "insensitive" as const } },
          { firstName: { contains: search, mode: "insensitive" as const } },
          { email: { contains: search, mode: "insensitive" as const } },
        ],
      }),
      ...(role && { role }),
      ...(status && { status }),
    };

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          name: true,
          firstName: true,
          email: true,
          role: true,
          status: true,
          createdAt: true,
          _count: { select: { products: true, orders: true } },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.user.count({ where }),
    ]);

    return { users, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
  },

  async updateStatus(id: string, status: UserStatus) {
    return prisma.user.update({
      where: { id },
      data: { status },
    });
  },

  async updateRole(id: string, role: UserRole) {
    return prisma.user.update({
      where: { id },
      data: { role },
    });
  },

  async countByRole() {
    const [total, artisans, admins] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: "ARTISAN", status: "ACTIVE" } }),
      prisma.user.count({ where: { role: "ADMIN" } }),
    ]);
    return { total, artisans, admins, clients: total - artisans - admins };
  },
};
