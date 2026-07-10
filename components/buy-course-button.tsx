"use client";

import { useActionState } from "react";
import { createCourseCheckoutAction, type CheckoutActionState } from "@/lib/actions/checkout";

const initialState: CheckoutActionState = {};

export function BuyCourseButton({ courseId, price }: { courseId: string; price: string }) {
  const [state, action, pending] = useActionState(createCourseCheckoutAction, initialState);

  return (
    <form action={action} className="flex flex-col gap-2">
      <input type="hidden" name="courseId" value={courseId} />
      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-ink px-6 py-3 text-sm font-medium text-cream hover:bg-ink/90 disabled:opacity-60"
      >
        {pending ? "Weiterleitung…" : `Jetzt kaufen · ${price}`}
      </button>
      {state.error && <p className="text-sm text-red-600">{state.error}</p>}
    </form>
  );
}
