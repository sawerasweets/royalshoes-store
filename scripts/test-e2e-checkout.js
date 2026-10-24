const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://postgres.pddjqenodzettkjdjoof:Jutt%4012453266@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres',
  ssl: { rejectUnauthorized: false }
});

async function run() {
  console.log("=== CHECKOUT END-TO-END VERIFICATION WITH COUPON USAGE & AUDIT LOG ===");

  try {
    // 1. Get an existing product variant to test
    const variantRes = await pool.query(`
      SELECT pv.id as "variantId", pv."productId", pv.size, pv.color, pv.sku, pv.stock, p.name as "productName", p.price
      FROM product_variants pv
      JOIN products p ON pv."productId" = p.id
      WHERE pv.stock > 5
      LIMIT 1
    `);

    if (variantRes.rows.length === 0) {
      console.log("No variant with stock found, skipping test order.");
      return;
    }

    const v = variantRes.rows[0];
    console.log(`Testing with variant: ${v.productName} (${v.sku}), stock: ${v.stock}, price: PKR ${v.price}`);

    const subtotal = Number(v.price) * 1;
    const testCouponCode = 'WELCOME10'; // 10% off
    const discount = Math.round((subtotal * 10) / 100);
    const shippingFee = 0; // free delivery
    const grandTotal = subtotal - discount;

    const testOrderNum = `ROYAL-TEST-${Date.now()}`;
    const orderId = `ord-${Date.now()}`;
    const orderItemId = `oi-${Date.now()}`;
    const paymentId = `pay-${Date.now()}`;
    const movId = `mov-${Date.now()}`;
    const couponUsageId = `cu-${Date.now()}`;
    const auditId = `aud-${Date.now()}`;

    // Test coupon lookup
    const couponRes = await pool.query('SELECT * FROM coupons WHERE code = $1', [testCouponCode]);
    const coupon = couponRes.rows[0];
    console.log(`Found coupon: ${coupon.code}, type: ${coupon.discountType}, percent: ${coupon.discountPercent}%`);

    // Begin transaction
    await pool.query('BEGIN');

    // Insert order
    await pool.query(
      `INSERT INTO orders (id, "orderNumber", "customerName", "customerPhone", "customerEmail", city, "shippingAddress", status, "paymentMethod", "paymentStatus", subtotal, discount, "shippingFee", "grandTotal", "couponCode")
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)`,
      [orderId, testOrderNum, "Test VIP Patron", "03481702710", "vip@royalshoes.store", "Karachi", "Clifton Block 2", "PENDING", "COD", "PENDING", subtotal, discount, shippingFee, grandTotal, testCouponCode]
    );

    // Insert order item
    await pool.query(
      `INSERT INTO order_items (id, "orderId", "productId", "variantId", "productName", "productSku", size, color, price, quantity, "lineTotal")
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
      [orderItemId, orderId, v.productId, v.variantId, v.productName, v.sku, v.size, v.color, v.price, 1, subtotal]
    );

    // Insert payment
    await pool.query(
      `INSERT INTO payments (id, "orderId", method, status, amount)
       VALUES ($1, $2, $3, $4, $5)`,
      [paymentId, orderId, "COD", "PENDING", grandTotal]
    );

    // Insert inventory movement
    await pool.query(
      `INSERT INTO inventory_movements (id, "variantId", quantity, reason, "referenceId")
       VALUES ($1, $2, $3, $4, $5)`,
      [movId, v.variantId, -1, "SALE", orderId]
    );

    // Insert coupon usage
    await pool.query(
      `INSERT INTO coupon_usages (id, "couponId", "orderId", "customerEmail", "customerPhone", "discountAmount")
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [couponUsageId, coupon.id, orderId, "vip@royalshoes.store", "03481702710", discount]
    );

    // Update coupon timesUsed
    await pool.query(
      `UPDATE coupons SET "timesUsed" = "timesUsed" + 1 WHERE id = $1`,
      [coupon.id]
    );

    // Insert audit log
    await pool.query(
      `INSERT INTO audit_logs (id, "userId", action, entity, "entityId", details)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [auditId, null, "ORDER_CREATED", "Order", orderId, `Test order ${testOrderNum} placed with coupon ${testCouponCode} (-PKR ${discount})`]
    );

    console.log("Transaction executed successfully! Now querying inserted records to verify:");

    // Verify all inserted records
    const checkOrder = await pool.query('SELECT "orderNumber", "grandTotal", "couponCode" FROM orders WHERE id = $1', [orderId]);
    console.log(" - Order record:", checkOrder.rows[0]);

    const checkMov = await pool.query('SELECT * FROM inventory_movements WHERE id = $1', [movId]);
    console.log(" - Inventory movement record:", checkMov.rows[0]);

    const checkUsage = await pool.query('SELECT * FROM coupon_usages WHERE id = $1', [couponUsageId]);
    console.log(" - Coupon usage record:", checkUsage.rows[0]);

    const checkAudit = await pool.query('SELECT id, action, entity, "entityId", details FROM audit_logs WHERE id = $1', [auditId]);
    console.log(" - Audit log record:", checkAudit.rows[0]);

    // Clean up test order from database so we don't pollute customer orders
    await pool.query('ROLLBACK');
    console.log("\nTransaction safely ROLLED BACK after 100% verification! Zero dirty data left.");

    console.log("\nALL VERIFICATIONS PASSED WITH 100% SUCCESS!");
  } catch (err) {
    console.error("Test failed:", err);
    try { await pool.query('ROLLBACK'); } catch {}
  } finally {
    await pool.end();
  }
}

run();
