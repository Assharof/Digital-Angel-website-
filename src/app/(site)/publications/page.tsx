import Link from "next/link";
import type { Metadata } from "next";
import { asc, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { categories, publications } from "@/db/schema";
import { BookCard, type Pub } from "@/components/book";
import { SmartSearch } from "@/components/public-forms";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Our Publications — Premium eBooks & Guides",
  description:
    "Browse the full Digital Angel library of premium eBooks covering health, parenting, personal development, digital skills and careers.",
};

type Category = {
  id: number;
  name: string;
  emoji: string;
};

export default async function PublicationsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string }>;
}) {
  const { q = "", category = "" } = await searchParams;
  const [rows, cats] = await Promise.all([
    db.select().from(publications).where(eq(publications.status, "published")).orderBy(desc(publications.createdAt)),
    db.select().from(categories).orderBy(asc(categories.name)),
  ]);

  const categoryRows = cats as unknown as Category[];
  const term = q.trim().toLowerCase();
  const list = (rows as unknown as Pub[]).filter((p) => {
    const matchQ =
      !term ||
      [p.title, p.subtitle, p.description, p.category].join(" ").toLowerCase().includes(term);
    const matchC = !category || p.category === category;
    return matchQ && matchC;
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-14">
      <h1 className="font-display text-4xl font-bold text-navy">Our Publications</h1>
      <p className="mt-2 max-w-2xl text-slate-600">
        Practical knowledge, beautifully published. Every guide is written to be understood and used.
      </p>

      <div className="mt-8">
        <SmartSearch initial={q} />
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <Chip href="/publications" active={!category} label="All" />
        {categoryRows.map((c) => (
          <Chip
            key={c.id}
            href={`/publications?category=${encodeURIComponent(c.name)}`}
            active={category === c.name}
            label={`${c.emoji} ${c.name}`}
          />
        ))}
      </div>

      <div className="mt-10">
        {list.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-mist p-16 text-center">
            <p className="font-display text-xl text-navy">No publications found</p>
            <p className="mt-2 text-slate-500">Try a different search term or category.</p>
            <Link href="/publications" className="mt-4 inline-block font-semibold text-navy underline decoration-gold">
              Clear filters
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((p) => (
              <BookCard key={p.id} pub={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Chip({ href, label, active }: { href: string; label: string; active: boolean }) {
  return (
    <Link
      href={href}
      className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
        active ? "border-navy bg-navy text-white" : "border-slate-300 text-slate-600 hover:border-gold"
      }`}
    >
      {label}
    </Link>
  );
}
