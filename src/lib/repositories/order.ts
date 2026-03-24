import { prisma } from "@/lib/prisma";
import { SHIPPING_FEE, DEFAULT_PAGE_SIZE } from "@/lib/constants";
import type { OrderFilter } from "@/lib/schemas/order";
import type { OrderStatus } from "@/generated/prisma/client";

export const orderRepository = {
  /**
   * Create order from cart items atomically:
   * 1. Read cart items with product prices
   * 2. Create Order + OrderItems
   * 3. Clear cart
   */
  async createFromCart(userId: string, shippingAddress: string) {
    return prisma.$transaction(async (tx) => {
      const cartItems = await tx.cartItem.findMany({
        where: { userId },
        include: { product: true },
      });

      if (cartItems.length === 0) {
        throw new Error("Le panier est vide");
      }

      // Verify all products are in stock
      const outOfStock = cartItems.filter((item) => !item.product.inStock);
      if (outOfStock.length > 0) {
        const names = outOfStock.map((i) => i.product.name).join(", ");
        throw new Error(`Produits indisponibles : ${names}`);
      }

      const subtotal = cartItems.reduce(
        (sum, item) => sum + Number(item.product.price) * item.quantity,
        0
      );
      const totalAmount = subtotal + SHIPPING_FEE;

      const order = await tx.order.create({
        data: {
          clientId: userId,
          shippingAddress,
          totalAmount,
          items: {
            create: cartItems.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              unitPrice: item.product.price,
            })),
          },
        },
        include: {
          items: { include: { product: true } },
        },
      });

      await tx.cartItem.deleteMany({ where: { userId } });

      return order;
    });
  },

  async findByClientId(clientId: string, filters: OrderFilter) {
    const { status, page = 1, pageSize = DEFAULT_PAGE_SIZE } = filters;

    const where = {
      clientId,
      ...(status && { status }),
    };

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          items: {
            include: {
              product: {
                select: { id: true, name: true, imageUrl: true },
              },
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.order.count({ where }),
    ]);

    return { orders, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
  },

  /**
   * Find orders containing products from a specific artisan.
   */
  async findByArtisanId(artisanId: string, filters: OrderFilter) {
    const { status, page = 1, pageSize = DEFAULT_PAGE_SIZE } = filters;

    const where = {
      items: { some: { product: { artisanId } } },
      ...(status && { status }),
    };

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          client: {
            select: { id: true, name: true, firstName: true, email: true },
          },
          items: {
            where: { product: { artisanId } },
            include: {
              product: {
                select: { id: true, name: true, imageUrl: true, price: true },
              },
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.order.count({ where }),
    ]);

    return { orders, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
  },

  async findById(id: string) {
    return prisma.order.findUnique({
      where: { id },
      include: {
        client: {
          select: { id: true, name: true, firstName: true, email: true, address: true },
        },
        items: {
          include: {
            product: {
              include: {
                artisan: { select: { id: true, name: true, firstName: true } },
              },
            },
          },
        },
      },
    });
  },

  async updateStatus(id: string, status: OrderStatus) {
    return prisma.order.update({
      where: { id },
      data: { status },
    });
  },

  // ─── Admin methods ──────────────────────────────────────────────

  async findAllForAdmin(filters: OrderFilter) {
    const { status, page = 1, pageSize = DEFAULT_PAGE_SIZE } = filters;

    const where = {
      ...(status && { status }),
    };

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          client: {
            select: { id: true, name: true, firstName: true, email: true },
          },
          items: {
            include: {
              product: {
                select: { id: true, name: true, imageUrl: true, price: true },
              },
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.order.count({ where }),
    ]);

    return { orders, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
  },

  async stats() {
    const [totalOrders, pendingOrders, revenue] = await Promise.all([
      prisma.order.count(),
      prisma.order.count({ where: { status: "PENDING" } }),
      prisma.order.aggregate({
        _sum: { totalAmount: true },
        where: { status: { in: ["CONFIRMED", "SHIPPED", "DELIVERED"] } },
      }),
    ]);
    return {
      totalOrders,
      pendingOrders,
      revenue: Number(revenue._sum.totalAmount ?? 0),
    };
  },
};
