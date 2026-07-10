import Image from "next/image";
import Link from "next/link";
import { db } from "@/lib/db";
import { formatPrice } from "@/lib/format";

export default async function StorePage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;

  const products = await db.product.findMany({
    where: { isPublished: true, ...(category ? { category } : {}) },
    orderBy: { isFeatured: "desc" },
  });

  const categories = await db.product.findMany({
    where: { isPublished: true },
    distinct: ["category"],
    select: { category: true },
  });

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-16">
      <h1 className="font-serif text-4xl text-ink">Concept Store</h1>
      <p className="mt-3 max-w-2xl text-ink/70">
        Kuratierte Produkte rund um Statement, Mindset & Growth – bewusst ausgewählt.
      </p>

      <div className="mt-8 flex flex-wrap gap-3 text-sm">
        <Link
          href="/store"
          className={`rounded-full border px-4 py-1.5 ${
            !category ? "border-ink bg-ink text-cream" : "border-ink/20 text-ink/70"
          }`}
        >
          Alle
        </Link>
        {categories.map((c) => (
          <Link
            key={c.category}
            href={`/store?category=${encodeURIComponent(c.category)}`}
            className={`rounded-full border px-4 py-1.5 ${
              category === c.category
                ? "border-ink bg-ink text-cream"
                : "border-ink/20 text-ink/70"
            }`}
          >
            {c.category}
          </Link>
        ))}
      </div>

      {products.length === 0 ? (
        <p className="mt-16 text-ink/60">Keine Produkte gefunden.</p>
      ) : (
        <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/store/${product.slug}`}
              className="group flex flex-col overflow-hidden rounded-2xl border border-ink/10 bg-white transition-shadow hover:shadow-lg"
            >
              <div className="relative h-44 w-full bg-lavender-light">
                {product.images[0] && (
                  <Image
                    src={product.images[0]}
                    alt={product.title}
                    fill
                    className="object-cover"
                  />
                )}
              </div>
              <div className="flex flex-1 flex-col gap-2 p-5">
                <span className="text-xs font-medium uppercase tracking-wide text-ink/50">
                  {product.category}
                </span>
                <h2 className="font-serif text-lg text-ink group-hover:underline">
                  {product.title}
                </h2>
                <span className="mt-auto pt-3 font-medium text-ink">
                  {formatPrice(product.priceCents)}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
