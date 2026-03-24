"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createCgu, updateCgu } from "@/app/actions/admin";
import type { ActionResult } from "@/lib/action-result";

interface CguFormProps {
  section?: { id: string; title: string; content: string };
  onDone?: () => void;
}

export function CguForm({ section, onDone }: CguFormProps) {
  const router = useRouter();

  async function action(
    _prev: ActionResult<unknown> | null,
    formData: FormData
  ) {
    if (section) {
      return updateCgu(section.id, formData);
    }
    return createCgu(formData);
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
        <Label htmlFor="title">Titre</Label>
        <Input
          id="title"
          name="title"
          defaultValue={section?.title}
          required
        />
      </div>
      <div>
        <Label htmlFor="content">Contenu</Label>
        <Textarea
          id="content"
          name="content"
          rows={6}
          defaultValue={section?.content}
          required
        />
      </div>
      {state && !state.success && (
        <p className="text-sm text-destructive">{state.error}</p>
      )}
      <Button type="submit" disabled={pending}>
        {section ? "Mettre a jour" : "Creer"}
      </Button>
    </form>
  );
}
