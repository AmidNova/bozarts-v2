"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { approveReview, deleteReview } from "@/app/actions/review";
import { Button } from "@/components/ui/button";

export function ReviewModerationActions({ reviewId }: { reviewId: string }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleApprove() {
    setPending(true);
    setError(null);
    const result = await approveReview(reviewId);
    if (result.success) {
      router.refresh();
    } else {
      setError(result.error);
      setPending(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Supprimer cet avis ? Cette action est irreversible.")) return;

    setPending(true);
    setError(null);
    const result = await deleteReview(reviewId);
    if (result.success) {
      router.refresh();
    } else {
      setError(result.error);
      setPending(false);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Button size="sm" disabled={pending} onClick={handleApprove}>
        Approuver
      </Button>
      <Button variant="destructive" size="sm" disabled={pending} onClick={handleDelete}>
        Rejeter
      </Button>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
