import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { productRepository } from "@/lib/repositories/product";
import { ProductForm } from "@/components/products/ProductForm";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: Props) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "ARTISAN") {
    redirect("/");
  }

  const { id } = await params;
  const product = await productRepository.findById(id);

  if (!product || product.artisanId !== session.user.id) {
    notFound();
  }

  return (
    <>
      <h1 className="text-2xl font-bold tracking-tight">Modifier le produit</h1>
      <div className="mt-6 max-w-2xl">
        <ProductForm
          product={{
            id: product.id,
            name: product.name,
            description: product.description,
            price: Number(product.price),
            imageUrl: product.imageUrl,
            category: product.category,
            inStock: product.inStock,
          }}
        />
      </div>
    </>
  );
}
