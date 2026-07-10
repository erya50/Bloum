import Image from "next/image";
import Link from "next/link";

const PILLARS = [
  {
    title: "Learning Journeys",
    description:
      "Digitale Lernprogramme für berufliches & persönliches Wachstum – in deinem Tempo, von überall.",
    href: "/courses",
    cta: "Kurse entdecken",
    color: "bg-blush-light",
  },
  {
    title: "Workshops & Events",
    description:
      "Persönliche Begegnung, die verbindet – Offline-Workshops und Events für echten Austausch.",
    href: "/events",
    cta: "Events ansehen",
    color: "bg-sage-light",
  },
  {
    title: "Concept Store",
    description:
      "Kuratierte Produkte rund um Statement, Mindset & Growth – bewusst ausgewählt.",
    href: "/store",
    cta: "Store besuchen",
    color: "bg-lavender-light",
  },
  {
    title: "Social Impact",
    description:
      "Ein Teil jeder Bestellung fließt in Projekte, die Mädchen und Frauen stärken.",
    href: "/impact",
    cta: "Impact erfahren",
    color: "bg-sand-light",
  },
];

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <section className="mx-auto flex w-full max-w-6xl flex-col items-center gap-8 px-6 py-24 text-center">
        <Image src="/logo.png" alt="BLOUM" width={96} height={96} className="h-24 w-24 object-contain" priority />
        <h1 className="max-w-3xl font-serif text-4xl leading-tight text-ink sm:text-5xl">
          WOMAN. HUMAN. PART OF THE STORY.
        </h1>
        <p className="max-w-xl text-lg text-ink/70">
          BLOUM verbindet digitale Learning Journeys, persönliche Workshops und einen kuratierten
          Concept Store, um Frauen ganzheitlich in ihrer Entwicklung zu stärken.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/courses"
            className="rounded-full bg-ink px-6 py-3 text-sm font-medium text-cream hover:bg-ink/90"
          >
            Learning Journeys entdecken
          </Link>
          <Link
            href="/about"
            className="rounded-full border border-ink/20 px-6 py-3 text-sm font-medium text-ink hover:bg-white"
          >
            Mehr über BLOUM
          </Link>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 pb-24">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PILLARS.map((pillar) => (
            <Link
              key={pillar.href}
              href={pillar.href}
              className={`flex flex-col justify-between rounded-2xl ${pillar.color} p-6 transition-transform hover:-translate-y-1`}
            >
              <div>
                <h2 className="font-serif text-xl text-ink">{pillar.title}</h2>
                <p className="mt-2 text-sm text-ink/70">{pillar.description}</p>
              </div>
              <span className="mt-6 text-sm font-medium text-ink underline underline-offset-2">
                {pillar.cta}
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
