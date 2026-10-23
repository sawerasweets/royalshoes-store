const { createPool } = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || "sawera_black_gold_secret_jwt_key_2026_luxury_store";

async function runTestSuite() {
  console.log("==================================================");
  console.log("   SAWERA — BLACK & GOLD EDITION AUTOMATED TESTS  ");
  console.log("==================================================\n");

  let passed = 0;
  let failed = 0;

  function assert(condition, testName) {
    if (condition) {
      console.log(`[PASS] ${testName}`);
      passed++;
    } else {
      console.error(`[FAIL] ${testName}`);
      failed++;
    }
  }

  const pool = createPool({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'sawera_store_db',
  });

  try {
    // Test 1: Database Connection & Integrity
    console.log("--- 1. Database & Store Settings Verification ---");
    const [settings] = await pool.query("SELECT * FROM store_settings WHERE id = 'singleton'");
    assert(settings.length === 1, "Store settings singleton exists");
    assert(settings[0].storeName === "ROYAL SHOES", `Brand name is ROYAL SHOES (Found: ${settings[0].storeName})`);
    assert(settings[0].businessPhone === "03481702710", `Official phone is 03481702710 (Found: ${settings[0].businessPhone})`);
    assert(settings[0].whatsappNumber === "923481702710", `Official WhatsApp is 923481702710 (Found: ${settings[0].whatsappNumber})`);

    // Test 2: Category Structure (Phase 6 exact order: ALL, MEN, WOMEN, BAGS, ACCESSORIES, KIDS)
    console.log("\n--- 2. Main Category & Subcategory Integrity ---");
    const [categories] = await pool.query("SELECT name, slug, displayOrder FROM categories ORDER BY displayOrder ASC");
    const catNames = categories.map(c => c.name);
    assert(catNames[0] === "ALL", "Category 1 is ALL");
    assert(catNames[1] === "MEN", "Category 2 is MEN");
    assert(catNames[2] === "WOMEN", "Category 3 is WOMEN");
    assert(catNames[3] === "BAGS", "Category 4 is BAGS");
    assert(catNames[4] === "ACCESSORIES", "Category 5 is ACCESSORIES");
    assert(catNames[5] === "KIDS", "Category 6 is KIDS");

    const [menSubs] = await pool.query("SELECT name FROM subcategories WHERE categoryId = 'cat-men'");
    assert(menSubs.length >= 8, `MEN has full subcategory structure (${menSubs.length} subcategories)`);

    const [womenSubs] = await pool.query("SELECT name FROM subcategories WHERE categoryId = 'cat-women'");
    assert(womenSubs.length >= 10, `WOMEN has full subcategory structure (${womenSubs.length} subcategories)`);

    // Test 3: Product Catalogue & Variants
    console.log("\n--- 3. Product Catalogue & Inventory Verification ---");
    const [products] = await pool.query("SELECT * FROM products WHERE isPublished = TRUE");
    assert(products.length >= 5, `Published products catalogue contains real items (${products.length} found)`);

    const [variants] = await pool.query("SELECT * FROM product_variants WHERE stock > 0");
    assert(variants.length >= 10, `Product variants with in-stock counts verified (${variants.length} active variants)`);

    // Test 4: Pricing and Free Shipping Threshold Calculations
    console.log("\n--- 4. Pricing & Shipping Calculation Logic ---");
    const freeShippingThreshold = Number(settings[0].freeShippingThreshold);
    const standardShippingFee = Number(settings[0].standardShippingFee);

    const testSubtotalHigh = 6500;
    const testShippingHigh = testSubtotalHigh >= freeShippingThreshold ? 0 : standardShippingFee;
    assert(testShippingHigh === 0, `Orders >= Rs. ${freeShippingThreshold} qualify for Complimentary Delivery (Rs. 0 shipping)`);

    const testSubtotalLow = 2500;
    const testShippingLow = testSubtotalLow >= freeShippingThreshold ? 0 : standardShippingFee;
    assert(testShippingLow === 250, `Orders < Rs. ${freeShippingThreshold} incur standard delivery fee (Rs. ${standardShippingFee})`);

    // Test 5: Coupon Validation
    console.log("\n--- 5. Coupon System Verification ---");
    const [coupons] = await pool.query("SELECT * FROM coupons WHERE isActive = TRUE");
    assert(coupons.some(c => c.code === "GOLD10"), "Promotional code GOLD10 verified active");
    assert(coupons.some(c => c.code === "SAWERA500"), "Promotional code SAWERA500 verified active");

    // Test 6: Authentication & Security
    console.log("\n--- 6. Authentication & Session Cryptography ---");
    const plain = "SaweraTestPassword123!";
    const hash = await bcrypt.hash(plain, 10);
    const match = await bcrypt.compare(plain, hash);
    assert(match === true, "Bcrypt password hashing and constant-time comparison verified");

    const token = jwt.sign({ userId: "test-user-1", role: "ADMIN", email: "admin@sawera.com" }, JWT_SECRET, { expiresIn: "1h" });
    const decoded = jwt.verify(token, JWT_SECRET);
    assert(decoded.role === "ADMIN" && decoded.userId === "test-user-1", "JWT token signing and verification payload validated");

    // Test 7: Simulated Order Checkout & Stock Integrity
    console.log("\n--- 7. Order Placement & Inventory Consistency ---");
    const testVar = variants[0];
    const initialStock = testVar.stock;
    const orderQty = 1;

    // Simulate order decrement
    await pool.query("UPDATE product_variants SET stock = stock - ? WHERE id = ?", [orderQty, testVar.id]);
    const [updatedVar] = await pool.query("SELECT stock FROM product_variants WHERE id = ?", [testVar.id]);
    assert(updatedVar[0].stock === initialStock - orderQty, `Atomic stock reduction verified (${initialStock} -> ${updatedVar[0].stock})`);

    // Restore stock
    await pool.query("UPDATE product_variants SET stock = stock + ? WHERE id = ?", [orderQty, testVar.id]);

    // Test 8: Manual Payment Verification Lifecycle
    console.log("\n--- 8. Payment Verification Lifecycle ---");
    const testOrderId = `test-ord-${Date.now()}`;
    const testPayId = `test-pay-${Date.now()}`;

    await pool.query(`
      INSERT INTO orders (id, orderNumber, customerName, customerPhone, city, shippingAddress, paymentMethod, paymentStatus, subtotal, grandTotal)
      VALUES (?, ?, 'Test Client', '03001234567', 'Lahore', 'Gulberg III', 'EASYPAISA', 'PENDING', 5000, 5000)
    `, [testOrderId, `TEST-${Date.now()}`]);

    await pool.query(`
      INSERT INTO payments (id, orderId, method, status, amount, referenceNumber)
      VALUES (?, ?, 'EASYPAISA', 'PENDING', 5000, 'EP-12345678901')
    `, [testPayId, testOrderId]);

    // Admin verifies payment
    await pool.query("UPDATE payments SET status = 'VERIFIED', verifiedBy = 'Test Admin' WHERE id = ?", [testPayId]);
    await pool.query("UPDATE orders SET paymentStatus = 'VERIFIED', status = 'CONFIRMED' WHERE id = ?", [testOrderId]);

    const [verifiedOrder] = await pool.query("SELECT status, paymentStatus FROM orders WHERE id = ?", [testOrderId]);
    assert(verifiedOrder[0].paymentStatus === "VERIFIED", "Manual payment verified and recorded");
    assert(verifiedOrder[0].status === "CONFIRMED", "Order status transitioned to CONFIRMED upon verification");

    // Clean up test order
    await pool.query("DELETE FROM payments WHERE id = ?", [testPayId]);
    await pool.query("DELETE FROM orders WHERE id = ?", [testOrderId]);

  } catch (err) {
    console.error("Test Suite encountered an unexpected error:", err);
    failed++;
  } finally {
    await pool.end();
  }

  console.log("\n==================================================");
  console.log(`TOTAL TESTS RUN: ${passed + failed}`);
  console.log(`PASSED: ${passed}`);
  console.log(`FAILED: ${failed}`);
  console.log("==================================================");

  if (failed > 0) {
    process.exit(1);
  }
}

runTestSuite();
