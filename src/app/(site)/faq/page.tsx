import type { Metadata } from "next";
import { asc } from "drizzle-orm";
import { db } from "@/db";
import { faqs } from "@/db/schema";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description: "Answers about Digital Angel eBooks, delivery, payments, refunds and support.",
};

export default async function FaqPage() {
  const rows = await db.select().from(faqs).orderBy(asc(faqs.sortOrder));
  return (
    <div className="mx-auto max-w-3xl px-4 py-14">
      <h1 className="font-display text-4xl font-bold text-navy">Frequently Asked Questions</h1>
      {rows.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-slate-300 bg-mist p-16 text-center text-slate-500">
          FAQs coming soon.
        </div>
      ) : (
        <div className="mt-8 divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white">
          {rows.map((f) => (
            <details key={f.id} className="group p-6">
              <summary className="cursor-pointer list-none font-display text-lg font-semibold text-navy">
                <span className="mr-2 text-gold group-open:hidden">+</span>
                <span className="mr-2 hidden text-gold group-open:inline">−</span>
                {f.question}
              </summary>
              <p className="mt-3 text-slate-600">{f.answer}</p>
            </details>
          ))}
        </div>
      )}
    </div>
  );
}
