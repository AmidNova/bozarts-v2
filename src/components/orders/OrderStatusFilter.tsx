"use client";

import { useRouter, useSearchParams } from "next/navigation";

const statuses = [
  { value: "", label: "Toutes" },
  { value: "PENDING", label: "En attente" },
  { value: "CONFIRMED", label: "Confirmees" },
  { value: "SHIPPED", label: "Expediees" },
  { value: "DELIVERED", label: "Livrees" },
  { value: "CANCELLED", label: "Annulees" },
];

export function OrderStatusFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const current = searchParams.get("status") ?? "";

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const params = new URLSearchParams(searchParams);
    if (e.target.value) {
      params.set("status", e.target.value);
    } else {
      params.delete("status");
    }
    params.delete("page");
    router.push(`?${params.toString()}`);
  }

  return (
    <select
      value={current}
      onChange={handleChange}
      className="h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      {statuses.map((s) => (
        <option key={s.value} value={s.value}>
          {s.label}
        </option>
      ))}
    </select>
  );
}
