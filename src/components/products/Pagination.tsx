"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

export function Pagination({ currentPage, totalPages }: PaginationProps) {
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  function pageUrl(page: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    return `/products?${params.toString()}`;
  }

  return (
    <div className="flex items-center justify-center gap-2 pt-8">
      {currentPage > 1 && (
        <Button variant="outline" size="sm" render={<Link href={pageUrl(currentPage - 1)} />}>
          Precedent
        </Button>
      )}
      <span className="px-2 text-sm text-muted-foreground">
        Page {currentPage} sur {totalPages}
      </span>
      {currentPage < totalPages && (
        <Button variant="outline" size="sm" render={<Link href={pageUrl(currentPage + 1)} />}>
          Suivant
        </Button>
      )}
    </div>
  );
}
