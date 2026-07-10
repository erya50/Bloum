"use client";

import Link from "next/link";
import { useActionState } from "react";
import { loginAction, type AuthActionState } from "../actions";

const initialState: AuthActionState = {};

export default function LoginPage() {
  const [state, action, pending] = useActionState(loginAction, initialState);

  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-6 py-20">
      <h1 className="font-serif text-3xl text-ink">Willkommen zurück</h1>
      <p className="mt-2 text-sm text-ink/70">Melde dich an, um weiterzulernen.</p>

      <form action={action} className="mt-8 flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-sm font-medium text-ink">
            E-Mail
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="rounded-xl border border-ink/15 bg-white px-4 py-2.5 text-ink outline-none focus:border-blush"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="password" className="text-sm font-medium text-ink">
            Passwort
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="rounded-xl border border-ink/15 bg-white px-4 py-2.5 text-ink outline-none focus:border-blush"
          />
        </div>

        {state.error && <p className="text-sm text-red-600">{state.error}</p>}

        <button
          type="submit"
          disabled={pending}
          className="mt-2 rounded-full bg-ink px-6 py-3 text-sm font-medium text-cream transition-colors hover:bg-ink/90 disabled:opacity-60"
        >
          {pending ? "Wird eingeloggt…" : "Einloggen"}
        </button>
      </form>

      <p className="mt-6 text-sm text-ink/70">
        Noch kein Konto?{" "}
        <Link href="/register" className="font-medium text-ink underline underline-offset-2">
          Jetzt registrieren
        </Link>
      </p>
    </div>
  );
}
