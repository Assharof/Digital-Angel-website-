import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { publications } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, { params }: Ctx) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const b = await req.json();
  const patch: Record<string, unknown> = {};
  for (const key of [
    "title",
    "subtitle",
    "description",
    "longDescription",
    "authorName",
    "category",
    "currency",
    "coverColor",
    "coverImageUrl",
    "tocImageUrl",
    "spreadImageUrl",
    "bonuses",
    "buyLink",
    "sampleLink",
    "status",
  ]) {
    if (b[key] !== undefined) patch[key] = String(b[key]);
  }
  if (b.price !== undefined) patch.price = String(b.price);
  for (const key of ["isFeatured", "isBookOfMonth", "isBestSeller", "isNewRelease", "isFree"]) {
    if (b[key] !== undefined) patch[key] = !!b[key];
  }
  const [row] = await db
    .update(publications)
    .set(patch)
    .where(eq(publications.id, Number(id)))
    .returning();
  if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(row);
}

export async function DELETE(_req: Request, { params }: Ctx) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  await db.delete(publications).where(eq(publications.id, Number(id)));
  return NextResponse.json({ ok: true });
}