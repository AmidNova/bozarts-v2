import { ProductCard } from "./ProductCard";

interface Product {
  id: string;
  name: string;
  price: number | { toString(): string };
  imageUrl: string | null;
  category: string;
  inStock: boolean;
  artisan: {
    id: string;
    name: string | null;
    firstName: string | null;
  };
}

interface ProductGridProps {
  products: Product[];
}

export function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-lg font-medium text-muted-foreground">
          Aucun produit trouve
        </p>
        <p className="text-sm text-muted-foreground">
          Essayez de modifier vos filtres
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
