import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { reviewRepository } from "@/lib/repositories/review";
import { ReviewModerationActions } from "@/components/reviews/ReviewModerationActions";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default async function AdminReviewsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  if (session.user.role !== "ADMIN") redirect("/");

  const pendingReviews = await reviewRepository.findPendingReviews();

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="text-2xl font-bold tracking-tight">Moderation des avis</h1>
      <p className="mt-1 text-muted-foreground">
        {pendingReviews.length} avis en attente de moderation
      </p>

      {pendingReviews.length === 0 ? (
        <p className="mt-16 text-center text-muted-foreground">
          Aucun avis en attente
        </p>
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
                  {review.author.firstName ?? review.author.name}
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
                  {review.target.firstName ?? review.target.name}
                </TableCell>
                <TableCell>
                  <span className="font-medium">{"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}</span>
                </TableCell>
                <TableCell className="max-w-xs truncate text-sm text-muted-foreground">
                  {review.comment ?? "-"}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {new Date(review.createdAt).toLocaleDateString("fr-FR")}
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
