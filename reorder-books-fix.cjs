// reorder-books-fix.cjs
// Correctly orders: Old Midwife's Tearing Secret (first) > Love After Baby (middle)
// > The Husband's Postpartum Handbook (last), by setting timestamps relative to
// Love After Baby's actual created_at instead of guessing a fixed offset.

const { Client } = require("pg");
require("dotenv").config();

(async () => {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();

  // Old Midwife = newest (shows first)
  await client.query(
    `update publications set created_at = now() where slug = 'the-old-midwife-s-tearing-secret'`
  );

  // Husband's = older than Love After Baby's actual timestamp (shows last)
  await client.query(
    `update publications
     set created_at = (select created_at from publications where slug = 'love-after-baby') - interval '1 hour'
     where slug = 'the-husband-s-postpartum-handbook'`
  );

  const { rows } = await client.query(
    `select title, created_at from publications order by created_at desc`
  );
  console.log("New order (top to bottom):");
  rows.forEach((r, i) => console.log(`${i + 1}. ${r.title} — ${r.created_at.toISOString()}`));

  await client.end();
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
