import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { productRepository } from "@/lib/repositories/product";
import { formatCurrency } from "@/lib/format";
import { CATEGORY_LABELS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DeleteProductButton } from "@/components/products/DeleteProductButton";
import { StockBadge } from "@/components/ui/StatusBadge";
import { PageHeader } from "@/components/PageHeader";
import { EmptyState } from "@/components/EmptyState";

export default async function MyProductsPage() {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "ARTISAN") {
    redirect("/");
  }

  const products = await productRepository.findByArtisanId(session.user.id);

  return (
    <>
      <PageHeader
        title="Mes produits"
        actions={
          <Button render={<Link href="/my-products/new" />}>
            Nouveau produit
          </Button>
        }
      />

      {products.length === 0 ? (
        <EmptyState message="Vous n'avez pas encore de produits.">
          <p className="mt-1 text-sm">
            Cliquez sur &quot;Nouveau produit&quot; pour commencer.
          </p>
        </EmptyState>
      ) : (
        <div className="mt-6 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Categorie</TableHead>
                <TableHead>Prix</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {CATEGORY_LABELS[product.category] ?? product.category}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatCurrency(product.price)}</TableCell>
                  <TableCell>
                    <StockBadge value={String(product.inStock)} />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        render={<Link href={`/my-products/${product.id}/edit`} />}
                      >
                        Modifier
                      </Button>
                      <DeleteProductButton productId={product.id} />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </>
  );
}
