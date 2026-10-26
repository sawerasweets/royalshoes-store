const { Pool } = require('pg');
const fs = require('fs');

const envContent = fs.readFileSync('.env', 'utf8');
let dbUrl = '';
envContent.split('\n').forEach(line => {
  if (line.startsWith('DATABASE_URL=')) {
    dbUrl = line.substring('DATABASE_URL='.length).trim().replace(/^["']|["']$/g, '');
  }
});

const pool = new Pool({
  connectionString: dbUrl,
  ssl: { rejectUnauthorized: false },
});

async function addCrossStrapSandals() {
  const productId = 'prod-black-cross-strap-sandals';
  const slug = 'mens-black-cross-strap-sandals';
  const sku = 'SWR-BLK-CRST-01';
  const name = "Men's Black Cross-Strap Sandals";
  const categoryId = 'cat-men';
  const subcategoryId = 'sub-men-sandals';
  const price = 2199.00;
  const originalPrice = 3200.00;

  const description = `Upgrade your everyday style with Men's Black Cross-Strap Sandals. Featuring a classic glossy black finish, multiple overlapping cross straps, detailed perimeter artisanal stitching, and a flexible textured black outsole, these sandals offer unmatched comfort and a stylish look for everyday wear and casual outings.

Key Features:
- Classic glossy black color finish
- Stylish multi-layered cross-strap design for secure foot support
- Cushioned insole providing all-day shock absorption
- Detailed perimeter artisanal stitching
- Flexible textured black outsole with multi-directional grip
- Breathable open-toe style
- Suitable for casual, daily wear, and regular outings
- Pairs easily with casual trousers, shalwar kameez, or denim

Product Details:
- Category: Men's Casual Sandals
- Color: Black
- Upper Style: Multiple Overlapping Cross Straps
- Sole Style: Flexible Textured Grip Sole
- Toe Style: Open Toe
- Heel Style: Flat / Low Ergonomic Arch
- Available Sizes: 39, 40, 41, 42, 43, 44

Care Instructions:
Clean gently with a soft brush or damp cloth. Avoid harsh chemicals and prolonged exposure to direct sunlight.

How to Order:
To place your order directly, click '⚡ BUY NOW — DIRECT ORDER' or contact us on WhatsApp: 03481702710. Please confirm your required size and availability before placing your order.`;

  console.log('Inserting or updating product...');

  // Check if exists
  const existing = await pool.query('SELECT id FROM products WHERE id = $1 OR slug = $2', [productId, slug]);
  if (existing.rows.length > 0) {
    console.log('Product already exists, deleting existing images and variants first to re-create clean...');
    await pool.query('DELETE FROM product_images WHERE "productId" = $1', [existing.rows[0].id]);
    await pool.query('DELETE FROM product_variants WHERE "productId" = $1', [existing.rows[0].id]);
    await pool.query('DELETE FROM products WHERE id = $1', [existing.rows[0].id]);
  }

  // Insert product
  await pool.query(
    `INSERT INTO products (
      id, "categoryId", "subcategoryId", name, slug, sku, description, price, "originalPrice",
      "isPublished", "isFeatured", "isNewArrival", "isBestseller", "createdAt", "updatedAt"
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, true, true, true, true, NOW(), NOW())`,
    [productId, categoryId, subcategoryId, name, slug, sku, description, price, originalPrice]
  );
  console.log('Product inserted successfully!');

  // Insert 5 images
  const images = [
    { url: '/products/cross-strap-sandals/black-cross-strap-sandal-side.png', isPrimary: true, order: 1, alt: "Men's Black Cross-Strap Sandals - Outer Side Profile" },
    { url: '/products/cross-strap-sandals/black-cross-strap-sandal-top.png', isPrimary: false, order: 2, alt: "Men's Black Cross-Strap Sandals - Top View & Cushion Insole" },
    { url: '/products/cross-strap-sandals/black-cross-strap-sandal-front.png', isPrimary: false, order: 3, alt: "Men's Black Cross-Strap Sandals - Front Open-Toe Angle" },
    { url: '/products/cross-strap-sandals/black-cross-strap-sandal-inner.png', isPrimary: false, order: 4, alt: "Men's Black Cross-Strap Sandals - Inner Side Profile" },
    { url: '/products/cross-strap-sandals/black-cross-strap-sandal-sole.jpg', isPrimary: false, order: 5, alt: "Men's Black Cross-Strap Sandals - Textured Anti-Slip Outsole" }
  ];

  for (const img of images) {
    const imgId = `img-blk-crst-${img.order}`;
    await pool.query(
      `INSERT INTO product_images (
        id, "productId", url, alt, "isPrimary", "displayOrder", "createdAt"
      ) VALUES ($1, $2, $3, $4, $5, $6, NOW())`,
      [imgId, productId, img.url, img.alt, img.isPrimary, img.order]
    );
    console.log(`Image ${img.order} added: ${img.url}`);
  }

  // Insert size variants: 39, 40, 41, 42, 43, 44
  const sizes = ['39', '40', '41', '42', '43', '44'];
  for (const size of sizes) {
    const varId = `var-blk-crst-${size}-Black`;
    const varSku = `SWR-BLK-CRST-${size}`;
    await pool.query(
      `INSERT INTO product_variants (
        id, "productId", size, color, sku, stock, "additionalPrice", "createdAt", "updatedAt"
      ) VALUES ($1, $2, $3, $4, $5, 25, 0.00, NOW(), NOW())`,
      [varId, productId, size, 'Black', varSku]
    );
    console.log(`Variant size ${size} added with stock: 25`);
  }

  console.log('\nAll done! Product successfully listed.');
}

addCrossStrapSandals()
  .catch(console.error)
  .finally(() => pool.end());
