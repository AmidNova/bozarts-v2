import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { reviewRepository } from "@/lib/repositories/review";
import { formatDate, formatFullName, formatStars } from "@/lib/format";
import { ReviewModerationActions } from "@/components/reviews/ReviewModerationActions";
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

export default async function AdminReviewsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  if (session.user.role !== "ADMIN") redirect("/");

  const pendingReviews = await reviewRepository.findPendingReviews();

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        title="Moderation des avis"
        subtitle={`${pendingReviews.length} avis en attente de moderation`}
      />

      {pendingReviews.length === 0 ? (
        <EmptyState message="Aucun avis en attente" />
      ) : (
        <Table className="mt-6">
          <TableHeader>
            <TableRow>
              <TableHead>Auteur</TableHead>
              <TableHead>Produit</TableHead>
              <TableHead>Artisan</TableHead>
              <TableHead>Note</TableHead>
              <TableHead>Commentaire</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pendingReviews.map((review) => (
              <TableRow key={review.id}>
                <TableCell className="text-sm">
                  {formatFullName(review.author.firstName, review.author.name)}
                </TableCell>
                <TableCell>
                  <Link
                    href={`/products/${review.product.id}`}
                    className="font-medium hover:underline"
                  >
                    {review.product.name}
                  </Link>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {formatFullName(review.target.firstName, review.target.name)}
                </TableCell>
                <TableCell>
                  <span className="font-medium">{formatStars(review.rating)}</span>
                </TableCell>
                <TableCell className="max-w-xs truncate text-sm text-muted-foreground">
                  {review.comment ?? "-"}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {formatDate(review.createdAt)}
                </TableCell>
                <TableCell className="text-right">
                  <ReviewModerationActions reviewId={review.id} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
