import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { formatDate, formatPrice } from "@/lib/format";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?redirect=/dashboard");

  const [enrollments, bookings, orders] = await Promise.all([
    db.enrollment.findMany({
      where: { userId: user.id },
      include: {
        course: { include: { modules: { include: { lessons: true } } } },
      },
      orderBy: { purchasedAt: "desc" },
    }),
    db.eventBooking.findMany({
      where: { userId: user.id, status: "CONFIRMED" },
      include: { event: true },
      orderBy: { createdAt: "desc" },
    }),
    db.order.findMany({
      where: { userId: user.id, status: "PAID" },
      include: { items: { include: { product: true } } },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const progressByCourse = await Promise.all(
    enrollments.map(async (e) => {
      const lessonIds = e.course.modules.flatMap((m) => m.lessons.map((l) => l.id));
      const completed = await db.lessonProgress.count({
        where: { userId: user.id, lessonId: { in: lessonIds } },
      });
      return {
        enrollmentId: e.id,
        percent: lessonIds.length > 0 ? Math.round((completed / lessonIds.length) * 100) : 0,
      };
    })
  );

  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-16">
      <h1 className="font-serif text-4xl text-ink">Hallo, {user.name}</h1>
      <p className="mt-2 text-ink/70">Willkommen in deinem BLOUM-Bereich.</p>

      <section className="mt-12">
        <h2 className="font-serif text-2xl text-ink">Meine Kurse</h2>
        {enrollments.length === 0 ? (
          <p className="mt-4 text-sm text-ink/60">
            Du bist noch in keinem Kurs eingeschrieben.{" "}
            <Link href="/courses" className="underline">
              Kurse entdecken
            </Link>
          </p>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {enrollments.map((e) => {
              const percent =
                progressByCourse.find((p) => p.enrollmentId === e.id)?.percent ?? 0;
              return (
                <Link
                  key={e.id}
                  href={`/learn/${e.course.slug}`}
                  className="flex gap-4 rounded-2xl border border-ink/10 bg-white p-4 hover:shadow-md"
                >
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-blush-light">
                    <Image src={e.course.coverImage} alt={e.course.title} fill className="object-cover" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-ink">{e.course.title}</p>
                    <div className="mt-2 h-1.5 w-full rounded-full bg-ink/10">
                      <div className="h-1.5 rounded-full bg-sage" style={{ width: `${percent}%` }} />
                    </div>
                    <p className="mt-1 text-xs text-ink/50">{percent}% abgeschlossen</p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      <section className="mt-12">
        <h2 className="font-serif text-2xl text-ink">Meine Buchungen</h2>
        {bookings.length === 0 ? (
          <p className="mt-4 text-sm text-ink/60">
            Du hast noch kein Event gebucht.{" "}
            <Link href="/events" className="underline">
              Events ansehen
            </Link>
          </p>
        ) : (
          <div className="mt-6 flex flex-col gap-3">
            {bookings.map((b) => (
              <div
                key={b.id}
                className="flex items-center justify-between rounded-2xl border border-ink/10 bg-white p-4"
              >
                <div>
                  <Link href={`/events/${b.event.slug}`} className="font-medium text-ink hover:underline">
                    {b.event.title}
                  </Link>
                  <p className="text-sm text-ink/60">{formatDate(b.event.startAt)}</p>
                </div>
                <span className="text-sm text-ink/60">{b.seats} Platz/Plätze</span>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="mt-12">
        <h2 className="font-serif text-2xl text-ink">Meine Bestellungen</h2>
        {orders.length === 0 ? (
          <p className="mt-4 text-sm text-ink/60">
            Du hast noch nichts im Store bestellt.{" "}
            <Link href="/store" className="underline">
              Store besuchen
            </Link>
          </p>
        ) : (
          <div className="mt-6 flex flex-col gap-3">
            {orders.map((order) => (
              <div key={order.id} className="rounded-2xl border border-ink/10 bg-white p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-ink/60">{formatDate(order.createdAt)}</p>
                  <p className="font-medium text-ink">{formatPrice(order.totalCents)}</p>
                </div>
                <ul className="mt-2 flex flex-col gap-1 text-sm text-ink/70">
                  {order.items.map((item) => (
                    <li key={item.id}>
                      {item.quantity}× {item.product.title}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
