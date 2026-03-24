import { notFound } from "next/navigation";
import Link from "next/link";
import { productRepository } from "@/lib/repositories/product";
import { reviewRepository } from "@/lib/repositories/review";
import { auth } from "@/lib/auth";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AddToCartButton } from "@/components/products/AddToCartButton";
import { ReviewForm } from "@/components/reviews/ReviewForm";
import { Button } from "@/components/ui/button";

const categoryLabels: Record<string, string> = {
  CERAMIQUE: "Ceramique",
  MOBILIER: "Mobilier",
  BIJOUX: "Bijoux",
  TEXTILE: "Textile",
  PEINTURE: "Peinture",
  SCULPTURE: "Sculpture",
  AUTRE: "Autre",
};

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params;
  const [product, session] = await Promise.all([
    productRepository.findById(id),
    auth(),
  ]);

  if (!product) notFound();

  const userId = session?.user?.id;
  const hasReviewed = userId
    ? await reviewRepository.hasReviewed(userId, product.id)
    : false;
  const canReview = userId && !hasReviewed && product.artisanId !== userId;

  const artisanName = [product.artisan.firstName, product.artisan.name]
    .filter(Boolean)
    .join(" ");

  const avgRating =
    product.reviews.length > 0
      ? product.reviews.reduce((sum, r) => sum + r.rating, 0) /
        product.reviews.length
      : null;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Image */}
        <div className="aspect-square overflow-hidden rounded-xl bg-muted">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              Pas d&apos;image
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col gap-4">
          <div>
            <Badge variant="secondary">
              {categoryLabels[product.category] ?? product.category}
            </Badge>
            <h1 className="mt-2 text-3xl font-bold tracking-tight">
              {product.name}
            </h1>
            <p className="mt-1 text-2xl font-semibold">
              {Number(product.price).toFixed(2)}&nbsp;&euro;
            </p>
          </div>

          <p className="text-sm text-muted-foreground">
            Par{" "}
            <Link
              href={`/artisans/${product.artisan.id}`}
              className="font-medium text-foreground hover:underline"
            >
              {artisanName}
            </Link>
          </p>

          {avgRating !== null && (
            <p className="text-sm text-muted-foreground">
              Note moyenne : {avgRating.toFixed(1)}/5 ({product.reviews.length}{" "}
              avis)
            </p>
          )}

          <Separator />

          {product.description && (
            <div className="prose prose-sm max-w-none">
              <p className="whitespace-pre-wrap">{product.description}</p>
            </div>
          )}

          <div className="mt-auto pt-4">
            <AddToCartButton productId={product.id} inStock={product.inStock} />
          </div>
        </div>
      </div>

      {/* Contact artisan */}
      {userId && product.artisanId !== userId && (
        <div className="mt-8">
          <Button variant="outline" render={<Link href={`/messages/${product.artisanId}`} />}>
            Contacter l&apos;artisan
          </Button>
        </div>
      )}

      {/* Reviews */}
      <section className="mt-12">
        <h2 className="text-xl font-semibold">Avis clients</h2>
        {product.reviews.length > 0 ? (
          <div className="mt-4 flex flex-col gap-4">
            {product.reviews.map((review) => {
              const reviewerName = [review.author.firstName, review.author.name]
                .filter(Boolean)
                .join(" ");
              return (
                <div
                  key={review.id}
                  className="rounded-lg border p-4"
                >
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{reviewerName}</p>
                    <p className="text-sm text-muted-foreground">
                      {review.rating}/5
                    </p>
                  </div>
                  {review.comment && (
                    <p className="mt-2 text-sm text-muted-foreground">
                      {review.comment}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <p className="mt-4 text-sm text-muted-foreground">Aucun avis pour le moment</p>
        )}

        {canReview && (
          <div className="mt-6">
            <ReviewForm productId={product.id} />
          </div>
        )}

        {userId && hasReviewed && (
          <p className="mt-4 text-sm text-muted-foreground">
            Vous avez deja donne votre avis sur ce produit.
          </p>
        )}

        {!userId && (
          <p className="mt-4 text-sm text-muted-foreground">
            <Link href="/login" className="text-foreground underline">Connectez-vous</Link>{" "}
            pour laisser un avis.
          </p>
        )}
      </section>
    </div>
  );
}
