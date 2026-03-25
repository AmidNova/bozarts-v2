"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

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
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setPending(true);

    const formData = new FormData(e.currentTarget);
    const shippingAddress = formData.get("shippingAddress") as string;

    try {
      const res = await fetch("/api/stripe/checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shippingAddress }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Erreur lors de la creation du paiement");
        setPending(false);
        return;
      }

      // Redirect to Stripe Checkout
      window.location.href = data.url;
    } catch {
      setError("Erreur de connexion");
      setPending(false);
    }
  }

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

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
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

        {error && <p className="text-sm text-destructive">{error}</p>}

        <Button type="submit" disabled={pending} className="w-full">
          {pending ? "Redirection vers le paiement..." : "Payer"}
        </Button>
      </form>
    </div>
  );
}
