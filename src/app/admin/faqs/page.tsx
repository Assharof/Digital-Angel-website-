"use client";

import { useEffect, useState } from "react";
import { Card, EmptyState, PageHeader, Spinner, btnGhost, btnPrimary, inputCls } from "@/components/admin/ui";

type F = { id: number; question: string; answer: string; sortOrder: number };

export default function FaqsAdmin() {
  const [rows, setRows] = useState<F[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ question: "", answer: "", sortOrder: 0 });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/faqs")
      .then((r) => r.json())
      .then(setRows)
      .finally(() => setLoading(false));
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    if (editingId) {
      setRows((r) => r.map((x) => (x.id === editingId ? { ...x, ...form } : x)));
      await fetch(`/api/faqs/${editingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setEditingId(null);
    } else {
      const res = await fetch("/api/faqs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        const created = (await res.json()) as F;
        setRows((r) => [...r, created].sort((a, b) => a.sortOrder - b.sortOrder));
      }
    }
    setForm({ question: "", answer: "", sortOrder: 0 });
    setSaving(false);
  }

  async function remove(row: F) {
    const prev = rows;
    setRows((r) => r.filter((x) => x.id !== row.id));
    const res = await fetch(`/api/faqs/${row.id}`, { method: "DELETE" });
    if (!res.ok) setRows(prev);
  }

  return (
    <div>
      <PageHeader title="FAQs" subtitle="Answer the questions readers ask most." />
      <Card className="mt-6">
        <form onSubmit={submit} className="grid gap-4">
          <input
            required
            className={inputCls}
            placeholder="Question"
            value={form.question}
            onChange={(e) => setForm({ ...form, question: e.target.value })}
          />
          <textarea
            required
            className={`${inputCls} min-h-24`}
            placeholder="Answer"
            value={form.answer}
            onChange={(e) => setForm({ ...form, answer: e.target.value })}
          />
          <div className="flex flex-wrap items-center gap-3">
            <input
              type="number"
              className={`${inputCls} w-32`}
              value={form.sortOrder}
              onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })}
              placeholder="Order"
            />
            <button disabled={saving} className={btnPrimary}>
              {saving ? "Saving…" : editingId ? "Update FAQ" : "Add FAQ"}
            </button>
            {editingId && (
              <button
                type="button"
                className={btnGhost}
                onClick={() => {
                  setEditingId(null);
                  setForm({ question: "", answer: "", sortOrder: 0 });
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
          <EmptyState title="No FAQs yet" hint="Add your first question above." />
        ) : (
          rows.map((f) => (
            <Card key={f.id} className="flex flex-wrap items-start justify-between gap-4">
              <div className="max-w-2xl">
                <p className="font-display text-lg font-semibold text-navy">{f.question}</p>
                <p className="mt-1 text-sm text-slate-600">{f.answer}</p>
              </div>
              <div className="flex gap-2">
                <button
                  className={btnGhost}
                  onClick={() => {
                    setEditingId(f.id);
                    setForm({ question: f.question, answer: f.answer, sortOrder: f.sortOrder });
                  }}
                >
                  Edit
                </button>
                <button
                  onClick={() => remove(f)}
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
