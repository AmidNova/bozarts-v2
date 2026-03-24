"use client";

import { useActionState } from "react";
import { updateOrderStatus } from "@/app/actions/order";
import { Button } from "@/components/ui/button";
import type { ActionResult } from "@/lib/action-result";

const nextStatuses: Record<string, { value: string; label: string }[]> = {
  PENDING: [{ value: "CONFIRMED", label: "Confirmer" }],
  CONFIRMED: [{ value: "SHIPPED", label: "Marquer expediee" }],
  SHIPPED: [{ value: "DELIVERED", label: "Marquer livree" }],
};

export function UpdateStatusForm({
  orderId,
  currentStatus,
}: {
  orderId: string;
  currentStatus: string;
}) {
  const transitions = nextStatuses[currentStatus];
  const [state, formAction, pending] = useActionState(
    async (_prev: ActionResult<void> | null, formData: FormData) => {
      return updateOrderStatus(formData);
    },
    null
  );

  if (!transitions || transitions.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {transitions.map((t) => (
        <form key={t.value} action={formAction}>
          <input type="hidden" name="orderId" value={orderId} />
          <input type="hidden" name="status" value={t.value} />
          <Button type="submit" size="sm" disabled={pending}>
            {pending ? "..." : t.label}
          </Button>
        </form>
      ))}
      {state && !state.success && (
        <p className="text-xs text-destructive">{state.error}</p>
      )}
    </div>
  );
}
