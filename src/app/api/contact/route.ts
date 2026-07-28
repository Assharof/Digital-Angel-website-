import { NextResponse } from "next/server";
import { db } from "@/db";
import { messages } from "@/db/schema";

export async function POST(req: Request) {
  const body = await req.json();
  if (!body?.name || !body?.email || !body?.body) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }
  await db.insert(messages).values({
    name: String(body.name),
    email: String(body.email),
    subject: String(body.subject ?? ""),
    body: String(body.body),
  });
  return NextResponse.json({ ok: true });
}
