import Image from "next/image";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { formatPrice } from "@/lib/format";
import { AddToCartButton } from "@/components/add-to-cart-button";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const product = await db.product.findUnique({ where: { slug } });
  if (!product || !product.isPublished) {
    notFound();
  }

  return (
    <div className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-10 px-6 py-16 lg:grid-cols-2">
      <div className="relative h-96 w-full overflow-hidden rounded-2xl bg-lavender-light">
        {product.images[0] && (
          <Image src={product.images[0]} alt={product.title} fill className="object-cover" />
        )}
      </div>

      <div>
        <span className="text-xs font-medium uppercase tracking-wide text-ink/50">
          {product.category}
        </span>
        <h1 className="mt-2 font-serif text-4xl text-ink">{product.title}</h1>
        <p className="mt-4 text-ink/70">{product.description}</p>
        <p className="mt-6 text-2xl font-medium text-ink">{formatPrice(product.priceCents)}</p>

        <div className="mt-8">
          <AddToCartButton
            productId={product.id}
            slug={product.slug}
            title={product.title}
            priceCents={product.priceCents}
            image={product.images[0] ?? ""}
            stock={product.stock}
          />
        </div>
      </div>
    </div>
  );
}
