import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

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

const categoryLabels: Record<string, string> = {
  CERAMIQUE: "Ceramique",
  MOBILIER: "Mobilier",
  BIJOUX: "Bijoux",
  TEXTILE: "Textile",
  PEINTURE: "Peinture",
  SCULPTURE: "Sculpture",
  AUTRE: "Autre",
};

export function ProductCard({ product }: ProductCardProps) {
  const displayName = [product.artisan.firstName, product.artisan.name]
    .filter(Boolean)
    .join(" ");

  return (
    <Link href={`/products/${product.id}`} className="group">
      <Card className="h-full transition-shadow group-hover:shadow-md">
        <div className="relative aspect-[4/3] overflow-hidden rounded-t-xl bg-muted">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="h-full w-full object-cover transition-transform group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              Pas d&apos;image
            </div>
          )}
          {!product.inStock && (
            <Badge variant="destructive" className="absolute right-2 top-2">
              Rupture
            </Badge>
          )}
        </div>
        <CardContent className="flex flex-col gap-1">
          <Badge variant="secondary" className="w-fit">
            {categoryLabels[product.category] ?? product.category}
          </Badge>
          <h3 className="line-clamp-1 font-medium">{product.name}</h3>
          <p className="text-xs text-muted-foreground">par {displayName}</p>
          <p className="mt-1 text-lg font-semibold">
            {Number(product.price).toFixed(2)}&nbsp;&euro;
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
