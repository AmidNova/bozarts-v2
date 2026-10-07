"use client";

import { useActionState } from "react";
import { updateProfile } from "@/app/actions/profile";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import type { ActionResult } from "@/lib/action-result";

interface ProfileFormProps {
  user: {
    name: string | null;
    firstName: string | null;
    description: string | null;
    address: string | null;
    phone: string | null;
    image: string | null;
  };
}

export function ProfileForm({ user }: ProfileFormProps) {
  const [state, formAction, pending] = useActionState(
    async (_prev: ActionResult<{ id: string }> | null, formData: FormData) => {
      return updateProfile(formData);
    },
    null,
  );

  return (
    <form action={formAction} className="flex flex-col gap-6">
      {/* ── Identite ── */}
      <Card>
        <CardHeader>
          <CardTitle>Identite</CardTitle>
          <CardDescription>Votre nom et presentation publique</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="firstName">Prenom</Label>
            <Input
              id="firstName"
              name="firstName"
              defaultValue={user.firstName ?? ""}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="name">Nom</Label>
            <Input id="name" name="name" defaultValue={user.name ?? ""} />
          </div>
          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <Label htmlFor="description">Bio</Label>
            <Textarea
              id="description"
              name="description"
              rows={4}
              defaultValue={user.description ?? ""}
              placeholder="Parlez de vous, de votre savoir-faire..."
            />
          </div>
        </CardContent>
      </Card>

      {/* ── Coordonnees ── */}
      <Card>
        <CardHeader>
          <CardTitle>Coordonnees</CardTitle>
          <CardDescription>Adresse et telephone</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <Label htmlFor="address">Adresse</Label>
            <Textarea
              id="address"
              name="address"
              rows={2}
              defaultValue={user.address ?? ""}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="phone">Telephone</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              defaultValue={user.phone ?? ""}
              placeholder="+33 6 12 34 56 78"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="image">Photo de profil (URL)</Label>
            <Input
              id="image"
              name="image"
              type="url"
              defaultValue={user.image ?? ""}
              placeholder="https://..."
            />
          </div>
        </CardContent>
      </Card>

      {/* ── Feedback + Submit ── */}
      <div className="flex flex-col gap-3">
        {state && !state.success && (
          <p className="text-sm text-destructive">{state.error}</p>
        )}
        {state?.success && (
          <p className="text-sm text-green-600">Profil mis a jour avec succes !</p>
        )}

        <Button type="submit" disabled={pending} className="w-fit">
          {pending ? "Mise a jour..." : "Enregistrer les modifications"}
        </Button>
      </div>
    </form>
  );
}
