// fix-bad-slugs.cjs
// Finds publications whose slug looks broken (contains a domain-like string
// such as "selar" or ".com" instead of being derived from the title) and
// regenerates a correct slug from their actual title.
//
// Usage: node fix-bad-slugs.cjs

const { Client } = require("pg");
require("dotenv").config();

function slugify(s) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 200);
}

(async () => {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();

  const { rows } = await client.query(`select id, title, slug from publications`);

  console.log("Current publications:");
  rows.forEach((r) => console.log(`  [${r.id}] "${r.title}" -> slug: ${r.slug}`));

  const suspicious = rows.filter(
    (r) => /\.(com|net|org|co)\b/i.test(r.slug) || r.slug.includes("selar") || r.slug.includes("facebook")
  );

  if (suspicious.length === 0) {
    console.log("\nNo suspicious slugs found. If the bad one isn't listed above, tell me its title and I'll target it directly.");
    await client.end();
    return;
  }

  console.log(`\nFixing ${suspicious.length} row(s)...`);
  for (const r of suspicious) {
    const newSlug = `${slugify(r.title)}-${Math.random().toString(36).slice(2, 6)}`;
    await client.query(`update publications set slug = $1 where id = $2`, [newSlug, r.id]);
    console.log(`  [${r.id}] "${r.title}": ${r.slug} -> ${newSlug}`);
  }

  await client.end();
  console.log("\nDone.");
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
