"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useTransition } from "react";
import { useCart } from "@/lib/cart";
import { useIsClient } from "@/lib/use-is-client";
import { formatPrice } from "@/lib/format";
import { createStoreCheckoutAction } from "@/lib/actions/checkout";

export default function CartPage() {
  const { items, setQuantity, removeItem } = useCart();
  const isClient = useIsClient();
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  if (!isClient) return null;

  const total = items.reduce((sum, item) => sum + item.priceCents * item.quantity, 0);

  function handleCheckout() {
    setError(null);
    startTransition(async () => {
      const result = await createStoreCheckoutAction(
        items.map((i) => ({ productId: i.productId, quantity: i.quantity }))
      );
      if (result?.error) {
        setError(result.error);
      }
    });
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-16">
      <h1 className="font-serif text-4xl text-ink">Warenkorb</h1>

      {items.length === 0 ? (
        <div className="mt-10">
          <p className="text-ink/60">Dein Warenkorb ist leer.</p>
          <Link href="/store" className="mt-4 inline-block text-sm font-medium underline">
            Zum Store
          </Link>
        </div>
      ) : (
        <>
          <div className="mt-10 flex flex-col gap-6">
            {items.map((item) => (
              <div
                key={item.productId}
                className="flex items-center gap-4 rounded-2xl border border-ink/10 bg-white p-4"
              >
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-lavender-light">
                  {item.image && (
                    <Image src={item.image} alt={item.title} fill className="object-cover" />
                  )}
                </div>
                <div className="flex-1">
                  <Link href={`/store/${item.slug}`} className="font-medium text-ink hover:underline">
                    {item.title}
                  </Link>
                  <p className="text-sm text-ink/60">{formatPrice(item.priceCents)}</p>
                </div>
                <input
                  type="number"
                  min={1}
                  value={item.quantity}
                  onChange={(e) => setQuantity(item.productId, Number(e.target.value))}
                  className="w-16 rounded-lg border border-ink/15 px-2 py-1.5 text-center text-ink"
                />
                <button
                  type="button"
                  onClick={() => removeItem(item.productId)}
                  className="text-sm text-ink/50 hover:text-ink"
                >
                  Entfernen
                </button>
              </div>
            ))}
          </div>

          <div className="mt-10 flex items-center justify-between border-t border-ink/10 pt-6">
            <span className="text-lg font-medium text-ink">Gesamt</span>
            <span className="text-lg font-medium text-ink">{formatPrice(total)}</span>
          </div>

          {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

          <button
            type="button"
            onClick={handleCheckout}
            disabled={pending}
            className="mt-6 w-full rounded-full bg-ink px-6 py-3 text-sm font-medium text-cream hover:bg-ink/90 disabled:opacity-60"
          >
            {pending ? "Weiterleitung…" : "Zur Kasse"}
          </button>
        </>
      )}
    </div>
  );
}
