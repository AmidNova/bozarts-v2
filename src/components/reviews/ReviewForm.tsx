"use client";

import { useActionState } from "react";
import { createReview } from "@/app/actions/review";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { ActionResult } from "@/lib/action-result";

interface ReviewFormProps {
  productId: string;
}

const initialState: ActionResult<{ id: string }> = { success: true, data: { id: "" } };

export function ReviewForm({ productId }: ReviewFormProps) {
  const [state, action, pending] = useActionState(
    async (_prev: ActionResult<{ id: string }>, formData: FormData) => {
      return createReview(formData);
    },
    initialState
  );

  if (state.success && state.data.id) {
    return (
      <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-800">
        Merci pour votre avis ! Il sera visible apres validation.
      </div>
    );
  }

  return (
    <form action={action} className="flex flex-col gap-4 rounded-lg border p-4">
      <h3 className="font-medium">Laisser un avis</h3>

      <input type="hidden" name="productId" value={productId} />

      <div className="flex flex-col gap-2">
        <Label htmlFor="rating">Note</Label>
        <select
          id="rating"
          name="rating"
          required
          className="rounded-md border bg-background px-3 py-2 text-sm"
        >
          <option value="">-- Choisir --</option>
          <option value="5">5 - Excellent</option>
          <option value="4">4 - Tres bien</option>
          <option value="3">3 - Bien</option>
          <option value="2">2 - Moyen</option>
          <option value="1">1 - Mauvais</option>
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="comment">Commentaire (optionnel)</Label>
        <Textarea id="comment" name="comment" rows={3} placeholder="Votre avis..." />
      </div>

      {!state.success && (
        <p className="text-sm text-destructive">{state.error}</p>
      )}

      <Button type="submit" disabled={pending}>
        {pending ? "Envoi..." : "Publier l'avis"}
      </Button>
    </form>
  );
}
