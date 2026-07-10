import Link from "next/link";

const LINKS: Record<string, (slug: string) => { href: string; label: string }> = {
  course: (slug) => ({ href: `/learn/${slug}`, label: "Zum Kurs" }),
  event: (slug) => ({ href: `/events/${slug}`, label: "Zum Event" }),
  store: () => ({ href: `/dashboard`, label: "Zu meinen Bestellungen" }),
};

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; slug?: string; orderId?: string }>;
}) {
  const { type, slug } = await searchParams;
  const link = type && LINKS[type] ? LINKS[type](slug ?? "") : null;

  return (
    <div className="mx-auto flex w-full max-w-lg flex-1 flex-col items-center justify-center px-6 py-24 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-sage-light text-2xl">
        ✓
      </div>
      <h1 className="mt-6 font-serif text-3xl text-ink">Zahlung erfolgreich</h1>
      <p className="mt-3 text-ink/70">
        Vielen Dank! Deine Bestellung wird gerade final bestätigt – das dauert meist nur wenige
        Sekunden.
      </p>
      <Link
        href={link?.href ?? "/dashboard"}
        className="mt-8 rounded-full bg-ink px-6 py-3 text-sm font-medium text-cream hover:bg-ink/90"
      >
        {link?.label ?? "Zum Dashboard"}
      </Link>
    </div>
  );
}
