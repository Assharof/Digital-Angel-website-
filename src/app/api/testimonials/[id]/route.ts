import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { testimonials } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, { params }: Ctx) {
  if (!(await getCurrentUser())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const b = await req.json();
  const patch: Record<string, unknown> = {};
  if (b.name !== undefined) patch.name = String(b.name);
  if (b.role !== undefined) patch.role = String(b.role);
  if (b.quote !== undefined) patch.quote = String(b.quote);
  if (b.rating !== undefined) patch.rating = Number(b.rating);
  if (b.published !== undefined) patch.published = !!b.published;
  const [row] = await db.update(testimonials).set(patch).where(eq(testimonials.id, Number(id))).returning();
  if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(row);
}

export async function DELETE(_req: Request, { params }: Ctx) {
  if (!(await getCurrentUser())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  await db.delete(testimonials).where(eq(testimonials.id, Number(id)));
  return NextResponse.json({ ok: true });
}
