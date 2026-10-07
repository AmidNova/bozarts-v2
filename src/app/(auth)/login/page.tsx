"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

type LoginState = { error: string } | null;

export default function LoginPage() {
  const router = useRouter();

  const [state, formAction, pending] = useActionState(
    async (_prev: LoginState, formData: FormData): Promise<LoginState> => {
      const email = formData.get("email") as string;
      const password = formData.get("password") as string;

      if (!email || !password) {
        return { error: "Email et mot de passe requis" };
      }

      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        return { error: "Email ou mot de passe incorrect" };
      }

      router.push("/");
      router.refresh();
      return null;
    },
    null
  );

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4 py-8">
      <h1 className="mb-5 font-heading text-4xl font-bold text-primary">Connexion</h1>

      <form
        action={formAction}
        className="flex w-full max-w-[450px] flex-col gap-4 rounded-xl bg-primary p-8 shadow-lg transition-all duration-500 hover:-translate-y-2"
      >
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
            autoComplete="current-password"
            placeholder="••••••••"
            className="border-3 border-secondary bg-background"
          />
        </div>

        {state?.error && (
          <div className="rounded-lg border border-red-400 bg-red-50 px-3 py-2 text-sm text-red-700">
            {state.error}
          </div>
        )}

        <Button
          type="submit"
          disabled={pending}
          className="mt-2 w-full bg-secondary text-lg font-bold hover:bg-[#19242f]"
        >
          {pending ? "Connexion..." : "Se connecter"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Pas encore de compte ?{" "}
        <Link href="/register" className="font-semibold text-primary hover:underline">
          Inscrivez-vous
        </Link>
      </p>
    </div>
  );
}
