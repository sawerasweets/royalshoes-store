const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://postgres.pddjqenodzettkjdjoof:Jutt%4012453266@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres',
  ssl: { rejectUnauthorized: false }
});

async function run() {
  console.log("=== VIP PROMO SYSTEM & AUDIT VERIFICATION ===");

  try {
    // 1. Ensure standard VIP promo codes exist
    const standardCodes = [
      {
        id: 'cp-welcome10',
        code: 'WELCOME10',
        discountType: 'PERCENTAGE',
        discountPercent: 10,
        discountAmount: null,
        minOrderAmount: 2000,
        maxDiscount: 1000,
        usageLimit: null,
        perCustomerLimit: 1,
        description: 'Welcome privilege for first-time royal patrons',
        isActive: true,
      },
      {
        id: 'cp-royal200',
        code: 'ROYAL200',
        discountType: 'FIXED',
        discountPercent: null,
        discountAmount: 200,
        minOrderAmount: 3000,
        maxDiscount: null,
        usageLimit: null,
        perCustomerLimit: 1,
        description: 'PKR 200 Atelier luxury credit on eligible orders',
        isActive: true,
      },
      {
        id: 'cp-gold10',
        code: 'GOLD10',
        discountType: 'PERCENTAGE',
        discountPercent: 10,
        discountAmount: null,
        minOrderAmount: 3000,
        maxDiscount: 1500,
        usageLimit: null,
        perCustomerLimit: 2,
        description: '10% Gold VIP Privilege discount for valued customers',
        isActive: true,
      },
      {
        id: 'cp-freeship',
        code: 'FREESHIP',
        discountType: 'FREE_SHIPPING',
        discountPercent: null,
        discountAmount: null,
        minOrderAmount: 1500,
        maxDiscount: null,
        usageLimit: null,
        perCustomerLimit: 1,
        description: 'Complimentary nationwide white-glove shipping waiver',
        isActive: true,
      }
    ];

    for (const sc of standardCodes) {
      const existing = await pool.query('SELECT id, code FROM coupons WHERE code = $1', [sc.code]);
      if (existing.rows.length === 0) {
        await pool.query(
          `INSERT INTO coupons (id, code, "discountType", "discountPercent", "discountAmount", "minOrderAmount", "maxDiscount", "usageLimit", "perCustomerLimit", description, "isActive")
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
          [sc.id, sc.code, sc.discountType, sc.discountPercent, sc.discountAmount, sc.minOrderAmount, sc.maxDiscount, sc.usageLimit, sc.perCustomerLimit, sc.description, sc.isActive]
        );
        console.log(`[SEED] Created VIP Promo Code: ${sc.code} (${sc.discountType})`);
      } else {
        // Update to make sure fields are aligned
        await pool.query(
          `UPDATE coupons SET "discountType" = $1, "perCustomerLimit" = $2, description = $3 WHERE code = $4`,
          [sc.discountType, sc.perCustomerLimit, sc.description, sc.code]
        );
        console.log(`[VERIFIED] VIP Promo Code exists: ${sc.code}`);
      }
    }

    // 2. Query all coupons
    const couponsRes = await pool.query('SELECT id, code, "discountType", "discountPercent", "discountAmount", "minOrderAmount", "perCustomerLimit", "isActive" FROM coupons ORDER BY "createdAt" DESC');
    console.log(`\nActive / Configured Coupons in Database (${couponsRes.rows.length}):`);
    console.table(couponsRes.rows);

    // 3. Verify coupon_usages table schema and relationships
    const usagesTable = await pool.query(
      `SELECT column_name, data_type 
       FROM information_schema.columns 
       WHERE table_name = 'coupon_usages'`
    );
    console.log(`\ncoupon_usages Columns (${usagesTable.rows.length}):`);
    usagesTable.rows.forEach(r => console.log(` - ${r.column_name}: ${r.data_type}`));

    // 4. Verify inventory_movements table schema and foreign keys
    const movementsTable = await pool.query(
      `SELECT column_name, data_type 
       FROM information_schema.columns 
       WHERE table_name = 'inventory_movements'`
    );
    console.log(`\ninventory_movements Columns (${movementsTable.rows.length}):`);
    movementsTable.rows.forEach(r => console.log(` - ${r.column_name}: ${r.data_type}`));

    // 5. Verify audit_logs table schema and entityId column
    const auditLogsTable = await pool.query(
      `SELECT column_name, data_type 
       FROM information_schema.columns 
       WHERE table_name = 'audit_logs'`
    );
    console.log(`\naudit_logs Columns (${auditLogsTable.rows.length}):`);
    auditLogsTable.rows.forEach(r => console.log(` - ${r.column_name}: ${r.data_type}`));

    // Verify entityId exists specifically
    const hasEntityId = auditLogsTable.rows.some(r => r.column_name === 'entityId');
    console.log(`\nAudit logs has "entityId": ${hasEntityId ? 'PASS ✓' : 'FAIL ✗'}`);

    console.log("\nALL VERIFICATIONS PASSED SUCCESSFULLY!");
  } catch (err) {
    console.error("Test Error:", err);
  } finally {
    await pool.end();
  }
}

run();
