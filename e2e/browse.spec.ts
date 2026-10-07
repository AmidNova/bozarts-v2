import { test, expect } from "@playwright/test";

test.describe("visitor browsing", () => {
  test("lists seeded products and opens a product page", async ({ page }) => {
    await page.goto("/products");
    await expect(page.getByRole("heading", { name: "Produits", level: 1 })).toBeVisible();

    await page.getByText("Vase en céramique bleu").first().click();

    await expect(page).toHaveURL(/\/products\/[^/]+$/);
    await expect(
      page.getByRole("heading", { name: "Vase en céramique bleu" }),
    ).toBeVisible();
  });

  test("sends anonymous visitors to the login page for the cart", async ({ page }) => {
    await page.goto("/cart");
    await expect(page).toHaveURL(/\/login$/);
  });
});
