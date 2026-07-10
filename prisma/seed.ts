import "dotenv/config";
import { db } from "../lib/db";
import { hashPassword } from "../lib/auth";

function img(seed: string, w = 800, h = 600) {
  return `https://picsum.photos/seed/${seed}/${w}/${h}`;
}

async function main() {
  console.log("Seeding BLOUM…");

  const adminPassword = await hashPassword("admin1234");
  const demoPassword = await hashPassword("demo1234");

  await db.user.upsert({
    where: { email: "admin@bloum.de" },
    update: {},
    create: {
      email: "admin@bloum.de",
      name: "BLOUM Admin",
      passwordHash: adminPassword,
      role: "ADMIN",
    },
  });

  await db.user.upsert({
    where: { email: "demo@bloum.de" },
    update: {},
    create: {
      email: "demo@bloum.de",
      name: "Demo Nutzerin",
      passwordHash: demoPassword,
      role: "CUSTOMER",
    },
  });

  const courses = [
    {
      slug: "future-skills-fuer-frauen",
      title: "Future Skills für Frauen",
      description:
        "Baue die Kompetenzen auf, die dich in einer sich wandelnden Arbeitswelt unabhängig machen: Digital Mindset, Selbstführung und strategisches Denken.",
      coverImage: img("course-future-skills"),
      priceCents: 14900,
      category: "Karriere",
      level: "Einsteiger",
      modules: [
        {
          title: "Digital Mindset",
          lessons: [
            { title: "Warum Future Skills zählen", durationMin: 8 },
            { title: "Die wichtigsten Tools im Überblick", durationMin: 12 },
          ],
        },
        {
          title: "Selbstführung",
          lessons: [
            { title: "Ziele setzen, die tragen", durationMin: 10 },
            { title: "Produktive Routinen aufbauen", durationMin: 9 },
          ],
        },
      ],
    },
    {
      slug: "verhandeln-mit-selbstvertrauen",
      title: "Verhandeln mit Selbstvertrauen",
      description:
        "Lerne, deinen Wert klar zu kommunizieren – ob beim Gehalt, in Projekten oder im Alltag.",
      coverImage: img("course-negotiation"),
      priceCents: 9900,
      category: "Karriere",
      level: "Fortgeschritten",
      modules: [
        {
          title: "Grundlagen der Verhandlung",
          lessons: [
            { title: "Die Psychologie des Verhandelns", durationMin: 11 },
            { title: "Deine Verhandlungsposition kennen", durationMin: 7 },
          ],
        },
      ],
    },
    {
      slug: "mindset-fuer-veraenderung",
      title: "Mindset für Veränderung",
      description:
        "Ein Kurs über Resilienz, Selbstvertrauen und die innere Haltung, die große Veränderungen möglich macht.",
      coverImage: img("course-mindset"),
      priceCents: 7900,
      category: "Persönlichkeit",
      level: "Einsteiger",
      modules: [
        {
          title: "Innere Klarheit",
          lessons: [
            { title: "Standortbestimmung", durationMin: 9 },
            { title: "Glaubenssätze erkennen", durationMin: 13 },
          ],
        },
        {
          title: "Resilienz aufbauen",
          lessons: [{ title: "Mit Rückschlägen wachsen", durationMin: 10 }],
        },
      ],
    },
  ];

  for (const c of courses) {
    await db.course.upsert({
      where: { slug: c.slug },
      update: {},
      create: {
        slug: c.slug,
        title: c.title,
        description: c.description,
        coverImage: c.coverImage,
        priceCents: c.priceCents,
        category: c.category,
        level: c.level,
        modules: {
          create: c.modules.map((m, mi) => ({
            title: m.title,
            order: mi,
            lessons: {
              create: m.lessons.map((l, li) => ({
                title: l.title,
                order: li,
                durationMin: l.durationMin,
                content:
                  "In dieser Lektion vertiefen wir das Thema Schritt für Schritt – mit praktischen Übungen für deinen Alltag.",
              })),
            },
          })),
        },
      },
    });
  }

  const now = Date.now();
  const day = 24 * 60 * 60 * 1000;

  const events = [
    {
      slug: "workshop-selbstfuehrung-berlin",
      title: "Workshop: Selbstführung in Berlin",
      description:
        "Ein Nachmittag voller Impulse und Austausch rund um Selbstführung, moderiert von unserem BLOUM-Coaching-Team.",
      type: "OFFLINE" as const,
      location: "Berlin, Kreuzberg",
      startAt: new Date(now + 14 * day),
      endAt: new Date(now + 14 * day + 4 * 60 * 60 * 1000),
      priceCents: 6900,
      capacity: 20,
      coverImage: img("event-berlin"),
    },
    {
      slug: "online-talk-future-of-work",
      title: "Online-Talk: Future of Work",
      description:
        "Live-Gespräch mit Expertinnen über die Arbeitswelt von morgen – inklusive Q&A.",
      type: "ONLINE" as const,
      location: "Online (Zoom-Link nach Buchung)",
      startAt: new Date(now + 7 * day),
      endAt: new Date(now + 7 * day + 90 * 60 * 1000),
      priceCents: 0,
      capacity: 200,
      coverImage: img("event-online"),
    },
    {
      slug: "netzwerk-brunch-muenchen",
      title: "Netzwerk-Brunch München",
      description: "Persönliches Kennenlernen bei Kaffee und Croissants – für echte Begegnung.",
      type: "OFFLINE" as const,
      location: "München, Glockenbachviertel",
      startAt: new Date(now + 21 * day),
      endAt: new Date(now + 21 * day + 3 * 60 * 60 * 1000),
      priceCents: 3500,
      capacity: 15,
      coverImage: img("event-brunch"),
    },
  ];

  for (const e of events) {
    await db.event.upsert({ where: { slug: e.slug }, update: {}, create: e });
  }

  const products = [
    {
      slug: "statement-shirt-woman-human",
      title: '"Woman. Human." Statement-Shirt',
      description: "Bio-Baumwoll-Shirt mit unserem Leitmotiv – ein stilles Statement.",
      priceCents: 3900,
      images: [img("product-shirt")],
      stock: 40,
      category: "Fashion",
      isFeatured: true,
    },
    {
      slug: "growth-journal",
      title: "BLOUM Growth Journal",
      description: "Geführtes Journal für Reflexion, Ziele und persönliches Wachstum.",
      priceCents: 2400,
      images: [img("product-journal")],
      stock: 60,
      category: "Papeterie",
      isFeatured: true,
    },
    {
      slug: "mindset-kartenset",
      title: "Mindset-Kartenset",
      description: "50 Impulskarten für mehr Klarheit im Alltag.",
      priceCents: 1900,
      images: [img("product-cards")],
      stock: 75,
      category: "Papeterie",
      isFeatured: false,
    },
    {
      slug: "bloum-tote-bag",
      title: "BLOUM Tote Bag",
      description: "Nachhaltige Baumwolltasche mit dem BLOUM-Logo.",
      priceCents: 1600,
      images: [img("product-bag")],
      stock: 100,
      category: "Fashion",
      isFeatured: false,
    },
    {
      slug: "duftkerze-selfcare",
      title: "Duftkerze „Selfcare Moment“",
      description: "Handgegossene Sojawachskerze für bewusste Pausen.",
      priceCents: 2200,
      images: [img("product-candle")],
      stock: 30,
      category: "Home",
      isFeatured: true,
    },
    {
      slug: "affirmationskarten-mini",
      title: "Mini-Affirmationskarten",
      description: "Kompaktes Kartenset für die Handtasche – tägliche Stärkung to go.",
      priceCents: 1200,
      images: [img("product-mini-cards")],
      stock: 90,
      category: "Papeterie",
      isFeatured: false,
    },
  ];

  for (const p of products) {
    await db.product.upsert({ where: { slug: p.slug }, update: {}, create: p });
  }

  console.log("Fertig. Login: admin@bloum.de / admin1234, demo@bloum.de / demo1234");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
