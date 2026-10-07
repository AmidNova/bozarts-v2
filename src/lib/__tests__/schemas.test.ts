import { describe, it, expect } from "vitest";
import { RegisterSchema, LoginSchema } from "@/lib/schemas/auth";
import { AddToCartSchema, UpdateCartSchema } from "@/lib/schemas/cart";
import { CreateEventSchema } from "@/lib/schemas/event";
import { CreateProductSchema, ProductFilterSchema } from "@/lib/schemas/product";
import { CreateReviewSchema } from "@/lib/schemas/review";
import { UpdateProfileSchema } from "@/lib/schemas/profile";
import { OrderFilterSchema, UpdateOrderStatusSchema } from "@/lib/schemas/order";

const firstError = (result: { success: boolean; error?: { issues: { message: string }[] } }) =>
  result.error?.issues[0]?.message;

describe("RegisterSchema", () => {
  const valid = {
    name: "Dupont",
    firstName: "Jean",
    email: "jean@example.com",
    password: "motdepasse",
    confirmPassword: "motdepasse",
    role: "CLIENT",
  };

  it("accepts a valid registration", () => {
    expect(RegisterSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects mismatched passwords on confirmPassword", () => {
    const result = RegisterSchema.safeParse({ ...valid, confirmPassword: "autre-chose" });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.path).toEqual(["confirmPassword"]);
  });

  it("rejects passwords shorter than 8 characters", () => {
    const result = RegisterSchema.safeParse({ ...valid, password: "court", confirmPassword: "court" });
    expect(firstError(result)).toMatch(/8 caracteres/);
  });

  it("does not allow self-registration as ADMIN", () => {
    expect(RegisterSchema.safeParse({ ...valid, role: "ADMIN" }).success).toBe(false);
  });
});

describe("LoginSchema", () => {
  it("rejects an invalid email", () => {
    expect(firstError(LoginSchema.safeParse({ email: "nope", password: "x" }))).toBe(
      "Email invalide",
    );
  });
});

describe("cart schemas", () => {
  it("defaults quantity to 1 and coerces form strings", () => {
    expect(AddToCartSchema.parse({ productId: "p1" }).quantity).toBe(1);
    expect(AddToCartSchema.parse({ productId: "p1", quantity: "3" }).quantity).toBe(3);
  });

  it("enforces quantity bounds 1..99", () => {
    expect(AddToCartSchema.safeParse({ productId: "p1", quantity: 0 }).success).toBe(false);
    expect(UpdateCartSchema.safeParse({ cartItemId: "c1", quantity: 100 }).success).toBe(false);
    expect(UpdateCartSchema.safeParse({ cartItemId: "c1", quantity: 99 }).success).toBe(true);
  });
});

describe("CreateEventSchema", () => {
  const base = {
    title: "Marché de Noël",
    description: "Artisans locaux",
    location: "Paris",
  };

  it("accepts an end date after the start date", () => {
    const result = CreateEventSchema.safeParse({
      ...base,
      startDate: "2026-12-01T10:00",
      endDate: "2026-12-01T18:00",
    });
    expect(result.success).toBe(true);
  });

  it("rejects an end date before the start date", () => {
    const result = CreateEventSchema.safeParse({
      ...base,
      startDate: "2026-12-02",
      endDate: "2026-12-01",
    });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.path).toEqual(["endDate"]);
  });
});

describe("product schemas", () => {
  it("applies defaults for category and stock", () => {
    const product = CreateProductSchema.parse({ name: "Vase", price: "25.50" });
    expect(product).toMatchObject({ price: 25.5, category: "AUTRE", inStock: true });
  });

  it("rejects a price below 0.01€ and unknown categories", () => {
    expect(firstError(CreateProductSchema.safeParse({ name: "Vase", price: 0 }))).toBe(
      "Le prix minimum est 0.01€",
    );
    expect(CreateProductSchema.safeParse({ name: "Vase", price: 10, category: "ROBOT" }).success).toBe(
      false,
    );
  });

  it("caps pagination page size at 100", () => {
    expect(ProductFilterSchema.parse({})).toMatchObject({ page: 1, pageSize: 20 });
    expect(ProductFilterSchema.safeParse({ pageSize: 101 }).success).toBe(false);
  });
});

describe("CreateReviewSchema", () => {
  it("accepts ratings from 1 to 5 only", () => {
    expect(CreateReviewSchema.safeParse({ productId: "p1", rating: "5" }).success).toBe(true);
    expect(firstError(CreateReviewSchema.safeParse({ productId: "p1", rating: 6 }))).toBe(
      "Note maximum : 5",
    );
    expect(firstError(CreateReviewSchema.safeParse({ productId: "p1", rating: 0 }))).toBe(
      "Note minimum : 1",
    );
  });
});

describe("UpdateProfileSchema", () => {
  it("validates phone numbers", () => {
    expect(UpdateProfileSchema.safeParse({ phone: "+33 6 12 34 56 78" }).success).toBe(true);
    expect(firstError(UpdateProfileSchema.safeParse({ phone: "abc" }))).toBe(
      "Numéro de téléphone invalide",
    );
  });
});

describe("order schemas", () => {
  it("only accepts known statuses", () => {
    expect(UpdateOrderStatusSchema.safeParse({ orderId: "o1", status: "SHIPPED" }).success).toBe(true);
    expect(UpdateOrderStatusSchema.safeParse({ orderId: "o1", status: "LOST" }).success).toBe(false);
    expect(OrderFilterSchema.safeParse({ status: "LOST" }).success).toBe(false);
  });
});
