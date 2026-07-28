import { NextResponse } from "next/server";
import { db } from "@/db";
import { subscribers } from "@/db/schema";

export async function POST(req: Request) {
  const { email } = await req.json();
  if (typeof email !== "string" || !email.includes("@")) {
    return NextResponse.json({ error: "Valid email required" }, { status: 400 });
  }
  await db.insert(subscribers).values({ email: email.toLowerCase() }).onConflictDoNothing();
  return NextResponse.json({ ok: true });
}
