import { NextResponse } from "next/server";
import { desc } from "drizzle-orm";
import { db } from "@/db";
import { publications } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 200);
}

export async function GET() {
  const rows = await db.select().from(publications).orderBy(desc(publications.createdAt));
  return NextResponse.json(rows);
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const b = await req.json();
  if (!b?.title) return NextResponse.json({ error: "Title required" }, { status: 400 });
  const slug = `${slugify(String(b.title))}-${Math.random().toString(36).slice(2, 6)}`;
  const [row] = await db
    .insert(publications)
    .values({
      title: String(b.title),
      slug,
      subtitle: String(b.subtitle ?? ""),
      description: String(b.description ?? ""),
      longDescription: String(b.longDescription ?? ""),
      authorName: String(b.authorName ?? ""),
      category: String(b.category ?? "Premium eBooks"),
      price: String(b.price ?? "0"),
      currency: String(b.currency ?? "USD"),
      coverColor: String(b.coverColor ?? "#0b1f3a"),
      coverImageUrl: String(b.coverImageUrl ?? ""),
      tocImageUrl: String(b.tocImageUrl ?? ""),
      spreadImageUrl: String(b.spreadImageUrl ?? ""),
      bonuses: String(b.bonuses ?? "[]"),
      buyLink: String(b.buyLink ?? ""),
      sampleLink: String(b.sampleLink ?? ""),
      status: String(b.status ?? "published"),
      isFeatured: !!b.isFeatured,
      isBookOfMonth: !!b.isBookOfMonth,
      isBestSeller: !!b.isBestSeller,
      isNewRelease: !!b.isNewRelease,
      isFree: !!b.isFree,
    })
    .returning();
  return NextResponse.json(row, { status: 201 });
}