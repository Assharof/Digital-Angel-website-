import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Digital Angel",
  description:
    "Digital Angel is a digital publishing brand building trusted educational resources that create lasting value through practical education.",
};

const VALUES = [
  { t: "Mission", d: "To build a trusted digital publishing brand that creates lasting value through practical education and meaningful content." },
  { t: "Brand Promise", d: "Every Digital Angel publication delivers practical knowledge readers can trust and use to improve their lives." },
  { t: "Our Difference", d: "We turn complex topics into simple, practical knowledge anyone can understand and use." },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <p className="text-xs uppercase tracking-[0.25em] text-gold">About</p>
      <h1 className="mt-2 font-display text-4xl font-bold text-navy">Where Knowledge Creates Freedom.</h1>
      <p className="mt-6 text-lg leading-relaxed text-slate-700">
        Digital Angel is a digital publishing brand committed to delivering practical knowledge that helps people live
        healthier, wiser, and more successful lives through carefully crafted eBooks and educational resources.
      </p>
      <div className="mt-10 grid gap-6 sm:grid-cols-3">
        {VALUES.map((v) => (
          <div key={v.t} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="font-display text-lg font-bold text-navy">{v.t}</h2>
            <p className="mt-2 text-sm text-slate-600">{v.d}</p>
          </div>
        ))}
      </div>

      <h2 className="mt-14 font-display text-2xl font-bold text-navy">Who we serve</h2>
      <p className="mt-3 text-slate-700">
        People seeking clear, practical solutions in health, parenting, personal development, digital skills, careers
        and everyday life. Our goal is simple: help readers overcome everyday challenges through trusted educational
        resources.
      </p>

      <h2 className="mt-12 font-display text-2xl font-bold text-navy">Where we&apos;re going</h2>
      <p className="mt-3 text-slate-700">
        We are expanding the publication library, launching online courses, adding reader testimonials, creating author
        videos and publishing weekly articles — evolving Digital Angel into a globally recognised educational publishing
        brand.
      </p>

      <Link
        href="/publications"
        className="mt-10 inline-block rounded-full bg-navy px-7 py-3 font-semibold text-white hover:bg-navy-light"
      >
        Explore our publications
      </Link>
    </div>
  );
}
