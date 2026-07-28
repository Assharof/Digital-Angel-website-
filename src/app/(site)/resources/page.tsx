import type { Metadata } from "next";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { publications } from "@/db/schema";
import { BookCard, type Pub } from "@/components/book";
import { NewsletterForm } from "@/components/public-forms";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Educational Resources & Free Library",
  description: "Free guides, checklists and lead magnets from Digital Angel — practical knowledge at no cost.",
};

export default async function ResourcesPage() {
  const rows = (await db.select().from(publications).where(eq(publications.isFree, true))) as unknown as Pub[];

  return (
    <div className="mx-auto max-w-6xl px-4 py-14">
      <h1 className="font-display text-4xl font-bold text-navy">Educational Resources</h1>
      <p className="mt-2 max-w-2xl text-slate-600">
        Free resources to help you start improving your health, family life, skills and career today.
      </p>

      <div className="mt-10">
        {rows.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-mist p-16 text-center text-slate-500">
            Our free resource library is being prepared. Join the newsletter to be notified first.
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {rows.map((p) => (
              <BookCard key={p.id} pub={p} />
            ))}
          </div>
        )}
      </div>

      <div className="mt-16 rounded-3xl bg-mist p-10">
        <h2 className="font-display text-2xl font-bold text-navy">Get free guides by email</h2>
        <p className="mt-2 text-slate-600">New lead magnets and articles delivered as soon as they publish.</p>
        <div className="mt-5">
          <NewsletterForm />
        </div>
      </div>

      <div className="mt-12 rounded-3xl border border-gold/50 p-10 text-center">
        <h2 className="font-display text-2xl font-bold text-navy">Online Courses — Coming Soon</h2>
        <p className="mt-2 text-slate-600">Structured video learning built on our most requested topics.</p>
      </div>
    </div>
  );
}
