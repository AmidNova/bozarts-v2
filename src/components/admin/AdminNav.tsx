"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/admin", label: "Tableau de bord" },
  { href: "/admin/users", label: "Utilisateurs" },
  { href: "/admin/products", label: "Produits" },
  { href: "/admin/orders", label: "Commandes" },
  { href: "/admin/events", label: "Evenements" },
  { href: "/admin/reviews", label: "Avis" },
  { href: "/admin/cgu", label: "CGU" },
  { href: "/admin/faq", label: "FAQ" },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1">
      {links.map((link) => {
        const active =
          link.href === "/admin"
            ? pathname === "/admin"
            : pathname.startsWith(link.href);

        return (
          <Link
            key={link.href}
            href={link.href}
            className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              active
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
