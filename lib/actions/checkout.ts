"use server";

import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { stripe } from "@/lib/stripe";

export type CheckoutActionState = {
  error?: string;
};

const APP_URL = process.env.APP_URL ?? "http://localhost:3000";

export async function createCourseCheckoutAction(
  _prevState: CheckoutActionState,
  formData: FormData
): Promise<CheckoutActionState> {
  const courseId = formData.get("courseId");
  if (typeof courseId !== "string") {
    return { error: "Ungültiger Kurs." };
  }

  const user = await getCurrentUser();
  if (!user) {
    redirect(`/login?redirect=/courses`);
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    return {
      error:
        "Zahlungen sind noch nicht aktiviert. Bitte konfiguriere STRIPE_SECRET_KEY in .env.local.",
    };
  }

  const course = await db.course.findUnique({ where: { id: courseId } });
  if (!course || !course.isPublished) {
    return { error: "Dieser Kurs ist nicht verfügbar." };
  }

  const existing = await db.enrollment.findUnique({
    where: { userId_courseId: { userId: user.id, courseId } },
  });
  if (existing) {
    redirect(`/learn/${course.slug}`);
  }

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "eur",
          unit_amount: course.priceCents,
          product_data: { name: course.title },
        },
        quantity: 1,
      },
    ],
    metadata: { type: "course", courseId: course.id, userId: user.id },
    success_url: `${APP_URL}/checkout/success?type=course&slug=${course.slug}`,
    cancel_url: `${APP_URL}/courses/${course.slug}?checkout=canceled`,
  });

  if (!session.url) {
    return { error: "Checkout konnte nicht gestartet werden." };
  }

  redirect(session.url);
}

export async function createEventCheckoutAction(
  _prevState: CheckoutActionState,
  formData: FormData
): Promise<CheckoutActionState> {
  const eventId = formData.get("eventId");
  const seatsRaw = formData.get("seats");
  const seats = typeof seatsRaw === "string" ? Math.max(1, parseInt(seatsRaw, 10) || 1) : 1;

  if (typeof eventId !== "string") {
    return { error: "Ungültiges Event." };
  }

  const user = await getCurrentUser();
  if (!user) {
    redirect(`/login?redirect=/events`);
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    return {
      error:
        "Zahlungen sind noch nicht aktiviert. Bitte konfiguriere STRIPE_SECRET_KEY in .env.local.",
    };
  }

  const event = await db.event.findUnique({ where: { id: eventId } });
  if (!event || !event.isPublished) {
    return { error: "Dieses Event ist nicht verfügbar." };
  }

  const confirmedSeats = await db.eventBooking.aggregate({
    where: { eventId, status: { in: ["PENDING", "CONFIRMED"] } },
    _sum: { seats: true },
  });
  const takenSeats = confirmedSeats._sum.seats ?? 0;
  if (takenSeats + seats > event.capacity) {
    return { error: "Für dieses Event sind nicht mehr genug Plätze verfügbar." };
  }

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "eur",
          unit_amount: event.priceCents,
          product_data: { name: event.title },
        },
        quantity: seats,
      },
    ],
    metadata: {
      type: "event",
      eventId: event.id,
      userId: user.id,
      seats: String(seats),
    },
    success_url: `${APP_URL}/checkout/success?type=event&slug=${event.slug}`,
    cancel_url: `${APP_URL}/events/${event.slug}?checkout=canceled`,
  });

  if (!session.url) {
    return { error: "Checkout konnte nicht gestartet werden." };
  }

  await db.eventBooking.create({
    data: {
      userId: user.id,
      eventId: event.id,
      seats,
      status: "PENDING",
      stripeSessionId: session.id,
    },
  });

  redirect(session.url);
}

export async function createStoreCheckoutAction(
  cartItems: { productId: string; quantity: number }[]
): Promise<CheckoutActionState> {
  if (cartItems.length === 0) {
    return { error: "Dein Warenkorb ist leer." };
  }

  const user = await getCurrentUser();
  if (!user) {
    redirect(`/login?redirect=/cart`);
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    return {
      error:
        "Zahlungen sind noch nicht aktiviert. Bitte konfiguriere STRIPE_SECRET_KEY in .env.local.",
    };
  }

  const products = await db.product.findMany({
    where: { id: { in: cartItems.map((i) => i.productId) }, isPublished: true },
  });

  const lineItems: {
    productId: string;
    quantity: number;
    priceCents: number;
    title: string;
  }[] = [];

  for (const item of cartItems) {
    const product = products.find((p) => p.id === item.productId);
    if (!product) {
      return { error: `Ein Produkt in deinem Warenkorb ist nicht mehr verfügbar.` };
    }
    if (product.stock < item.quantity) {
      return { error: `"${product.title}" ist nicht mehr in ausreichender Menge verfügbar.` };
    }
    lineItems.push({
      productId: product.id,
      quantity: item.quantity,
      priceCents: product.priceCents,
      title: product.title,
    });
  }

  const totalCents = lineItems.reduce((sum, i) => sum + i.priceCents * i.quantity, 0);

  const order = await db.order.create({
    data: {
      userId: user.id,
      status: "PENDING",
      totalCents,
      stripeSessionId: `pending-${crypto.randomUUID()}`,
      items: {
        create: lineItems.map((i) => ({
          productId: i.productId,
          quantity: i.quantity,
          priceCents: i.priceCents,
        })),
      },
    },
  });

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: lineItems.map((i) => ({
      price_data: {
        currency: "eur",
        unit_amount: i.priceCents,
        product_data: { name: i.title },
      },
      quantity: i.quantity,
    })),
    metadata: { type: "store", orderId: order.id, userId: user.id },
    success_url: `${APP_URL}/checkout/success?type=store&orderId=${order.id}`,
    cancel_url: `${APP_URL}/cart?checkout=canceled`,
  });

  if (!session.url) {
    return { error: "Checkout konnte nicht gestartet werden." };
  }

  await db.order.update({ where: { id: order.id }, data: { stripeSessionId: session.id } });

  redirect(session.url);
}
