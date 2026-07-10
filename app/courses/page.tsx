import Image from "next/image";
import Link from "next/link";
import { db } from "@/lib/db";
import { formatPrice } from "@/lib/format";

export default async function CoursesPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; level?: string }>;
}) {
  const { category, level } = await searchParams;

  const courses = await db.course.findMany({
    where: {
      isPublished: true,
      ...(category ? { category } : {}),
      ...(level ? { level } : {}),
    },
    orderBy: { createdAt: "desc" },
  });

  const categories = await db.course.findMany({
    where: { isPublished: true },
    distinct: ["category"],
    select: { category: true },
  });
  const levels = await db.course.findMany({
    where: { isPublished: true },
    distinct: ["level"],
    select: { level: true },
  });

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-16">
      <h1 className="font-serif text-4xl text-ink">Learning Journeys</h1>
      <p className="mt-3 max-w-2xl text-ink/70">
        Digitale Lernprogramme für dein berufliches & persönliches Wachstum – in deinem Tempo,
        von überall.
      </p>

      <div className="mt-8 flex flex-wrap gap-3 text-sm">
        <Link
          href="/courses"
          className={`rounded-full border px-4 py-1.5 ${
            !category && !level ? "border-ink bg-ink text-cream" : "border-ink/20 text-ink/70"
          }`}
        >
          Alle
        </Link>
        {categories.map((c) => (
          <Link
            key={c.category}
            href={`/courses?category=${encodeURIComponent(c.category)}`}
            className={`rounded-full border px-4 py-1.5 ${
              category === c.category
                ? "border-ink bg-ink text-cream"
                : "border-ink/20 text-ink/70"
            }`}
          >
            {c.category}
          </Link>
        ))}
        {levels.map((l) => (
          <Link
            key={l.level}
            href={`/courses?level=${encodeURIComponent(l.level)}`}
            className={`rounded-full border px-4 py-1.5 ${
              level === l.level ? "border-ink bg-ink text-cream" : "border-ink/20 text-ink/70"
            }`}
          >
            {l.level}
          </Link>
        ))}
      </div>

      {courses.length === 0 ? (
        <p className="mt-16 text-ink/60">Keine Kurse gefunden.</p>
      ) : (
        <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <Link
              key={course.id}
              href={`/courses/${course.slug}`}
              className="group flex flex-col overflow-hidden rounded-2xl border border-ink/10 bg-white transition-shadow hover:shadow-lg"
            >
              <div className="relative h-44 w-full bg-blush-light">
                <Image
                  src={course.coverImage}
                  alt={course.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex flex-1 flex-col gap-2 p-5">
                <span className="text-xs font-medium uppercase tracking-wide text-ink/50">
                  {course.category} · {course.level}
                </span>
                <h2 className="font-serif text-lg text-ink group-hover:underline">
                  {course.title}
                </h2>
                <p className="line-clamp-2 text-sm text-ink/60">{course.description}</p>
                <span className="mt-auto pt-3 font-medium text-ink">
                  {formatPrice(course.priceCents)}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
