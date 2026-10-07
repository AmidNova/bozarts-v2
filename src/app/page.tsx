import Link from "next/link";
import { auth } from "@/lib/auth";
import { productRepository } from "@/lib/repositories/product";
import { eventRepository } from "@/lib/repositories/event";
import { formatCurrency, formatDate, formatFullName, pluralize } from "@/lib/format";
import { Button } from "@/components/ui/button";

export default async function Home() {
  const session = await auth();
  const user = session?.user;

  const [{ products: trending }, { events }] = await Promise.all([
    productRepository.findAll({ page: 1, pageSize: 6 }),
    eventRepository.findAll(1, 3),
  ]);

  return (
    <div className="px-5 py-6">
      {/* ── Bandeau "Rejoignez-nous" ── */}
      <JoinUsBanner isLoggedIn={!!user} role={user?.role} />

      {/* ── Tendance du moment ── */}
      <section className="mt-10">
        <h2 className="mb-4 text-xl font-bold text-primary">Tendance du moment</h2>
        {trending.length === 0 ? (
          <p className="text-muted-foreground">Aucun produit pour le moment.</p>
        ) : (
          <div className="flex flex-wrap gap-6">
            {trending.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.id}`}
                className="group w-[calc(16.66%-20px)] min-w-[140px] overflow-hidden rounded-2xl bg-secondary p-2.5 transition-all duration-500 hover:scale-[1.08] hover:bg-primary"
              >
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="h-[150px] w-full rounded-xl object-cover transition-all duration-500"
                  />
                ) : (
                  <div className="flex h-[150px] items-center justify-center rounded-xl bg-muted text-sm text-muted-foreground">
                    Pas d&apos;image
                  </div>
                )}
              </Link>
            ))}
          </div>
        )}
        <div className="mt-6 text-center">
          <Button render={<Link href="/products" />}>
            Voir tous les produits
          </Button>
        </div>
      </section>

      {/* ── Evenements a venir ── */}
      <section className="mt-10">
        <h2 className="mb-4 text-xl font-bold text-primary">Evenements a venir</h2>
        {events.length === 0 ? (
          <p className="text-muted-foreground">Aucun evenement a venir.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <Link
                key={event.id}
                href={`/events/${event.id}`}
                className="group overflow-hidden rounded-xl bg-white shadow-md transition-transform duration-300 hover:-translate-y-1"
              >
                {event.imageUrl ? (
                  <img
                    src={event.imageUrl}
                    alt={event.title}
                    className="h-[200px] w-full object-cover"
                  />
                ) : (
                  <div className="flex h-[200px] items-center justify-center bg-muted text-muted-foreground">
                    Evenement
                  </div>
                )}
                <div className="p-5">
                  <h3 className="mb-2 text-lg font-semibold text-primary">
                    {event.title}
                  </h3>
                  <p className="mb-1 text-sm text-muted-foreground">
                    {formatDate(event.startDate, "long")}
                  </p>
                  <p className="mb-1 text-sm text-muted-foreground">
                    {event.location}
                  </p>
                  <p className="text-sm italic text-muted-foreground">
                    par {formatFullName(event.creator.firstName, event.creator.name)}
                  </p>
                  <p className="mt-2 text-sm font-bold text-primary">
                    {pluralize(event._count.participants, "participant")}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
        <div className="mt-6 text-center">
          <Button variant="outline" render={<Link href="/events" />}>
            Voir tous les evenements
          </Button>
        </div>
      </section>
    </div>
  );
}

/* ── Bandeau conditionnel (visiteur / client / artisan) ── */
function JoinUsBanner({
  isLoggedIn,
  role,
}: {
  isLoggedIn: boolean;
  role?: string;
}) {
  if (isLoggedIn && role === "ARTISAN") {
    return (
      <section className="rounded-[20px] border-3 border-primary bg-background p-6 text-center shadow-md transition-transform hover:-translate-y-1">
        <p className="mx-auto max-w-3xl leading-relaxed text-secondary">
          Bienvenue sur Bozarts ! Gerez vos produits, commandes et evenements
          depuis votre espace artisan.
        </p>
        <div className="mt-4 flex justify-center gap-4">
          <Button render={<Link href="/my-products" />}>Mes produits</Button>
          <Button variant="outline" render={<Link href="/my-events" />}>
            Mes evenements
          </Button>
        </div>
      </section>
    );
  }

  if (isLoggedIn) {
    return (
      <section className="rounded-[20px] border-3 border-primary bg-background p-6 text-center shadow-md transition-transform hover:-translate-y-1">
        <p className="mx-auto max-w-3xl leading-relaxed text-secondary">
          Decouvrez des creations uniques faites main par des artisans
          passionnes. Bijoux, ceramique, textile et bien plus.
        </p>
        <div className="mt-4">
          <Button render={<Link href="/products" />}>Explorer les produits</Button>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-[20px] border-3 border-primary bg-background p-6 text-center shadow-md transition-transform hover:-translate-y-1">
      <p className="mx-auto max-w-3xl leading-relaxed text-secondary">
        Rejoignez Bozarts, la marketplace de l&apos;artisanat d&apos;art.
        Decouvrez des creations uniques ou vendez vos propres oeuvres.
      </p>
      <div className="mt-4 flex justify-center gap-4">
        <Button render={<Link href="/register" />}>
          Rejoindre Bozarts
        </Button>
        <Button variant="outline" render={<Link href="/login" />}>
          Se connecter
        </Button>
      </div>
    </section>
  );
}
