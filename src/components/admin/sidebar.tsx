"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

const LINKS = [
  { href: "/admin", label: "Dashboard", icon: "📊" },
  { href: "/admin/publications", label: "Publications", icon: "📚" },
  { href: "/admin/testimonials", label: "Testimonials", icon: "⭐" },
  { href: "/admin/faqs", label: "FAQs", icon: "❓" },
  { href: "/admin/subscribers", label: "Subscribers", icon: "✉️" },
  { href: "/admin/messages", label: "Messages", icon: "💬" },
];

export function AdminSidebar({ userName }: { userName: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  const nav = (
    <nav className="flex h-full flex-col gap-1 p-4">
      <Link href="/" className="mb-6 flex items-center gap-2 px-2">
        <span className="grid h-9 w-9 place-items-center rounded-full bg-gold text-navy">✦</span>
        <span className="font-display text-lg font-bold text-white">Digital Angel</span>
      </Link>
      {LINKS.map((l) => {
        const active = pathname === l.href;
        return (
          <Link
            key={l.href}
            href={l.href}
            onClick={() => setOpen(false)}
            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
              active ? "bg-gold text-navy" : "text-slate-300 hover:bg-white/10 hover:text-white"
            }`}
          >
            <span>{l.icon}</span>
            {l.label}
          </Link>
        );
      })}
      <div className="mt-auto border-t border-white/10 pt-4">
        <p className="px-3 text-xs uppercase tracking-widest text-slate-400">Signed in</p>
        <p className="px-3 text-sm font-medium text-white">{userName}</p>
        <button
          onClick={logout}
          className="mt-3 w-full rounded-xl border border-white/20 px-3 py-2 text-sm text-slate-200 hover:bg-white/10"
        >
          Sign out
        </button>
      </div>
    </nav>
  );

  return (
    <>
      <aside className="fixed inset-y-0 left-0 hidden w-64 bg-navy lg:block">{nav}</aside>
      <div className="fixed inset-x-0 top-0 z-40 flex items-center justify-between bg-navy px-4 py-3 lg:hidden">
        <span className="font-display font-bold text-white">Digital Angel Admin</span>
        <button onClick={() => setOpen((v) => !v)} className="rounded-lg border border-white/30 px-3 py-1 text-white">
          ☰
        </button>
      </div>
      {open && <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-navy lg:hidden">{nav}</aside>}
      <div className="h-12 lg:hidden" />
    </>
  );
}
