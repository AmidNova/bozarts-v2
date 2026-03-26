"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { CATEGORY_OPTIONS } from "@/lib/constants";

/**
 * Filtre par categorie sous forme de boutons pills.
 * Utilise les constantes centralisees CATEGORY_OPTIONS.
 */
export function CategoryFilter() {
  const router = useRouter();
  const pathname = usePathname();
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
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex flex-wrap gap-2">
      {CATEGORY_OPTIONS.map((cat) => (
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
