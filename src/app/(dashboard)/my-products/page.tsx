import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { productRepository } from "@/lib/repositories/product";
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

const categoryLabels: Record<string, string> = {
  CERAMIQUE: "Ceramique",
  MOBILIER: "Mobilier",
  BIJOUX: "Bijoux",
  TEXTILE: "Textile",
  PEINTURE: "Peinture",
  SCULPTURE: "Sculpture",
  AUTRE: "Autre",
};

export default async function MyProductsPage() {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "ARTISAN") {
    redirect("/");
  }

  const products = await productRepository.findByArtisanId(session.user.id);

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Mes produits</h1>
        <Button render={<Link href="/my-products/new" />}>
          Nouveau produit
        </Button>
      </div>

      {products.length === 0 ? (
        <div className="mt-8 text-center text-muted-foreground">
          <p>Vous n&apos;avez pas encore de produits.</p>
          <p className="mt-1 text-sm">
            Cliquez sur &quot;Nouveau produit&quot; pour commencer.
          </p>
        </div>
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
                      {categoryLabels[product.category] ?? product.category}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {Number(product.price).toFixed(2)}&nbsp;&euro;
                  </TableCell>
                  <TableCell>
                    {product.inStock ? (
                      <Badge variant="outline">En stock</Badge>
                    ) : (
                      <Badge variant="destructive">Rupture</Badge>
                    )}
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
