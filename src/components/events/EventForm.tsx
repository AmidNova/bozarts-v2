"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { createEvent, updateEvent } from "@/app/actions/event";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { ActionResult } from "@/lib/action-result";

type EventData = {
  id: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  location: string;
  imageUrl: string | null;
};

const initialState: ActionResult<{ id: string }> = { success: true, data: { id: "" } };

function toDatetimeLocal(date: Date) {
  const d = new Date(date);
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
}

export function EventForm({ event }: { event?: EventData }) {
  const router = useRouter();
  const [state, action, pending] = useActionState(
    async (_prev: ActionResult<{ id: string }>, formData: FormData) => {
      if (event) {
        return updateEvent(event.id, formData);
      }
      return createEvent(formData);
    },
    initialState
  );

  useEffect(() => {
    if (state.success && state.data.id) {
      router.push(`/events/${state.data.id}`);
    }
  }, [state, router]);

  return (
    <form action={action} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="title">Titre</Label>
        <Input id="title" name="title" required defaultValue={event?.title} />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          rows={4}
          required
          defaultValue={event?.description}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="startDate">Date de debut</Label>
          <Input
            id="startDate"
            name="startDate"
            type="datetime-local"
            required
            defaultValue={event ? toDatetimeLocal(event.startDate) : undefined}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="endDate">Date de fin</Label>
          <Input
            id="endDate"
            name="endDate"
            type="datetime-local"
            required
            defaultValue={event ? toDatetimeLocal(event.endDate) : undefined}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="location">Lieu</Label>
        <Input id="location" name="location" required defaultValue={event?.location} />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="imageUrl">URL de l&apos;image (optionnel)</Label>
        <Input
          id="imageUrl"
          name="imageUrl"
          type="url"
          defaultValue={event?.imageUrl ?? undefined}
        />
      </div>

      {!state.success && (
        <p className="text-sm text-destructive">{state.error}</p>
      )}

      <Button type="submit" disabled={pending}>
        {pending
          ? event ? "Mise a jour..." : "Creation..."
          : event ? "Mettre a jour" : "Creer l'evenement"}
      </Button>
    </form>
  );
}
