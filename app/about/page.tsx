export default function AboutPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-20">
      <h1 className="font-serif text-4xl text-ink">Über BLOUM</h1>
      <p className="mt-4 text-lg text-ink/70">
        BLOUM ist ein hybrider E-Learning-Anbieter, der digitale Lernprogramme, persönliche
        Workshops/Events und einen kuratierten Concept Store verbindet, um Frauen ganzheitlich in
        ihrer beruflichen und persönlichen Entwicklung zu stärken.
      </p>
      <p className="mt-4 text-ink/70">
        Geführt von unserem Leitmotiv <strong className="text-ink">WOMAN. HUMAN. PART OF
        THE STORY.</strong> schaffen wir Lern- und Entwicklungsräume, die moderne Bildung, Future
        Skills und echte Menschlichkeit vereinen – online wie offline.
      </p>

      <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2">
        <div className="rounded-2xl bg-blush-light p-6">
          <h2 className="font-serif text-xl text-ink">Unsere Mission</h2>
          <p className="mt-2 text-sm text-ink/70">
            Frauen stärken und Zukunft zugänglich machen.
          </p>
        </div>
        <div className="rounded-2xl bg-lavender-light p-6">
          <h2 className="font-serif text-xl text-ink">Unsere Vision</h2>
          <p className="mt-2 text-sm text-ink/70">
            Räume erschaffen, die jede Frau befähigt, ihren eigenen Weg zu gestalten – und
            gleichzeitig andere Frauen mitzunehmen.
          </p>
        </div>
      </div>

      <div className="mt-12">
        <h2 className="font-serif text-2xl text-ink">BLOUM steht für</h2>
        <ul className="mt-4 flex flex-col gap-3 text-ink/70">
          <li>• Digitale Learning Journeys für persönliches & berufliches Wachstum</li>
          <li>• Offline-Workshops & Events für authentische Begegnung</li>
          <li>• Concept Store mit kuratierten Produkten rund um Statement, Mindset & Growth</li>
          <li>• Sozialer Impact, der über das eigene Lernen hinausgeht</li>
        </ul>
      </div>
    </div>
  );
}
