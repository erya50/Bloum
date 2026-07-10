import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return NextResponse.json({ error: "Webhook nicht konfiguriert." }, { status: 500 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Fehlende Signatur." }, { status: 400 });
  }

  const rawBody = await request.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch {
    return NextResponse.json({ error: "Ungültige Signatur." }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const metadata = session.metadata ?? {};

    if (metadata.type === "course") {
      const existing = await db.enrollment.findUnique({
        where: { stripeSessionId: session.id },
      });
      if (!existing) {
        await db.enrollment.create({
          data: {
            userId: metadata.userId,
            courseId: metadata.courseId,
            stripeSessionId: session.id,
          },
        });
      }
    }

    if (metadata.type === "event") {
      await db.eventBooking.updateMany({
        where: { stripeSessionId: session.id, status: "PENDING" },
        data: { status: "CONFIRMED" },
      });
    }

    if (metadata.type === "store") {
      const order = await db.order.findUnique({
        where: { id: metadata.orderId },
        include: { items: true },
      });

      if (order && order.status === "PENDING") {
        await db.$transaction([
          db.order.update({ where: { id: order.id }, data: { status: "PAID" } }),
          ...order.items.map((item: (typeof order.items)[number]) =>
            db.product.update({
              where: { id: item.productId },
              data: { stock: { decrement: item.quantity } },
            })
          ),
        ]);
      }
    }
  }

  if (event.type === "checkout.session.expired") {
    const session = event.data.object as Stripe.Checkout.Session;
    const metadata = session.metadata ?? {};

    if (metadata.type === "event") {
      await db.eventBooking.updateMany({
        where: { stripeSessionId: session.id, status: "PENDING" },
        data: { status: "CANCELED" },
      });
    }

    if (metadata.type === "store") {
      await db.order.updateMany({
        where: { id: metadata.orderId, status: "PENDING" },
        data: { status: "CANCELED" },
      });
    }
  }

  return NextResponse.json({ received: true });
}
