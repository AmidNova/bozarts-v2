"use client";

import { useRouter, useSearchParams } from "next/navigation";

const categories = [
  { value: "", label: "Toutes" },
  { value: "CERAMIQUE", label: "Ceramique" },
  { value: "MOBILIER", label: "Mobilier" },
  { value: "BIJOUX", label: "Bijoux" },
  { value: "TEXTILE", label: "Textile" },
  { value: "PEINTURE", label: "Peinture" },
  { value: "SCULPTURE", label: "Sculpture" },
  { value: "AUTRE", label: "Autre" },
];

export function CategoryFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const current = searchParams.get("category") ?? "";

  function handleChange(category: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (category) {
      params.set("category", category);
    } else {
      params.delete("category");
    }
    params.delete("page");
    router.push(`/products?${params.toString()}`);
  }

  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((cat) => (
        <button
          key={cat.value}
          onClick={() => handleChange(cat.value)}
          className={`rounded-full border px-3 py-1 text-sm transition-colors ${
            current === cat.value
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border hover:bg-muted"
          }`}
        >
          {cat.label}
        </button>
      ))}
    </div>
  );
}
