const { createPool } = require('mysql2/promise');

const pool = createPool({
  host: '127.0.0.1',
  user: 'root',
  password: '',
  database: 'sawera_store_db',
});

async function runTest() {
  const [settings] = await pool.query("SELECT * FROM store_settings WHERE id = 'singleton'");
  console.log("DB Test - Store Name:", settings[0]?.storeName, "Phone:", settings[0]?.businessPhone);

  const [products] = await pool.query("SELECT id, name, price, sku FROM products LIMIT 5");
  console.log("DB Test - Products count:", products.length, "First:", products[0]?.name, "Price:", products[0]?.price);

  const [categories] = await pool.query("SELECT name, slug FROM categories ORDER BY displayOrder ASC");
  console.log("DB Test - Categories:", categories.map(c => c.name).join(" -> "));

  await pool.end();
  console.log("DB connection test passed successfully!");
}

runTest().catch(console.error);
