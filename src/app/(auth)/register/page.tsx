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
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4 py-8">
      <h1 className="mb-5 font-heading text-4xl font-bold text-primary">Inscription</h1>

      <form
        action={formAction}
        className="flex w-full max-w-[450px] flex-col gap-4 rounded-xl bg-primary p-8 shadow-lg transition-all duration-500 hover:-translate-y-2"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="firstName" className="font-bold text-background">
              Prenom
            </Label>
            <Input
              id="firstName"
              name="firstName"
              required
              autoComplete="given-name"
              className="border-3 border-secondary bg-background"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="name" className="font-bold text-background">
              Nom
            </Label>
            <Input
              id="name"
              name="name"
              required
              autoComplete="family-name"
              className="border-3 border-secondary bg-background"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="email" className="font-bold text-background">
            Email
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="vous@exemple.com"
            className="border-3 border-secondary bg-background"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="password" className="font-bold text-background">
            Mot de passe
          </Label>
          <Input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="new-password"
            placeholder="8 caracteres minimum"
            className="border-3 border-secondary bg-background"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="confirmPassword" className="font-bold text-background">
            Confirmer le mot de passe
          </Label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            required
            autoComplete="new-password"
            className="border-3 border-secondary bg-background"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="role" className="font-bold text-background">
            Je suis
          </Label>
          <select
            id="role"
            name="role"
            defaultValue="CLIENT"
            className="h-10 rounded-lg border-3 border-secondary bg-background px-3 text-base outline-none focus:shadow-[0_0_0_2px_rgba(43,62,80,0.2)]"
          >
            <option value="CLIENT">Acheteur</option>
            <option value="ARTISAN">Artisan</option>
          </select>
        </div>

        {state && !state.success && (
          <div className="rounded-lg border border-red-400 bg-red-50 px-3 py-2 text-sm text-red-700">
            {state.error}
          </div>
        )}

        <Button
          type="submit"
          disabled={pending}
          className="mt-2 w-full bg-secondary text-lg font-bold hover:bg-[#19242f]"
        >
          {pending ? "Creation..." : "Creer mon compte"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Deja un compte ?{" "}
        <Link href="/login" className="font-semibold text-primary hover:underline">
          Connectez-vous
        </Link>
      </p>
    </div>
  );
}
