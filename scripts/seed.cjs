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

const IMG = "/images/publications";

const PUBS = [
  {
    title: "The Old Midwife's Tearing Secret",
    subtitle: "Breaking the Cycle of Intimacy Pain, Tearing and Infection After Birth",
    description:
      "A practical postpartum recovery guide covering healing nutrition, self-care, warning signs to watch for, and how to prepare for follow-up medical appointments after childbirth-related tearing or episiotomy.",
    longDescription: `Finally Discover the Gentle Recovery Secrets That Help Thousands of Mothers Heal with Greater Comfort, Confidence, and Hope.

Childbirth Was Supposed to Bring You Joy...

So why does every step hurt? Why do you dread using the bathroom? Why does the thought of intimacy fill you with fear? Why do you still feel like your body isn't your own?

If you've been silently battling pain after childbirth, you're not alone. Every year, millions of women experience vaginal tears, painful stitches, fear of intimacy, slow healing, constant discomfort while sitting or walking, anxiety about infections, and fear of tearing again in future births.

Yet many women leave the hospital with only a few minutes of advice before being expected to figure everything out on their own. This guide was created to fill that gap.

Introducing The Old Midwife's Tearing Secret — a practical postpartum recovery guide designed to help women understand their healing journey, care for themselves with confidence, recognize when recovery is progressing normally, and know when to seek medical attention.

This isn't based on myths or unsafe home remedies. It combines practical postpartum self-care, nutrition, recovery education, and guidance on recognizing warning signs — while encouraging appropriate medical follow-up whenever needed.

Inside You'll Discover: why some women heal faster than others, the nutrients your body needs to rebuild tissue, foods that support wound healing, how to care for yourself in the critical weeks after delivery, common mistakes that slow healing, how to recognize symptoms needing prompt attention, tips for postpartum appointments, and a step-by-step recovery checklist.

A Gentle Reminder: every woman's recovery is unique. This guide does not replace your doctor, midwife, or other healthcare professionals — it helps you better understand your recovery, care for yourself, and recognize when professional medical attention may be needed.`,
    authorName: "Angele Nena",
    category: "Health & Wellness Guides",
    price: "9.99",
    color: "#0b1f3a",
    buyLink: "https://selar.com/z8s757x68o",
    coverImageUrl: `${IMG}/old-midwifes-tearing-secret-cover.jpg`,
    tocImageUrl: `${IMG}/old-midwifes-tearing-secret-toc.jpg`,
    spreadImageUrl: `${IMG}/old-midwifes-tearing-secret-spread.jpg`,
    bonuses: [
      { title: "Foods That Support Tissue Healing After Birth", description: "Discover the nutrients and meal ideas that help nourish your body during postpartum recovery." },
      { title: "Questions Every Woman Should Ask Her Gynecologist", description: "Never leave a medical appointment wishing you had asked something important again." },
      { title: "Postpartum Recovery Checklist", description: "A printable week-by-week guide to help you track your healing and prepare for follow-up appointments." },
      { title: "Signs You Need Medical Attention After Childbirth", description: "Learn how to recognize important warning signs so you can seek timely medical care if needed." },
    ],
    flags: { featured: true, bom: true, best: true, nr: false, free: false },
  },
  {
    title: "Love After Baby",
    subtitle: "A Gentle 14-Day Postpartum Reset for Confidence, Desire & Intimacy",
    description:
      "A 14-day guided reset helping new mothers rebuild body confidence, emotional wellbeing, and intimacy with their partner after childbirth.",
    longDescription: `You Love Your Baby… So Why Does It Feel Like You've Lost Yourself?

You look in the mirror and barely recognize the woman staring back. Your body feels different. Your confidence has disappeared. Your relationship doesn't feel as close as it once did. Your husband wants to help, but you don't know how to explain what you're feeling.

And then comes the guilt… "Am I a bad wife?" "Will I ever feel like myself again?" "Will our marriage survive this season?"

If you've ever asked yourself these questions, take a deep breath. You are not broken. You're healing. And you don't have to figure it all out alone.

Introducing Love After Baby — a practical, compassionate guide created to help new mothers rebuild confidence, reconnect with themselves, and strengthen their marriage — one small step at a time.

This isn't another unrealistic "bounce back" program. This isn't about becoming the woman you were before giving birth. It's about becoming a healthier, stronger, and more confident version of the woman you are today.

Inside This Guide You'll Discover: why it's completely normal for intimacy to feel different after childbirth, how to rebuild confidence without comparing yourself to other mothers, gentle daily exercises that fit into a busy mom's schedule, practical ways to reconnect emotionally with your husband, healthy communication techniques, self-care habits that don't require hours of free time, and how to celebrate progress instead of chasing perfection.

Healing doesn't happen overnight. But every small step matters.

This guide is intended for educational and supportive purposes and is not a substitute for personalized medical or mental health care. If you experience severe physical symptoms or persistent emotional distress, please seek advice from a qualified healthcare professional.`,
    authorName: "Angele Nena",
    category: "Health & Wellness Guides",
    price: "14.99",
    color: "#3a1030",
    buyLink: "https://selar.com/a12e1726ko",
    coverImageUrl: `${IMG}/love-after-baby-cover.jpg`,
    tocImageUrl: `${IMG}/love-after-baby-toc.jpg`,
    spreadImageUrl: `${IMG}/love-after-baby-spread.jpg`,
    bonuses: [
      { title: "The Nursing Mother's Self-Care Guide", description: "Practical tips for rest, nourishment, and caring for yourself while caring for your baby." },
      { title: "Dear Hubby", description: "A practical guide to help husbands understand, support, and reconnect with their wives after childbirth." },
      { title: "Understanding Postpartum Depression & Anxiety", description: "Recognize common warning signs and know when to seek professional support." },
      { title: "The Touch Reconnection Ladder™", description: "A gentle step-by-step framework for rebuilding physical closeness without pressure." },
      { title: "Body Confidence Tracker", description: "A guided workbook to help you rebuild confidence through simple daily habits and reflection." },
      { title: "\"Am I Normal?\" Private Postpartum FAQ", description: "Answers to many of the questions new mothers are often too embarrassed to ask." },
      { title: "Daily Action Sheets & Progress Checklists", description: "Interactive worksheets to help you stay consistent throughout your healing journey." },
      { title: "30-Day Reconnection Tracker", description: "A printable tracker to help you continue building healthy habits after the 14-day program ends." },
    ],
    flags: { featured: true, bom: false, best: true, nr: true, free: false },
  },
  {
    title: "The Husband's Postpartum Handbook",
    subtitle: "The Guide Every Husband Wishes He Had Before Baby Arrived",
    description:
      "A practical handbook helping husbands understand the hormonal, emotional, and physical changes their wives go through after childbirth — with guidance on rebuilding intimacy, communication, and connection.",
    longDescription: `She hasn't stopped loving you... she's going through one of the biggest physical and emotional changes of her life.

After your baby arrived... has your wife become distant? Does she seem exhausted all the time? Has intimacy almost disappeared? Do you sometimes wonder "Did I do something wrong?" or "Will our marriage ever feel the same again?"

If you've asked yourself even one of those questions, you're not alone. The truth is, most husbands are never taught what really happens after childbirth. Nobody explains the hormonal changes. Nobody prepares you for the emotional changes. So many good husbands begin blaming themselves... while so many good wives silently blame themselves too. And that's where distance quietly begins.

That's exactly why The Husband's Postpartum Handbook was created — a practical handbook written for one purpose: to help husbands understand, support, and reconnect with the woman they love after childbirth.

Inside You'll Learn: why childbirth changes much more than a woman's body, why intimacy feels different after baby, what she secretly wishes you understood, the biggest mistakes husbands unknowingly make, how to rebuild emotional connection, and when it's time to seek professional help for postpartum depression and anxiety.

This Book Will Help You Become a more understanding husband, a more confident father, a better communicator, a stronger emotional partner, and the safe place your wife needs during recovery.

No book can promise a perfect marriage. But the right knowledge can help you avoid misunderstandings, strengthen your relationship, and navigate the postpartum season as a team.`,
    authorName: "Angele Nena",
    category: "Parenting & Family Resources",
    price: "9.99",
    color: "#10233a",
    buyLink: "https://selar.com/2421e273f2",
    coverImageUrl: `${IMG}/husbands-postpartum-handbook-cover.jpg`,
    tocImageUrl: `${IMG}/husbands-postpartum-handbook-toc.jpg`,
    spreadImageUrl: `${IMG}/husbands-postpartum-handbook-spread.jpg`,
    bonuses: [
      { title: "30-Day Marriage Reconnection Challenge", description: "A simple day-by-day plan filled with practical actions that help couples reconnect one small step at a time." },
      { title: "100 Encouraging Things Every Husband Can Say After Baby", description: "100 sincere, supportive phrases to encourage your wife through the postpartum season." },
      { title: "Understanding Postpartum Depression & Anxiety", description: "Recognize warning signs, offer meaningful support, and know when professional help may be needed." },
      { title: "52 Simple Date Nights for New Parents", description: "One meaningful date idea for every week of the year — no expensive outings required." },
      { title: "The New Dad's Survival Guide", description: "Practical advice to navigate work, family, sleep deprivation, stress, and fatherhood with confidence." },
    ],
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
      `insert into publications (title, slug, subtitle, description, long_description, author_name, category, price, currency, cover_color, cover_image_url, toc_image_url, spread_image_url, bonuses, buy_link, sample_link, status, is_featured, is_book_of_month, is_best_seller, is_new_release, is_free)
       values ($1,$2,$3,$4,$5,$6,$7,$8,'USD',$9,$10,$11,$12,$13,$14,$15,'published',$16,$17,$18,$19,$20)
       on conflict (slug) do update set
         subtitle = excluded.subtitle,
         description = excluded.description,
         long_description = excluded.long_description,
         author_name = excluded.author_name,
         cover_image_url = excluded.cover_image_url,
         toc_image_url = excluded.toc_image_url,
         spread_image_url = excluded.spread_image_url,
         bonuses = excluded.bonuses,
         buy_link = excluded.buy_link`,
      [
        p.title,
        slugify(p.title),
        p.subtitle,
        p.description,
        p.longDescription || "",
        p.authorName || "",
        p.category,
        p.price,
        p.color,
        p.coverImageUrl || "",
        p.tocImageUrl || "",
        p.spreadImageUrl || "",
        JSON.stringify(p.bonuses || []),
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
