import { Badge } from "@/components/ui/badge";

// ─── Types ───────────────────────────────────────────────────────────

type BadgeVariant = "default" | "secondary" | "outline" | "destructive";

/** Configuration pour un statut : le label affiche et la variante du badge. */
interface StatusConfig {
  label: string;
  variant: BadgeVariant;
}

// ─── Factory ─────────────────────────────────────────────────────────
//
// Cree un composant badge type a partir d'un mapping statut → config.
// Evite de repeter le meme pattern Record<string, config> + Badge
// dans chaque fichier.
//
// Usage :
//   const OrderStatusBadge = createStatusBadge({ PENDING: { ... }, ... });
//   <OrderStatusBadge value="PENDING" />

/**
 * Cree un composant React qui affiche un Badge colore selon la valeur.
 *
 * @param config — mapping valeur → { label, variant }
 * @param fallbackVariant — variant par defaut si la valeur n'est pas dans le mapping
 */
export function createStatusBadge(
  config: Record<string, StatusConfig>,
  fallbackVariant: BadgeVariant = "secondary",
) {
  return function StatusBadge({ value }: { value: string }) {
    const entry = config[value] ?? {
      label: value,
      variant: fallbackVariant,
    };
    return <Badge variant={entry.variant}>{entry.label}</Badge>;
  };
}

// ─── Pre-built Badges ────────────────────────────────────────────────
//
// Badges prets a l'emploi pour les statuts les plus courants.
// Import direct : import { OrderStatusBadge } from "@/components/ui/StatusBadge";

export const OrderStatusBadge = createStatusBadge({
  PENDING: { label: "En attente", variant: "secondary" },
  CONFIRMED: { label: "Confirmee", variant: "default" },
  SHIPPED: { label: "Expediee", variant: "outline" },
  DELIVERED: { label: "Livree", variant: "default" },
  CANCELLED: { label: "Annulee", variant: "destructive" },
});

export const UserRoleBadge = createStatusBadge({
  ADMIN: { label: "Admin", variant: "destructive" },
  ARTISAN: { label: "Artisan", variant: "default" },
  CLIENT: { label: "Client", variant: "outline" },
});

export const UserStatusBadge = createStatusBadge({
  ACTIVE: { label: "Actif", variant: "default" },
  SUSPENDED: { label: "Suspendu", variant: "destructive" },
  PENDING: { label: "En attente", variant: "secondary" },
});

export const StockBadge = createStatusBadge({
  true: { label: "En stock", variant: "default" },
  false: { label: "Rupture", variant: "destructive" },
});
