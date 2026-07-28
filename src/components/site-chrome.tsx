"use client";

import Link from "next/link";
import { useState } from "react";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/publications", label: "Our Publications" },
  { href: "/resources", label: "Free Resources" },
  { href: "/testimonials", label: "Testimonials" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-navy text-gold-light">✦</span>
          <span className="font-display text-xl font-bold text-navy">Digital Angel</span>
        </Link>
        <nav className="hidden items-center gap-6 lg:flex">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="text-sm font-medium text-slate-600 hover:text-navy">
              {n.label}
            </Link>
          ))}
          <Link
            href="/publications"
            className="rounded-full bg-navy px-4 py-2 text-sm font-semibold text-white hover:bg-navy-light"
          >
            Browse Books
          </Link>
        </nav>
        <button
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
          className="rounded-lg border border-slate-300 px-3 py-2 text-navy lg:hidden"
        >
          ☰
        </button>
      </div>
      {open && (
        <div className="border-t border-slate-200 bg-white px-4 py-3 lg:hidden">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              onClick={() => setOpen(false)}
              className="block rounded-lg px-2 py-2 text-sm font-medium text-slate-700 hover:bg-mist"
            >
              {n.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-24 bg-navy text-slate-200">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-4">
        <div>
          <p className="font-display text-2xl font-bold text-white">Digital Angel</p>
          <p className="mt-2 text-sm text-gold-light">Where Knowledge Creates Freedom.</p>
          <p className="mt-4 text-sm text-slate-300">
            Practical knowledge readers can trust and use to improve their lives.
          </p>
        </div>
        <div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-gold">Explore</p>
          {NAV.slice(1).map((n) => (
            <Link key={n.href} href={n.href} className="block py-1 text-sm text-slate-300 hover:text-white">
              {n.label}
            </Link>
          ))}
          <span className="block py-1 text-sm text-slate-500">Blog (Coming Soon)</span>
        </div>
        <div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-gold">Contact</p>
          <p className="py-1 text-sm text-slate-300">angelblissangel27@gmail.com</p>
          <p className="py-1 text-sm text-slate-300">+237 640 187 577</p>
          <a
            className="py-1 text-sm text-slate-300 hover:text-white"
            href="https://facebook.com"
            target="_blank"
            rel="noreferrer"
          >
            Facebook
          </a>
        </div>
        <div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-gold">Admin</p>
          <Link href="/login" className="block py-1 text-sm text-slate-300 hover:text-white">
            Team Login
          </Link>
          <Link href="/admin" className="block py-1 text-sm text-slate-300 hover:text-white">
            Dashboard
          </Link>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-slate-400">
        © {new Date().getFullYear()} Digital Angel. All rights reserved.
      </div>
    </footer>
  );
}

export function WhatsAppFloat() {
  return (
    <a
      href="https://wa.me/237640187577"
      target="_blank"
      rel="noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-3 font-semibold text-white shadow-lg transition hover:scale-105"
    >
      <span className="text-lg">💬</span>
      <span className="hidden sm:inline">WhatsApp</span>
    </a>
  );
}
