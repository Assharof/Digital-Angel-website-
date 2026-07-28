import Link from "next/link";
import { desc, sql } from "drizzle-orm";
import { db } from "@/db";
import { faqs, messages, publications, subscribers, testimonials } from "@/db/schema";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [pubs, subs, msgs, tests, faqRows] = await Promise.all([
    db.select().from(publications).orderBy(desc(publications.createdAt)),
    db.select({ c: sql<number>`count(*)::int` }).from(subscribers),
    db.select().from(messages).orderBy(desc(messages.createdAt)).limit(5),
    db.select({ c: sql<number>`count(*)::int` }).from(testimonials),
    db.select({ c: sql<number>`count(*)::int` }).from(faqs),
  ]);

  const stats = [
    { label: "Publications", value: pubs.length, href: "/admin/publications", icon: "📚" },
    { label: "Subscribers", value: subs[0]?.c ?? 0, href: "/admin/subscribers", icon: "✉️" },
    { label: "Testimonials", value: tests[0]?.c ?? 0, href: "/admin/testimonials", icon: "⭐" },
    { label: "FAQs", value: faqRows[0]?.c ?? 0, href: "/admin/faqs", icon: "❓" },
  ];

  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-navy">Dashboard</h1>
      <p className="mt-1 text-slate-500">Overview of the Digital Angel publishing operation.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <span className="text-2xl">{s.icon}</span>
            <p className="mt-3 text-3xl font-bold text-navy">{s.value}</p>
            <p className="text-sm text-slate-500">{s.label}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="font-display text-lg font-bold text-navy">Recent publications</h2>
          {pubs.length === 0 ? (
            <p className="mt-6 text-sm text-slate-500">No publications yet.</p>
          ) : (
            <ul className="mt-4 divide-y divide-slate-100">
              {pubs.slice(0, 5).map((p) => (
                <li key={p.id} className="flex items-center justify-between py-3">
                  <span className="truncate text-sm font-medium text-slate-700">{p.title}</span>
                  <span className="rounded-full bg-mist px-3 py-1 text-xs text-slate-500">{p.category}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="font-display text-lg font-bold text-navy">Latest messages</h2>
          {msgs.length === 0 ? (
            <p className="mt-6 text-sm text-slate-500">Inbox is empty.</p>
          ) : (
            <ul className="mt-4 divide-y divide-slate-100">
              {msgs.map((m) => (
                <li key={m.id} className="py-3">
                  <p className="text-sm font-medium text-slate-700">
                    {m.name} <span className="text-slate-400">· {m.email}</span>
                  </p>
                  <p className="truncate text-sm text-slate-500">{m.subject || m.body}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
