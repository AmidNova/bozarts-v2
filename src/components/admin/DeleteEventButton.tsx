"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { deleteEventAdmin } from "@/app/actions/admin";

export function DeleteEventButton({ eventId }: { eventId: string }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function handleDelete() {
    if (!confirm("Supprimer cet evenement ?")) return;
    setPending(true);
    const result = await deleteEventAdmin(eventId);
    setPending(false);
    if (result.success) {
      router.refresh();
    }
  }

  return (
    <Button
      size="sm"
      variant="destructive"
      onClick={handleDelete}
      disabled={pending}
    >
      Supprimer
    </Button>
  );
}
