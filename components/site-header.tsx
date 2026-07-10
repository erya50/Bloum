"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/lib/cart";
import { useIsClient } from "@/lib/use-is-client";
import { logoutAction } from "@/app/(auth)/actions";

const NAV_LINKS = [
  { href: "/courses", label: "Kurse" },
  { href: "/events", label: "Events" },
  { href: "/store", label: "Store" },
  { href: "/impact", label: "Impact" },
  { href: "/about", label: "Über uns" },
];

export function SiteHeader({ userName }: { userName: string | null }) {
  const pathname = usePathname();
  const items = useCart((state) => state.items);
  const isClient = useIsClient();

  const cartCount = isClient ? items.reduce((sum, item) => sum + item.quantity, 0) : 0;

  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-cream/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.png" alt="BLOUM" width={40} height={40} className="h-10 w-10 object-contain" />
          <span className="font-serif text-xl tracking-wide text-ink">BLOUM</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm transition-colors hover:text-ink ${
                pathname?.startsWith(link.href) ? "font-medium text-ink" : "text-ink/70"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <Link href="/cart" className="relative text-sm text-ink/80 hover:text-ink">
            Warenkorb
            {cartCount > 0 && (
              <span className="absolute -right-3 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-blush text-[10px] font-medium text-ink">
                {cartCount}
              </span>
            )}
          </Link>

          {userName ? (
            <div className="flex items-center gap-3">
              <Link href="/dashboard" className="text-sm font-medium text-ink hover:underline">
                {userName}
              </Link>
              <form action={logoutAction}>
                <button type="submit" className="text-sm text-ink/60 hover:text-ink">
                  Logout
                </button>
              </form>
            </div>
          ) : (
            <Link
              href="/login"
              className="rounded-full bg-ink px-4 py-2 text-sm font-medium text-cream hover:bg-ink/90"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
