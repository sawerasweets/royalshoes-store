const { Pool } = require('pg');

async function testSupabase() {
  const password = encodeURIComponent('Jutt@12453266');
  // Supabase pooler uses format: postgres.[project-ref]:[password]@[host]:6543/postgres
  const connectionString = `postgresql://postgres.pddjqenodzettkjdjoof:${password}@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres`;
  console.log("Connecting to Supabase Pooler at aws-0-ap-southeast-1.pooler.supabase.com:6543...");

  const pool = new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 10000,
  });

  try {
    const res = await pool.query('SELECT count(*) as product_count FROM products');
    console.log("SUCCESS! Connected to Supabase Cloud Database!");
    console.log("Product count in cloud DB:", res.rows[0].product_count);

    const cats = await pool.query('SELECT name FROM categories ORDER BY "displayOrder" ASC');
    console.log("Categories in cloud DB:", cats.rows.map(r => r.name).join(" -> "));

    const settings = await pool.query('SELECT * FROM store_settings WHERE id = \'singleton\'');
    console.log("Store Name in cloud DB:", settings.rows[0].storeName, "| Tagline:", settings.rows[0].storeTagline);
  } catch (err) {
    console.error("Pooler connection failed:", err.message);
  } finally {
    await pool.end();
  }
}

testSupabase();
