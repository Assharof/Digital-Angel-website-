import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { faqs } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, { params }: Ctx) {
  if (!(await getCurrentUser())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const b = await req.json();
  const patch: Record<string, unknown> = {};
  if (b.question !== undefined) patch.question = String(b.question);
  if (b.answer !== undefined) patch.answer = String(b.answer);
  if (b.sortOrder !== undefined) patch.sortOrder = Number(b.sortOrder);
  const [row] = await db.update(faqs).set(patch).where(eq(faqs.id, Number(id))).returning();
  if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(row);
}

export async function DELETE(_req: Request, { params }: Ctx) {
  if (!(await getCurrentUser())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  await db.delete(faqs).where(eq(faqs.id, Number(id)));
  return NextResponse.json({ ok: true });
}
