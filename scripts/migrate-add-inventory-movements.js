const { Pool } = require('pg');

async function applyMigration() {
  const password = encodeURIComponent('Jutt@12453266');
  const connectionString = `postgresql://postgres.pddjqenodzettkjdjoof:${password}@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres`;

  console.log("Connecting to Supabase production database...");
  const pool = new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 10000,
  });

  try {
    console.log("Checking if inventory_movements already exists...");
    const check = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name = 'inventory_movements';
    `);

    if (check.rows.length > 0) {
      console.log("inventory_movements table already exists!");
    } else {
      console.log("Creating inventory_movements table with relational integrity...");
      await pool.query(`
        CREATE TABLE IF NOT EXISTS inventory_movements (
          "id" VARCHAR(64) PRIMARY KEY,
          "variantId" VARCHAR(64) NOT NULL REFERENCES product_variants("id") ON DELETE CASCADE,
          "quantity" INTEGER NOT NULL,
          "reason" VARCHAR(100) NOT NULL,
          "referenceId" VARCHAR(100) NULL,
          "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
        );

        CREATE INDEX IF NOT EXISTS idx_inv_mov_variant ON inventory_movements("variantId");
        CREATE INDEX IF NOT EXISTS idx_inv_mov_created ON inventory_movements("createdAt");
        CREATE INDEX IF NOT EXISTS idx_inv_mov_reason ON inventory_movements("reason");
        CREATE INDEX IF NOT EXISTS idx_inv_mov_reference ON inventory_movements("referenceId");
      `);
      console.log("SUCCESS! Created table inventory_movements and indexes!");
    }

    // Verify columns and constraints
    const cols = await pool.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'inventory_movements'
      ORDER BY ordinal_position;
    `);

    console.log("\nVerified inventory_movements columns in Supabase:");
    cols.rows.forEach(r => console.log(` - ${r.column_name}: ${r.data_type} (nullable: ${r.is_nullable})`));

    // Test a dry-run insert and rollback within a transaction to guarantee permissions and constraints
    console.log("\nTesting transactional integrity on inventory_movements...");
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      // Find one active product variant
      const v = await client.query('SELECT "id" FROM product_variants LIMIT 1');
      if (v.rows.length > 0) {
        const variantId = v.rows[0].id;
        const testId = `test-mov-${Date.now()}`;
        await client.query(
          'INSERT INTO inventory_movements ("id", "variantId", "quantity", "reason", "referenceId") VALUES ($1, $2, $3, $4, $5)',
          [testId, variantId, -1, 'ORDER_PLACED', 'test-order']
        );
        const readBack = await client.query('SELECT * FROM inventory_movements WHERE "id" = $1', [testId]);
        console.log("Test insert & query successful! Record:", readBack.rows[0]);
      }
      // Rollback so no test data remains
      await client.query("ROLLBACK");
      console.log("Transaction safely rolled back. No test data retained.");
    } finally {
      client.release();
    }

  } catch (err) {
    console.error("Migration failed:", err);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

applyMigration();
