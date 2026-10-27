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

async function addBrogueTasselLoafers() {
  const productId = 'prod-royal-black-brogue-tassel-loafers';
  const slug = 'royal-shoes-black-brogue-tassel-loafers-for-men';
  const sku = 'RS-BLK-TSSL-01';
  const name = "ROYAL SHOES Black Brogue Tassel Loafers for Men";
  const categoryId = 'cat-men';
  const subcategoryId = 'sub-men-formal-shoes';
  const price = 3299.00;
  const originalPrice = 4800.00;

  const description = `Step into timeless elegance with ROYAL SHOES Black Brogue Tassel Loafers for Men. Designed for the modern gentleman, these stylish loafers feature a sleek black textured finish, decorative double leather tassels, and classic brogue-inspired perforations for a refined and sophisticated appearance.

The elegant pointed-toe silhouette, contrasting tan leather inner lining, Royal Shoes cushioned insole, and convenient slip-on design make these shoes an exceptional choice for formal occasions, weddings, office galas, and special festive events.

Key Features:
- Elegant black textured leather finish with natural grain character
- Stylish double leather tassel ornament across the bridge
- Classic wingtip brogue-inspired perforated medallion detailing
- Sleek chisel pointed-toe design
- Convenient slip-on construction with discreet stretch gussets
- Contrasting tan leather inner lining with Royal Shoes silver script insole
- Low stacked block heel with signature red accent sole edge
- Ideal for weddings, formal dinners, business meetings, and festive celebrations
- Pairs effortlessly with bespoke suits, tailored trousers, and traditional sherwanis

Product Details:
- Brand: ROYAL SHOES
- Category: Men's Formal Loafers
- Color: Black
- Style: Brogue Tassel Loafer
- Toe Shape: Pointed Chisel Toe
- Insole: Royal Shoes Padded Leather Footbed
- Closure: Slip-On
- Available Sizes: 39, 40, 41, 42, 43, 44

Care Instructions:
Clean gently with a soft shoe brush or damp cloth. Use black leather cream occasionally to keep the leather supple and polished.

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
    { url: '/products/brogue-tassel-loafers/brogue-tassel-loafer-side.jpg', isPrimary: true, order: 1, alt: "Royal Shoes Black Brogue Tassel Loafers - Outer Profile View" },
    { url: '/products/brogue-tassel-loafers/brogue-tassel-loafer-angle.jpg', isPrimary: false, order: 2, alt: "Royal Shoes Black Brogue Tassel Loafers - 3/4 Floating Angle" },
    { url: '/products/brogue-tassel-loafers/brogue-tassel-loafer-top.png', isPrimary: false, order: 3, alt: "Royal Shoes Black Brogue Tassel Loafers - Overhead Brogue & Insole View" },
    { url: '/products/brogue-tassel-loafers/brogue-tassel-loafer-front.jpg', isPrimary: false, order: 4, alt: "Royal Shoes Black Brogue Tassel Loafers - Front View with Double Tassels" },
    { url: '/products/brogue-tassel-loafers/brogue-tassel-loafer-perspective.jpg', isPrimary: false, order: 5, alt: "Royal Shoes Black Brogue Tassel Loafers - Top Perspective View" }
  ];

  for (const img of images) {
    const imgId = `img-tssl-${img.order}`;
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
    const varId = `var-tssl-${size}-Black`;
    const varSku = `RS-BLK-TSSL-${size}`;
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

addBrogueTasselLoafers()
  .catch(console.error)
  .finally(() => pool.end());
