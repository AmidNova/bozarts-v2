import { describe, it, expect, vi, beforeEach } from "vitest";

const mocks = vi.hoisted(() => ({
  requireAuth: vi.fn(),
  orderRepository: {
    createFromCart: vi.fn(),
    findById: vi.fn(),
    updateStatus: vi.fn(),
  },
}));

vi.mock("@/lib/auth-guard", () => ({ requireAuth: mocks.requireAuth }));
vi.mock("@/lib/repositories/order", () => ({ orderRepository: mocks.orderRepository }));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));

import { createOrder, updateOrderStatus, cancelOrder } from "@/app/actions/order";

const { requireAuth, orderRepository } = mocks;

const loggedInAs = (id: string, role: string) =>
  requireAuth.mockResolvedValue({ authenticated: true, user: { id, role } });

const form = (data: Record<string, string>) => {
  const fd = new FormData();
  Object.entries(data).forEach(([k, v]) => fd.append(k, v));
  return fd;
};

const orderOwnedBy = (clientId: string, artisanId: string, status = "PENDING") => ({
  id: "order-1",
  clientId,
  status,
  items: [{ product: { artisan: { id: artisanId } } }],
});

beforeEach(() => {
  vi.clearAllMocks();
});

describe("createOrder", () => {
  it("rejects anonymous users", async () => {
    requireAuth.mockResolvedValue({ authenticated: false, error: "Non authentifié" });
    expect(await createOrder(form({ shippingAddress: "1 rue X" }))).toEqual({
      success: false,
      error: "Non authentifié",
    });
    expect(orderRepository.createFromCart).not.toHaveBeenCalled();
  });

  it("requires a shipping address", async () => {
    loggedInAs("client-1", "CLIENT");
    const result = await createOrder(form({ shippingAddress: "" }));
    expect(result).toEqual({ success: false, error: "L'adresse de livraison est requise" });
  });

  it("creates the order from the current user's cart", async () => {
    loggedInAs("client-1", "CLIENT");
    orderRepository.createFromCart.mockResolvedValue({ id: "order-1" });

    const result = await createOrder(form({ shippingAddress: "1 rue X" }));

    expect(orderRepository.createFromCart).toHaveBeenCalledWith("client-1", "1 rue X");
    expect(result).toEqual({ success: true, data: { id: "order-1" } });
  });

  it("surfaces repository business errors (e.g. empty cart)", async () => {
    loggedInAs("client-1", "CLIENT");
    orderRepository.createFromCart.mockRejectedValue(new Error("Le panier est vide"));
    expect(await createOrder(form({ shippingAddress: "1 rue X" }))).toEqual({
      success: false,
      error: "Le panier est vide",
    });
  });
});

describe("updateOrderStatus", () => {
  const statusForm = form({ orderId: "order-1", status: "SHIPPED" });

  it("forbids clients", async () => {
    loggedInAs("client-1", "CLIENT");
    expect(await updateOrderStatus(statusForm)).toEqual({ success: false, error: "Non autorisé" });
    expect(orderRepository.updateStatus).not.toHaveBeenCalled();
  });

  it("forbids an artisan with no product in the order", async () => {
    loggedInAs("artisan-2", "ARTISAN");
    orderRepository.findById.mockResolvedValue(orderOwnedBy("client-1", "artisan-1"));
    expect(await updateOrderStatus(statusForm)).toEqual({ success: false, error: "Non autorisé" });
    expect(orderRepository.updateStatus).not.toHaveBeenCalled();
  });

  it("lets the artisan who sold a product update the status", async () => {
    loggedInAs("artisan-1", "ARTISAN");
    orderRepository.findById.mockResolvedValue(orderOwnedBy("client-1", "artisan-1"));
    expect((await updateOrderStatus(statusForm)).success).toBe(true);
    expect(orderRepository.updateStatus).toHaveBeenCalledWith("order-1", "SHIPPED");
  });

  it("lets admins update without an ownership lookup", async () => {
    loggedInAs("admin-1", "ADMIN");
    expect((await updateOrderStatus(statusForm)).success).toBe(true);
    expect(orderRepository.findById).not.toHaveBeenCalled();
  });

  it("rejects unknown statuses", async () => {
    loggedInAs("admin-1", "ADMIN");
    const result = await updateOrderStatus(form({ orderId: "order-1", status: "LOST" }));
    expect(result.success).toBe(false);
  });
});

describe("cancelOrder", () => {
  it("forbids cancelling someone else's order", async () => {
    loggedInAs("client-2", "CLIENT");
    orderRepository.findById.mockResolvedValue(orderOwnedBy("client-1", "artisan-1"));
    expect(await cancelOrder("order-1")).toEqual({ success: false, error: "Non autorisé" });
  });

  it.each(["DELIVERED", "CANCELLED"])("refuses to cancel a %s order", async (status) => {
    loggedInAs("client-1", "CLIENT");
    orderRepository.findById.mockResolvedValue(orderOwnedBy("client-1", "artisan-1", status));
    expect(await cancelOrder("order-1")).toEqual({
      success: false,
      error: "Impossible d'annuler cette commande",
    });
  });

  it("cancels the owner's pending order", async () => {
    loggedInAs("client-1", "CLIENT");
    orderRepository.findById.mockResolvedValue(orderOwnedBy("client-1", "artisan-1"));
    expect((await cancelOrder("order-1")).success).toBe(true);
    expect(orderRepository.updateStatus).toHaveBeenCalledWith("order-1", "CANCELLED");
  });

  it("returns not found for an unknown order", async () => {
    loggedInAs("client-1", "CLIENT");
    orderRepository.findById.mockResolvedValue(null);
    expect(await cancelOrder("missing")).toEqual({ success: false, error: "Commande introuvable" });
  });
});
