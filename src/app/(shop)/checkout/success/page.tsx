import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { stripe } from "@/lib/stripe";
import { Button } from "@/components/ui/button";

interface Props {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function CheckoutSuccessPage({ searchParams }: Props) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const raw = await searchParams;
  const sessionId = typeof raw.session_id === "string" ? raw.session_id : null;

  let amountPaid: string | null = null;

  if (sessionId) {
    try {
      const checkoutSession =
        await stripe.checkout.sessions.retrieve(sessionId);
      if (checkoutSession.amount_total) {
        amountPaid = (checkoutSession.amount_total / 100).toFixed(2);
      }
    } catch {
      // Session not found or expired — still show success
    }
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-16 text-center">
      <div className="text-5xl">&#10003;</div>
      <h1 className="mt-4 text-2xl font-bold tracking-tight">
        Paiement confirme !
      </h1>
      <p className="mt-2 text-muted-foreground">
        Merci pour votre commande.
        {amountPaid && <> Montant paye : {amountPaid}&nbsp;&euro;</>}
      </p>
      <p className="mt-1 text-sm text-muted-foreground">
        Vous recevrez une confirmation par email.
      </p>
      <div className="mt-8 flex justify-center gap-3">
        <Button render={<Link href="/orders" />}>Mes commandes</Button>
        <Button variant="outline" render={<Link href="/products" />}>
          Continuer mes achats
        </Button>
      </div>
    </div>
  );
}
