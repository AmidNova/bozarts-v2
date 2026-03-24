import Link from "next/link";
import { auth } from "@/lib/auth";
import { cartRepository } from "@/lib/repositories/cart";
import { messageRepository } from "@/lib/repositories/message";
import { Button } from "@/components/ui/button";
import { MobileNav } from "@/components/MobileNav";
import { UserNav } from "@/components/UserNav";

export async function Header() {
  const session = await auth();
  const user = session?.user;

  let cartCount = 0;
  let unreadCount = 0;
  if (user?.id) {
    [cartCount, unreadCount] = await Promise.all([
      cartRepository.countItems(user.id),
      messageRepository.countUnread(user.id),
    ]);
  }

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-xl font-bold tracking-tight">
            Bozarts
          </Link>
          <nav className="hidden items-center gap-4 text-sm md:flex">
            <Link
              href="/products"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              Produits
            </Link>
            <Link
              href="/artisans"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              Artisans
            </Link>
            <Link
              href="/events"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              Evenements
            </Link>
            {user?.role === "ARTISAN" && (
              <>
                <Link
                  href="/my-products"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Mes produits
                </Link>
                <Link
                  href="/my-orders"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Commandes
                </Link>
                <Link
                  href="/my-reviews"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Avis
                </Link>
                <Link
                  href="/my-events"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Mes evenements
                </Link>
              </>
            )}
            {user?.role === "ADMIN" && (
              <Link
                href="/admin/reviews"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                Moderation
              </Link>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link href="/messages" className="relative">
                <Button variant="ghost" size="sm">
                  Messages
                  {unreadCount > 0 && (
                    <span className="ml-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                      {unreadCount}
                    </span>
                  )}
                </Button>
              </Link>
              <Link href="/cart" className="relative">
                <Button variant="ghost" size="sm">
                  Panier
                  {cartCount > 0 && (
                    <span className="ml-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                      {cartCount}
                    </span>
                  )}
                </Button>
              </Link>
              <UserNav user={user} />
            </>
          ) : (
            <div className="hidden gap-2 md:flex">
              <Button variant="ghost" size="sm" render={<Link href="/login" />}>
                Connexion
              </Button>
              <Button size="sm" render={<Link href="/register" />}>
                Inscription
              </Button>
            </div>
          )}
          <MobileNav user={user ?? null} />
        </div>
      </div>
    </header>
  );
}
