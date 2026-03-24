"use client";

import { useActionState } from "react";
import { addToCart } from "@/app/actions/cart";
import { Button } from "@/components/ui/button";
import type { ActionResult } from "@/lib/action-result";

interface AddToCartButtonProps {
  productId: string;
  inStock: boolean;
}

export function AddToCartButton({ productId, inStock }: AddToCartButtonProps) {
  const [state, formAction, pending] = useActionState(
    async (_prev: ActionResult<{ id: string }> | null, formData: FormData) => {
      return addToCart(formData);
    },
    null
  );

  if (!inStock) {
    return (
      <Button disabled size="lg" className="w-full">
        Rupture de stock
      </Button>
    );
  }

  return (
    <form action={formAction}>
      <input type="hidden" name="productId" value={productId} />
      <input type="hidden" name="quantity" value="1" />
      <Button type="submit" size="lg" className="w-full" disabled={pending}>
        {pending ? "Ajout..." : "Ajouter au panier"}
      </Button>
      {state && !state.success && (
        <p className="mt-2 text-sm text-destructive">{state.error}</p>
      )}
      {state?.success && (
        <p className="mt-2 text-sm text-green-600">Ajoute au panier !</p>
      )}
    </form>
  );
}
