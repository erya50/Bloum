export default function ImpactPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-20">
      <h1 className="font-serif text-4xl text-ink">Social Impact</h1>
      <p className="mt-4 text-lg text-ink/70">
        Ein wesentlicher Teil unserer Identität ist unser sozialer Beitrag: Ein Teil unserer
        Einnahmen fließt in Projekte, die Mädchen und Frauen unterstützen und ihnen Zugang zu
        Bildung, Sicherheit und Chancen ermöglichen.
      </p>

      <div className="mt-12 flex flex-col gap-6">
        <div className="rounded-2xl bg-sage-light p-6">
          <h2 className="font-serif text-xl text-ink">Bildung</h2>
          <p className="mt-2 text-sm text-ink/70">
            Zugang zu Lernressourcen und Bildungschancen für Mädchen und Frauen, die sonst keinen
            Zugang dazu hätten.
          </p>
        </div>
        <div className="rounded-2xl bg-sand-light p-6">
          <h2 className="font-serif text-xl text-ink">Sicherheit</h2>
          <p className="mt-2 text-sm text-ink/70">
            Unterstützung von Projekten, die Frauen und Mädchen ein sicheres Umfeld ermöglichen.
          </p>
        </div>
        <div className="rounded-2xl bg-blush-light p-6">
          <h2 className="font-serif text-xl text-ink">Chancen</h2>
          <p className="mt-2 text-sm text-ink/70">
            Förderung von Perspektiven und Möglichkeiten, die langfristig Türen öffnen.
          </p>
        </div>
      </div>

      <p className="mt-12 text-ink/70">
        Mit jedem Kurs, jedem Workshop-Ticket und jedem Store-Kauf trägst du automatisch zu diesen
        Projekten bei.
      </p>
    </div>
  );
}
