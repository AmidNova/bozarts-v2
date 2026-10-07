import { afterAll, beforeEach } from "vitest";

if (!process.env.DATABASE_URL) {
  throw new Error(
    "Integration tests need DATABASE_URL pointing to a disposable PostgreSQL database " +
      "(e.g. docker compose up db, then `npx prisma db push`).",
  );
}

const { prisma } = await import("@/lib/prisma");

/** Wipe every application table so each test starts from an empty database. */
beforeEach(async () => {
  const tables = await prisma.$queryRaw<{ tablename: string }[]>`
    SELECT tablename FROM pg_tables
    WHERE schemaname = 'public' AND tablename <> '_prisma_migrations'
  `;
  if (tables.length === 0) return;

  const list = tables.map(({ tablename }) => `"public"."${tablename}"`).join(", ");
  await prisma.$executeRawUnsafe(`TRUNCATE TABLE ${list} RESTART IDENTITY CASCADE`);
});

afterAll(async () => {
  await prisma.$disconnect();
});
