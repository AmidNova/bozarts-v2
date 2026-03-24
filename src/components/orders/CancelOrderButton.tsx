"use client";

import { useActionState } from "react";
import { cancelOrder } from "@/app/actions/order";
import { Button } from "@/components/ui/button";
import type { ActionResult } from "@/lib/action-result";

export function CancelOrderButton({ orderId }: { orderId: string }) {
  const [state, formAction, pending] = useActionState(
    async (_prev: ActionResult<void> | null) => {
      return cancelOrder(orderId);
    },
    null
  );

  return (
    <>
      <form action={formAction}>
        <Button type="submit" variant="destructive" size="sm" disabled={pending}>
          {pending ? "Annulation..." : "Annuler"}
        </Button>
      </form>
      {state && !state.success && (
        <p className="mt-1 text-xs text-destructive">{state.error}</p>
      )}
    </>
  );
}
