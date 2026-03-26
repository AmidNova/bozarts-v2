// ─── Business Rules ──────────────────────────────────────────────────

/** Fixed shipping fee per order (€) */
export const SHIPPING_FEE = 10;

/** Platform commission rate (10%) */
export const COMMISSION_RATE = 0.1;

// ─── Pagination ─────────────────────────────────────────────────────

export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;

// ─── Validation ─────────────────────────────────────────────────────

export const PRODUCT_NAME_MAX = 255;
export const PRODUCT_DESCRIPTION_MAX = 5000;
export const PRODUCT_PRICE_MIN = 0.01;
export const PRODUCT_PRICE_MAX = 99999.99;

export const REVIEW_RATING_MIN = 1;
export const REVIEW_RATING_MAX = 5;

export const CART_QUANTITY_MIN = 1;
export const CART_QUANTITY_MAX = 99;

// ─── Category Labels ────────────────────────────────────────────────
//
// Mapping entre les valeurs Prisma (enum) et les labels affiches en UI.
// Utilise par les filtres, badges et formulaires produit.

export const CATEGORY_LABELS: Record<string, string> = {
  CERAMIQUE: "Ceramique",
  MOBILIER: "Mobilier",
  BIJOUX: "Bijoux",
  TEXTILE: "Textile",
  PEINTURE: "Peinture",
  SCULPTURE: "Sculpture",
  AUTRE: "Autre",
};

/** Options pour les selects/filtres de categorie (avec "Toutes" en premier). */
export const CATEGORY_OPTIONS = [
  { value: "", label: "Toutes" },
  ...Object.entries(CATEGORY_LABELS).map(([value, label]) => ({ value, label })),
];
