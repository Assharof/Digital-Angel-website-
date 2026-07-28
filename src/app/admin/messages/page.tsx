"use client";

import { useEffect, useState } from "react";
import { Card, EmptyState, PageHeader, Spinner, btnGhost } from "@/components/admin/ui";

type M = {
  id: number;
  name: string;
  email: string;
  subject: string;
  body: string;
  handled: boolean;
  createdAt: string;
};

export default function MessagesAdmin() {
  const [rows, setRows] = useState<M[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "open">("all");

  useEffect(() => {
    fetch("/api/messages")
      .then((r) => r.json())
      .then(setRows)
      .finally(() => setLoading(false));
  }, []);

  async function toggle(row: M) {
    const value = !row.handled;
    setRows((r) => r.map((x) => (x.id === row.id ? { ...x, handled: value } : x)));
    await fetch(`/api/messages/${row.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ handled: value }),
    });
  }

  async function remove(row: M) {
    const prev = rows;
    setRows((r) => r.filter((x) => x.id !== row.id));
    const res = await fetch(`/api/messages/${row.id}`, { method: "DELETE" });
    if (!res.ok) setRows(prev);
  }

  const list = filter === "open" ? rows.filter((r) => !r.handled) : rows;

  return (
    <div>
      <PageHeader
        title="Inbox"
        subtitle="Contact form submissions from the website."
        action={
          <div className="flex gap-2">
            <button onClick={() => setFilter("all")} className={filter === "all" ? "rounded-xl bg-navy px-4 py-2 text-sm text-white" : btnGhost}>
              All
            </button>
            <button onClick={() => setFilter("open")} className={filter === "open" ? "rounded-xl bg-navy px-4 py-2 text-sm text-white" : btnGhost}>
              Unhandled
            </button>
          </div>
        }
      />
      <div className="mt-6 grid gap-4">
        {loading ? (
          <Spinner />
        ) : list.length === 0 ? (
          <EmptyState title="Inbox zero" hint="New enquiries will appear here." />
        ) : (
          list.map((m) => (
            <Card key={m.id}>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="font-display text-lg font-bold text-navy">{m.subject || "(no subject)"}</p>
                  <p className="text-sm text-slate-500">
                    {m.name} · {m.email} · {new Date(m.createdAt).toLocaleString()}
                  </p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    m.handled ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {m.handled ? "Handled" : "Open"}
                </span>
              </div>
              <p className="mt-3 whitespace-pre-line text-slate-700">{m.body}</p>
              <div className="mt-4 flex gap-2">
                <a href={`mailto:${m.email}`} className={btnGhost}>
                  Reply by email
                </a>
                <button onClick={() => toggle(m)} className={btnGhost}>
                  Mark as {m.handled ? "open" : "handled"}
                </button>
                <button
                  onClick={() => remove(m)}
                  className="rounded-xl border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                >
                  Delete
                </button>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
