import { NextResponse } from "next/server";
import { asc } from "drizzle-orm";
import { db } from "@/db";
import { faqs } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  return NextResponse.json(await db.select().from(faqs).orderBy(asc(faqs.sortOrder)));
}

export async function POST(req: Request) {
  if (!(await getCurrentUser())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const b = await req.json();
  if (!b?.question || !b?.answer) return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  const [row] = await db
    .insert(faqs)
    .values({
      question: String(b.question),
      answer: String(b.answer),
      sortOrder: Number(b.sortOrder ?? 0),
    })
    .returning();
  return NextResponse.json(row, { status: 201 });
}
