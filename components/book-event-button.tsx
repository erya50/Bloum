"use client";

import { useActionState, useState } from "react";
import { createEventCheckoutAction, type CheckoutActionState } from "@/lib/actions/checkout";

const initialState: CheckoutActionState = {};

export function BookEventButton({
  eventId,
  price,
  seatsLeft,
}: {
  eventId: string;
  price: string;
  seatsLeft: number;
}) {
  const [state, action, pending] = useActionState(createEventCheckoutAction, initialState);
  const [seats, setSeats] = useState(1);

  if (seatsLeft <= 0) {
    return (
      <button
        type="button"
        disabled
        className="rounded-full bg-ink/20 px-6 py-3 text-sm font-medium text-ink/50"
      >
        Ausgebucht
      </button>
    );
  }

  return (
    <form action={action} className="flex flex-col gap-3">
      <input type="hidden" name="eventId" value={eventId} />
      <div className="flex items-center gap-3">
        <label htmlFor="seats" className="text-sm text-ink/70">
          Plätze
        </label>
        <input
          id="seats"
          name="seats"
          type="number"
          min={1}
          max={seatsLeft}
          value={seats}
          onChange={(e) => setSeats(Number(e.target.value))}
          className="w-20 rounded-lg border border-ink/15 bg-white px-3 py-1.5 text-ink"
        />
      </div>
      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-ink px-6 py-3 text-sm font-medium text-cream hover:bg-ink/90 disabled:opacity-60"
      >
        {pending ? "Weiterleitung…" : `Buchen & bezahlen · ${price}`}
      </button>
      {state.error && <p className="text-sm text-red-600">{state.error}</p>}
    </form>
  );
}
