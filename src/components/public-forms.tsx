"use client";

import { useState } from "react";

export function NewsletterForm({ dark = false }: { dark?: boolean }) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState("loading");
    const res = await fetch("/api/newsletter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    setState(res.ok ? "done" : "error");
    if (res.ok) setEmail("");
  }

  if (state === "done")
    return (
      <p className={dark ? "text-gold-light" : "text-emerald-700"}>
        ✅ You&apos;re on the list. Watch your inbox for free resources.
      </p>
    );

  return (
    <form onSubmit={submit} className="flex w-full max-w-md flex-col gap-3 sm:flex-row">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
        aria-label="Email address"
        className="flex-1 rounded-full border border-slate-300 bg-white px-5 py-3 text-sm text-slate-800 outline-none focus:border-gold"
      />
      <button
        disabled={state === "loading"}
        className="rounded-full bg-gold px-6 py-3 text-sm font-semibold text-navy transition hover:bg-gold-light disabled:opacity-60"
      >
        {state === "loading" ? "Joining…" : "Join Free"}
      </button>
    </form>
  );
}

export function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", body: "" });
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState("loading");
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setState("done");
      setForm({ name: "", email: "", subject: "", body: "" });
    } else setState("error");
  }

  const input =
    "w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-navy";

  return (
    <form onSubmit={submit} className="space-y-4">
      <input
        className={input}
        required
        placeholder="Your name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />
      <input
        className={input}
        required
        type="email"
        placeholder="Your email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />
      <input
        className={input}
        placeholder="Subject"
        value={form.subject}
        onChange={(e) => setForm({ ...form, subject: e.target.value })}
      />
      <textarea
        className={`${input} min-h-32`}
        required
        placeholder="How can we help?"
        value={form.body}
        onChange={(e) => setForm({ ...form, body: e.target.value })}
      />
      <button
        disabled={state === "loading"}
        className="rounded-full bg-navy px-7 py-3 text-sm font-semibold text-white hover:bg-navy-light disabled:opacity-60"
      >
        {state === "loading" ? "Sending…" : "Send Message"}
      </button>
      {state === "done" && <p className="text-emerald-700">✅ Message received. We reply within 24 hours.</p>}
      {state === "error" && <p className="text-red-600">Something went wrong. Please try again.</p>}
    </form>
  );
}

export function SmartSearch({ initial = "" }: { initial?: string }) {
  const [q, setQ] = useState(initial);
  return (
    <form action="/publications" className="flex w-full max-w-xl gap-2">
      <input
        name="q"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search publications, topics, categories…"
        aria-label="Search publications"
        className="flex-1 rounded-full border border-slate-300 px-5 py-3 text-sm outline-none focus:border-gold"
      />
      <button className="rounded-full bg-navy px-6 py-3 text-sm font-semibold text-white">Search</button>
    </form>
  );
}
