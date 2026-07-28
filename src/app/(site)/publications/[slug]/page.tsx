import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { and, eq, ne } from "drizzle-orm";
import { db } from "@/db";
import { publications } from "@/db/schema";
import { BookCard, BookCover, priceLabel, type Pub } from "@/components/book";

export const dynamic = "force-dynamic";

async function getPub(slug: string) {
  const rows = await db.select().from(publications).where(eq(publications.slug, slug)).limit(1);
  return (rows[0] as unknown as Pub) ?? null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const pub = await getPub(slug);
  if (!pub) return { title: "Publication not found" };
  return {
    title: `${pub.title} — ${pub.category}`,
    description: (pub.subtitle || pub.description).slice(0, 155),
  };
}

export default async function PublicationPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const pub = await getPub(slug);
  if (!pub) notFound();

  const related = (await db
    .select()
    .from(publications)
    .where(and(eq(publications.category, pub.category), ne(publications.slug, slug)))
    .limit(3)) as unknown as Pub[];

  return (
    <div>
      <div className="bg-navy text-white">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 lg:grid-cols-[240px_1fr]">
          <div className="flex justify-center">
            <BookCover pub={pub} />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-gold-light">{pub.category}</p>
            <h1 className="mt-2 font-display text-4xl font-bold">{pub.title}</h1>
            <p className="mt-3 text-lg text-slate-300">{pub.subtitle}</p>
            <p className="mt-6 text-2xl font-semibold text-gold-light">{priceLabel(pub)}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={pub.buyLink || "https://selar.co"}
                target="_blank"
                rel="noreferrer"
                className="rounded-full bg-gold px-7 py-3 font-semibold text-navy hover:bg-gold-light"
              >
                Buy Now
              </a>
              <a
                href={pub.sampleLink || "#details"}
                className="rounded-full border border-white/40 px-7 py-3 font-semibold hover:bg-white/10"
              >
                Read Free Sample
              </a>
            </div>
          </div>
        </div>
      </div>

      <div id="details" className="mx-auto max-w-3xl px-4 py-14">
        <h2 className="font-display text-2xl font-bold text-navy">About this publication</h2>
        <p className="mt-4 whitespace-pre-line leading-relaxed text-slate-700">
          {pub.description || "A detailed description of this publication will be added shortly."}
        </p>
        <div className="mt-8 rounded-2xl bg-mist p-6">
          <p className="font-display text-lg text-navy">Our promise</p>
          <p className="mt-2 text-sm text-slate-600">
            Every Digital Angel publication delivers practical knowledge readers can trust and use.
          </p>
        </div>
      </div>

      {related.length > 0 && (
        <div className="mx-auto max-w-6xl px-4 pb-16">
          <h2 className="font-display text-2xl font-bold text-navy">Related publications</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((r) => (
              <BookCard key={r.id} pub={r} />
            ))}
          </div>
        </div>
      )}

      {/* Sticky buy bar */}
      <div className="sticky bottom-0 z-30 border-t border-slate-200 bg-white/95 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4">
          <div className="min-w-0">
            <p className="truncate font-display font-bold text-navy">{pub.title}</p>
            <p className="text-sm text-slate-500">{priceLabel(pub)}</p>
          </div>
          <div className="flex gap-2">
            <Link href="/publications" className="hidden rounded-full border border-slate-300 px-5 py-2 text-sm sm:block">
              Back to library
            </Link>
            <a
              href={pub.buyLink || "https://selar.co"}
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-navy px-6 py-2 text-sm font-semibold text-white hover:bg-navy-light"
            >
              Buy Now
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
