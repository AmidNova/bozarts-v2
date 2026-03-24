import Link from "next/link";
import { Suspense } from "react";
import { userRepository } from "@/lib/repositories/user";
import { Card, CardContent } from "@/components/ui/card";
import { Pagination } from "@/components/products/Pagination";

interface Props {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function ArtisansPage({ searchParams }: Props) {
  const raw = await searchParams;
  const page = Math.max(1, Number(raw.page) || 1);
  const { artisans, totalPages } = await userRepository.findArtisans(page);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight">Nos artisans</h1>
      <p className="mt-1 text-muted-foreground">
        Decouvrez les artisans et leurs creations uniques
      </p>

      {artisans.length === 0 ? (
        <p className="mt-12 text-center text-muted-foreground">
          Aucun artisan pour le moment.
        </p>
      ) : (
        <>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {artisans.map((artisan) => {
              const displayName = [artisan.firstName, artisan.name]
                .filter(Boolean)
                .join(" ");

              return (
                <Link
                  key={artisan.id}
                  href={`/artisans/${artisan.id}`}
                  className="group"
                >
                  <Card className="h-full transition-shadow group-hover:shadow-md">
                    <CardContent className="flex flex-col items-center gap-3 pt-6">
                      <div className="h-20 w-20 overflow-hidden rounded-full bg-muted">
                        {artisan.image ? (
                          <img
                            src={artisan.image}
                            alt={displayName}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-2xl font-semibold text-muted-foreground">
                            {(artisan.firstName?.[0] ?? "A").toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div className="text-center">
                        <h2 className="font-semibold">{displayName}</h2>
                        {artisan.description && (
                          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                            {artisan.description}
                          </p>
                        )}
                        <p className="mt-2 text-xs text-muted-foreground">
                          {artisan._count.products} produit
                          {artisan._count.products > 1 ? "s" : ""}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
          <Suspense>
            <Pagination currentPage={page} totalPages={totalPages} />
          </Suspense>
        </>
      )}
    </div>
  );
}
