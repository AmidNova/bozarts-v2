import { Badge } from "@/components/ui/badge";

const roleConfig: Record<
  string,
  { label: string; variant: "default" | "secondary" | "outline" | "destructive" }
> = {
  ADMIN: { label: "Admin", variant: "destructive" },
  ARTISAN: { label: "Artisan", variant: "default" },
  CLIENT: { label: "Client", variant: "outline" },
};

export function UserRoleBadge({ role }: { role: string }) {
  const config = roleConfig[role] ?? {
    label: role,
    variant: "secondary" as const,
  };
  return <Badge variant={config.variant}>{config.label}</Badge>;
}
