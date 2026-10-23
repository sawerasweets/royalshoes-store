const queries = [
  "SELECT * FROM homepage_campaigns WHERE isActive = TRUE ORDER BY displayOrder ASC LIMIT 1",
  "SELECT p.*, c.name as categoryName, s.name as subcategoryName FROM products p LEFT JOIN categories c ON p.categoryId = c.id WHERE p.isPublished = ? AND p.isFeatured = ?",
  "INSERT INTO users (id, email, passwordHash, name, phone, role) VALUES (?, ?, ?, ?, ?, ?)",
  "UPDATE store_settings SET `storeName` = ?, `storeTagline` = ? WHERE id = 'singleton'",
  "SELECT * FROM subcategories WHERE categoryId = ? AND isActive = TRUE ORDER BY displayOrder ASC",
  "SELECT * FROM order_items WHERE orderId IN (?, ?)",
  "INSERT INTO product_variants (id, productId, size, color, sku, stock, additionalPrice) VALUES (?, ?, ?, ?, ?, ?, ?)"
];

const CAMEL_WORDS = [
  "isActive", "showInNav", "isPublished", "isFeatured", "isNewArrival", "isBestseller",
  "displayOrder", "categoryId", "categoryName", "categorySlug", "subcategoryId",
  "subcategoryName", "subcategorySlug", "originalPrice", "orderId", "userId", "productId",
  "variantId", "orderNumber", "customerName", "customerPhone", "customerEmail",
  "shippingAddress", "deliveryNotes", "paymentMethod", "paymentStatus", "shippingFee",
  "grandTotal", "couponCode", "productName", "productSku", "lineTotal", "imageUrl",
  "proofImageUrl", "referenceNumber", "discountPercent", "discountAmount", "minOrderAmount",
  "maxDiscount", "usageLimit", "timesUsed", "startDate", "endDate", "referenceId",
  "ipAddress", "passwordHash", "businessPhone", "whatsappNumber", "telephoneLink",
  "currencySymbol", "freeShippingThreshold", "standardShippingFee", "easypaisaInstructions",
  "bankInstructions", "announcementText", "showAnnouncement", "createdAt", "updatedAt",
  "storeName", "storeTagline", "logoUrl", "verifiedBy", "verifiedAt", "postalCode",
  "fullName", "addressLine", "isDefault", "isPrimary", "additionalPrice"
];

// Sort by length descending so longer words match first
CAMEL_WORDS.sort((a, b) => b.length - a.length);

const CAMEL_REGEX = new RegExp(`(?<!["\`])\\b(${CAMEL_WORDS.join('|')})\\b(?!["\`])`, 'g');

function convertQueryForPg(sql, params = []) {
  let idx = 0;
  // Convert backticks to quotes
  let pgSql = sql.replace(/`([a-zA-Z0-9_]+)`/g, '"$1"');
  // Quote all known camelCase words if not already quoted
  pgSql = pgSql.replace(CAMEL_REGEX, '"$1"');
  // Convert ? to $1, $2, ...
  pgSql = pgSql.replace(/\?/g, () => `$${++idx}`);
  if (pgSql.includes("ON DUPLICATE KEY UPDATE")) {
    pgSql = pgSql.replace(
      /ON DUPLICATE KEY UPDATE.*/i,
      'ON CONFLICT ("userId", "productId") DO UPDATE SET "createdAt" = CURRENT_TIMESTAMP'
    );
  }
  return { sql: pgSql, params };
}

queries.forEach(q => {
  console.log("\nIN: ", q);
  console.log("OUT:", convertQueryForPg(q).sql);
});
