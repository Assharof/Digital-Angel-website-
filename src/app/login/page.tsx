"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@digitalangel.com");
  const [password, setPassword] = useState("angel1234");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (res.ok) {
      router.push("/admin");
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Login failed");
      setLoading(false);
    }
  }

  return (
    <div className="grid min-h-screen place-items-center bg-navy px-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl">
        <Link href="/" className="font-display text-2xl font-bold text-navy">
          ✦ Digital Angel
        </Link>
        <h1 className="mt-6 font-display text-2xl font-bold text-navy">Team Login</h1>
        <p className="mt-1 text-sm text-slate-500">Manage publications, testimonials and readers.</p>
        <form onSubmit={submit} className="mt-6 space-y-4">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-navy"
            placeholder="Email"
          />
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-navy"
            placeholder="Password"
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            disabled={loading}
            className="w-full rounded-xl bg-navy py-3 font-semibold text-white hover:bg-navy-light disabled:opacity-60"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
        
      </div>
    </div>
  );
}
