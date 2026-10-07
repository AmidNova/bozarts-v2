import { describe, it, expect } from "vitest";
import {
  formatCurrency,
  formatDate,
  formatFullName,
  pluralize,
  formatStars,
} from "@/lib/format";

/** Intl uses narrow no-break spaces; normalize them for readable assertions. */
const normalizeSpaces = (s: string) => s.replace(/\s/g, " ");

describe("formatCurrency", () => {
  it("formats a number as euros with French separators", () => {
    expect(normalizeSpaces(formatCurrency(12.5))).toBe("12,50 €");
  });

  it("accepts numeric strings and Decimal-like objects", () => {
    expect(normalizeSpaces(formatCurrency("9.99"))).toBe("9,99 €");
    expect(normalizeSpaces(formatCurrency({ toString: () => "1234.5" }))).toBe(
      "1 234,50 €",
    );
  });
});

describe("formatDate", () => {
  const date = new Date(2024, 2, 15, 14, 30);

  it("defaults to the short dd/mm/yyyy format", () => {
    expect(formatDate(date)).toBe("15/03/2024");
  });

  it("supports long and month-year styles", () => {
    expect(formatDate(date, "long")).toBe("15 mars 2024");
    expect(formatDate(date, "month-year")).toBe("mars 2024");
  });

  it("includes the time for datetime styles", () => {
    expect(formatDate(date, "datetime")).toContain("14:30");
    expect(formatDate(date, "datetime-full")).toContain("vendredi 15 mars 2024");
  });
});

describe("formatFullName", () => {
  it("joins first and last name", () => {
    expect(formatFullName("Jean", "Dupont")).toBe("Jean Dupont");
  });

  it("skips missing parts", () => {
    expect(formatFullName(null, "Dupont")).toBe("Dupont");
    expect(formatFullName("Jean", undefined)).toBe("Jean");
    expect(formatFullName(null, null)).toBe("");
  });
});

describe("pluralize", () => {
  it("keeps the singular for 0 and 1", () => {
    expect(pluralize(0, "produit")).toBe("0 produit");
    expect(pluralize(1, "produit")).toBe("1 produit");
  });

  it("adds an s above 1, or uses the explicit plural", () => {
    expect(pluralize(5, "produit")).toBe("5 produits");
    expect(pluralize(2, "travail", "travaux")).toBe("2 travaux");
  });
});

describe("formatStars", () => {
  it("renders filled and empty stars out of 5", () => {
    expect(formatStars(3)).toBe("★★★☆☆");
    expect(formatStars(0)).toBe("☆☆☆☆☆");
    expect(formatStars(5)).toBe("★★★★★");
  });

  it("supports a custom maximum", () => {
    expect(formatStars(2, 3)).toBe("★★☆");
  });
});
