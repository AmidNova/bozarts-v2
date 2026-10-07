import { describe, it, expect, vi, beforeEach } from "vitest";

const mocks = vi.hoisted(() => ({
  constructEvent: vi.fn(),
  orderRepository: { confirmPayment: vi.fn(), cancelPending: vi.fn() },
}));

vi.mock("@/lib/stripe", () => ({
  getStripe: () => ({ webhooks: { constructEvent: mocks.constructEvent } }),
}));
vi.mock("@/lib/repositories/order", () => ({ orderRepository: mocks.orderRepository }));

import { POST } from "@/app/api/stripe/webhook/route";

const { constructEvent, orderRepository } = mocks;

const webhookRequest = (signature: string | null = "sig_test") =>
  new Request("http://localhost/api/stripe/webhook", {
    method: "POST",
    body: "{}",
    headers: signature ? { "stripe-signature": signature } : {},
  });

const stripeEvent = (type: string, session: Record<string, unknown>) => ({
  type,
  data: { object: session },
});

beforeEach(() => {
  vi.clearAllMocks();
  vi.stubEnv("STRIPE_WEBHOOK_SECRET", "whsec_test");
  vi.spyOn(console, "error").mockImplementation(() => {});
});

describe("POST /api/stripe/webhook", () => {
  it("rejects requests without a signature", async () => {
    expect((await POST(webhookRequest(null))).status).toBe(400);
  });

  it("returns 500 when the webhook secret is not configured", async () => {
    vi.stubEnv("STRIPE_WEBHOOK_SECRET", "");
    expect((await POST(webhookRequest())).status).toBe(500);
    expect(constructEvent).not.toHaveBeenCalled();
  });

  it("rejects an invalid signature", async () => {
    constructEvent.mockImplementation(() => {
      throw new Error("No signatures found matching the expected signature");
    });
    expect((await POST(webhookRequest())).status).toBe(400);
  });

  it("confirms the order referenced in metadata when the session is paid", async () => {
    constructEvent.mockReturnValue(
      stripeEvent("checkout.session.completed", {
        metadata: { orderId: "order-1" },
        payment_status: "paid",
        payment_intent: "pi_123",
      }),
    );
    orderRepository.confirmPayment.mockResolvedValue({ confirmed: true });

    const response = await POST(webhookRequest());

    expect(response.status).toBe(200);
    expect(orderRepository.confirmPayment).toHaveBeenCalledWith("order-1", "pi_123");
  });

  it("does not confirm a completed session that is not paid yet", async () => {
    constructEvent.mockReturnValue(
      stripeEvent("checkout.session.completed", {
        metadata: { orderId: "order-1" },
        payment_status: "unpaid",
        payment_intent: null,
      }),
    );

    expect((await POST(webhookRequest())).status).toBe(200);
    expect(orderRepository.confirmPayment).not.toHaveBeenCalled();
  });

  it("rejects a completed session without an order id", async () => {
    constructEvent.mockReturnValue(
      stripeEvent("checkout.session.completed", { metadata: {}, payment_status: "paid" }),
    );
    expect((await POST(webhookRequest())).status).toBe(400);
  });

  it("cancels the pending order when the checkout session expires", async () => {
    constructEvent.mockReturnValue(
      stripeEvent("checkout.session.expired", { metadata: { orderId: "order-1" } }),
    );
    orderRepository.cancelPending.mockResolvedValue({ cancelled: true });

    expect((await POST(webhookRequest())).status).toBe(200);
    expect(orderRepository.cancelPending).toHaveBeenCalledWith("order-1");
  });

  it("acknowledges unrelated events without side effects", async () => {
    constructEvent.mockReturnValue(stripeEvent("customer.created", {}));
    expect((await POST(webhookRequest())).status).toBe(200);
    expect(orderRepository.confirmPayment).not.toHaveBeenCalled();
    expect(orderRepository.cancelPending).not.toHaveBeenCalled();
  });

  it("returns 500 on database failure so Stripe retries the event", async () => {
    constructEvent.mockReturnValue(
      stripeEvent("checkout.session.completed", {
        metadata: { orderId: "order-1" },
        payment_status: "paid",
        payment_intent: "pi_123",
      }),
    );
    orderRepository.confirmPayment.mockRejectedValue(new Error("connection lost"));

    expect((await POST(webhookRequest())).status).toBe(500);
  });
});
