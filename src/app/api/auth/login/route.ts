import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";
import { createSession, verifyPassword } from "@/lib/auth";

export async function POST(req: Request) {
  const { email, password } = await req.json();
  const rows = await db
    .select()
    .from(users)
    .where(eq(users.email, String(email ?? "").toLowerCase()))
    .limit(1);
  const user = rows[0];
  if (!user || !verifyPassword(String(password ?? ""), user.passwordHash)) {
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
  }
  await createSession(user.id);
  return NextResponse.json({ ok: true });
}
