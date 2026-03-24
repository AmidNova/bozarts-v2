"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { updateOrderStatusAdmin } from "@/app/actions/admin";

const nextStatuses: Record<string, string[]> = {
  PENDING: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["SHIPPED", "CANCELLED"],
  SHIPPED: ["DELIVERED"],
  DELIVERED: [],
  CANCELLED: [],
};

const statusLabels: Record<string, string> = {
  CONFIRMED: "Confirmer",
  SHIPPED: "Expedier",
  DELIVERED: "Livree",
  CANCELLED: "Annuler",
};

export function OrderStatusUpdateForm({
  orderId,
  currentStatus,
}: {
  orderId: string;
  currentStatus: string;
}) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const available = nextStatuses[currentStatus] ?? [];
  if (available.length === 0) return null;

  async function handleUpdate(status: string) {
    setPending(true);
    setError(null);
    const result = await updateOrderStatusAdmin(orderId, status);
    setPending(false);
    if (!result.success) {
      setError(result.error);
    } else {
      router.refresh();
    }
  }

  return (
    <div className="flex items-center gap-2">
      {available.map((status) => (
        <Button
          key={status}
          size="sm"
          variant={status === "CANCELLED" ? "destructive" : "outline"}
          onClick={() => handleUpdate(status)}
          disabled={pending}
        >
          {statusLabels[status] ?? status}
        </Button>
      ))}
      {error && <span className="text-xs text-destructive">{error}</span>}
    </div>
  );
}
