import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { messages } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, { params }: Ctx) {
  if (!(await getCurrentUser())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const b = await req.json();
  const [row] = await db
    .update(messages)
    .set({ handled: !!b.handled })
    .where(eq(messages.id, Number(id)))
    .returning();
  return NextResponse.json(row ?? {});
}

export async function DELETE(_req: Request, { params }: Ctx) {
  if (!(await getCurrentUser())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  await db.delete(messages).where(eq(messages.id, Number(id)));
  return NextResponse.json({ ok: true });
}
