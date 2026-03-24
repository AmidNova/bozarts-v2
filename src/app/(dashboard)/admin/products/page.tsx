import Link from "next/link";
import { Suspense } from "react";
import { productRepository } from "@/lib/repositories/product";
import { ProductFilterSchema } from "@/lib/schemas/product";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ProductAdminActions } from "@/components/admin/ProductAdminActions";
import { CategoryFilter } from "@/components/products/CategoryFilter";
import { SearchBar } from "@/components/products/SearchBar";
import { Pagination } from "@/components/products/Pagination";

interface Props {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function AdminProductsPage({ searchParams }: Props) {
  const raw = await searchParams;
  const filters = ProductFilterSchema.parse(raw);
  const { products, page, totalPages, total } =
    await productRepository.findAll(filters);

  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Produits</h1>
          <p className="mt-1 text-muted-foreground">{total} produit{total > 1 ? "s" : ""}</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Suspense>
            <SearchBar />
          </Suspense>
          <Suspense>
            <CategoryFilter />
          </Suspense>
        </div>
      </div>

      {products.length === 0 ? (
        <p className="mt-16 text-center text-muted-foreground">
          Aucun produit trouve.
        </p>
      ) : (
        <div className="mt-6 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Produit</TableHead>
                <TableHead>Artisan</TableHead>
                <TableHead>Categorie</TableHead>
                <TableHead>Prix</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => {
                const artisanName = [
                  product.artisan.firstName,
                  product.artisan.name,
                ]
                  .filter(Boolean)
                  .join(" ");

                return (
                  <TableRow key={product.id}>
                    <TableCell>
                      <Link
                        href={`/products/${product.id}`}
                        className="font-medium hover:underline"
                      >
                        {product.name}
                      </Link>
                    </TableCell>
                    <TableCell className="text-sm">
                      <Link
                        href={`/admin/users/${product.artisan.id}`}
                        className="hover:underline"
                      >
                        {artisanName}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{product.category}</Badge>
                    </TableCell>
                    <TableCell>
                      {new Intl.NumberFormat("fr-FR", {
                        style: "currency",
                        currency: "EUR",
                      }).format(Number(product.price))}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={product.inStock ? "default" : "destructive"}
                      >
                        {product.inStock ? "En stock" : "Epuise"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(product.createdAt).toLocaleDateString("fr-FR")}
                    </TableCell>
                    <TableCell className="text-right">
                      <ProductAdminActions
                        productId={product.id}
                        inStock={product.inStock}
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          <Suspense>
            <Pagination currentPage={page} totalPages={totalPages} />
          </Suspense>
        </div>
      )}
    </>
  );
}
