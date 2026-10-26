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

async function addCrystalBitLoafers() {
  const productId = 'prod-royal-black-crystal-bit-loafers';
  const slug = 'royal-shoes-black-crystal-bit-loafers-for-men';
  const sku = 'RS-BLK-CRYST-01';
  const name = "Royal Shoes Black Crystal Bit Loafers for Men";
  const categoryId = 'cat-men';
  const subcategoryId = 'sub-men-formal-shoes';
  const price = 3499.00;
  const originalPrice = 5000.00;

  const description = `Upgrade your formal look with ROYAL SHOES Black Crystal Bit Loafers for Men, designed for a sleek and sophisticated appearance. Featuring a mirror-finish glossy black patent surface, an elegant chisel pointed toe, and a premium double-row crystal-embellished metal bit buckle, these slip-on loafers add a refined touch to your formal wardrobe.

Key Features:
- Elegant high-shine glossy black patent finish
- Stylish double-row crystal-embellished chrome metal bit ornament
- Sleek chisel pointed-toe styling
- Royal Shoes cushioned insole for day-long reception & formal comfort
- Convenient slip-on style with discreet elastic gussets
- Red accent perimeter sole edging with stacked low block heel
- Perfect for weddings, black-tie galas, parties, business banquets, and special occasions
- Easily pairs with tuxedos, bespoke suits, and traditional formal sherwanis

Product Details:
- Category: Men's Formal Loafers
- Color: Glossy Black
- Style: Crystal Bit Formal Slip-On Loafer
- Upper: High-Gloss Patent Leather Finish
- Insole: Royal Shoes Silver Script Padded Insole
- Sole: Dress Outsole with Low Stacked Block Heel & Red Accent Trim
- Available Sizes: 39, 40, 41, 42, 43, 44

Care Instructions:
Wipe gently with a soft microfibre cloth. Avoid harsh abrasives or heavy chemical cleaners to maintain the mirror gloss finish.

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
    { url: '/products/crystal-bit-loafers/crystal-bit-loafer-side.png', isPrimary: true, order: 1, alt: "Royal Shoes Black Crystal Bit Loafers - Outer Profile View" },
    { url: '/products/crystal-bit-loafers/crystal-bit-loafer-front.png', isPrimary: false, order: 2, alt: "Royal Shoes Black Crystal Bit Loafers - Front Crystal Bit View" },
    { url: '/products/crystal-bit-loafers/crystal-bit-loafer-top.png', isPrimary: false, order: 3, alt: "Royal Shoes Black Crystal Bit Loafers - Overhead Profile & Insole" },
    { url: '/products/crystal-bit-loafers/crystal-bit-loafer-heel.png', isPrimary: false, order: 4, alt: "Royal Shoes Black Crystal Bit Loafers - Rear Stacked Heel View" },
    { url: '/products/crystal-bit-loafers/crystal-bit-loafer-angle.png', isPrimary: false, order: 5, alt: "Royal Shoes Black Crystal Bit Loafers - Angled Overhead Perspective" }
  ];

  for (const img of images) {
    const imgId = `img-cryst-${img.order}`;
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
    const varId = `var-cryst-${size}-Black`;
    const varSku = `RS-BLK-CRYST-${size}`;
    await pool.query(
      `INSERT INTO product_variants (
        id, "productId", size, color, sku, stock, "additionalPrice", "createdAt", "updatedAt"
      ) VALUES ($1, $2, $3, $4, $5, 25, 0.00, NOW(), NOW())`,
      [varId, productId, size, 'Glossy Black', varSku]
    );
    console.log(`Variant size ${size} added with stock: 25`);
  }

  console.log('\nAll done! Product successfully listed.');
}

addCrystalBitLoafers()
  .catch(console.error)
  .finally(() => pool.end());
