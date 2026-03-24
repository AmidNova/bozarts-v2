import { Suspense } from "react";
import { productRepository } from "@/lib/repositories/product";
import { ProductFilterSchema } from "@/lib/schemas/product";
import { ProductGrid } from "@/components/products/ProductGrid";
import { CategoryFilter } from "@/components/products/CategoryFilter";
import { SearchBar } from "@/components/products/SearchBar";
import { Pagination } from "@/components/products/Pagination";

interface Props {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function ProductsPage({ searchParams }: Props) {
  const raw = await searchParams;
  const filters = ProductFilterSchema.parse(raw);
  const { products, page, totalPages } = await productRepository.findAll(filters);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight">Produits</h1>

      <div className="mt-6 flex flex-col gap-4">
        <Suspense>
          <SearchBar />
        </Suspense>
        <Suspense>
          <CategoryFilter />
        </Suspense>
      </div>

      <div className="mt-8">
        <ProductGrid products={products} />
        <Suspense>
          <Pagination currentPage={page} totalPages={totalPages} />
        </Suspense>
      </div>
    </div>
  );
}
