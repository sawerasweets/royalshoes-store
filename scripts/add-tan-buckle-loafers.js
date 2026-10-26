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

async function addTanBuckleLoafers() {
  const productId = 'prod-national-tan-buckle-loafers';
  const slug = 'mens-tan-buckle-formal-loafers-elegant-stylish';
  const sku = 'NAT-TAN-BCKL-01';
  const name = "Men's Tan Buckle Formal Loafers – Elegant & Stylish";
  const categoryId = 'cat-men';
  const subcategoryId = 'sub-men-formal-shoes';
  const price = 3199.00;
  const originalPrice = 4800.00;

  const description = `Upgrade your formal look with these stylish men's tan formal loafers. Designed with a sophisticated cognac brown finish, decorative perforated toe detailing, and an elegant metallic buckle, these shoes offer a smart and polished appearance.

Key Features:
- Premium Look: Attractive tan / cognac brown finish with refined tonal sheen
- Elegant Design: Decorative laser perforations across the toe box for breathability and style
- Metallic Buckle: Gunmetal hardware detailing for an executive signature aesthetic
- Easy Slip-On: Convenient slip-on entry with integrated stretch comfort gussets
- Classic Sole: Dark outsole with puzzle-pattern grip and low block heel
- Sole Branding: National Shoes
- Versatile Style: Perfect for office wear, weddings, parties, executive dinners, and formal occasions
- Easy to Pair: Complements formal navy/grey dress trousers, suits, and traditional sherwanis

Product Details:
- Category: Men's Formal Shoes / Loafers
- Color: Tan / Cognac Brown
- Style: Slip-On Buckle Formal Loafer
- Sole: Puzzle-pattern outsole with National Shoes branding
- Closure: Slip-on
- Available Sizes: 39, 40, 41, 42, 43, 44

Care Instructions:
Clean gently with a soft brush or suitable shoe-cleaning product. Avoid harsh chemicals and excessive moisture to protect the tan finish.

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
    { url: '/products/tan-buckle-loafers/tan-buckle-loafer-side.png', isPrimary: true, order: 1, alt: "Men's Tan Buckle Formal Loafers - Outer Profile View" },
    { url: '/products/tan-buckle-loafers/tan-buckle-loafer-front.jpg', isPrimary: false, order: 2, alt: "Men's Tan Buckle Formal Loafers - Front Toe & Buckle Angle" },
    { url: '/products/tan-buckle-loafers/tan-buckle-loafer-top.png', isPrimary: false, order: 3, alt: "Men's Tan Buckle Formal Loafers - Top Profile with Perforations" },
    { url: '/products/tan-buckle-loafers/tan-buckle-loafer-inner.png', isPrimary: false, order: 4, alt: "Men's Tan Buckle Formal Loafers - Inner Profile View" },
    { url: '/products/tan-buckle-loafers/tan-buckle-loafer-sole.png', isPrimary: false, order: 5, alt: "Men's Tan Buckle Formal Loafers - Red Puzzle Outsole National Shoes" }
  ];

  for (const img of images) {
    const imgId = `img-tan-bckl-${img.order}`;
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
    const varId = `var-tan-bckl-${size}-Tan`;
    const varSku = `NAT-TAN-BCKL-${size}`;
    await pool.query(
      `INSERT INTO product_variants (
        id, "productId", size, color, sku, stock, "additionalPrice", "createdAt", "updatedAt"
      ) VALUES ($1, $2, $3, $4, $5, 25, 0.00, NOW(), NOW())`,
      [varId, productId, size, 'Tan', varSku]
    );
    console.log(`Variant size ${size} added with stock: 25`);
  }

  console.log('\nAll done! Product successfully listed.');
}

addTanBuckleLoafers()
  .catch(console.error)
  .finally(() => pool.end());
