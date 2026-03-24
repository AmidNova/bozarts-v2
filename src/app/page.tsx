import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <>
      <section className="flex flex-col items-center justify-center gap-6 px-4 py-24 text-center sm:py-32">
        <h1 className="max-w-2xl text-4xl font-bold tracking-tight sm:text-5xl">
          L&apos;artisanat d&apos;art, a portee de clic
        </h1>
        <p className="max-w-lg text-lg text-muted-foreground">
          Decouvrez des creations uniques faites main par des artisans
          passionnes. Bijoux, ceramique, textile et bien plus.
        </p>
        <div className="flex gap-3">
          <Button size="lg" render={<Link href="/products" />}>
            Voir les produits
          </Button>
          <Button variant="outline" size="lg" render={<Link href="/register" />}>
            Devenir artisan
          </Button>
        </div>
      </section>
    </>
  );
}
