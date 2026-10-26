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

async function addGlitterLoafers() {
  const productId = 'prod-mr-black-glitter-horsebit-loafers';
  const slug = 'mens-black-glitter-horsebit-loafers-mr-sole';
  const sku = 'MR-GLTR-LF-BLK-01';
  const name = "Men's Black Glitter Horsebit Loafers – MR Sole";
  const categoryId = 'cat-men';
  const subcategoryId = 'sub-men-formal-shoes';
  const price = 2999.00;
  const originalPrice = 4500.00;

  const description = `Make a stylish impression with these men's black glitter loafers, designed with an eye-catching textured finish and elegant metallic horsebit detailing. The slip-on design offers a convenient wearing experience, while the classic loafer silhouette complements both formal and party outfits.

Key Features:
- Elegant black glitter finish
- Stylish metallic horsebit ornament
- MR brand-quality sole
- Convenient slip-on design
- Classic moc-toe styling
- Suitable for weddings, parties, dinners and formal occasions
- Easy to pair with dress trousers and traditional outfits

Product Details:
- Category: Men's Formal Shoes
- Color: Black Glitter
- Style: Horsebit Loafer
- Sole: MR
- Closure: Slip-on
- Available Sizes: 39, 40, 41, 42, 43, 44

Care Instructions:
Clean gently with a soft brush or cloth. Avoid harsh chemicals and excessive moisture to protect the glitter finish.

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
    { url: '/products/glitter-loafers/glitter-horsebit-loafer-front.jpg', isPrimary: true, order: 1, alt: "Men's Black Glitter Horsebit Loafers - Front View" },
    { url: '/products/glitter-loafers/glitter-horsebit-loafer-angle.jpg', isPrimary: false, order: 2, alt: "Men's Black Glitter Horsebit Loafers - Side Angle" },
    { url: '/products/glitter-loafers/glitter-horsebit-loafer-top.jpg', isPrimary: false, order: 3, alt: "Men's Black Glitter Horsebit Loafers - Top Profile" },
    { url: '/products/glitter-loafers/glitter-horsebit-loafer-insole.jpg', isPrimary: false, order: 4, alt: "Men's Black Glitter Horsebit Loafers - Insole Detail" },
    { url: '/products/glitter-loafers/glitter-horsebit-loafer-back.jpg', isPrimary: false, order: 5, alt: "Men's Black Glitter Horsebit Loafers - Heel Back View" }
  ];

  for (const img of images) {
    const imgId = `img-mr-gltr-${img.order}`;
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
    const varId = `var-mr-gltr-${size}-BlackGlitter`;
    const varSku = `MR-GLTR-LF-BLK-${size}`;
    await pool.query(
      `INSERT INTO product_variants (
        id, "productId", size, color, sku, stock, "additionalPrice", "createdAt", "updatedAt"
      ) VALUES ($1, $2, $3, $4, $5, 25, 0.00, NOW(), NOW())`,
      [varId, productId, size, 'Black Glitter', varSku]
    );
    console.log(`Variant size ${size} added with stock: 25`);
  }

  console.log('\nAll done! Product successfully listed.');
}

addGlitterLoafers()
  .catch(console.error)
  .finally(() => pool.end());
