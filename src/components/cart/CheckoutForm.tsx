"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { createOrder } from "@/app/actions/order";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import type { ActionResult } from "@/lib/action-result";

interface CheckoutFormProps {
  defaultAddress?: string | null;
  subtotal: number;
  shippingFee: number;
  total: number;
}

export function CheckoutForm({
  defaultAddress,
  subtotal,
  shippingFee,
  total,
}: CheckoutFormProps) {
  const router = useRouter();

  const [state, formAction, pending] = useActionState(
    async (
      _prev: ActionResult<{ id: string }> | null,
      formData: FormData
    ) => {
      const result = await createOrder(formData);
      if (result.success) {
        router.push(`/orders/${result.data.id}`);
      }
      return result;
    },
    null
  );

  return (
    <div className="rounded-xl border p-6">
      <h2 className="text-lg font-semibold">Recapitulatif</h2>

      <div className="mt-4 space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Sous-total</span>
          <span>{subtotal.toFixed(2)}&nbsp;&euro;</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Livraison</span>
          <span>{shippingFee.toFixed(2)}&nbsp;&euro;</span>
        </div>
        <div className="flex justify-between border-t pt-2 text-base font-semibold">
          <span>Total</span>
          <span>{total.toFixed(2)}&nbsp;&euro;</span>
        </div>
      </div>

      <form action={formAction} className="mt-6 flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="shippingAddress">Adresse de livraison</Label>
          <Textarea
            id="shippingAddress"
            name="shippingAddress"
            required
            rows={3}
            defaultValue={defaultAddress ?? ""}
            placeholder="Votre adresse complete..."
          />
        </div>

        {state && !state.success && (
          <p className="text-sm text-destructive">{state.error}</p>
        )}

        <Button type="submit" disabled={pending} className="w-full">
          {pending ? "Commande en cours..." : "Commander"}
        </Button>
      </form>
    </div>
  );
}
