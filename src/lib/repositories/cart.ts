import { prisma } from "@/lib/prisma";
import { CART_QUANTITY_MAX, SHIPPING_FEE } from "@/lib/constants";

export const cartRepository = {
  async findByUserId(userId: string) {
    const items = await prisma.cartItem.findMany({
      where: { userId },
      include: {
        product: {
          include: {
            artisan: {
              select: { id: true, name: true, firstName: true },
            },
          },
        },
      },
      orderBy: { product: { name: "asc" } },
    });

    const subtotal = items.reduce(
      (sum, item) => sum + Number(item.product.price) * item.quantity,
      0
    );

    return {
      items,
      subtotal,
      shippingFee: items.length > 0 ? SHIPPING_FEE : 0,
      total: items.length > 0 ? subtotal + SHIPPING_FEE : 0,
    };
  },

  /**
   * Add a product to the cart, or increment its quantity if already present.
   * The resulting quantity is capped at CART_QUANTITY_MAX: the input schema only
   * bounds each addition, not the accumulated total.
   */
  async addItem(userId: string, productId: string, quantity: number) {
    return prisma.$transaction(async (tx) => {
      const item = await tx.cartItem.upsert({
        where: {
          userId_productId: { userId, productId },
        },
        update: {
          quantity: { increment: quantity },
        },
        create: {
          userId,
          productId,
          quantity,
        },
      });

      if (item.quantity <= CART_QUANTITY_MAX) return item;

      return tx.cartItem.update({
        where: { id: item.id },
        data: { quantity: CART_QUANTITY_MAX },
      });
    });
  },

  async updateQuantity(cartItemId: string, userId: string, quantity: number) {
    return prisma.cartItem.update({
      where: { id: cartItemId, userId },
      data: { quantity },
    });
  },

  async removeItem(cartItemId: string, userId: string) {
    return prisma.cartItem.delete({
      where: { id: cartItemId, userId },
    });
  },

  async clear(userId: string) {
    return prisma.cartItem.deleteMany({
      where: { userId },
    });
  },

  async countItems(userId: string) {
    return prisma.cartItem.count({
      where: { userId },
    });
  },
};
