"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createFaq, updateFaq } from "@/app/actions/admin";
import type { ActionResult } from "@/lib/action-result";

interface FaqFormProps {
  entry?: {
    id: string;
    question: string;
    answerTitle: string;
    answerContent: string;
  };
  onDone?: () => void;
}

export function FaqForm({ entry, onDone }: FaqFormProps) {
  const router = useRouter();

  async function action(
    _prev: ActionResult<unknown> | null,
    formData: FormData
  ) {
    if (entry) {
      return updateFaq(entry.id, formData);
    }
    return createFaq(formData);
  }

  const [state, formAction, pending] = useActionState(action, null);

  useEffect(() => {
    if (state?.success) {
      router.refresh();
      onDone?.();
    }
  }, [state, router, onDone]);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <Label htmlFor="question">Question</Label>
        <Input
          id="question"
          name="question"
          defaultValue={entry?.question}
          required
        />
      </div>
      <div>
        <Label htmlFor="answerTitle">Titre de la reponse</Label>
        <Input
          id="answerTitle"
          name="answerTitle"
          defaultValue={entry?.answerTitle}
          required
        />
      </div>
      <div>
        <Label htmlFor="answerContent">Contenu de la reponse</Label>
        <Textarea
          id="answerContent"
          name="answerContent"
          rows={6}
          defaultValue={entry?.answerContent}
          required
        />
      </div>
      {state && !state.success && (
        <p className="text-sm text-destructive">{state.error}</p>
      )}
      <Button type="submit" disabled={pending}>
        {entry ? "Mettre a jour" : "Creer"}
      </Button>
    </form>
  );
}
