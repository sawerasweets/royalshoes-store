const { Pool } = require('pg');

async function migratePromoSystem() {
  const password = encodeURIComponent('Jutt@12453266');
  const connectionString = `postgresql://postgres.pddjqenodzettkjdjoof:${password}@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres`;

  console.log("Connecting to Supabase PostgreSQL database...");
  const pool = new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 10000,
  });

  try {
    console.log("1. Adding missing columns to coupons table if not exists...");
    await pool.query(`
      ALTER TABLE coupons 
      ADD COLUMN IF NOT EXISTS "discountType" VARCHAR(32) DEFAULT 'PERCENTAGE',
      ADD COLUMN IF NOT EXISTS "perCustomerLimit" INTEGER DEFAULT 1,
      ADD COLUMN IF NOT EXISTS "description" VARCHAR(255) NULL;
    `);

    // Synchronize startDate and endDate defaults / mappings
    await pool.query(`
      UPDATE coupons 
      SET "discountType" = 'FIXED' 
      WHERE "discountAmount" IS NOT NULL AND ("discountPercent" IS NULL OR "discountPercent" = 0);
    `);

    await pool.query(`
      UPDATE coupons 
      SET "discountType" = 'PERCENTAGE' 
      WHERE "discountPercent" IS NOT NULL AND "discountPercent" > 0;
    `);

    console.log("2. Creating coupon_usages table with relational constraints and indexes...");
    await pool.query(`
      CREATE TABLE IF NOT EXISTS coupon_usages (
        "id" VARCHAR(64) PRIMARY KEY,
        "couponId" VARCHAR(64) NOT NULL REFERENCES coupons("id") ON DELETE CASCADE,
        "orderId" VARCHAR(64) NOT NULL REFERENCES orders("id") ON DELETE CASCADE,
        "customerEmail" VARCHAR(191) NULL,
        "customerPhone" VARCHAR(64) NULL,
        "discountAmount" NUMERIC(10,2) NOT NULL DEFAULT 0.00,
        "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX IF NOT EXISTS idx_coupon_usage_coupon ON coupon_usages("couponId");
      CREATE INDEX IF NOT EXISTS idx_coupon_usage_order ON coupon_usages("orderId");
      CREATE INDEX IF NOT EXISTS idx_coupon_usage_phone ON coupon_usages("customerPhone");
      CREATE INDEX IF NOT EXISTS idx_coupon_usage_email ON coupon_usages("customerEmail");
    `);

    console.log("3. Verifying columns in coupons table...");
    const colsCoupons = await pool.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'coupons'
      ORDER BY ordinal_position;
    `);
    colsCoupons.rows.forEach(r => console.log(` - coupons.${r.column_name}: ${r.data_type}`));

    console.log("\n4. Verifying columns in coupon_usages table...");
    const colsUsages = await pool.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'coupon_usages'
      ORDER BY ordinal_position;
    `);
    colsUsages.rows.forEach(r => console.log(` - coupon_usages.${r.column_name}: ${r.data_type}`));

    console.log("\nSUCCESS! Promo code and discount tracking schema successfully migrated!");
  } catch (err) {
    console.error("Migration error:", err);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

migratePromoSystem();
