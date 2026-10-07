import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { CATEGORY_LABELS } from "@/lib/constants";
import { formatCurrency, formatFullName } from "@/lib/format";

interface ProductCardProps {
  product: {
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
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const displayName = formatFullName(product.artisan.firstName, product.artisan.name);

  return (
    <Link
      href={`/products/${product.id}`}
      className="group flex flex-col overflow-hidden rounded-xl bg-white p-4 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
    >
      {/* Image */}
      <div className="relative mb-4 overflow-hidden rounded-lg">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-[220px] w-full object-cover"
          />
        ) : (
          <div className="flex h-[220px] items-center justify-center bg-muted text-muted-foreground">
            Pas d&apos;image
          </div>
        )}
        {!product.inStock && (
          <Badge variant="destructive" className="absolute right-2 top-2">
            Rupture
          </Badge>
        )}
      </div>

      {/* Categorie */}
      <span className="text-sm font-bold uppercase text-primary">
        {CATEGORY_LABELS[product.category] ?? product.category}
      </span>

      {/* Titre */}
      <h3 className="mt-2 line-clamp-1 text-xl font-semibold text-primary">
        {product.name}
      </h3>

      {/* Artisan */}
      <p className="mt-1 text-sm italic text-muted-foreground">par {displayName}</p>

      {/* Prix */}
      <p className="mt-2 text-xl font-bold text-secondary">
        {formatCurrency(product.price)}
      </p>
    </Link>
  );
}
