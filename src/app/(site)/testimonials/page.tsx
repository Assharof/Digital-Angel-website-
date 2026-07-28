import type { Metadata } from "next";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { testimonials } from "@/db/schema";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Reader Testimonials",
  description: "Real stories from readers who used Digital Angel publications to improve their lives.",
};

export default async function TestimonialsPage() {
  const rows = await db
    .select()
    .from(testimonials)
    .where(eq(testimonials.published, true))
    .orderBy(desc(testimonials.createdAt));

  return (
    <div className="mx-auto max-w-6xl px-4 py-14">
      <h1 className="font-display text-4xl font-bold text-navy">Reader Testimonials</h1>
      <p className="mt-2 text-slate-600">What readers say about Digital Angel publications.</p>
      {rows.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-slate-300 bg-mist p-16 text-center text-slate-500">
          No testimonials published yet.
        </div>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {rows.map((t) => (
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
    </div>
  );
}
