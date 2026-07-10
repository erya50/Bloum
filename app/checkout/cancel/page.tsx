import Link from "next/link";

export default function CheckoutCancelPage() {
  return (
    <div className="mx-auto flex w-full max-w-lg flex-1 flex-col items-center justify-center px-6 py-24 text-center">
      <h1 className="font-serif text-3xl text-ink">Zahlung abgebrochen</h1>
      <p className="mt-3 text-ink/70">
        Es wurde nichts berechnet. Du kannst es jederzeit erneut versuchen.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-full bg-ink px-6 py-3 text-sm font-medium text-cream hover:bg-ink/90"
      >
        Zur Startseite
      </Link>
    </div>
  );
}
