import Link from "next/link";
import { notFound } from "next/navigation";
import { userRepository } from "@/lib/repositories/user";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ProductGrid } from "@/components/products/ProductGrid";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ArtisanProfilePage({ params }: Props) {
  const { id } = await params;
  const artisan = await userRepository.findArtisanPublicProfile(id);

  if (!artisan) {
    notFound();
  }

  const displayName = [artisan.firstName, artisan.name]
    .filter(Boolean)
    .join(" ");

  const avgRating =
    artisan.reviewsReceived.length > 0
      ? artisan.reviewsReceived.reduce((sum, r) => sum + r.rating, 0) /
        artisan.reviewsReceived.length
      : null;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Button variant="ghost" size="sm" render={<Link href="/artisans" />}>
        &larr; Tous les artisans
      </Button>

      <div className="mt-6 flex flex-col items-center gap-4 sm:flex-row sm:items-start">
        <div className="h-24 w-24 shrink-0 overflow-hidden rounded-full bg-muted">
          {artisan.image ? (
            <img
              src={artisan.image}
              alt={displayName}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-3xl font-semibold text-muted-foreground">
              {(artisan.firstName?.[0] ?? "A").toUpperCase()}
            </div>
          )}
        </div>
        <div className="text-center sm:text-left">
          <h1 className="text-2xl font-bold tracking-tight">{displayName}</h1>
          {artisan.description && (
            <p className="mt-2 max-w-xl text-muted-foreground">
              {artisan.description}
            </p>
          )}
          <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
            {avgRating !== null && (
              <span>
                {avgRating.toFixed(1)} / 5 ({artisan.reviewsReceived.length} avis)
              </span>
            )}
            <span>
              Membre depuis{" "}
              {new Date(artisan.createdAt).toLocaleDateString("fr-FR", {
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>
        </div>
      </div>

      <Separator className="my-8" />

      <h2 className="text-xl font-semibold">
        Creations ({artisan.products.length})
      </h2>
      {artisan.products.length === 0 ? (
        <p className="mt-4 text-muted-foreground">
          Aucun produit disponible pour le moment.
        </p>
      ) : (
        <div className="mt-6">
          <ProductGrid
            products={artisan.products.map((p) => ({
              ...p,
              artisan: {
                id: artisan.id,
                name: artisan.name,
                firstName: artisan.firstName,
              },
            }))}
          />
        </div>
      )}
    </div>
  );
}
