const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

function escapeSqlStr(val) {
  if (val === null || val === undefined) return 'NULL';
  if (typeof val === 'boolean') return val ? 'TRUE' : 'FALSE';
  if (typeof val === 'number') return String(val);
  return `'${String(val).replace(/'/g, "''")}'`;
}

async function main() {
  console.log("Connecting to local MySQL to generate Supabase PostgreSQL dump...");
  const conn = await mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'sawera_store_db',
  });

  let sql = `-- ========================================================
-- ROYAL SHOES — BLACK & GOLD EDITION
-- COMPLETE SUPABASE / POSTGRESQL PRODUCTION DATABASE SCRIPT
-- DOMAIN: royalshoes.store
-- Generated automatically for 1-Click Import in Supabase SQL Editor
-- ========================================================

-- 1. Enable UUID Extension if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Clean Drop of Previous Schema (Safe for Fresh Re-runs)
DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS wishlist_items CASCADE;
DROP TABLE IF EXISTS coupons CASCADE;
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS product_images CASCADE;
DROP TABLE IF EXISTS product_variants CASCADE;
DROP TABLE IF EXISTS inventory_movements CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS subcategories CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS addresses CASCADE;
DROP TABLE IF EXISTS sessions CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS homepage_campaigns CASCADE;
DROP TABLE IF EXISTS store_settings CASCADE;

-- 3. Create Tables with Relational Constraints
CREATE TABLE users (
  "id" VARCHAR(64) PRIMARY KEY,
  "email" VARCHAR(191) NOT NULL UNIQUE,
  "passwordHash" VARCHAR(255) NOT NULL,
  "name" VARCHAR(191) NOT NULL,
  "phone" VARCHAR(64) NULL,
  "role" VARCHAR(20) NOT NULL DEFAULT 'CUSTOMER',
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_users_role ON users("role");

CREATE TABLE sessions (
  "id" VARCHAR(64) PRIMARY KEY,
  "userId" VARCHAR(64) NOT NULL REFERENCES users("id") ON DELETE CASCADE,
  "token" VARCHAR(512) NOT NULL UNIQUE,
  "expiresAt" TIMESTAMPTZ NOT NULL,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_sessions_user ON sessions("userId");

CREATE TABLE addresses (
  "id" VARCHAR(64) PRIMARY KEY,
  "userId" VARCHAR(64) NOT NULL REFERENCES users("id") ON DELETE CASCADE,
  "title" VARCHAR(64) NOT NULL DEFAULT 'Home',
  "fullName" VARCHAR(191) NOT NULL,
  "phone" VARCHAR(64) NOT NULL,
  "city" VARCHAR(100) NOT NULL,
  "addressLine" TEXT NOT NULL,
  "postalCode" VARCHAR(32) NULL,
  "isDefault" BOOLEAN NOT NULL DEFAULT FALSE,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_addresses_user ON addresses("userId");

CREATE TABLE categories (
  "id" VARCHAR(64) PRIMARY KEY,
  "name" VARCHAR(100) NOT NULL UNIQUE,
  "slug" VARCHAR(100) NOT NULL UNIQUE,
  "description" TEXT NULL,
  "imageUrl" VARCHAR(512) NULL,
  "displayOrder" INTEGER NOT NULL DEFAULT 0,
  "isActive" BOOLEAN NOT NULL DEFAULT TRUE,
  "showInNav" BOOLEAN NOT NULL DEFAULT TRUE,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_categories_order ON categories("displayOrder");
CREATE INDEX idx_categories_slug ON categories("slug");

CREATE TABLE subcategories (
  "id" VARCHAR(64) PRIMARY KEY,
  "categoryId" VARCHAR(64) NOT NULL REFERENCES categories("id") ON DELETE CASCADE,
  "name" VARCHAR(100) NOT NULL,
  "slug" VARCHAR(100) NOT NULL UNIQUE,
  "description" TEXT NULL,
  "imageUrl" VARCHAR(512) NULL,
  "displayOrder" INTEGER NOT NULL DEFAULT 0,
  "isActive" BOOLEAN NOT NULL DEFAULT TRUE,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT uq_cat_sub UNIQUE ("categoryId", "name")
);
CREATE INDEX idx_sub_category ON subcategories("categoryId");
CREATE INDEX idx_sub_slug ON subcategories("slug");

CREATE TABLE products (
  "id" VARCHAR(64) PRIMARY KEY,
  "categoryId" VARCHAR(64) NOT NULL REFERENCES categories("id") ON DELETE RESTRICT,
  "subcategoryId" VARCHAR(64) NULL REFERENCES subcategories("id") ON DELETE SET NULL,
  "name" VARCHAR(191) NOT NULL,
  "slug" VARCHAR(191) NOT NULL UNIQUE,
  "sku" VARCHAR(100) NOT NULL UNIQUE,
  "description" TEXT NOT NULL,
  "price" NUMERIC(10,2) NOT NULL,
  "originalPrice" NUMERIC(10,2) NULL,
  "isPublished" BOOLEAN NOT NULL DEFAULT TRUE,
  "isFeatured" BOOLEAN NOT NULL DEFAULT FALSE,
  "isNewArrival" BOOLEAN NOT NULL DEFAULT FALSE,
  "isBestseller" BOOLEAN NOT NULL DEFAULT FALSE,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_products_category ON products("categoryId");
CREATE INDEX idx_products_sub ON products("subcategoryId");
CREATE INDEX idx_products_slug ON products("slug");
CREATE INDEX idx_products_flags ON products("isPublished", "isFeatured", "isBestseller");

CREATE TABLE product_variants (
  "id" VARCHAR(64) PRIMARY KEY,
  "productId" VARCHAR(64) NOT NULL REFERENCES products("id") ON DELETE CASCADE,
  "size" VARCHAR(32) NOT NULL,
  "color" VARCHAR(64) NOT NULL,
  "sku" VARCHAR(100) NULL,
  "stock" INTEGER NOT NULL DEFAULT 0,
  "additionalPrice" NUMERIC(10,2) NOT NULL DEFAULT 0.00,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT uq_product_size_color UNIQUE ("productId", "size", "color")
);
CREATE INDEX idx_variants_product ON product_variants("productId");

CREATE TABLE product_images (
  "id" VARCHAR(64) PRIMARY KEY,
  "productId" VARCHAR(64) NOT NULL REFERENCES products("id") ON DELETE CASCADE,
  "url" VARCHAR(512) NOT NULL,
  "alt" VARCHAR(191) NULL,
  "isPrimary" BOOLEAN NOT NULL DEFAULT FALSE,
  "displayOrder" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_images_product ON product_images("productId");

CREATE TABLE orders (
  "id" VARCHAR(64) PRIMARY KEY,
  "orderNumber" VARCHAR(64) NOT NULL UNIQUE,
  "userId" VARCHAR(64) NULL REFERENCES users("id") ON DELETE SET NULL,
  "customerName" VARCHAR(191) NOT NULL,
  "customerPhone" VARCHAR(64) NOT NULL,
  "customerEmail" VARCHAR(191) NULL,
  "city" VARCHAR(100) NOT NULL,
  "shippingAddress" TEXT NOT NULL,
  "deliveryNotes" TEXT NULL,
  "status" VARCHAR(32) NOT NULL DEFAULT 'PENDING',
  "paymentMethod" VARCHAR(32) NOT NULL DEFAULT 'COD',
  "paymentStatus" VARCHAR(32) NOT NULL DEFAULT 'PENDING',
  "subtotal" NUMERIC(10,2) NOT NULL,
  "discount" NUMERIC(10,2) NOT NULL DEFAULT 0.00,
  "shippingFee" NUMERIC(10,2) NOT NULL DEFAULT 0.00,
  "grandTotal" NUMERIC(10,2) NOT NULL,
  "couponCode" VARCHAR(64) NULL,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_orders_number ON orders("orderNumber");
CREATE INDEX idx_orders_user ON orders("userId");
CREATE INDEX idx_orders_status ON orders("status", "paymentStatus");

CREATE TABLE order_items (
  "id" VARCHAR(64) PRIMARY KEY,
  "orderId" VARCHAR(64) NOT NULL REFERENCES orders("id") ON DELETE CASCADE,
  "productId" VARCHAR(64) NULL REFERENCES products("id") ON DELETE SET NULL,
  "variantId" VARCHAR(64) NULL REFERENCES product_variants("id") ON DELETE SET NULL,
  "productName" VARCHAR(191) NOT NULL,
  "productSku" VARCHAR(100) NOT NULL,
  "size" VARCHAR(32) NOT NULL,
  "color" VARCHAR(64) NOT NULL,
  "price" NUMERIC(10,2) NOT NULL,
  "quantity" INTEGER NOT NULL,
  "lineTotal" NUMERIC(10,2) NOT NULL,
  "imageUrl" VARCHAR(512) NULL
);
CREATE INDEX idx_order_items_order ON order_items("orderId");

CREATE TABLE payments (
  "id" VARCHAR(64) PRIMARY KEY,
  "orderId" VARCHAR(64) NOT NULL REFERENCES orders("id") ON DELETE CASCADE,
  "method" VARCHAR(32) NOT NULL,
  "status" VARCHAR(32) NOT NULL DEFAULT 'PENDING',
  "amount" NUMERIC(10,2) NOT NULL,
  "referenceNumber" VARCHAR(191) NULL,
  "proofImageUrl" VARCHAR(512) NULL,
  "verifiedBy" VARCHAR(64) NULL,
  "verifiedAt" TIMESTAMPTZ NULL,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_payments_order ON payments("orderId");

CREATE TABLE coupons (
  "id" VARCHAR(64) PRIMARY KEY,
  "code" VARCHAR(64) NOT NULL UNIQUE,
  "discountPercent" NUMERIC(5,2) NULL,
  "discountAmount" NUMERIC(10,2) NULL,
  "minOrderAmount" NUMERIC(10,2) NOT NULL DEFAULT 0.00,
  "maxDiscount" NUMERIC(10,2) NULL,
  "usageLimit" INTEGER NULL,
  "timesUsed" INTEGER NOT NULL DEFAULT 0,
  "startDate" TIMESTAMPTZ NULL,
  "endDate" TIMESTAMPTZ NULL,
  "isActive" BOOLEAN NOT NULL DEFAULT TRUE,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_coupons_code ON coupons("code");

CREATE TABLE wishlist_items (
  "id" VARCHAR(64) PRIMARY KEY,
  "userId" VARCHAR(64) NOT NULL REFERENCES users("id") ON DELETE CASCADE,
  "productId" VARCHAR(64) NOT NULL REFERENCES products("id") ON DELETE CASCADE,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT uq_wishlist_user_product UNIQUE ("userId", "productId")
);

CREATE TABLE homepage_campaigns (
  "id" VARCHAR(64) PRIMARY KEY,
  "title" VARCHAR(191) NOT NULL,
  "subtitle" VARCHAR(191) NULL,
  "ctaText" VARCHAR(64) NOT NULL DEFAULT 'EXPLORE ATELIER',
  "ctaLink" VARCHAR(255) NOT NULL DEFAULT '/all',
  "imageUrl" VARCHAR(512) NULL,
  "isActive" BOOLEAN NOT NULL DEFAULT TRUE,
  "displayOrder" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE store_settings (
  "id" VARCHAR(32) PRIMARY KEY DEFAULT 'singleton',
  "storeName" VARCHAR(100) NOT NULL DEFAULT 'ROYAL SHOES',
  "storeTagline" VARCHAR(191) NOT NULL DEFAULT 'STEP INTO ELEGANCE',
  "logoUrl" VARCHAR(512) NULL,
  "businessPhone" VARCHAR(64) NOT NULL DEFAULT '03481702710',
  "whatsappNumber" VARCHAR(64) NOT NULL DEFAULT '923481702710',
  "telephoneLink" VARCHAR(64) NOT NULL DEFAULT 'tel:+923481702710',
  "country" VARCHAR(64) NOT NULL DEFAULT 'Pakistan',
  "currencySymbol" VARCHAR(16) NOT NULL DEFAULT 'Rs.',
  "freeShippingThreshold" NUMERIC(10,2) NOT NULL DEFAULT 5000.00,
  "standardShippingFee" NUMERIC(10,2) NOT NULL DEFAULT 250.00,
  "easypaisaInstructions" TEXT NULL,
  "bankInstructions" TEXT NULL,
  "announcementText" VARCHAR(255) NULL,
  "showAnnouncement" BOOLEAN NOT NULL DEFAULT TRUE,
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE audit_logs (
  "id" VARCHAR(64) PRIMARY KEY,
  "userId" VARCHAR(64) NULL REFERENCES users("id") ON DELETE SET NULL,
  "action" VARCHAR(64) NOT NULL,
  "entity" VARCHAR(64) NOT NULL,
  "entityId" VARCHAR(64) NULL,
  "details" TEXT NULL,
  "ipAddress" VARCHAR(64) NULL,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ========================================================
-- DATA SEEDING (ROYAL SHOES 222 PRODUCTS & CATALOGUE)
-- ========================================================
`;

  // 1. Store Settings
  console.log("Exporting store_settings...");
  const [settings] = await conn.query("SELECT * FROM store_settings");
  for (const s of settings) {
    sql += `\nINSERT INTO store_settings ("id", "storeName", "storeTagline", "logoUrl", "businessPhone", "whatsappNumber", "telephoneLink", "country", "currencySymbol", "freeShippingThreshold", "standardShippingFee", "easypaisaInstructions", "bankInstructions", "announcementText", "showAnnouncement") VALUES (${escapeSqlStr(s.id)}, 'ROYAL SHOES', 'STEP INTO ELEGANCE', ${escapeSqlStr(s.logoUrl)}, ${escapeSqlStr(s.businessPhone)}, ${escapeSqlStr(s.whatsappNumber)}, ${escapeSqlStr(s.telephoneLink)}, ${escapeSqlStr(s.country)}, ${escapeSqlStr(s.currencySymbol)}, ${s.freeShippingThreshold}, ${s.standardShippingFee}, ${escapeSqlStr(s.easypaisaInstructions)}, ${escapeSqlStr(s.bankInstructions)}, ${escapeSqlStr(s.announcementText)}, ${s.showAnnouncement ? 'TRUE' : 'FALSE'}) ON CONFLICT ("id") DO UPDATE SET "storeName" = EXCLUDED."storeName", "storeTagline" = EXCLUDED."storeTagline";\n`;
  }

  // 2. Users (Admin + Demo)
  console.log("Exporting users...");
  const [users] = await conn.query("SELECT * FROM users");
  for (const u of users) {
    sql += `INSERT INTO users ("id", "email", "passwordHash", "name", "phone", "role") VALUES (${escapeSqlStr(u.id)}, ${escapeSqlStr(u.email)}, ${escapeSqlStr(u.passwordHash)}, ${escapeSqlStr(u.name)}, ${escapeSqlStr(u.phone)}, ${escapeSqlStr(u.role)}) ON CONFLICT ("id") DO NOTHING;\n`;
  }

  // 3. Categories
  console.log("Exporting categories...");
  const [categories] = await conn.query("SELECT * FROM categories ORDER BY displayOrder ASC");
  for (const c of categories) {
    sql += `INSERT INTO categories ("id", "name", "slug", "description", "imageUrl", "displayOrder", "isActive", "showInNav") VALUES (${escapeSqlStr(c.id)}, ${escapeSqlStr(c.name)}, ${escapeSqlStr(c.slug)}, ${escapeSqlStr(c.description)}, ${escapeSqlStr(c.imageUrl)}, ${c.displayOrder}, ${c.isActive ? 'TRUE' : 'FALSE'}, ${c.showInNav ? 'TRUE' : 'FALSE'}) ON CONFLICT ("id") DO NOTHING;\n`;
  }

  // 4. Subcategories
  console.log("Exporting subcategories...");
  const [subs] = await conn.query("SELECT * FROM subcategories ORDER BY categoryId, displayOrder ASC");
  for (const s of subs) {
    sql += `INSERT INTO subcategories ("id", "categoryId", "name", "slug", "description", "imageUrl", "displayOrder", "isActive") VALUES (${escapeSqlStr(s.id)}, ${escapeSqlStr(s.categoryId)}, ${escapeSqlStr(s.name)}, ${escapeSqlStr(s.slug)}, ${escapeSqlStr(s.description)}, ${escapeSqlStr(s.imageUrl)}, ${s.displayOrder}, ${s.isActive ? 'TRUE' : 'FALSE'}) ON CONFLICT ("id") DO NOTHING;\n`;
  }

  // 5. Products
  console.log("Exporting products (222 luxury creations)...");
  const [prods] = await conn.query("SELECT * FROM products ORDER BY id ASC");
  for (const p of prods) {
    sql += `INSERT INTO products ("id", "categoryId", "subcategoryId", "name", "slug", "sku", "description", "price", "originalPrice", "isPublished", "isFeatured", "isNewArrival", "isBestseller") VALUES (${escapeSqlStr(p.id)}, ${escapeSqlStr(p.categoryId)}, ${escapeSqlStr(p.subcategoryId)}, ${escapeSqlStr(p.name)}, ${escapeSqlStr(p.slug)}, ${escapeSqlStr(p.sku)}, ${escapeSqlStr(p.description)}, ${p.price}, ${p.originalPrice || 'NULL'}, ${p.isPublished ? 'TRUE' : 'FALSE'}, ${p.isFeatured ? 'TRUE' : 'FALSE'}, ${p.isNewArrival ? 'TRUE' : 'FALSE'}, ${p.isBestseller ? 'TRUE' : 'FALSE'}) ON CONFLICT ("id") DO NOTHING;\n`;
  }

  // 6. Product Variants
  console.log("Exporting product variants...");
  const [variants] = await conn.query("SELECT * FROM product_variants ORDER BY productId, size ASC");
  for (const v of variants) {
    sql += `INSERT INTO product_variants ("id", "productId", "size", "color", "sku", "stock", "additionalPrice") VALUES (${escapeSqlStr(v.id)}, ${escapeSqlStr(v.productId)}, ${escapeSqlStr(v.size)}, ${escapeSqlStr(v.color)}, ${escapeSqlStr(v.sku)}, ${v.stock}, ${v.additionalPrice || 0}) ON CONFLICT ("id") DO NOTHING;\n`;
  }

  // 7. Product Images
  console.log("Exporting product images...");
  const [images] = await conn.query("SELECT * FROM product_images ORDER BY productId, displayOrder ASC");
  for (const img of images) {
    sql += `INSERT INTO product_images ("id", "productId", "url", "alt", "isPrimary", "displayOrder") VALUES (${escapeSqlStr(img.id)}, ${escapeSqlStr(img.productId)}, ${escapeSqlStr(img.url)}, ${escapeSqlStr(img.alt)}, ${img.isPrimary ? 'TRUE' : 'FALSE'}, ${img.displayOrder}) ON CONFLICT ("id") DO NOTHING;\n`;
  }

  // 8. Coupons
  console.log("Exporting coupons...");
  const [coupons] = await conn.query("SELECT * FROM coupons");
  for (const cp of coupons) {
    sql += `INSERT INTO coupons ("id", "code", "discountPercent", "discountAmount", "minOrderAmount", "maxDiscount", "usageLimit", "timesUsed", "isActive") VALUES (${escapeSqlStr(cp.id)}, ${escapeSqlStr(cp.code)}, ${cp.discountPercent || 'NULL'}, ${cp.discountAmount || 'NULL'}, ${cp.minOrderAmount}, ${cp.maxDiscount || 'NULL'}, ${cp.usageLimit || 'NULL'}, ${cp.timesUsed || 0}, ${cp.isActive ? 'TRUE' : 'FALSE'}) ON CONFLICT ("id") DO NOTHING;\n`;
  }

  // 9. Homepage Campaigns
  console.log("Exporting homepage campaigns...");
  const [campaigns] = await conn.query("SELECT * FROM homepage_campaigns");
  for (const camp of campaigns) {
    sql += `INSERT INTO homepage_campaigns ("id", "title", "subtitle", "ctaText", "ctaLink", "imageUrl", "isActive", "displayOrder") VALUES (${escapeSqlStr(camp.id)}, ${escapeSqlStr(camp.title)}, ${escapeSqlStr(camp.subtitle)}, ${escapeSqlStr(camp.ctaText)}, ${escapeSqlStr(camp.ctaLink)}, ${escapeSqlStr(camp.imageUrl)}, ${camp.isActive ? 'TRUE' : 'FALSE'}, ${camp.displayOrder}) ON CONFLICT ("id") DO NOTHING;\n`;
  }

  fs.writeFileSync('supabase-schema.sql', sql, 'utf8');
  console.log("SUCCESS! supabase-schema.sql successfully created! File size:", (fs.statSync('supabase-schema.sql').size / 1024).toFixed(1), "KB");

  await conn.end();
}

main().catch(console.error);
