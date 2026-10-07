import { test, expect } from "@playwright/test";
import { login, SEED_PASSWORD } from "./helpers";

test.describe("authentication", () => {
  test("registers a new client who is then signed in", async ({ page }) => {
    const email = `e2e-${Date.now()}@test.local`;

    await page.goto("/register");
    await page.locator('input[name="firstName"]').fill("Camille");
    await page.locator('input[name="name"]').fill("Test");
    await page.locator('input[name="email"]').fill(email);
    await page.locator('input[name="password"]').fill("motdepasse-e2e");
    await page.locator('input[name="confirmPassword"]').fill("motdepasse-e2e");
    await page.getByRole("button", { name: "Creer mon compte" }).click();

    await expect(page).toHaveURL("/");
    await page.goto("/cart");
    await expect(page.getByRole("heading", { name: "Panier", level: 1 })).toBeVisible();
  });

  test("rejects a wrong password", async ({ page }) => {
    await page.goto("/login");
    await page.locator('input[name="email"]').fill("jean.dupont@email.com");
    await page.locator('input[name="password"]').fill("mauvais-mot-de-passe");
    await page.locator('button[type="submit"]').click();

    await expect(page.getByText("Email ou mot de passe incorrect")).toBeVisible();
    await expect(page).toHaveURL(/\/login$/);
  });

  test("keeps clients out of the admin panel", async ({ page }) => {
    await login(page, "jean.dupont@email.com", SEED_PASSWORD);
    await page.goto("/admin");
    await expect(page).toHaveURL("/");
  });

  test("lets the admin into the admin panel", async ({ page }) => {
    await login(page, "admin@bozarts.fr", SEED_PASSWORD);
    await page.goto("/admin");
    await expect(page).toHaveURL(/\/admin$/);
  });
});
