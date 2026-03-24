import { Badge } from "@/components/ui/badge";

const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "outline" | "destructive" }> = {
  PENDING: { label: "En attente", variant: "secondary" },
  CONFIRMED: { label: "Confirmee", variant: "default" },
  SHIPPED: { label: "Expediee", variant: "outline" },
  DELIVERED: { label: "Livree", variant: "default" },
  CANCELLED: { label: "Annulee", variant: "destructive" },
};

export function OrderStatusBadge({ status }: { status: string }) {
  const config = statusConfig[status] ?? { label: status, variant: "secondary" as const };
  return <Badge variant={config.variant}>{config.label}</Badge>;
}
