import { prisma } from "@/lib/prisma";
import type { UserRole } from "@/generated/prisma/client";

let sequence = 0;
const nextId = () => ++sequence;

export async function createUser(role: UserRole = "CLIENT") {
  const n = nextId();
  return prisma.user.create({
    data: { email: `user${n}@test.local`, name: `User ${n}`, role },
  });
}

export async function createProduct(
  artisanId: string,
  overrides: { name?: string; price?: number; inStock?: boolean } = {},
) {
  const n = nextId();
  return prisma.product.create({
    data: {
      name: overrides.name ?? `Produit ${n}`,
      price: overrides.price ?? 20,
      inStock: overrides.inStock ?? true,
      artisanId,
    },
  });
}
