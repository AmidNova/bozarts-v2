"use client";

import { useRouter, useSearchParams } from "next/navigation";

const roles = [
  { value: "", label: "Tous les roles" },
  { value: "CLIENT", label: "Client" },
  { value: "ARTISAN", label: "Artisan" },
  { value: "ADMIN", label: "Admin" },
];

const statuses = [
  { value: "", label: "Tous les statuts" },
  { value: "ACTIVE", label: "Actif" },
  { value: "SUSPENDED", label: "Suspendu" },
  { value: "PENDING", label: "En attente" },
];

export function AdminUserFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();

  function handleChange(key: string, value: string) {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete("page");
    router.push(`?${params.toString()}`);
  }

  function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const search = formData.get("search") as string;
    handleChange("search", search);
  }

  const selectClass =
    "h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

  return (
    <div className="flex flex-wrap items-center gap-3">
      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          name="search"
          type="text"
          placeholder="Rechercher..."
          defaultValue={searchParams.get("search") ?? ""}
          className={`${selectClass} w-48`}
        />
        <button
          type="submit"
          className="h-8 rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground"
        >
          OK
        </button>
      </form>
      <select
        value={searchParams.get("role") ?? ""}
        onChange={(e) => handleChange("role", e.target.value)}
        className={selectClass}
      >
        {roles.map((r) => (
          <option key={r.value} value={r.value}>
            {r.label}
          </option>
        ))}
      </select>
      <select
        value={searchParams.get("status") ?? ""}
        onChange={(e) => handleChange("status", e.target.value)}
        className={selectClass}
      >
        {statuses.map((s) => (
          <option key={s.value} value={s.value}>
            {s.label}
          </option>
        ))}
      </select>
    </div>
  );
}
