const { Pool } = require('pg');

async function updateKidsImages() {
  const password = encodeURIComponent('Jutt@12453266');
  const connectionString = `postgresql://postgres.pddjqenodzettkjdjoof:${password}@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres`;
  const pool = new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 10000,
  });

  try {
    const res = await pool.query(`
      SELECT p.id, pi.id as img_id, pi.url 
      FROM products p
      JOIN product_images pi ON pi."productId" = p.id
      WHERE p."categoryId" = 'cat-kids'
      ORDER BY p.id ASC
    `);

    console.log(`Found ${res.rows.length} kids images in Supabase.`);
    
    // Group by product
    const prodMap = {};
    for (const row of res.rows) {
      if (!prodMap[row.id]) prodMap[row.id] = [];
      prodMap[row.id].push(row);
    }

    const updates = [];
    const prodIds = Object.keys(prodMap);
    for (let i = 0; i < prodIds.length; i++) {
      const pid = prodIds[i];
      const imgIndex = (i % 6) + 1;
      const newUrl = `/products/kids/kids-${imgIndex}.jpg`;
      const imgs = prodMap[pid];
      for (const img of imgs) {
        if (img.url.endsWith('.svg')) {
          updates.push({ id: img.img_id, url: newUrl });
        }
      }
    }

    console.log(`Will update ${updates.length} kids images.`);
    if (updates.length > 0) {
      const values = updates.map(u => `('${u.id}', '${u.url}')`).join(',');
      const sql = `
        UPDATE product_images AS pi
        SET url = u.new_url
        FROM (VALUES ${values}) AS u(img_id, new_url)
        WHERE pi.id = u.img_id;
      `;
      await pool.query(sql);
      console.log('Kids images successfully updated to genuine photography!');
    }
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await pool.end();
  }
}

updateKidsImages();
