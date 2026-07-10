import Image from "next/image";
import Link from "next/link";
import { db } from "@/lib/db";
import { formatDate, formatPrice } from "@/lib/format";

export default async function EventsPage() {
  const events = await db.event.findMany({
    where: { isPublished: true, startAt: { gte: new Date() } },
    orderBy: { startAt: "asc" },
    include: { bookings: { where: { status: { in: ["PENDING", "CONFIRMED"] } } } },
  });

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-16">
      <h1 className="font-serif text-4xl text-ink">Workshops & Events</h1>
      <p className="mt-3 max-w-2xl text-ink/70">
        Persönliche Begegnung, die verbindet – Offline-Workshops und Events für echten Austausch.
      </p>

      {events.length === 0 ? (
        <p className="mt-16 text-ink/60">Aktuell sind keine Events geplant.</p>
      ) : (
        <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => {
            const takenSeats = event.bookings.reduce((sum, b) => sum + b.seats, 0);
            const seatsLeft = event.capacity - takenSeats;

            return (
              <Link
                key={event.id}
                href={`/events/${event.slug}`}
                className="group flex flex-col overflow-hidden rounded-2xl border border-ink/10 bg-white transition-shadow hover:shadow-lg"
              >
                <div className="relative h-44 w-full bg-sage-light">
                  <Image src={event.coverImage} alt={event.title} fill className="object-cover" />
                </div>
                <div className="flex flex-1 flex-col gap-2 p-5">
                  <span className="text-xs font-medium uppercase tracking-wide text-ink/50">
                    {event.type === "ONLINE" ? "Online" : event.location}
                  </span>
                  <h2 className="font-serif text-lg text-ink group-hover:underline">
                    {event.title}
                  </h2>
                  <p className="text-sm text-ink/60">{formatDate(event.startAt)}</p>
                  <div className="mt-auto flex items-center justify-between pt-3">
                    <span className="font-medium text-ink">{formatPrice(event.priceCents)}</span>
                    <span className="text-xs text-ink/50">
                      {seatsLeft > 0 ? `${seatsLeft} Plätze frei` : "Ausgebucht"}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
