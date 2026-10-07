import Link from "next/link";
import Image from "next/image";

const SOCIAL_LINKS = [
  { name: "Facebook", icon: "/icons/facebook.png", href: "#" },
  { name: "Twitter", icon: "/icons/twitter.png", href: "#" },
  { name: "Instagram", icon: "/icons/instagram.png", href: "#" },
  { name: "LinkedIn", icon: "/icons/linkedin.png", href: "#" },
] as const;

export function Footer() {
  return (
    <footer className="mt-auto bg-secondary text-white">
      <div className="mx-auto flex max-w-7xl flex-wrap items-start justify-between gap-8 px-6 py-10">
        {/* ── Colonne gauche : copyright + liens legaux ── */}
        <div className="min-w-[220px] flex-1">
          <p>&copy; {new Date().getFullYear()} Bozarts. Tous droits reserves.</p>
          <p className="mt-2">
            <Link href="/cgu" className="transition-colors hover:text-primary">
              CGU &amp; Mentions legales
            </Link>
          </p>
          <p className="mt-2">
            Un probleme non resolu par la FAQ ?{" "}
            <Link href="/messages?destinataire=admin" className="transition-colors hover:text-primary">
              Contactez-nous
            </Link>
          </p>
        </div>

        {/* ── Colonne centre : liens utiles ── */}
        <div className="min-w-[220px] flex-1">
          <ul className="space-y-2">
            <li>
              <Link href="/faq" className="transition-colors hover:text-primary">
                Notre FAQ
              </Link>
            </li>
            <li>
              <Link href="/products" className="transition-colors hover:text-primary">
                Produits
              </Link>
            </li>
            <li>
              <Link href="/events" className="transition-colors hover:text-primary">
                Evenements
              </Link>
            </li>
          </ul>
        </div>

        {/* ── Colonne droite : reseaux sociaux ── */}
        <div className="min-w-[220px] flex-1">
          <p>Suivez-nous</p>
          <div className="mt-3 flex gap-3">
            {SOCIAL_LINKS.map((social) => (
              <a
                key={social.name}
                href={social.href}
                aria-label={social.name}
                className="transition-transform hover:scale-110"
              >
                <Image
                  src={social.icon}
                  alt={social.name}
                  width={28}
                  height={28}
                  className="h-7 w-7 brightness-0 invert"
                />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
