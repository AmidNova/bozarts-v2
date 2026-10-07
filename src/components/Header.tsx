import Link from "next/link";
import Image from "next/image";
import { auth } from "@/lib/auth";
import { cartRepository } from "@/lib/repositories/cart";
import { messageRepository } from "@/lib/repositories/message";
import { SearchBar } from "@/components/SearchBar";
import { MobileNav } from "@/components/MobileNav";

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
    <header className="sticky top-0 z-50 bg-background shadow-sm">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* ── Logo ── */}
        <Link href="/" className="shrink-0">
          <Image
            src="/icons/LOGO.png"
            alt="Bozarts"
            width={70}
            height={70}
            className="h-[60px] w-auto"
            priority
          />
        </Link>

        {/* ── Barre de recherche (centre, desktop) ── */}
        <div className="hidden flex-1 justify-center px-8 md:flex">
          <SearchBar />
        </div>

        {/* ── Icones de navigation (droite) ── */}
        <div className="flex items-center gap-5">
          {user ? (
            <>
              <NavIcon href="/orders" src="/icons/mes-transactions.png" alt="Transactions" />
              <NavIcon href="/cart" src="/icons/panier-icon.png" alt="Panier" badge={cartCount} />
              <NavIcon href="/messages" src="/icons/notifications-icon.png" alt="Messages" badge={unreadCount} />
              <NavIcon href="/profile" src="/icons/profil-icon.png" alt="Profil" />
            </>
          ) : (
            <>
              <NavIcon href="/cart" src="/icons/panier-icon.png" alt="Panier" />
              <NavIcon href="/login" src="/icons/profil-icon.png" alt="Connexion" />
            </>
          )}
          <MobileNav user={user ?? null} />
        </div>
      </div>

      {/* ── Barre de recherche (mobile) ── */}
      <div className="border-t px-4 py-2 md:hidden">
        <SearchBar />
      </div>
    </header>
  );
}

/* ── Icone de navigation avec badge optionnel ── */
function NavIcon({
  href,
  src,
  alt,
  badge,
}: {
  href: string;
  src: string;
  alt: string;
  badge?: number;
}) {
  return (
    <Link href={href} className="relative hidden md:block">
      <Image
        src={src}
        alt={alt}
        width={30}
        height={30}
        className="h-[30px] w-[30px] transition-all hover:brightness-85"
      />
      {badge !== undefined && badge > 0 && (
        <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
          {badge}
        </span>
      )}
    </Link>
  );
}
