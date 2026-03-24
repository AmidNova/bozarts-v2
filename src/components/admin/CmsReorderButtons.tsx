"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { reorderCgu, reorderFaq } from "@/app/actions/admin";

interface CmsReorderButtonsProps {
  id: string;
  orderedIds: string[];
  index: number;
  type: "cgu" | "faq";
}

export function CmsReorderButtons({
  id,
  orderedIds,
  index,
  type,
}: CmsReorderButtonsProps) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function swap(direction: "up" | "down") {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= orderedIds.length) return;

    const newOrder = [...orderedIds];
    [newOrder[index], newOrder[newIndex]] = [newOrder[newIndex], newOrder[index]];

    setPending(true);
    const reorder = type === "cgu" ? reorderCgu : reorderFaq;
    await reorder(newOrder);
    setPending(false);
    router.refresh();
  }

  return (
    <div className="flex gap-1">
      <Button
        size="sm"
        variant="ghost"
        onClick={() => swap("up")}
        disabled={pending || index === 0}
        aria-label="Monter"
      >
        &#8593;
      </Button>
      <Button
        size="sm"
        variant="ghost"
        onClick={() => swap("down")}
        disabled={pending || index === orderedIds.length - 1}
        aria-label="Descendre"
      >
        &#8595;
      </Button>
    </div>
  );
}
