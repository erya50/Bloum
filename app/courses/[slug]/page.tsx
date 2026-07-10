import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { formatPrice } from "@/lib/format";
import { getCurrentUser } from "@/lib/auth";
import { BuyCourseButton } from "@/components/buy-course-button";

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const course = await db.course.findUnique({
    where: { slug },
    include: {
      modules: {
        orderBy: { order: "asc" },
        include: { lessons: { orderBy: { order: "asc" } } },
      },
    },
  });

  if (!course || !course.isPublished) {
    notFound();
  }

  const user = await getCurrentUser();
  const enrollment = user
    ? await db.enrollment.findUnique({
        where: { userId_courseId: { userId: user.id, courseId: course.id } },
      })
    : null;

  const totalLessons = course.modules.reduce((sum, m) => sum + m.lessons.length, 0);

  return (
    <div className="mx-auto w-full max-w-4xl px-6 py-16">
      <span className="text-xs font-medium uppercase tracking-wide text-ink/50">
        {course.category} · {course.level}
      </span>
      <h1 className="mt-2 font-serif text-4xl text-ink">{course.title}</h1>
      <p className="mt-4 text-lg text-ink/70">{course.description}</p>

      <div className="relative mt-8 h-64 w-full overflow-hidden rounded-2xl bg-blush-light">
        <Image src={course.coverImage} alt={course.title} fill className="object-cover" />
      </div>

      <div className="mt-8 flex items-center justify-between rounded-2xl border border-ink/10 bg-white p-6">
        <div>
          <p className="text-sm text-ink/60">
            {course.modules.length} Module · {totalLessons} Lektionen
          </p>
          <p className="mt-1 text-2xl font-medium text-ink">{formatPrice(course.priceCents)}</p>
        </div>

        {enrollment ? (
          <Link
            href={`/learn/${course.slug}`}
            className="rounded-full bg-ink px-6 py-3 text-sm font-medium text-cream hover:bg-ink/90"
          >
            Weiterlernen
          </Link>
        ) : (
          <BuyCourseButton courseId={course.id} price={formatPrice(course.priceCents)} />
        )}
      </div>

      <div className="mt-12">
        <h2 className="font-serif text-2xl text-ink">Curriculum</h2>
        <div className="mt-6 flex flex-col gap-4">
          {course.modules.map((module, i) => (
            <div key={module.id} className="rounded-xl border border-ink/10 bg-white p-5">
              <h3 className="font-medium text-ink">
                Modul {i + 1}: {module.title}
              </h3>
              <ul className="mt-3 flex flex-col gap-2">
                {module.lessons.map((lesson) => (
                  <li key={lesson.id} className="flex justify-between text-sm text-ink/70">
                    <span>{lesson.title}</span>
                    <span>{lesson.durationMin} Min.</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
