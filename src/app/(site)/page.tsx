import Link from "next/link";
import { asc, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { categories, publications, testimonials } from "@/db/schema";
import { BookCard, BookCover, priceLabel, type Pub } from "@/components/book";
import { NewsletterForm, SmartSearch } from "@/components/public-forms";

export const dynamic = "force-dynamic";

const WHY = [
  { t: "Practical, Not Theoretical", d: "Every page turns complex topics into steps you can act on today.", i: "🎯" },
  { t: "Editorially Crafted", d: "Researched, edited and designed to a premium standard.", i: "✒️" },
  { t: "Trusted Guidance", d: "Content you can rely on regardless of your background.", i: "🛡️" },
  { t: "Instant Digital Access", d: "Download and start reading within minutes of purchase.", i: "⚡" },
];

export default async function HomePage() {
  const [pubs, cats, quotes] = await Promise.all([
    db.select().from(publications).where(eq(publications.status, "published")).orderBy(desc(publications.createdAt)),
    db.select().from(categories).orderBy(asc(categories.name)),
    db.select().from(testimonials).where(eq(testimonials.published, true)).limit(6),
  ]);

  const list = pubs as unknown as Pub[];
  const featured = list.filter((p) => (p as unknown as { isFeatured: boolean }).isFeatured).slice(0, 3);
  const bom = list.find((p) => (p as unknown as { isBookOfMonth: boolean }).isBookOfMonth);
  const newReleases = list.filter((p) => (p as unknown as { isNewRelease: boolean }).isNewRelease).slice(0, 4);
  const best = list.filter((p) => (p as unknown as { isBestSeller: boolean }).isBestSeller).slice(0, 4);
  const free = list.filter((p) => p.isFree).slice(0, 3);

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-navy text-white">
        <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-gold/20 blur-3xl" />
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-20 lg:grid-cols-2 lg:py-28">
          <div>
            <p className="mb-4 inline-block rounded-full border border-gold/50 px-4 py-1 text-xs uppercase tracking-[0.25em] text-gold-light">
              Digital Publishing
            </p>
            <h1 className="font-display text-4xl font-bold leading-tight md:text-6xl">
              Where Knowledge <span className="text-gold-light">Creates Freedom.</span>
            </h1>
            <p className="mt-6 max-w-lg text-lg text-slate-300">
              Practical eBooks and educational resources that help you live healthier, wiser and more successful —
              written in plain language anyone can use.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/publications"
                className="rounded-full bg-gold px-7 py-3 font-semibold text-navy hover:bg-gold-light"
              >
                Explore Publications
              </Link>
              <Link
                href="/resources"
                className="rounded-full border border-white/40 px-7 py-3 font-semibold text-white hover:bg-white/10"
              >
                Free Resources
              </Link>
            </div>
            <div className="mt-8 max-w-xl [&_input]:text-slate-800">
              <SmartSearch />
            </div>
          </div>
          <div className="flex justify-center gap-6">
            {(featured.length ? featured : list).slice(0, 3).map((p, i) => (
              <div key={p.id} style={{ marginTop: i * 18 }}>
                <BookCover pub={p} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED */}
      <Section title="Featured Publications" sub="Hand-picked guides our readers return to again and again.">
        {featured.length === 0 ? (
          <Empty text="Featured publications will appear here soon." />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((p) => (
              <BookCard key={p.id} pub={p} />
            ))}
          </div>
        )}
      </Section>

      {/* CATEGORIES */}
      <Section title="Browse by Category" sub="Find the exact knowledge you need.">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cats.map((c) => (
            <Link
              key={c.id}
              href={`/publications?category=${encodeURIComponent(c.name)}`}
              className="rounded-2xl border border-slate-200 bg-mist p-6 transition hover:border-gold hover:bg-white hover:shadow-md"
            >
              <span className="text-2xl">{c.emoji}</span>
              <h3 className="mt-3 font-display text-lg font-bold text-navy">{c.name}</h3>
              <p className="mt-1 text-sm text-slate-600">{c.description}</p>
            </Link>
          ))}
        </div>
      </Section>

      {/* WHY */}
      <section className="bg-mist py-20">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-center font-display text-3xl font-bold text-navy">Why Choose Digital Angel</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {WHY.map((w) => (
              <div key={w.t} className="rounded-2xl bg-white p-6 shadow-sm">
                <span className="text-3xl">{w.i}</span>
                <h3 className="mt-3 font-display text-lg font-bold text-navy">{w.t}</h3>
                <p className="mt-2 text-sm text-slate-600">{w.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BOOK OF THE MONTH */}
      {bom && (
        <section className="mx-auto my-20 max-w-6xl px-4">
          <div className="grid items-center gap-10 rounded-3xl bg-navy p-10 text-white lg:grid-cols-[220px_1fr]">
            <div className="flex justify-center">
              <BookCover pub={bom} />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-gold-light">Featured Book of the Month</p>
              <h2 className="mt-2 font-display text-3xl font-bold">{bom.title}</h2>
              <p className="mt-3 max-w-2xl text-slate-300">{bom.description || bom.subtitle}</p>
              <div className="mt-6 flex flex-wrap items-center gap-4">
                <span className="text-xl font-semibold text-gold-light">{priceLabel(bom)}</span>
                <Link
                  href={`/publications/${bom.slug}`}
                  className="rounded-full bg-gold px-6 py-3 text-sm font-semibold text-navy hover:bg-gold-light"
                >
                  Read More
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      <Section title="New Releases" sub="Fresh from the Digital Angel press.">
        {newReleases.length === 0 ? (
          <Empty text="New releases are on the way." />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {newReleases.map((p) => (
              <BookCard key={p.id} pub={p} />
            ))}
          </div>
        )}
      </Section>

      <Section title="Best Sellers" sub="Most loved by our readers.">
        {best.length === 0 ? (
          <Empty text="Best sellers coming soon." />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {best.map((p) => (
              <BookCard key={p.id} pub={p} />
            ))}
          </div>
        )}
      </Section>

      <Section title="Free Resources" sub="Start learning today at no cost.">
        {free.length === 0 ? (
          <Empty text="Free resources will be published shortly." />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {free.map((p) => (
              <BookCard key={p.id} pub={p} />
            ))}
          </div>
        )}
      </Section>

      {/* ABOUT */}
      <section className="bg-mist py-20">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-3xl font-bold text-navy">About Digital Angel</h2>
            <p className="mt-4 text-slate-600">
              Digital Angel is a digital publishing brand committed to delivering practical knowledge that helps people
              live healthier, wiser, and more successful lives through carefully crafted eBooks and educational
              resources.
            </p>
            <p className="mt-4 text-slate-600">
              Our mission is to turn complex topics into simple, practical knowledge that anyone can understand and
              use — regardless of background or experience.
            </p>
            <Link href="/about" className="mt-6 inline-block font-semibold text-navy underline decoration-gold">
              Read our full story →
            </Link>
          </div>
          <div className="rounded-3xl border border-gold/40 bg-white p-8">
            <p className="font-display text-xl text-navy">Our Brand Promise</p>
            <p className="mt-3 text-slate-600">
              Every Digital Angel publication delivers practical knowledge readers can trust and use to improve their
              lives.
            </p>
          </div>
        </div>
      </section>

      <Section title="What Readers Say" sub="Real feedback from the Digital Angel community.">
        {quotes.length === 0 ? (
          <Empty text="Testimonials coming soon." />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {quotes.map((t) => (
              <figure key={t.id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="text-gold">{"★".repeat(t.rating)}</div>
                <blockquote className="mt-3 text-slate-700">“{t.quote}”</blockquote>
                <figcaption className="mt-4 text-sm font-semibold text-navy">
                  {t.name} <span className="font-normal text-slate-500">· {t.role}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        )}
      </Section>

      <section className="bg-navy py-16">
        <div className="mx-auto flex max-w-4xl flex-col items-center px-4 text-center">
          <h2 className="font-display text-3xl font-bold text-white">Join the Digital Angel Newsletter</h2>
          <p className="mt-3 text-slate-300">Free guides, new releases and reader-only offers.</p>
          <div className="mt-6 flex justify-center">
            <NewsletterForm dark />
          </div>
        </div>
      </section>
    </>
  );
}

export function Section({
  title,
  sub,
  children,
}: {
  title: string;
  sub?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <h2 className="font-display text-3xl font-bold text-navy">{title}</h2>
      {sub && <p className="mt-2 text-slate-600">{sub}</p>}
      <div className="mt-8">{children}</div>
    </section>
  );
}

function Empty({ text }: { text: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-mist p-12 text-center text-slate-500">
      {text}
    </div>
  );
}
