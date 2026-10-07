import { describe, it, expect } from "vitest";
import { prisma } from "@/lib/prisma";
import { cartRepository } from "@/lib/repositories/cart";
import { orderRepository } from "@/lib/repositories/order";
import { SHIPPING_FEE } from "@/lib/constants";
import { createProduct, createUser } from "./factories";

describe("orderRepository.createFromCart", () => {
  it("creates the order with price snapshots and empties the cart", async () => {
    const [client, artisan] = await Promise.all([createUser(), createUser("ARTISAN")]);
    const vase = await createProduct(artisan.id, { price: 25 });
    await cartRepository.addItem(client.id, vase.id, 2);

    const order = await orderRepository.createFromCart(client.id, "1 rue des Arts, Paris");

    expect(order.status).toBe("PENDING");
    expect(Number(order.totalAmount)).toBe(50 + SHIPPING_FEE);
    expect(order.items).toHaveLength(1);
    expect(order.items[0]).toMatchObject({ productId: vase.id, quantity: 2 });
    expect(Number(order.items[0].unitPrice)).toBe(25);
    expect(await cartRepository.countItems(client.id)).toBe(0);
  });

  it("keeps the price paid even if the artisan changes it later", async () => {
    const [client, artisan] = await Promise.all([createUser(), createUser("ARTISAN")]);
    const vase = await createProduct(artisan.id, { price: 25 });
    await cartRepository.addItem(client.id, vase.id, 1);
    const order = await orderRepository.createFromCart(client.id, "1 rue des Arts");

    await prisma.product.update({ where: { id: vase.id }, data: { price: 99 } });

    const stored = await orderRepository.findById(order.id);
    expect(Number(stored?.items[0].unitPrice)).toBe(25);
  });

  it("refuses an empty cart", async () => {
    const client = await createUser();
    await expect(orderRepository.createFromCart(client.id, "1 rue des Arts")).rejects.toThrow(
      "Le panier est vide",
    );
  });

  it("rolls back entirely when a product is out of stock", async () => {
    const [client, artisan] = await Promise.all([createUser(), createUser("ARTISAN")]);
    const dispo = await createProduct(artisan.id, { name: "Vase" });
    const epuise = await createProduct(artisan.id, { name: "Bol", inStock: false });
    await cartRepository.addItem(client.id, dispo.id, 1);
    await cartRepository.addItem(client.id, epuise.id, 1);

    await expect(orderRepository.createFromCart(client.id, "1 rue des Arts")).rejects.toThrow(
      "Produits indisponibles : Bol",
    );

    expect(await prisma.order.count()).toBe(0);
    expect(await cartRepository.countItems(client.id)).toBe(2);
  });
});

describe("orderRepository queries", () => {
  it("shows an artisan only the orders and lines containing their products", async () => {
    const [client, artisanA, artisanB] = await Promise.all([
      createUser(),
      createUser("ARTISAN"),
      createUser("ARTISAN"),
    ]);
    const vaseA = await createProduct(artisanA.id);
    const bolB = await createProduct(artisanB.id);
    await cartRepository.addItem(client.id, vaseA.id, 1);
    await cartRepository.addItem(client.id, bolB.id, 1);
    await orderRepository.createFromCart(client.id, "1 rue des Arts");

    const forA = await orderRepository.findByArtisanId(artisanA.id, { page: 1, pageSize: 20 });

    expect(forA.total).toBe(1);
    expect(forA.orders[0].items.map((i) => i.product.id)).toEqual([vaseA.id]);
  });

  it("counts revenue only for confirmed, shipped or delivered orders", async () => {
    const [client, artisan] = await Promise.all([createUser(), createUser("ARTISAN")]);
    const vase = await createProduct(artisan.id, { price: 40 });

    await cartRepository.addItem(client.id, vase.id, 1);
    const paid = await orderRepository.createFromCart(client.id, "adresse");
    await orderRepository.updateStatus(paid.id, "CONFIRMED");

    await cartRepository.addItem(client.id, vase.id, 1);
    const cancelled = await orderRepository.createFromCart(client.id, "adresse");
    await orderRepository.updateStatus(cancelled.id, "CANCELLED");

    expect(await orderRepository.stats()).toEqual({
      totalOrders: 2,
      pendingOrders: 0,
      revenue: 40 + SHIPPING_FEE,
    });
  });
});
