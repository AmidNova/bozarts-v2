"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { deleteProductAdmin, toggleProductStock } from "@/app/actions/admin";

interface ProductAdminActionsProps {
  productId: string;
  inStock: boolean;
}

export function ProductAdminActions({
  productId,
  inStock,
}: ProductAdminActionsProps) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleToggleStock() {
    setPending(true);
    setError(null);
    const result = await toggleProductStock(productId, !inStock);
    setPending(false);
    if (!result.success) {
      setError(result.error);
    } else {
      router.refresh();
    }
  }

  async function handleDelete() {
    if (!confirm("Supprimer ce produit ?")) return;
    setPending(true);
    setError(null);
    const result = await deleteProductAdmin(productId);
    setPending(false);
    if (!result.success) {
      setError(result.error);
    } else {
      router.refresh();
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        size="sm"
        variant="outline"
        onClick={handleToggleStock}
        disabled={pending}
      >
        {inStock ? "Retirer" : "En stock"}
      </Button>
      <Button
        size="sm"
        variant="destructive"
        onClick={handleDelete}
        disabled={pending}
      >
        Supprimer
      </Button>
      {error && <span className="text-xs text-destructive">{error}</span>}
    </div>
  );
}
