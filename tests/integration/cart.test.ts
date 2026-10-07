import { describe, it, expect } from "vitest";
import { cartRepository } from "@/lib/repositories/cart";
import { CART_QUANTITY_MAX, SHIPPING_FEE } from "@/lib/constants";
import { createProduct, createUser } from "./factories";

describe("cartRepository", () => {
  it("returns an empty cart with no shipping fee", async () => {
    const client = await createUser();
    expect(await cartRepository.findByUserId(client.id)).toMatchObject({
      items: [],
      subtotal: 0,
      shippingFee: 0,
      total: 0,
    });
  });

  it("computes subtotal and adds the shipping fee", async () => {
    const [client, artisan] = await Promise.all([createUser(), createUser("ARTISAN")]);
    const vase = await createProduct(artisan.id, { price: 12.5 });
    const bol = await createProduct(artisan.id, { price: 7 });

    await cartRepository.addItem(client.id, vase.id, 2);
    await cartRepository.addItem(client.id, bol.id, 1);

    const cart = await cartRepository.findByUserId(client.id);
    expect(cart.subtotal).toBe(32);
    expect(cart.shippingFee).toBe(SHIPPING_FEE);
    expect(cart.total).toBe(32 + SHIPPING_FEE);
  });

  it("increments the quantity when the same product is added again", async () => {
    const [client, artisan] = await Promise.all([createUser(), createUser("ARTISAN")]);
    const vase = await createProduct(artisan.id);

    await cartRepository.addItem(client.id, vase.id, 2);
    await cartRepository.addItem(client.id, vase.id, 3);

    const { items } = await cartRepository.findByUserId(client.id);
    expect(items).toHaveLength(1);
    expect(items[0].quantity).toBe(5);
  });

  it("never lets repeated additions exceed the maximum quantity", async () => {
    const [client, artisan] = await Promise.all([createUser(), createUser("ARTISAN")]);
    const vase = await createProduct(artisan.id);

    await cartRepository.addItem(client.id, vase.id, 60);
    await cartRepository.addItem(client.id, vase.id, 60);

    const { items } = await cartRepository.findByUserId(client.id);
    expect(items[0].quantity).toBe(CART_QUANTITY_MAX);
  });

  it("cannot modify or remove another user's cart item", async () => {
    const [owner, intruder, artisan] = await Promise.all([
      createUser(),
      createUser(),
      createUser("ARTISAN"),
    ]);
    const vase = await createProduct(artisan.id);
    const item = await cartRepository.addItem(owner.id, vase.id, 1);

    await expect(cartRepository.updateQuantity(item.id, intruder.id, 50)).rejects.toThrow();
    await expect(cartRepository.removeItem(item.id, intruder.id)).rejects.toThrow();

    const { items } = await cartRepository.findByUserId(owner.id);
    expect(items[0].quantity).toBe(1);
  });
});
