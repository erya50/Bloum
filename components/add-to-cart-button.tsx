"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart";

export function AddToCartButton({
  productId,
  slug,
  title,
  priceCents,
  image,
  stock,
}: {
  productId: string;
  slug: string;
  title: string;
  priceCents: number;
  image: string;
  stock: number;
}) {
  const addItem = useCart((state) => state.addItem);
  const [added, setAdded] = useState(false);

  if (stock <= 0) {
    return (
      <button
        type="button"
        disabled
        className="rounded-full bg-ink/20 px-6 py-3 text-sm font-medium text-ink/50"
      >
        Ausverkauft
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => {
        addItem({ productId, slug, title, priceCents, image });
        setAdded(true);
        setTimeout(() => setAdded(false), 1500);
      }}
      className="rounded-full bg-ink px-6 py-3 text-sm font-medium text-cream hover:bg-ink/90"
    >
      {added ? "Hinzugefügt ✓" : "In den Warenkorb"}
    </button>
  );
}
