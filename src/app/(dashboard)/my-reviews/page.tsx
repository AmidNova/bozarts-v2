import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { reviewRepository } from "@/lib/repositories/review";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default async function MyReviewsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  if (session.user.role !== "ARTISAN") redirect("/");

  const reviews = await reviewRepository.findByTargetId(session.user.id);

  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : null;

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="text-2xl font-bold tracking-tight">Avis recus</h1>

      {avgRating && (
        <p className="mt-2 text-muted-foreground">
          Note moyenne : <span className="font-semibold text-foreground">{avgRating}/5</span>
          {" "}({reviews.length} avis)
        </p>
      )}

      {reviews.length === 0 ? (
        <p className="mt-16 text-center text-muted-foreground">
          Vous n&apos;avez pas encore recu d&apos;avis
        </p>
      ) : (
        <Table className="mt-6">
          <TableHeader>
            <TableRow>
              <TableHead>Produit</TableHead>
              <TableHead>Auteur</TableHead>
              <TableHead>Note</TableHead>
              <TableHead>Commentaire</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reviews.map((review) => (
              <TableRow key={review.id}>
                <TableCell>
                  <Link
                    href={`/products/${review.productId}`}
                    className="font-medium hover:underline"
                  >
                    {review.product.name}
                  </Link>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {review.author.firstName ?? review.author.name}
                </TableCell>
                <TableCell>
                  <span className="font-medium">{"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}</span>
                </TableCell>
                <TableCell className="max-w-xs truncate text-sm text-muted-foreground">
                  {review.comment ?? "-"}
                </TableCell>
                <TableCell>
                  {review.approved ? (
                    <Badge variant="outline">Approuve</Badge>
                  ) : (
                    <Badge variant="secondary">En attente</Badge>
                  )}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {new Date(review.createdAt).toLocaleDateString("fr-FR")}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
