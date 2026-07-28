"use client";

import { useEffect, useState } from "react";
import { Card, EmptyState, PageHeader, Spinner, btnGhost, btnPrimary, inputCls } from "@/components/admin/ui";

type T = {
  id: number;
  name: string;
  role: string;
  quote: string;
  rating: number;
  published: boolean;
};

export default function TestimonialsAdmin() {
  const [rows, setRows] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: "", role: "", quote: "", rating: 5 });
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/testimonials")
      .then((r) => r.json())
      .then(setRows)
      .finally(() => setLoading(false));
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    if (editingId) {
      setRows((r) => r.map((x) => (x.id === editingId ? { ...x, ...form } : x)));
      await fetch(`/api/testimonials/${editingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setEditingId(null);
    } else {
      const res = await fetch("/api/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        const created = (await res.json()) as T;
        setRows((r) => [created, ...r]);
      }
    }
    setForm({ name: "", role: "", quote: "", rating: 5 });
    setSaving(false);
  }

  async function togglePublish(row: T) {
    const value = !row.published;
    setRows((r) => r.map((x) => (x.id === row.id ? { ...x, published: value } : x)));
    await fetch(`/api/testimonials/${row.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: value }),
    });
  }

  async function remove(row: T) {
    const prev = rows;
    setRows((r) => r.filter((x) => x.id !== row.id));
    const res = await fetch(`/api/testimonials/${row.id}`, { method: "DELETE" });
    if (!res.ok) setRows(prev);
  }

  return (
    <div>
      <PageHeader title="Testimonials" subtitle="Curate the reader voices shown across the site." />

      <Card className="mt-6">
        <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
          <input
            required
            className={inputCls}
            placeholder="Reader name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            className={inputCls}
            placeholder="Role / location"
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
          />
          <div className="sm:col-span-2">
            <textarea
              required
              className={`${inputCls} min-h-24`}
              placeholder="Quote"
              value={form.quote}
              onChange={(e) => setForm({ ...form, quote: e.target.value })}
            />
          </div>
          <select
            className={inputCls}
            value={form.rating}
            onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}
          >
            {[5, 4, 3, 2, 1].map((n) => (
              <option key={n} value={n}>
                {n} stars
              </option>
            ))}
          </select>
          <div className="flex gap-3">
            <button disabled={saving} className={btnPrimary}>
              {saving ? "Saving…" : editingId ? "Update" : "Add testimonial"}
            </button>
            {editingId && (
              <button
                type="button"
                className={btnGhost}
                onClick={() => {
                  setEditingId(null);
                  setForm({ name: "", role: "", quote: "", rating: 5 });
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </Card>

      <div className="mt-6 grid gap-4">
        {loading ? (
          <Spinner />
        ) : rows.length === 0 ? (
          <EmptyState title="No testimonials yet" hint="Add the first reader story above." />
        ) : (
          rows.map((t) => (
            <Card key={t.id} className="flex flex-wrap items-start justify-between gap-4">
              <div className="max-w-xl">
                <p className="text-gold">{"★".repeat(t.rating)}</p>
                <p className="mt-1 text-slate-700">“{t.quote}”</p>
                <p className="mt-2 text-sm font-semibold text-navy">
                  {t.name} <span className="font-normal text-slate-500">· {t.role}</span>
                </p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => togglePublish(t)} className={btnGhost}>
                  {t.published ? "Unpublish" : "Publish"}
                </button>
                <button
                  onClick={() => {
                    setEditingId(t.id);
                    setForm({ name: t.name, role: t.role, quote: t.quote, rating: t.rating });
                  }}
                  className={btnGhost}
                >
                  Edit
                </button>
                <button
                  onClick={() => remove(t)}
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
