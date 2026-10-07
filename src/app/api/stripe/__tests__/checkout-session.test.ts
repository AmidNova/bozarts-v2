import { describe, it, expect, vi, beforeEach } from "vitest";

const mocks = vi.hoisted(() => ({
  auth: vi.fn(),
  createSession: vi.fn(),
  orderRepository: { createFromCart: vi.fn(), cancelPending: vi.fn() },
}));

vi.mock("@/lib/auth", () => ({ auth: mocks.auth }));
vi.mock("@/lib/stripe", () => ({
  getStripe: () => ({ checkout: { sessions: { create: mocks.createSession } } }),
}));
vi.mock("@/lib/repositories/order", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/lib/repositories/order")>()),
  orderRepository: mocks.orderRepository,
}));

import { POST } from "@/app/api/stripe/checkout-session/route";
import { OrderValidationError } from "@/lib/repositories/order";
import { SHIPPING_FEE } from "@/lib/constants";

const { auth, createSession, orderRepository } = mocks;

const checkoutRequest = (body: unknown) =>
  new Request("http://localhost/api/stripe/checkout-session", {
    method: "POST",
    headers: { "Content-Type": "application/json", origin: "http://localhost:3000" },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });

const pendingOrder = {
  id: "order-1",
  items: [
    { quantity: 2, unitPrice: "25.00", product: { name: "Vase", imageUrl: null } },
    { quantity: 1, unitPrice: "12.50", product: { name: "Bol", imageUrl: "https://img/bol.jpg" } },
  ],
};

beforeEach(() => {
  vi.clearAllMocks();
  vi.spyOn(console, "error").mockImplementation(() => {});
  auth.mockResolvedValue({ user: { id: "client-1" } });
});

describe("POST /api/stripe/checkout-session", () => {
  it("requires authentication", async () => {
    auth.mockResolvedValue(null);
    expect((await POST(checkoutRequest({ shippingAddress: "1 rue X" }))).status).toBe(401);
  });

  it("rejects a malformed body or a missing address", async () => {
    expect((await POST(checkoutRequest("not json"))).status).toBe(400);
    expect((await POST(checkoutRequest({ shippingAddress: "" }))).status).toBe(400);
    expect(orderRepository.createFromCart).not.toHaveBeenCalled();
  });

  it("returns business errors (empty cart, out of stock) as 400", async () => {
    orderRepository.createFromCart.mockRejectedValue(
      new OrderValidationError("Produits indisponibles : Bol"),
    );

    const response = await POST(checkoutRequest({ shippingAddress: "1 rue X" }));

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ error: "Produits indisponibles : Bol" });
  });

  it("creates a pending order without clearing the cart, then a Stripe session from it", async () => {
    orderRepository.createFromCart.mockResolvedValue(pendingOrder);
    createSession.mockResolvedValue({ url: "https://checkout.stripe.com/c/pay/cs_test" });

    const response = await POST(checkoutRequest({ shippingAddress: "1 rue X" }));

    expect(orderRepository.createFromCart).toHaveBeenCalledWith("client-1", "1 rue X", {
      clearCart: false,
    });
    expect(await response.json()).toEqual({ url: "https://checkout.stripe.com/c/pay/cs_test" });

    const params = createSession.mock.calls[0][0];
    expect(params.metadata).toEqual({ orderId: "order-1" });
    expect(params.client_reference_id).toBe("order-1");
    expect(params.line_items.map((l: { price_data: { unit_amount: number } }) => l.price_data.unit_amount)).toEqual([
      2500,
      1250,
      SHIPPING_FEE * 100,
    ]);
    expect(params.line_items[0].quantity).toBe(2);
    expect(params.success_url).toBe(
      "http://localhost:3000/checkout/success?session_id={CHECKOUT_SESSION_ID}",
    );
  });

  it("cancels the pending order if Stripe is unavailable", async () => {
    orderRepository.createFromCart.mockResolvedValue(pendingOrder);
    createSession.mockRejectedValue(new Error("Stripe API down"));

    const response = await POST(checkoutRequest({ shippingAddress: "1 rue X" }));

    expect(response.status).toBe(502);
    expect(orderRepository.cancelPending).toHaveBeenCalledWith("order-1");
  });
});
