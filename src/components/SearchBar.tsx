"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    router.push(`/products?search=${encodeURIComponent(trimmed)}`);
  }

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-[700px]">
      <Image
        src="/icons/search-icon.png"
        alt=""
        width={20}
        height={20}
        className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2"
      />
      <input
        type="text"
        name="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Rechercher"
        className="w-full rounded-[30px] border border-border bg-white py-3 pl-12 pr-4 text-lg shadow-sm outline-none transition-all focus:border-primary focus:shadow-[0_0_0_7px_rgba(244,127,59,0.2)]"
      />
    </form>
  );
}
