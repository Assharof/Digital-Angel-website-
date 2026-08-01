"use client";

import { useEffect, useState } from "react";
import { BookCover, type Pub } from "@/components/book";
import { Card, EmptyState, PageHeader, Spinner, btnGhost, btnPrimary, inputCls } from "@/components/admin/ui";

type Row = Pub & {
  status: string;
  isFeatured: boolean;
  isBookOfMonth: boolean;
  isBestSeller: boolean;
  isNewRelease: boolean;
};

const CATEGORIES = [
  "Premium eBooks",
  "Health & Wellness Guides",
  "Parenting & Family Resources",
  "Personal Development Resources",
  "Digital Skills Guides",
  "Career Development Resources",
];

const blank = {
  title: "",
  subtitle: "",
  description: "",
  longDescription: "",
  category: CATEGORIES[0],
  price: "9.99",
  currency: "USD",
  coverColor: "#0b1f3a",
  coverImageUrl: "",
  tocImageUrl: "",
  spreadImageUrl: "",
  buyLink: "",
  sampleLink: "",
  status: "published",
  isFeatured: false,
  isBookOfMonth: false,
  isBestSeller: false,
  isNewRelease: true,
  isFree: false,
};

async function uploadImage(file: File): Promise<string> {
  const fd = new FormData();
  fd.append("file", file);
  const res = await fetch("/api/upload", { method: "POST", body: fd });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error ?? "Upload failed");
  }
  const data = await res.json();
  return data.url as string;
}

function ImageField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (url: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const url = await uploadImage(file);
      onChange(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold uppercase tracking-widest text-slate-500">{label}</span>
      <div className="flex items-center gap-3">
        {value ? (
          <img src={value} alt={label} className="h-20 w-16 rounded-lg object-cover shadow-sm" />
        ) : (
          <div className="grid h-20 w-16 place-items-center rounded-lg border border-dashed border-slate-300 text-[10px] text-slate-400">
            No image
          </div>
        )}
        <div className="flex-1">
          <input
            type="file"
            accept="image/*"
            onChange={handleFile}
            disabled={uploading}
            className="block w-full text-sm text-slate-600 file:mr-3 file:rounded-full file:border-0 file:bg-navy file:px-4 file:py-2 file:text-xs file:font-semibold file:text-white hover:file:bg-navy-light disabled:opacity-60"
          />
          {uploading && <p className="mt-1 text-xs text-slate-500">Uploading…</p>}
          {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
          {value && !uploading && (
            <button
              type="button"
              onClick={() => onChange("")}
              className="mt-1 text-xs text-slate-500 underline hover:text-red-600"
            >
              Remove image
            </button>
          )}
        </div>
      </div>
    </label>
  );
}

export default function PublicationsAdmin() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Row | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ ...blank });
  const [saving, setSaving] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    fetch("/api/publications")
      .then((r) => r.json())
      .then((d: Row[]) => setRows(d))
      .finally(() => setLoading(false));
  }, []);

  function openCreate() {
    setForm({ ...blank });
    setEditing(null);
    setCreating(true);
  }
  function openEdit(row: Row) {
    setForm({ ...blank, ...row, price: String(row.price) });
    setEditing(row);
    setCreating(true);
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    if (editing) {
      const prev = rows;
      setRows((r) => r.map((x) => (x.id === editing.id ? ({ ...x, ...form } as Row) : x)));
      const res = await fetch(`/api/publications/${editing.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) setRows(prev);
      else {
        const row = await res.json();
        setRows((r) => r.map((x) => (x.id === row.id ? row : x)));
      }
    } else {
      const res = await fetch("/api/publications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        const created = (await res.json()) as Row;
        setRows((r) => [created, ...r]);
      }
    }
    setSaving(false);
    setCreating(false);
    setEditing(null);
  }

  async function remove(row: Row) {
    if (!confirm(`Delete "${row.title}"?`)) return;
    const prev = rows;
    setRows((r) => r.filter((x) => x.id !== row.id));
    const res = await fetch(`/api/publications/${row.id}`, { method: "DELETE" });
    if (!res.ok) setRows(prev);
  }

  async function toggle(row: Row, key: keyof Row) {
    const value = !row[key];
    setRows((r) => r.map((x) => (x.id === row.id ? { ...x, [key]: value } : x)));
    await fetch(`/api/publications/${row.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [key]: value }),
    });
  }

  const filtered = rows.filter((r) => r.title.toLowerCase().includes(query.toLowerCase()));

  return (
    <div>
      <PageHeader
        title="Publications"
        subtitle="Create, edit and merchandise the Digital Angel library."
        action={
          <button onClick={openCreate} className={btnPrimary}>
            + New publication
          </button>
        }
      />

      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search publications…"
        className={`${inputCls} mt-6 max-w-sm`}
      />

      <div className="mt-6">
        {loading ? (
          <Spinner label="Loading publications…" />
        ) : filtered.length === 0 ? (
          <EmptyState title="No publications yet" hint="Add your first eBook to populate the website." />
        ) : (
          <div className="grid gap-4">
            {filtered.map((row) => (
              <Card key={row.id} className="flex flex-wrap items-center gap-6">
                <div className="scale-75 origin-left">
                  <BookCover pub={row} />
                </div>
                <div className="min-w-56 flex-1">
                  <p className="text-xs uppercase tracking-widest text-gold">{row.category}</p>
                  <h3 className="font-display text-lg font-bold text-navy">{row.title}</h3>
                  <p className="line-clamp-1 text-sm text-slate-500">{row.subtitle}</p>
                  <p className="mt-1 text-sm font-semibold text-navy">
                    {row.isFree ? "Free" : `${row.currency} ${Number(row.price).toFixed(2)}`} ·{" "}
                    <span className="text-slate-500">{row.status}</span>
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {(
                      [
                        ["isFeatured", "Featured"],
                        ["isBookOfMonth", "Book of Month"],
                        ["isBestSeller", "Best Seller"],
                        ["isNewRelease", "New Release"],
                        ["isFree", "Free"],
                      ] as [keyof Row, string][]
                    ).map(([key, label]) => (
                      <button
                        key={String(key)}
                        onClick={() => toggle(row, key)}
                        className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                          row[key] ? "border-gold bg-gold/20 text-navy" : "border-slate-300 text-slate-500"
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => openEdit(row)} className={btnGhost}>
                    Edit
                  </button>
                  <button
                    onClick={() => remove(row)}
                    className="rounded-xl border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                  >
                    Delete
                  </button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {creating && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
          <form
            onSubmit={save}
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-8"
          >
            <h2 className="font-display text-2xl font-bold text-navy">
              {editing ? "Edit publication" : "New publication"}
            </h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <Field label="Title">
                <input
                  required
                  className={inputCls}
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
              </Field>
              <Field label="Subtitle">
                <input
                  className={inputCls}
                  value={form.subtitle}
                  onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                />
              </Field>
              <Field label="Category">
                <select
                  className={inputCls}
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </Field>
              <Field label="Status">
                <select
                  className={inputCls}
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                >
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
              </Field>
              <Field label="Price">
                <input
                  className={inputCls}
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                />
              </Field>
              <Field label="Currency">
                <input
                  className={inputCls}
                  value={form.currency}
                  onChange={(e) => setForm({ ...form, currency: e.target.value })}
                />
              </Field>
              <Field label="Buy link (Selar)">
                <input
                  className={inputCls}
                  value={form.buyLink}
                  onChange={(e) => setForm({ ...form, buyLink: e.target.value })}
                />
              </Field>
              <Field label="Sample link">
                <input
                  className={inputCls}
                  value={form.sampleLink}
                  onChange={(e) => setForm({ ...form, sampleLink: e.target.value })}
                />
              </Field>
              <Field label="Cover colour (fallback if no cover image)">
                <input
                  type="color"
                  className="h-10 w-full rounded-xl border border-slate-300"
                  value={form.coverColor}
                  onChange={(e) => setForm({ ...form, coverColor: e.target.value })}
                />
              </Field>

              <div className="sm:col-span-2 grid gap-4 rounded-2xl bg-mist p-4 sm:grid-cols-3">
                <ImageField
                  label="Cover image"
                  value={form.coverImageUrl}
                  onChange={(url) => setForm({ ...form, coverImageUrl: url })}
                />
                <ImageField
                  label="Table of contents image"
                  value={form.tocImageUrl}
                  onChange={(url) => setForm({ ...form, tocImageUrl: url })}
                />
                <ImageField
                  label="Interior spread image"
                  value={form.spreadImageUrl}
                  onChange={(url) => setForm({ ...form, spreadImageUrl: url })}
                />
              </div>

              <div className="sm:col-span-2">
                <Field label="Description (short — shown on cards, 2-3 sentences max)">
                  <textarea
                    className={`${inputCls} min-h-24`}
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                  />
                </Field>
              </div>
              <div className="sm:col-span-2">
                <Field label="Long description (full sales page copy — shown on the book's own page only)">
                  <textarea
                    className={`${inputCls} min-h-48`}
                    value={form.longDescription}
                    onChange={(e) => setForm({ ...form, longDescription: e.target.value })}
                  />
                </Field>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-4 text-sm">
              {(
                [
                  ["isFeatured", "Featured"],
                  ["isBookOfMonth", "Book of the Month"],
                  ["isBestSeller", "Best Seller"],
                  ["isNewRelease", "New Release"],
                  ["isFree", "Free resource"],
                ] as [keyof typeof blank, string][]
              ).map(([key, label]) => (
                <label key={String(key)} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={Boolean(form[key])}
                    onChange={(e) => setForm({ ...form, [key]: e.target.checked })}
                  />
                  {label}
                </label>
              ))}
            </div>
            <div className="mt-8 flex justify-end gap-3">
              <button type="button" onClick={() => setCreating(false)} className={btnGhost}>
                Cancel
              </button>
              <button disabled={saving} className={btnPrimary}>
                {saving ? "Saving…" : "Save publication"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold uppercase tracking-widest text-slate-500">{label}</span>
      {children}
    </label>
  );
}