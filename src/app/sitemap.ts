import type { MetadataRoute } from "next";
import { db } from "@/db";
import { publications } from "@/db/schema";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = "https://digitalangel.example.com";
  const statics = ["", "/about", "/publications", "/resources", "/testimonials", "/faq", "/contact"];
  let pubs: { slug: string }[] = [];
  try {
    pubs = await db.select({ slug: publications.slug }).from(publications);
  } catch {
    pubs = [];
  }
  return [
    ...statics.map((p) => ({ url: `${base}${p}`, lastModified: new Date() })),
    ...pubs.map((p) => ({ url: `${base}/publications/${p.slug}`, lastModified: new Date() })),
  ];
}
