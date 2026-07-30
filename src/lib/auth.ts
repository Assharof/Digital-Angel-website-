import { randomBytes, scryptSync, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { and, eq, gt } from "drizzle-orm";
import { db } from "@/db";
import { sessions, users } from "@/db/schema";

export const SESSION_COOKIE = "da_session";

// Idle timeout: a session is valid only if sessions.expiresAt is in the future.
// Every successful getCurrentUser() call (i.e. every admin page load) pushes
// that DB expiry forward, so staying active keeps you logged in — going idle
// this long logs you out automatically. The browser cookie itself carries no
// expiry logic of its own (it's a plain session cookie) — all real enforcement
// happens against the database, which can be updated during render (unlike
// cookies, which can only be set in a Server Action or Route Handler).
const IDLE_TIMEOUT_MS = 1000 * 60 * 5; // 5 minutes

export function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string) {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const candidate = scryptSync(password, salt, 64);
  const original = Buffer.from(hash, "hex");
  if (candidate.length !== original.length) return false;
  return timingSafeEqual(candidate, original);
}

export async function createSession(userId: number) {
  const id = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + IDLE_TIMEOUT_MS);
  await db.insert(sessions).values({ id, userId, expiresAt });
  const store = await cookies();
  // No `expires` set on the cookie itself — it's a browser session cookie
  // (cleared when the browser fully closes). Real timeout enforcement is
  // entirely server-side via sessions.expiresAt, refreshed in getCurrentUser.
  store.set(SESSION_COOKIE, id, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });
}

export async function destroySession() {
  const store = await cookies();
  const id = store.get(SESSION_COOKIE)?.value;
  if (id) await db.delete(sessions).where(eq(sessions.id, id));
  store.delete(SESSION_COOKIE);
}

export async function getCurrentUser() {
  const store = await cookies();
  const id = store.get(SESSION_COOKIE)?.value;
  if (!id) return null;
  const rows = await db
    .select({ id: users.id, email: users.email, name: users.name })
    .from(sessions)
    .innerJoin(users, eq(users.id, sessions.userId))
    .where(and(eq(sessions.id, id), gt(sessions.expiresAt, new Date())))
    .limit(1);

  const user = rows[0] ?? null;

  // Sliding expiry: push the DB row's expiry forward on every valid check.
  // This is a plain database write — safe to run during page render, unlike
  // cookie mutation, which Next.js only allows in Server Actions/Route Handlers.
  if (user) {
    const newExpiresAt = new Date(Date.now() + IDLE_TIMEOUT_MS);
    await db.update(sessions).set({ expiresAt: newExpiresAt }).where(eq(sessions.id, id));
  }

  return user;
}