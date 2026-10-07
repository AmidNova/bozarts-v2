import { execSync } from "node:child_process";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

/**
 * Reset the E2E database to the seed dataset. Run by the Playwright webServer
 * command before the app starts (Playwright boots the webServer before globalSetup).
 * Refuses to touch any database whose name does not end with "_e2e",
 * so a misconfigured DATABASE_URL can never wipe dev or production data.
 */
const url = process.env.DATABASE_URL;
if (!url) {
  throw new Error("E2E tests need DATABASE_URL (a disposable database named *_e2e).");
}

const dbName = new URL(url).pathname.replace(/^\//, "");
if (!dbName.endsWith("_e2e")) {
  throw new Error(`Refusing to reset database "${dbName}": E2E database name must end with "_e2e".`);
}

const run = (cmd: string) => execSync(cmd, { stdio: "inherit", env: process.env });

async function truncateAllTables() {
  const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: url }) });
  try {
    const tables = await prisma.$queryRaw<{ tablename: string }[]>`
      SELECT tablename FROM pg_tables
      WHERE schemaname = 'public' AND tablename <> '_prisma_migrations'
    `;
    if (tables.length === 0) return;
    const list = tables.map(({ tablename }) => `"public"."${tablename}"`).join(", ");
    await prisma.$executeRawUnsafe(`TRUNCATE TABLE ${list} RESTART IDENTITY CASCADE`);
  } finally {
    await prisma.$disconnect();
  }
}

async function main() {
  run("npx prisma db push");
  await truncateAllTables();
  run("npx prisma db seed");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
