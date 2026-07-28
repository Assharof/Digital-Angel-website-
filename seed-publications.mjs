// seed-publications.mjs
// Seeds the three Digital Angel ebooks into the database via the app's own
// /api/publications endpoint (so it uses whatever validation/shape your
// backend already expects — no schema guessing).
//
// Usage:
//   1. Make sure your dev server is running:  npm run dev
//   2. In a second terminal, run:             node seed-publications.mjs
//
// If your dev server runs on a different port, change BASE_URL below.

const BASE_URL = "http://localhost:3000";

const publications = [
  {
    title: "The Husband's Postpartum Handbook",
    subtitle: "The Guide Every Husband Wishes He Had Before Baby Arrived",
    description:
      "A practical handbook helping husbands understand the hormonal, emotional, and physical changes their wives go through after childbirth — with guidance on rebuilding intimacy, communication, and connection. Includes 5 bonus guides: a 30-day reconnection challenge, encouragement phrases, a postpartum depression/anxiety guide, date night ideas, and a new dad survival guide.",
    category: "Parenting & Family Resources",
    price: "9.99",
    currency: "USD",
    coverColor: "#0b1f3a",
    buyLink: "https://selar.com/2421e273f2",
    sampleLink: "",
    status: "published",
    isFeatured: false,
    isBookOfMonth: false,
    isBestSeller: false,
    isNewRelease: true,
    isFree: false,
  },
  {
    title: "The Old Midwife's Tearing Secret",
    subtitle:
      "Breaking the Cycle of Intimacy Pain, Tearing and Infection After Birth",
    description:
      "A postpartum recovery guide covering healing nutrition, self-care, warning signs to watch for, and how to prepare for follow-up medical appointments after childbirth-related tearing or episiotomy. Includes 4 bonus guides on healing foods, questions to ask your gynecologist, a recovery checklist, and medical warning signs.",
    category: "Health & Wellness Guides",
    price: "9.99",
    currency: "USD",
    coverColor: "#0b1f3a",
    buyLink: "https://selar.com/z8s757x68o",
    sampleLink: "",
    status: "published",
    isFeatured: false,
    isBookOfMonth: false,
    isBestSeller: false,
    isNewRelease: true,
    isFree: false,
  },
  {
    title: "Love After Baby",
    subtitle: "A Gentle 14-Day Postpartum Reset for Confidence, Desire & Intimacy",
    description:
      "A 14-day guided reset helping new mothers rebuild body confidence, emotional wellbeing, and intimacy with their partner after childbirth. Includes 8 bonus resources covering self-care, husband communication, postpartum mental health, and progress trackers.",
    category: "Health & Wellness Guides",
    price: "14.99",
    currency: "USD",
    coverColor: "#0b1f3a",
    buyLink: "https://selar.com/a12e1726ko",
    sampleLink: "",
    status: "published",
    isFeatured: false,
    isBookOfMonth: false,
    isBestSeller: false,
    isNewRelease: true,
    isFree: false,
  },
];

async function main() {
  for (const pub of publications) {
    try {
      const res = await fetch(`${BASE_URL}/api/publications`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pub),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error(`✗ Failed: "${pub.title}" — ${res.status} ${res.statusText}`);
        console.error(`  Response: ${text}`);
        continue;
      }

      const created = await res.json();
      console.log(`✓ Created: "${pub.title}" (id: ${created.id ?? "?"})`);
    } catch (err) {
      console.error(`✗ Error creating "${pub.title}":`, err.message);
    }
  }
}

main();
