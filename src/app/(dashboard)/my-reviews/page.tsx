import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { reviewRepository } from "@/lib/repositories/review";
import { formatDate, formatFullName, formatStars } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PageHeader } from "@/components/PageHeader";
import { EmptyState } from "@/components/EmptyState";

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
      <PageHeader
        title="Avis recus"
        subtitle={avgRating ? `Note moyenne : ${avgRating}/5 (${reviews.length} avis)` : undefined}
      />

      {reviews.length === 0 ? (
        <EmptyState message="Vous n'avez pas encore recu d'avis" />
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
                  {formatFullName(review.author.firstName, review.author.name)}
                </TableCell>
                <TableCell>
                  <span className="font-medium">{formatStars(review.rating)}</span>
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
                  {formatDate(review.createdAt)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
