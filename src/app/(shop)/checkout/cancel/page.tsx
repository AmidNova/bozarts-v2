import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CheckoutCancelPage() {
  return (
    <div className="mx-auto max-w-lg px-4 py-16 text-center">
      <div className="text-5xl">&#10007;</div>
      <h1 className="mt-4 text-2xl font-bold tracking-tight">
        Paiement annule
      </h1>
      <p className="mt-2 text-muted-foreground">
        Votre panier a ete conserve. Vous pouvez reprendre votre commande a tout
        moment.
      </p>
      <div className="mt-8 flex justify-center gap-3">
        <Button render={<Link href="/cart" />}>Retour au panier</Button>
        <Button variant="outline" render={<Link href="/products" />}>
          Continuer mes achats
        </Button>
      </div>
    </div>
  );
}
