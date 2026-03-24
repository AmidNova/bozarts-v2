"use client";

import { useActionState } from "react";
import { registerForEvent, unregisterFromEvent } from "@/app/actions/event";
import { Button } from "@/components/ui/button";
import type { ActionResult } from "@/lib/action-result";

interface RegisterButtonProps {
  eventId: string;
  isRegistered: boolean;
}

const initialState: ActionResult<void> = { success: true, data: undefined };

export function RegisterButton({ eventId, isRegistered }: RegisterButtonProps) {
  const [state, action, pending] = useActionState(
    async () => {
      if (isRegistered) {
        return unregisterFromEvent(eventId);
      }
      return registerForEvent(eventId);
    },
    initialState
  );

  return (
    <div>
      <form action={action}>
        <Button type="submit" variant={isRegistered ? "outline" : "default"} disabled={pending}>
          {pending
            ? "..."
            : isRegistered
              ? "Se desinscrire"
              : "S'inscrire"}
        </Button>
      </form>
      {!state.success && (
        <p className="mt-2 text-sm text-destructive">{state.error}</p>
      )}
    </div>
  );
}
