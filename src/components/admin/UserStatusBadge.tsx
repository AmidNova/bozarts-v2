import { Badge } from "@/components/ui/badge";

const statusConfig: Record<
  string,
  { label: string; variant: "default" | "secondary" | "outline" | "destructive" }
> = {
  ACTIVE: { label: "Actif", variant: "default" },
  SUSPENDED: { label: "Suspendu", variant: "destructive" },
  PENDING: { label: "En attente", variant: "secondary" },
};

export function UserStatusBadge({ status }: { status: string }) {
  const config = statusConfig[status] ?? {
    label: status,
    variant: "secondary" as const,
  };
  return <Badge variant={config.variant}>{config.label}</Badge>;
}
