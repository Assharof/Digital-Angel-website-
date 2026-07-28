import { NextResponse } from "next/server";
import { desc } from "drizzle-orm";
import { db } from "@/db";
import { testimonials } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  return NextResponse.json(await db.select().from(testimonials).orderBy(desc(testimonials.createdAt)));
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const b = await req.json();
  if (!b?.name || !b?.quote) return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  const [row] = await db
    .insert(testimonials)
    .values({
      name: String(b.name),
      role: String(b.role ?? ""),
      quote: String(b.quote),
      rating: Number(b.rating ?? 5),
      published: b.published !== false,
    })
    .returning();
  return NextResponse.json(row, { status: 201 });
}
