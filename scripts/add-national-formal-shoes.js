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

async function addNationalFormalShoes() {
  const productId = 'prod-national-black-formal-shoes';
  const slug = 'mens-black-formal-shoes-premium-design';
  const sku = 'NAT-BLK-FRML-01';
  const name = "Men's Black Formal Shoes – Premium Design";
  const categoryId = 'cat-men';
  const subcategoryId = 'sub-men-formal-shoes';
  const price = 3199.00;
  const originalPrice = 4800.00;

  const description = `Upgrade your formal footwear collection with these stylish men's formal shoes. Featuring a distinctive black outsole with a red puzzle-pattern design, these shoes offer a classic formal look with a unique sole finish.

Key Features:
- Premium textured & embossed geometric vamp design
- Distinctive black outsole with signature red puzzle-pattern grip
- Royal Shoes cushioned insole for day-long comfort
- Classic slip-on styling with subtle elastic comfort gussets
- Broad stacked heel providing balanced posture and durability
- Sole Branding: National Shoes
- Perfect for weddings, corporate meetings, formal events, and special occasions
- Easily pairs with bespoke suits, tuxedos, and traditional Pakistani attire

Product Details:
- Category: Men's Formal Shoes
- Color: Black with red sole accents
- Style: Slip-On Formal Dress Shoe
- Sole Design: Puzzle-pattern outsole with National Shoes branding
- Heel: Broad black heel
- Insole: Royal Shoes Padded Insole
- Available Sizes: 39, 40, 41, 42, 43, 44

Care Instructions:
Clean gently with a soft brush or suitable shoe-cleaning product. Avoid harsh chemicals and excessive moisture to protect the finish.

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
    { url: '/products/national-formal/mens-formal-side-profile.png', isPrimary: true, order: 1, alt: "Men's Black Formal Shoes - Outer Side Profile" },
    { url: '/products/national-formal/mens-formal-top-view.png', isPrimary: false, order: 2, alt: "Men's Black Formal Shoes - Top Profile & Royal Shoes Insole" },
    { url: '/products/national-formal/mens-formal-inner-side.png', isPrimary: false, order: 3, alt: "Men's Black Formal Shoes - Inner Profile with Gusset" },
    { url: '/products/national-formal/mens-formal-puzzle-sole.png', isPrimary: false, order: 4, alt: "Men's Black Formal Shoes - Red Puzzle Outsole National Shoes" },
    { url: '/products/national-formal/mens-formal-rear-heel.jpg', isPrimary: false, order: 5, alt: "Men's Black Formal Shoes - Stacked Broad Heel & Counter View" }
  ];

  for (const img of images) {
    const imgId = `img-nat-frml-${img.order}`;
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
    const varId = `var-nat-frml-${size}-Black`;
    const varSku = `NAT-BLK-FRML-${size}`;
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

addNationalFormalShoes()
  .catch(console.error)
  .finally(() => pool.end());
