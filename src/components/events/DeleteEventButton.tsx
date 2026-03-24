"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteEvent } from "@/app/actions/event";
import { Button } from "@/components/ui/button";

export function DeleteEventButton({ eventId }: { eventId: string }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    if (!confirm("Supprimer cet evenement ? Cette action est irreversible.")) return;

    setPending(true);
    setError(null);

    const result = await deleteEvent(eventId);
    if (result.success) {
      router.refresh();
    } else {
      setError(result.error);
      setPending(false);
    }
  }

  return (
    <>
      <Button
        variant="destructive"
        size="sm"
        disabled={pending}
        onClick={handleDelete}
      >
        {pending ? "..." : "Supprimer"}
      </Button>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </>
  );
}
