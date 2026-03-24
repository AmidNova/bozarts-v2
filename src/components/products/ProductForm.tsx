"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { createProduct, updateProduct } from "@/app/actions/product";
import type { ActionResult } from "@/lib/action-result";

const categories = [
  { value: "CERAMIQUE", label: "Ceramique" },
  { value: "MOBILIER", label: "Mobilier" },
  { value: "BIJOUX", label: "Bijoux" },
  { value: "TEXTILE", label: "Textile" },
  { value: "PEINTURE", label: "Peinture" },
  { value: "SCULPTURE", label: "Sculpture" },
  { value: "AUTRE", label: "Autre" },
];

interface ProductFormProps {
  product?: {
    id: string;
    name: string;
    description: string | null;
    price: number;
    imageUrl: string | null;
    category: string;
    inStock: boolean;
  };
}

export function ProductForm({ product }: ProductFormProps) {
  const router = useRouter();
  const isEdit = !!product;

  const [state, formAction, pending] = useActionState(
    async (_prev: ActionResult<{ id: string }> | null, formData: FormData) => {
      const result = isEdit
        ? await updateProduct(product.id, formData)
        : await createProduct(formData);
      if (result.success) {
        router.push("/my-products");
      }
      return result;
    },
    null
  );

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="name">Nom du produit</Label>
        <Input
          id="name"
          name="name"
          required
          defaultValue={product?.name}
          placeholder="Ex: Vase en ceramique"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          rows={4}
          defaultValue={product?.description ?? ""}
          placeholder="Decrivez votre produit..."
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="price">Prix (&euro;)</Label>
          <Input
            id="price"
            name="price"
            type="number"
            step="0.01"
            min="0.01"
            required
            defaultValue={product?.price}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="category">Categorie</Label>
          <select
            id="category"
            name="category"
            defaultValue={product?.category ?? "AUTRE"}
            className="h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            {categories.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="imageUrl">URL de l&apos;image</Label>
        <Input
          id="imageUrl"
          name="imageUrl"
          type="url"
          defaultValue={product?.imageUrl ?? ""}
          placeholder="https://..."
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          id="inStock"
          name="inStock"
          type="checkbox"
          defaultChecked={product?.inStock ?? true}
          value="true"
          className="h-4 w-4 rounded border-input"
        />
        <Label htmlFor="inStock">En stock</Label>
      </div>

      {state && !state.success && (
        <p className="text-sm text-destructive">{state.error}</p>
      )}

      <div className="flex gap-2">
        <Button type="submit" disabled={pending}>
          {pending
            ? isEdit
              ? "Mise a jour..."
              : "Creation..."
            : isEdit
              ? "Mettre a jour"
              : "Creer le produit"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/my-products")}
        >
          Annuler
        </Button>
      </div>
    </form>
  );
}
