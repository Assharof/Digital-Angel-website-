import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required");
}

const globalForDb = globalThis as typeof globalThis & {
  __arenaNextJsPostgresqlPool?: Pool;
};

export const pool =
  globalForDb.__arenaNextJsPostgresqlPool ??
  new Pool({
    connectionString: databaseUrl,
    // Hard cap on how many simultaneous connections THIS app instance can
    // open. Supabase's Session Pooler allows 15 total across everything
    // connected to the project — keeping this well under that (even in
    // production, even with multiple server instances) leaves headroom for
    // migrations, other tools, etc. instead of one app instance eating the
    // whole budget.
    max: 5,
    // Close connections that have been idle this long instead of holding
    // them open forever. Prevents leaked/unused connections from
    // accumulating over time (e.g. across hot-reloads, or after traffic
    // spikes die down).
    idleTimeoutMillis: 30_000,
    // Fail fast instead of hanging if the pool can't get a connection —
    // surfaces problems immediately rather than a slow silent hang.
    // Bumped from 10s to 20s to tolerate a slower/less stable network path
    // to the pooler region without spuriously timing out.
    connectionTimeoutMillis: 20_000,
    // Send TCP keepalive packets on idle connections so routers/firewalls/
    // load balancers along the path don't silently drop them without either
    // side knowing — this is the usual cause of "Connection terminated
    // unexpectedly" errors on a connection that looked fine moments earlier.
    keepAlive: true,
    keepAliveInitialDelayMillis: 10_000,
  });

// Without this handler, an error on an idle client in the pool (e.g. the
// server or network killing a connection while it sits unused) becomes an
// unhandled 'error' event and can crash the whole Node process. Logging it
// here lets pg quietly remove the bad connection and open a fresh one on
// the next query instead.
pool.on("error", (err) => {
  console.error("Unexpected error on idle database client", err);
});

if (process.env.NODE_ENV !== "production") {
  globalForDb.__arenaNextJsPostgresqlPool = pool;
}

export const db = drizzle(pool);