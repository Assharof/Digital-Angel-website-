const { Client } = require("pg");
const { randomBytes, scryptSync } = require("crypto");
require("dotenv").config();

function hash(pw) {
  const salt = randomBytes(16).toString("hex");
  return `${salt}:${scryptSync(pw, salt, 64).toString("hex")}`;
}

const CATS = [
  ["Premium eBooks", "premium-ebooks", "Our flagship publications across every topic.", "📘"],
  ["Health & Wellness Guides", "health-wellness", "Practical guides for a healthier body and mind.", "🌿"],
  ["Parenting & Family Resources", "parenting-family", "Support for new parents and growing families.", "👶"],
  ["Personal Development Resources", "personal-development", "Habits, mindset and confidence building.", "🚀"],
  ["Digital Skills Guides", "digital-skills", "Modern skills for the online economy.", "💻"],
  ["Career Development Resources", "career-development", "Get hired, get promoted, get paid.", "💼"],
];

const PUBS = [
  {
    title: "The Old Midwife's Tearing Secret",
    subtitle: "Breaking the Cycle of Intimacy Pain, Tearing and Infection After Birth",
    description:
      "A practical postpartum recovery guide covering healing nutrition, self-care, warning signs to watch for, and how to prepare for follow-up medical appointments after childbirth-related tearing or episiotomy. Includes 4 bonus guides on healing foods, questions to ask your gynecologist, a recovery checklist, and medical warning signs.",
    category: "Health & Wellness Guides",
    price: "9.99",
    color: "#0b1f3a",
    buyLink: "https://selar.com/z8s757x68o",
    flags: { featured: true, bom: true, best: true, nr: false, free: false },
  },
  {
    title: "Love After Baby",
    subtitle: "A Gentle 14-Day Postpartum Reset for Confidence, Desire & Intimacy",
    description:
      "A 14-day guided reset helping new mothers rebuild body confidence, emotional wellbeing, and intimacy with their partner after childbirth. Includes 8 bonus resources covering self-care, husband communication, postpartum mental health, and progress trackers.",
    category: "Health & Wellness Guides",
    price: "14.99",
    color: "#3a1030",
    buyLink: "https://selar.com/a12e1726ko",
    flags: { featured: true, bom: false, best: true, nr: true, free: false },
  },
  {
    title: "The Husband's Postpartum Handbook",
    subtitle: "The Guide Every Husband Wishes He Had Before Baby Arrived",
    description:
      "A practical handbook helping husbands understand the hormonal, emotional, and physical changes their wives go through after childbirth — with guidance on rebuilding intimacy, communication, and connection. Includes 5 bonus guides: a 30-day reconnection challenge, encouragement phrases, a postpartum depression/anxiety guide, date night ideas, and a new dad survival guide.",
    category: "Parenting & Family Resources",
    price: "9.99",
    color: "#10233a",
    buyLink: "https://selar.com/2421e273f2",
    flags: { featured: true, bom: false, best: false, nr: true, free: false },
  },
  {
    title: "Nursing Mother's Self-Care Guide",
    subtitle: "Nourish yourself while you nourish your baby.",
    description:
      "Feeding schedules, nutrition, rest strategies and mental health tools for breastfeeding mothers who keep putting themselves last.",
    category: "Health & Wellness Guides",
    price: "9.99",
    color: "#1f3a2b",
    buyLink: "https://selar.co/",
    flags: { featured: false, bom: false, best: true, nr: true, free: false },
  },
  {
    title: "The Bloating Breakthrough",
    subtitle: "A simple 21-day plan for a calmer gut.",
    description:
      "Identify your triggers, rebuild digestion and feel light again with an easy elimination and reintroduction plan you can follow with ordinary food.",
    category: "Health & Wellness Guides",
    price: "13.99",
    color: "#3a2a0b",
    buyLink: "https://selar.co/",
    flags: { featured: false, bom: false, best: true, nr: true, free: false },
  },
  {
    title: "Digital Skills Starter Kit",
    subtitle: "Free 30-page primer on earning online.",
    description:
      "A free introduction to the digital skills that pay: writing, design basics, simple automation and how to land your first client.",
    category: "Digital Skills Guides",
    price: "0",
    color: "#123a3a",
    buyLink: "https://selar.co/",
    flags: { featured: false, bom: false, best: false, nr: true, free: true },
  },
  {
    title: "The Confident Interview Checklist",
    subtitle: "Free checklist for your next job interview.",
    description:
      "Everything to prepare, practise and pack — a one-page-per-stage checklist that turns interview anxiety into readiness.",
    category: "Career Development Resources",
    price: "0",
    color: "#2a123a",
    buyLink: "https://selar.co/",
    flags: { featured: false, bom: false, best: false, nr: false, free: true },
  },
  {
    title: "Quiet Discipline",
    subtitle: "Build habits that survive real life.",
    description:
      "A personal development guide about consistency without burnout: small systems, honest tracking and recovery plans for the days you fall off.",
    category: "Personal Development Resources",
    price: "10.99",
    color: "#0b2f3a",
    buyLink: "https://selar.co/",
    flags: { featured: true, bom: false, best: false, nr: true, free: false },
  },
];

const TESTIMONIALS = [
  ["Amara N.", "First-time mother, Douala", "The Old Midwife's Tearing Secret gave me confidence instead of fear. I recommended it to my whole antenatal group.", 5],
  ["Joseph K.", "Father of two, Yaoundé", "The Husband's Postpartum Handbook told me exactly what to do. It saved us so many arguments.", 5],
  ["Grace M.", "Nurse, Buea", "Clear, respectful and practical. Digital Angel writes the way people actually think.", 5],
  ["Blessing O.", "Entrepreneur, Lagos", "The Bloating Breakthrough plan worked in under three weeks. Simple food, no gimmicks.", 4],
  ["Marie T.", "Teacher, Bamenda", "Quiet Discipline helped me finally keep a morning routine for more than a week.", 5],
  ["Samuel A.", "Graduate, Accra", "The free interview checklist got me my first job. Incredible value for zero cost.", 5],
];

const FAQS = [
  ["How do I receive my eBook after purchase?", "Your download link is delivered instantly by email after checkout on our secure partner store. You can re-download it at any time.", 1],
  ["What format are the eBooks in?", "Every publication is delivered as a PDF optimised for phones, tablets and desktop reading.", 2],
  ["Can I read a sample before buying?", "Yes. Most publications include a free sample link on their page so you can preview the content first.", 3],
  ["Do you offer refunds?", "Because our products are digital and delivered instantly, refunds are handled case by case. Contact us within 7 days and we will make it right.", 4],
  ["What payment methods do you accept?", "Card payments, mobile money and bank transfer are supported through our checkout partner.", 5],
  ["Are online courses available?", "Online courses are coming soon. Join the newsletter to be notified when enrolment opens.", 6],
];

const MESSAGES = [
  ["Chantal Mbah", "chantal@example.com", "Bulk order for antenatal class", "Hello, I run an antenatal class of 25 mothers. Can we arrange a bundle price for the midwife guide?"],
  ["Peter Eyong", "peter@example.com", "Affiliate partnership", "I have a parenting page with 40k followers. Do you offer affiliate commissions?"],
  ["Linda A.", "linda@example.com", "Thank you", "Just wanted to say the postpartum handbook helped my husband understand me. Thank you."],
];

function slugify(s) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

(async () => {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();

  const { rows: existing } = await client.query("select count(*)::int as c from users");
  if (existing[0].c === 0) {
    await client.query("insert into users (email, name, password_hash) values ($1,$2,$3)", [
      "admin@digitalangel.com",
      "Angel Bliss",
      hash("angel1234"),
    ]);
  }

  for (const [name, slug, description, emoji] of CATS) {
    await client.query(
      "insert into categories (name, slug, description, emoji) values ($1,$2,$3,$4) on conflict (slug) do nothing",
      [name, slug, description, emoji]
    );
  }

  for (const p of PUBS) {
    await client.query(
      `insert into publications (title, slug, subtitle, description, category, price, currency, cover_color, buy_link, sample_link, status, is_featured, is_book_of_month, is_best_seller, is_new_release, is_free)
       values ($1,$2,$3,$4,$5,$6,'USD',$7,$8,$9,'published',$10,$11,$12,$13,$14)
       on conflict (slug) do nothing`,
      [
        p.title,
        slugify(p.title),
        p.subtitle,
        p.description,
        p.category,
        p.price,
        p.color,
        p.buyLink,
        "",
        p.flags.featured,
        p.flags.bom,
        p.flags.best,
        p.flags.nr,
        p.flags.free,
      ]
    );
  }

  const { rows: tc } = await client.query("select count(*)::int as c from testimonials");
  if (tc[0].c === 0) {
    for (const [name, role, quote, rating] of TESTIMONIALS) {
      await client.query("insert into testimonials (name, role, quote, rating) values ($1,$2,$3,$4)", [
        name,
        role,
        quote,
        rating,
      ]);
    }
  }

  const { rows: fc } = await client.query("select count(*)::int as c from faqs");
  if (fc[0].c === 0) {
    for (const [q, a, o] of FAQS) {
      await client.query("insert into faqs (question, answer, sort_order) values ($1,$2,$3)", [q, a, o]);
    }
  }

  const { rows: mc } = await client.query("select count(*)::int as c from messages");
  if (mc[0].c === 0) {
    for (const [name, email, subject, body] of MESSAGES) {
      await client.query("insert into messages (name, email, subject, body) values ($1,$2,$3,$4)", [
        name,
        email,
        subject,
        body,
      ]);
    }
  }

  for (const e of ["reader1@example.com", "mamaj@example.com", "kofi@example.com", "sandra@example.com"]) {
    await client.query("insert into subscribers (email) values ($1) on conflict (email) do nothing", [e]);
  }

  await client.end();
  console.log("Seed complete");
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
