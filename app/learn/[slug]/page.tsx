import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { getSignedVideoUrl } from "@/lib/storage";
import { markLessonCompleteAction } from "@/lib/actions/progress";

export default async function LearnPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ lesson?: string }>;
}) {
  const { slug } = await params;
  const { lesson: lessonIdParam } = await searchParams;

  const user = await getCurrentUser();
  if (!user) {
    redirect(`/login?redirect=/learn/${slug}`);
  }

  const course = await db.course.findUnique({
    where: { slug },
    include: {
      modules: {
        orderBy: { order: "asc" },
        include: { lessons: { orderBy: { order: "asc" } } },
      },
    },
  });

  if (!course) notFound();

  const enrollment = await db.enrollment.findUnique({
    where: { userId_courseId: { userId: user.id, courseId: course.id } },
  });
  if (!enrollment) {
    redirect(`/courses/${slug}`);
  }

  const allLessons = course.modules.flatMap((m) => m.lessons);
  const currentLesson =
    allLessons.find((l) => l.id === lessonIdParam) ?? allLessons[0] ?? null;

  if (!currentLesson) {
    return (
      <div className="mx-auto w-full max-w-3xl px-6 py-16">
        <p className="text-ink/70">Dieser Kurs hat noch keine Lektionen.</p>
      </div>
    );
  }

  const progressEntries = await db.lessonProgress.findMany({
    where: { userId: user.id, lessonId: { in: allLessons.map((l) => l.id) } },
  });
  const completedLessonIds = new Set(progressEntries.map((p) => p.lessonId));

  const videoUrl = currentLesson.videoKey
    ? await getSignedVideoUrl(currentLesson.videoKey)
    : null;

  const progressPercent = Math.round(
    (completedLessonIds.size / allLessons.length) * 100
  );

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-6 py-10 lg:flex-row">
      <aside className="w-full shrink-0 lg:w-72">
        <h1 className="font-serif text-xl text-ink">{course.title}</h1>
        <div className="mt-3">
          <div className="h-1.5 w-full rounded-full bg-ink/10">
            <div
              className="h-1.5 rounded-full bg-sage"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <p className="mt-1 text-xs text-ink/60">{progressPercent}% abgeschlossen</p>
        </div>

        <div className="mt-6 flex flex-col gap-4">
          {course.modules.map((module, i) => (
            <div key={module.id}>
              <p className="text-xs font-medium uppercase tracking-wide text-ink/50">
                Modul {i + 1}: {module.title}
              </p>
              <ul className="mt-2 flex flex-col gap-1">
                {module.lessons.map((lesson) => (
                  <li key={lesson.id}>
                    <Link
                      href={`/learn/${slug}?lesson=${lesson.id}`}
                      className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm ${
                        lesson.id === currentLesson.id
                          ? "bg-ink text-cream"
                          : "text-ink/70 hover:bg-ink/5"
                      }`}
                    >
                      <span>{lesson.title}</span>
                      {completedLessonIds.has(lesson.id) && <span>✓</span>}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </aside>

      <div className="flex-1">
        <h2 className="font-serif text-2xl text-ink">{currentLesson.title}</h2>

        <div className="mt-4 aspect-video w-full overflow-hidden rounded-2xl bg-ink/90">
          {videoUrl ? (
            <video key={currentLesson.id} src={videoUrl} controls className="h-full w-full" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm text-cream/60">
              Für diese Lektion ist noch kein Video hinterlegt.
            </div>
          )}
        </div>

        <p className="mt-6 whitespace-pre-line text-ink/70">{currentLesson.content}</p>

        <form action={markLessonCompleteAction} className="mt-8">
          <input type="hidden" name="lessonId" value={currentLesson.id} />
          <input type="hidden" name="courseSlug" value={slug} />
          <button
            type="submit"
            disabled={completedLessonIds.has(currentLesson.id)}
            className="rounded-full bg-sage px-6 py-3 text-sm font-medium text-ink disabled:opacity-50"
          >
            {completedLessonIds.has(currentLesson.id)
              ? "Lektion abgeschlossen"
              : "Als erledigt markieren"}
          </button>
        </form>
      </div>
    </div>
  );
}
