import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { ProductForm } from "@/components/products/ProductForm";

export default async function NewProductPage() {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "ARTISAN") {
    redirect("/");
  }

  return (
    <>
      <h1 className="text-2xl font-bold tracking-tight">Nouveau produit</h1>
      <div className="mt-6 max-w-2xl">
        <ProductForm />
      </div>
    </>
  );
}
