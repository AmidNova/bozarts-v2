// ─── Formatting Utilities ────────────────────────────────────────────
//
// Fonctions utilitaires pour formater les donnees affichees dans l'UI.
// Centralise ici pour eviter la duplication dans les pages et composants.

/**
 * Formate un montant en euros (ex: "12,50 €").
 *
 * @example
 * formatCurrency(12.5)  // "12,50 €"
 * formatCurrency("9.99") // "9,99 €"
 */
export function formatCurrency(amount: number | string | { toString(): string }): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(Number(amount));
}

/**
 * Formate une date en francais.
 *
 * @param date  — Date, string ISO, ou timestamp
 * @param style — variante d'affichage :
 *   - "short"         → 15/03/2024
 *   - "long"          → 15 mars 2024
 *   - "month-year"    → mars 2024
 *   - "datetime"      → 15 mars, 14:30  (messages)
 *   - "datetime-full" → lundi 15 mars 2024, 14:30  (evenements)
 *
 * @example
 * formatDate("2024-03-15")                   // "15/03/2024"
 * formatDate("2024-03-15", "long")           // "15 mars 2024"
 * formatDate("2024-03-15T14:30", "datetime") // "15 mars, 14:30"
 */
export function formatDate(
  date: Date | string | number,
  style: "short" | "long" | "month-year" | "datetime" | "datetime-full" = "short",
): string {
  const d = new Date(date);

  const styleMap: Record<typeof style, Intl.DateTimeFormatOptions> = {
    short: {},
    long: { day: "numeric", month: "long", year: "numeric" },
    "month-year": { month: "long", year: "numeric" },
    datetime: { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" },
    "datetime-full": {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    },
  };

  return d.toLocaleDateString("fr-FR", styleMap[style]);
}

/**
 * Compose un nom complet a partir de prenom + nom.
 * Gere les valeurs null/undefined/vides proprement.
 *
 * @example
 * formatFullName("Jean", "Dupont")  // "Jean Dupont"
 * formatFullName(null, "Dupont")    // "Dupont"
 * formatFullName(null, null)        // ""
 */
export function formatFullName(
  firstName: string | null | undefined,
  lastName: string | null | undefined,
): string {
  return [firstName, lastName].filter(Boolean).join(" ");
}

/**
 * Ajoute un "s" au pluriel (regles simples du francais).
 *
 * @example
 * pluralize(0, "produit")   // "0 produit"
 * pluralize(1, "produit")   // "1 produit"
 * pluralize(5, "produit")   // "5 produits"
 */
export function pluralize(count: number, word: string, plural?: string): string {
  const form = count > 1 ? (plural ?? `${word}s`) : word;
  return `${count} ${form}`;
}

/**
 * Affiche une note sous forme d'etoiles (★★★☆☆).
 *
 * @example
 * formatStars(3) // "★★★☆☆"
 */
export function formatStars(rating: number, max = 5): string {
  return "★".repeat(rating) + "☆".repeat(max - rating);
}
