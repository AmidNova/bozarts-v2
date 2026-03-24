"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { register } from "@/app/actions/auth";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { ActionResult } from "@/lib/action-result";

export default function RegisterPage() {
  const router = useRouter();

  const [state, formAction, pending] = useActionState(
    async (
      _prev: ActionResult<{ id: string }> | null,
      formData: FormData
    ) => {
      const result = await register(formData);
      if (result.success) {
        // Auto-login after registration
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;
        await signIn("credentials", { email, password, redirect: false });
        router.push("/");
        router.refresh();
      }
      return result;
    },
    null
  );

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md items-center px-4 py-8">
      <div className="w-full space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight">Inscription</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Creez votre compte Bozarts
          </p>
        </div>

        <form action={formAction} className="flex flex-col gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="firstName">Prenom</Label>
              <Input
                id="firstName"
                name="firstName"
                required
                autoComplete="given-name"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="name">Nom</Label>
              <Input
                id="name"
                name="name"
                required
                autoComplete="family-name"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="vous@exemple.com"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="password">Mot de passe</Label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="new-password"
              placeholder="8 caracteres minimum"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              autoComplete="new-password"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="role">Je suis</Label>
            <select
              id="role"
              name="role"
              defaultValue="CLIENT"
              className="h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <option value="CLIENT">Acheteur</option>
              <option value="ARTISAN">Artisan</option>
            </select>
          </div>

          {state && !state.success && (
            <p className="text-sm text-destructive">{state.error}</p>
          )}

          <Button type="submit" disabled={pending} className="w-full">
            {pending ? "Creation..." : "Creer mon compte"}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          Deja un compte ?{" "}
          <Link href="/login" className="text-primary hover:underline">
            Connectez-vous
          </Link>
        </p>
      </div>
    </div>
  );
}
