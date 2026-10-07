import { expect, type Page } from "@playwright/test";

/** Password shared by every account created in prisma/seed.ts. */
export const SEED_PASSWORD = "password123";

export async function login(page: Page, email: string, password: string) {
  await page.goto("/login");
  await page.locator('input[name="email"]').fill(email);
  await page.locator('input[name="password"]').fill(password);
  await page.locator('button[type="submit"]').click();
  await expect(page).toHaveURL("/");
}
