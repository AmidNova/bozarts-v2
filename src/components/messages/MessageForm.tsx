"use client";

import { useActionState } from "react";
import { sendMessage } from "@/app/actions/message";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { ActionResult } from "@/lib/action-result";

interface MessageFormProps {
  receiverId: string;
}

const initialState: ActionResult<{ id: string }> = { success: true, data: { id: "" } };

export function MessageForm({ receiverId }: MessageFormProps) {
  const [state, action, pending] = useActionState(
    async (_prev: ActionResult<{ id: string }>, formData: FormData) => {
      const result = await sendMessage(formData);
      if (result.success) {
        // Reset form by returning initial state — the form will naturally re-render
        const form = document.querySelector<HTMLFormElement>("[data-message-form]");
        form?.reset();
      }
      return result;
    },
    initialState
  );

  return (
    <form action={action} data-message-form className="flex flex-col gap-3 border-t pt-4">
      <input type="hidden" name="receiverId" value={receiverId} />

      <Textarea
        name="content"
        placeholder="Votre message..."
        rows={3}
        required
      />

      {!state.success && (
        <p className="text-sm text-destructive">{state.error}</p>
      )}

      <Button type="submit" disabled={pending} className="self-end">
        {pending ? "Envoi..." : "Envoyer"}
      </Button>
    </form>
  );
}
