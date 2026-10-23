const mysql = require('mysql2/promise');

async function check() {
  const conn = await mysql.createConnection({ host: '127.0.0.1', user: 'root', password: '', database: 'sawera_store_db' });
  const [rows] = await conn.query(`
    SELECT p.id, p.subcategoryId, p.name, p.description, pi.url 
    FROM products p 
    LEFT JOIN product_images pi ON pi.productId = p.id AND pi.isPrimary = TRUE
    WHERE p.name LIKE '%laptop%' 
       OR p.name LIKE '%phone%' 
       OR p.name LIKE '%mobile%' 
       OR p.name LIKE '%pant%'
       OR p.description LIKE '%laptop%' 
       OR p.description LIKE '%phone%' 
       OR p.description LIKE '%mobile%'
       OR p.description LIKE '%cable%'
  `);
  console.log("Matching items count:", rows.length);
  for (const r of rows) {
    console.log(`[${r.subcategoryId}] ${r.name}: ${r.description.slice(0, 80)}... | Image: ${r.url}`);
  }
  await conn.end();
}

check().catch(console.error);
