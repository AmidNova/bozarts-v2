"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { deleteCgu, deleteFaq } from "@/app/actions/admin";

interface CmsDeleteButtonProps {
  id: string;
  type: "cgu" | "faq";
}

export function CmsDeleteButton({ id, type }: CmsDeleteButtonProps) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function handleDelete() {
    if (!confirm("Supprimer cette entree ?")) return;
    setPending(true);
    const result = type === "cgu" ? await deleteCgu(id) : await deleteFaq(id);
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
