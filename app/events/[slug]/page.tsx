import Image from "next/image";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { formatDate, formatPrice } from "@/lib/format";
import { BookEventButton } from "@/components/book-event-button";

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const event = await db.event.findUnique({
    where: { slug },
    include: { bookings: { where: { status: { in: ["PENDING", "CONFIRMED"] } } } },
  });

  if (!event || !event.isPublished) {
    notFound();
  }

  const takenSeats = event.bookings.reduce((sum, b) => sum + b.seats, 0);
  const seatsLeft = event.capacity - takenSeats;

  return (
    <div className="mx-auto w-full max-w-4xl px-6 py-16">
      <span className="text-xs font-medium uppercase tracking-wide text-ink/50">
        {event.type === "ONLINE" ? "Online" : event.location}
      </span>
      <h1 className="mt-2 font-serif text-4xl text-ink">{event.title}</h1>
      <p className="mt-4 text-lg text-ink/70">{event.description}</p>

      <div className="relative mt-8 h-64 w-full overflow-hidden rounded-2xl bg-sage-light">
        <Image src={event.coverImage} alt={event.title} fill className="object-cover" />
      </div>

      <div className="mt-8 flex flex-col gap-6 rounded-2xl border border-ink/10 bg-white p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-ink/60">{formatDate(event.startAt)}</p>
          <p className="text-sm text-ink/60">
            {event.type === "ONLINE" ? "Online-Teilnahme" : event.location}
          </p>
          <p className="mt-1 text-2xl font-medium text-ink">{formatPrice(event.priceCents)}</p>
          <p className="mt-1 text-xs text-ink/50">
            {seatsLeft > 0 ? `${seatsLeft} von ${event.capacity} Plätzen frei` : "Ausgebucht"}
          </p>
        </div>

        <BookEventButton
          eventId={event.id}
          price={formatPrice(event.priceCents)}
          seatsLeft={seatsLeft}
        />
      </div>
    </div>
  );
}
