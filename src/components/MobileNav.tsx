"use client";

import { useState } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface MobileNavProps {
  user: {
    id?: string;
    name?: string | null;
    role?: string;
  } | null;
}

export function MobileNav({ user }: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={<Button variant="ghost" size="sm" className="md:hidden" />}
      >
        Menu
      </SheetTrigger>
      <SheetContent side="right" className="w-64">
        <SheetHeader>
          <SheetTitle>Bozarts</SheetTitle>
        </SheetHeader>
        <nav className="mt-6 flex flex-col gap-3">
          <Link
            href="/products"
            onClick={close}
            className="text-sm hover:text-foreground"
          >
            Produits
          </Link>
          <Link
            href="/artisans"
            onClick={close}
            className="text-sm hover:text-foreground"
          >
            Artisans
          </Link>
          <Link
            href="/events"
            onClick={close}
            className="text-sm hover:text-foreground"
          >
            Evenements
          </Link>
          {user ? (
            <>
              <Link href="/cart" onClick={close} className="text-sm hover:text-foreground">
                Panier
              </Link>
              <Link href="/profile" onClick={close} className="text-sm hover:text-foreground">
                Mon profil
              </Link>
              <Link href="/messages" onClick={close} className="text-sm hover:text-foreground">
                Messages
              </Link>
              {user.role === "ARTISAN" && (
                <>
                  <Link href="/my-products" onClick={close} className="text-sm hover:text-foreground">
                    Mes produits
                  </Link>
                  <Link href="/my-orders" onClick={close} className="text-sm hover:text-foreground">
                    Commandes recues
                  </Link>
                  <Link href="/my-events" onClick={close} className="text-sm hover:text-foreground">
                    Mes evenements
                  </Link>
                </>
              )}
              {user.role === "CLIENT" && (
                <Link href="/orders" onClick={close} className="text-sm hover:text-foreground">
                  Mes commandes
                </Link>
              )}
              <Button
                variant="ghost"
                size="sm"
                className="justify-start px-0"
                onClick={() => {
                  close();
                  signOut({ callbackUrl: "/" });
                }}
              >
                Deconnexion
              </Button>
            </>
          ) : (
            <>
              <Link href="/login" onClick={close} className="text-sm">
                Connexion
              </Link>
              <Link href="/register" onClick={close} className="text-sm">
                Inscription
              </Link>
            </>
          )}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
