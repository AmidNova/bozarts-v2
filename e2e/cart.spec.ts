import { test, expect } from "@playwright/test";
import { login, SEED_PASSWORD } from "./helpers";

test("a signed-in client adds a product to the cart", async ({ page }) => {
  await login(page, "sophie.martin@email.com", SEED_PASSWORD);

  await page.goto("/products");
  await page.getByText("Vase en céramique bleu").first().click();
  await page.getByRole("button", { name: "Ajouter au panier" }).click();
  await expect(page.getByText("Ajoute au panier !")).toBeVisible();

  await page.goto("/cart");
  await expect(page.getByRole("heading", { name: "Panier", level: 1 })).toBeVisible();
  await expect(page.getByText("Vase en céramique bleu")).toBeVisible();
});
