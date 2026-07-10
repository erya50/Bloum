import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-ink/10 bg-white/60">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <p className="font-serif text-lg text-ink">WOMAN. HUMAN. PART OF THE STORY.</p>
        <p className="mt-2 max-w-xl text-sm text-ink/70">
          Ein Teil jeder BLOUM-Bestellung fließt in Projekte, die Mädchen und Frauen Zugang zu
          Bildung, Sicherheit und Chancen ermöglichen.{" "}
          <Link href="/impact" className="underline underline-offset-2">
            Mehr über unseren Impact
          </Link>
          .
        </p>

        <div className="mt-8 flex flex-wrap gap-x-8 gap-y-2 text-sm text-ink/70">
          <Link href="/courses" className="hover:text-ink">
            Learning Journeys
          </Link>
          <Link href="/events" className="hover:text-ink">
            Events & Workshops
          </Link>
          <Link href="/store" className="hover:text-ink">
            Concept Store
          </Link>
          <Link href="/about" className="hover:text-ink">
            Über BLOUM
          </Link>
        </div>

        <p className="mt-8 text-xs text-ink/40">
          © {new Date().getFullYear()} BLOUM. Alle Rechte vorbehalten.
        </p>
      </div>
    </footer>
  );
}
