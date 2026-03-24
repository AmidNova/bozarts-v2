"use client";

import { useActionState } from "react";
import { deleteProduct } from "@/app/actions/product";
import { Button } from "@/components/ui/button";
import type { ActionResult } from "@/lib/action-result";

interface DeleteProductButtonProps {
  productId: string;
}

export function DeleteProductButton({ productId }: DeleteProductButtonProps) {
  const [state, formAction, pending] = useActionState(
    async (_prev: ActionResult<void> | null) => {
      return deleteProduct(productId);
    },
    null
  );

  return (
    <form action={formAction}>
      <Button
        type="submit"
        variant="destructive"
        size="sm"
        disabled={pending}
        onClick={(e) => {
          if (!confirm("Supprimer ce produit ?")) {
            e.preventDefault();
          }
        }}
      >
        {pending ? "Suppression..." : "Supprimer"}
      </Button>
      {state && !state.success && (
        <p className="mt-1 text-xs text-destructive">{state.error}</p>
      )}
    </form>
  );
}
