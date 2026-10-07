import { describe, it, expect } from "vitest";
import { prisma } from "@/lib/prisma";
import { cartRepository } from "@/lib/repositories/cart";
import { orderRepository } from "@/lib/repositories/order";
import { createProduct, createUser } from "./factories";

/** Client with a cart containing one vase (25€ × 2). */
async function clientWithCart() {
  const [client, artisan] = await Promise.all([createUser(), createUser("ARTISAN")]);
  const vase = await createProduct(artisan.id, { price: 25 });
  await cartRepository.addItem(client.id, vase.id, 2);
  return { client, artisan, vase };
}

describe("pending order for Stripe checkout", () => {
  it("can be created without emptying the cart (payment not done yet)", async () => {
    const { client } = await clientWithCart();

    const order = await orderRepository.createFromCart(client.id, "1 rue des Arts", {
      clearCart: false,
    });

    expect(order.status).toBe("PENDING");
    expect(await cartRepository.countItems(client.id)).toBe(1);
  });
});

describe("orderRepository.confirmPayment", () => {
  it("confirms the order, stores the payment id and removes ordered products from the cart", async () => {
    const { client } = await clientWithCart();
    const order = await orderRepository.createFromCart(client.id, "adresse", { clearCart: false });

    const result = await orderRepository.confirmPayment(order.id, "pi_123");

    expect(result).toEqual({ confirmed: true });
    const stored = await prisma.order.findUnique({ where: { id: order.id } });
    expect(stored).toMatchObject({ status: "CONFIRMED", stripePaymentId: "pi_123" });
    expect(await cartRepository.countItems(client.id)).toBe(0);
  });

  it("keeps products added to the cart after checkout started", async () => {
    const { client, artisan } = await clientWithCart();
    const order = await orderRepository.createFromCart(client.id, "adresse", { clearCart: false });
    const bol = await createProduct(artisan.id, { name: "Bol ajouté après" });
    await cartRepository.addItem(client.id, bol.id, 1);

    await orderRepository.confirmPayment(order.id, "pi_123");

    const { items } = await cartRepository.findByUserId(client.id);
    expect(items.map((i) => i.productId)).toEqual([bol.id]);
  });

  it("keeps the amount charged even if the cart changed after checkout started", async () => {
    const { client, vase } = await clientWithCart();
    const order = await orderRepository.createFromCart(client.id, "adresse", { clearCart: false });
    await cartRepository.updateQuantity(
      (await cartRepository.findByUserId(client.id)).items[0].id,
      client.id,
      9,
    );

    await orderRepository.confirmPayment(order.id, "pi_123");

    const stored = await orderRepository.findById(order.id);
    expect(stored?.items).toHaveLength(1);
    expect(stored?.items[0]).toMatchObject({ productId: vase.id, quantity: 2 });
  });

  it("is idempotent when Stripe retries the webhook", async () => {
    const { client } = await clientWithCart();
    const order = await orderRepository.createFromCart(client.id, "adresse", { clearCart: false });

    await orderRepository.confirmPayment(order.id, "pi_123");
    const retry = await orderRepository.confirmPayment(order.id, "pi_123");

    expect(retry).toEqual({ confirmed: false });
    expect(await prisma.order.count()).toBe(1);
  });

  it("does not resurrect a cancelled order", async () => {
    const { client } = await clientWithCart();
    const order = await orderRepository.createFromCart(client.id, "adresse", { clearCart: false });
    await orderRepository.cancelPending(order.id);

    expect(await orderRepository.confirmPayment(order.id, "pi_123")).toEqual({ confirmed: false });
    const stored = await prisma.order.findUnique({ where: { id: order.id } });
    expect(stored?.status).toBe("CANCELLED");
  });
});

describe("orderRepository.cancelPending", () => {
  it("cancels a pending order and leaves the cart untouched", async () => {
    const { client } = await clientWithCart();
    const order = await orderRepository.createFromCart(client.id, "adresse", { clearCart: false });

    expect(await orderRepository.cancelPending(order.id)).toEqual({ cancelled: true });

    const stored = await prisma.order.findUnique({ where: { id: order.id } });
    expect(stored?.status).toBe("CANCELLED");
    expect(await cartRepository.countItems(client.id)).toBe(1);
  });

  it("never cancels an order that was already paid", async () => {
    const { client } = await clientWithCart();
    const order = await orderRepository.createFromCart(client.id, "adresse", { clearCart: false });
    await orderRepository.confirmPayment(order.id, "pi_123");

    expect(await orderRepository.cancelPending(order.id)).toEqual({ cancelled: false });
    const stored = await prisma.order.findUnique({ where: { id: order.id } });
    expect(stored?.status).toBe("CONFIRMED");
  });
});
