const mysql = require('mysql2/promise');

async function initDatabase() {
  console.log("Connecting to MySQL server at 127.0.0.1:3306...");
  const conn = await mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    multipleStatements: true,
  });

  console.log("Creating database sawera_store_db if not exists...");
  await conn.query(`
    CREATE DATABASE IF NOT EXISTS sawera_store_db 
    CHARACTER SET utf8mb4 
    COLLATE utf8mb4_unicode_ci;
  `);

  await conn.query(`USE sawera_store_db;`);

  console.log("Creating tables with relational integrity...");

  const schemaSql = `
    CREATE TABLE IF NOT EXISTS users (
      id VARCHAR(64) PRIMARY KEY,
      email VARCHAR(191) NOT NULL UNIQUE,
      passwordHash VARCHAR(255) NOT NULL,
      name VARCHAR(191) NOT NULL,
      phone VARCHAR(64) NULL,
      role ENUM('CUSTOMER', 'ADMIN', 'STAFF') NOT NULL DEFAULT 'CUSTOMER',
      createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_users_role (role)
    ) ENGINE=InnoDB;

    CREATE TABLE IF NOT EXISTS sessions (
      id VARCHAR(64) PRIMARY KEY,
      userId VARCHAR(64) NOT NULL,
      token VARCHAR(512) NOT NULL UNIQUE,
      expiresAt DATETIME NOT NULL,
      createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
      INDEX idx_sessions_user (userId)
    ) ENGINE=InnoDB;

    CREATE TABLE IF NOT EXISTS addresses (
      id VARCHAR(64) PRIMARY KEY,
      userId VARCHAR(64) NOT NULL,
      title VARCHAR(64) NOT NULL DEFAULT 'Home',
      fullName VARCHAR(191) NOT NULL,
      phone VARCHAR(64) NOT NULL,
      city VARCHAR(100) NOT NULL,
      addressLine TEXT NOT NULL,
      postalCode VARCHAR(32) NULL,
      isDefault BOOLEAN NOT NULL DEFAULT FALSE,
      createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
      INDEX idx_addresses_user (userId)
    ) ENGINE=InnoDB;

    CREATE TABLE IF NOT EXISTS categories (
      id VARCHAR(64) PRIMARY KEY,
      name VARCHAR(100) NOT NULL UNIQUE,
      slug VARCHAR(100) NOT NULL UNIQUE,
      description TEXT NULL,
      imageUrl VARCHAR(512) NULL,
      displayOrder INT NOT NULL DEFAULT 0,
      isActive BOOLEAN NOT NULL DEFAULT TRUE,
      showInNav BOOLEAN NOT NULL DEFAULT TRUE,
      createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_categories_order (displayOrder),
      INDEX idx_categories_slug (slug)
    ) ENGINE=InnoDB;

    CREATE TABLE IF NOT EXISTS subcategories (
      id VARCHAR(64) PRIMARY KEY,
      categoryId VARCHAR(64) NOT NULL,
      name VARCHAR(100) NOT NULL,
      slug VARCHAR(100) NOT NULL UNIQUE,
      description TEXT NULL,
      imageUrl VARCHAR(512) NULL,
      displayOrder INT NOT NULL DEFAULT 0,
      isActive BOOLEAN NOT NULL DEFAULT TRUE,
      createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (categoryId) REFERENCES categories(id) ON DELETE CASCADE,
      UNIQUE KEY uq_cat_sub (categoryId, name),
      INDEX idx_sub_category (categoryId),
      INDEX idx_sub_slug (slug)
    ) ENGINE=InnoDB;

    CREATE TABLE IF NOT EXISTS products (
      id VARCHAR(64) PRIMARY KEY,
      categoryId VARCHAR(64) NOT NULL,
      subcategoryId VARCHAR(64) NULL,
      name VARCHAR(191) NOT NULL,
      slug VARCHAR(191) NOT NULL UNIQUE,
      sku VARCHAR(100) NOT NULL UNIQUE,
      description TEXT NOT NULL,
      price DECIMAL(10, 2) NOT NULL,
      originalPrice DECIMAL(10, 2) NULL,
      isPublished BOOLEAN NOT NULL DEFAULT TRUE,
      isFeatured BOOLEAN NOT NULL DEFAULT FALSE,
      isNewArrival BOOLEAN NOT NULL DEFAULT FALSE,
      isBestseller BOOLEAN NOT NULL DEFAULT FALSE,
      createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (categoryId) REFERENCES categories(id) ON DELETE RESTRICT,
      FOREIGN KEY (subcategoryId) REFERENCES subcategories(id) ON DELETE SET NULL,
      INDEX idx_products_cat (categoryId),
      INDEX idx_products_sub (subcategoryId),
      INDEX idx_products_pub (isPublished),
      INDEX idx_products_feat (isFeatured),
      INDEX idx_products_new (isNewArrival),
      INDEX idx_products_best (isBestseller),
      INDEX idx_products_price (price)
    ) ENGINE=InnoDB;

    CREATE TABLE IF NOT EXISTS product_images (
      id VARCHAR(64) PRIMARY KEY,
      productId VARCHAR(64) NOT NULL,
      url VARCHAR(512) NOT NULL,
      altText VARCHAR(255) NULL,
      displayOrder INT NOT NULL DEFAULT 0,
      isPrimary BOOLEAN NOT NULL DEFAULT FALSE,
      createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (productId) REFERENCES products(id) ON DELETE CASCADE,
      INDEX idx_img_prod (productId)
    ) ENGINE=InnoDB;

    CREATE TABLE IF NOT EXISTS product_variants (
      id VARCHAR(64) PRIMARY KEY,
      productId VARCHAR(64) NOT NULL,
      size VARCHAR(32) NOT NULL,
      color VARCHAR(64) NOT NULL,
      sku VARCHAR(100) NULL UNIQUE,
      stock INT NOT NULL DEFAULT 0,
      additionalPrice DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
      createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (productId) REFERENCES products(id) ON DELETE CASCADE,
      UNIQUE KEY uq_prod_size_color (productId, size, color),
      INDEX idx_var_prod (productId)
    ) ENGINE=InnoDB;

    CREATE TABLE IF NOT EXISTS inventory_movements (
      id VARCHAR(64) PRIMARY KEY,
      variantId VARCHAR(64) NOT NULL,
      quantity INT NOT NULL,
      reason VARCHAR(100) NOT NULL,
      referenceId VARCHAR(100) NULL,
      createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (variantId) REFERENCES product_variants(id) ON DELETE CASCADE,
      INDEX idx_mov_var (variantId)
    ) ENGINE=InnoDB;

    CREATE TABLE IF NOT EXISTS carts (
      id VARCHAR(64) PRIMARY KEY,
      userId VARCHAR(64) NULL UNIQUE,
      sessionId VARCHAR(128) NULL UNIQUE,
      createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
      INDEX idx_cart_user (userId),
      INDEX idx_cart_sess (sessionId)
    ) ENGINE=InnoDB;

    CREATE TABLE IF NOT EXISTS cart_items (
      id VARCHAR(64) PRIMARY KEY,
      cartId VARCHAR(64) NOT NULL,
      productId VARCHAR(64) NOT NULL,
      variantId VARCHAR(64) NOT NULL,
      quantity INT NOT NULL DEFAULT 1,
      createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (cartId) REFERENCES carts(id) ON DELETE CASCADE,
      FOREIGN KEY (productId) REFERENCES products(id) ON DELETE CASCADE,
      FOREIGN KEY (variantId) REFERENCES product_variants(id) ON DELETE CASCADE,
      UNIQUE KEY uq_cart_variant (cartId, variantId),
      INDEX idx_ci_cart (cartId)
    ) ENGINE=InnoDB;

    CREATE TABLE IF NOT EXISTS orders (
      id VARCHAR(64) PRIMARY KEY,
      orderNumber VARCHAR(64) NOT NULL UNIQUE,
      userId VARCHAR(64) NULL,
      customerName VARCHAR(191) NOT NULL,
      customerPhone VARCHAR(64) NOT NULL,
      customerEmail VARCHAR(191) NULL,
      city VARCHAR(100) NOT NULL,
      shippingAddress TEXT NOT NULL,
      deliveryNotes TEXT NULL,
      status ENUM('PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED') NOT NULL DEFAULT 'PENDING',
      paymentMethod ENUM('COD', 'EASYPAISA', 'BANK_TRANSFER') NOT NULL DEFAULT 'COD',
      paymentStatus ENUM('PENDING', 'VERIFIED', 'REJECTED', 'REFUNDED') NOT NULL DEFAULT 'PENDING',
      subtotal DECIMAL(10, 2) NOT NULL,
      discount DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
      shippingFee DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
      grandTotal DECIMAL(10, 2) NOT NULL,
      couponCode VARCHAR(64) NULL,
      trackingNumber VARCHAR(100) NULL,
      internalNotes TEXT NULL,
      createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE SET NULL,
      INDEX idx_orders_num (orderNumber),
      INDEX idx_orders_user (userId),
      INDEX idx_orders_status (status),
      INDEX idx_orders_pay (paymentStatus),
      INDEX idx_orders_created (createdAt)
    ) ENGINE=InnoDB;

    CREATE TABLE IF NOT EXISTS order_items (
      id VARCHAR(64) PRIMARY KEY,
      orderId VARCHAR(64) NOT NULL,
      productId VARCHAR(64) NULL,
      variantId VARCHAR(64) NULL,
      productName VARCHAR(191) NOT NULL,
      productSku VARCHAR(100) NOT NULL,
      size VARCHAR(32) NOT NULL,
      color VARCHAR(64) NOT NULL,
      price DECIMAL(10, 2) NOT NULL,
      quantity INT NOT NULL,
      lineTotal DECIMAL(10, 2) NOT NULL,
      imageUrl VARCHAR(512) NULL,
      FOREIGN KEY (orderId) REFERENCES orders(id) ON DELETE CASCADE,
      FOREIGN KEY (productId) REFERENCES products(id) ON DELETE SET NULL,
      FOREIGN KEY (variantId) REFERENCES product_variants(id) ON DELETE SET NULL,
      INDEX idx_oi_order (orderId)
    ) ENGINE=InnoDB;

    CREATE TABLE IF NOT EXISTS payments (
      id VARCHAR(64) PRIMARY KEY,
      orderId VARCHAR(64) NOT NULL,
      method ENUM('COD', 'EASYPAISA', 'BANK_TRANSFER') NOT NULL,
      status ENUM('PENDING', 'VERIFIED', 'REJECTED', 'REFUNDED') NOT NULL DEFAULT 'PENDING',
      amount DECIMAL(10, 2) NOT NULL,
      referenceNumber VARCHAR(191) NULL,
      proofImageUrl VARCHAR(512) NULL,
      verifiedBy VARCHAR(191) NULL,
      verifiedAt DATETIME NULL,
      rejectionReason TEXT NULL,
      notes TEXT NULL,
      createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (orderId) REFERENCES orders(id) ON DELETE CASCADE,
      INDEX idx_pay_order (orderId),
      INDEX idx_pay_ref (referenceNumber)
    ) ENGINE=InnoDB;

    CREATE TABLE IF NOT EXISTS coupons (
      id VARCHAR(64) PRIMARY KEY,
      code VARCHAR(64) NOT NULL UNIQUE,
      discountPercent DECIMAL(5, 2) NULL,
      discountAmount DECIMAL(10, 2) NULL,
      minOrderAmount DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
      maxDiscount DECIMAL(10, 2) NULL,
      usageLimit INT NULL,
      timesUsed INT NOT NULL DEFAULT 0,
      isActive BOOLEAN NOT NULL DEFAULT TRUE,
      startsAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      expiresAt DATETIME NULL,
      createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_coupon_code (code),
      INDEX idx_coupon_active (isActive)
    ) ENGINE=InnoDB;

    CREATE TABLE IF NOT EXISTS wishlist_items (
      id VARCHAR(64) PRIMARY KEY,
      userId VARCHAR(64) NOT NULL,
      productId VARCHAR(64) NOT NULL,
      createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (productId) REFERENCES products(id) ON DELETE CASCADE,
      UNIQUE KEY uq_user_prod (userId, productId),
      INDEX idx_wish_user (userId)
    ) ENGINE=InnoDB;

    CREATE TABLE IF NOT EXISTS store_settings (
      id VARCHAR(32) PRIMARY KEY DEFAULT 'singleton',
      storeName VARCHAR(100) NOT NULL DEFAULT 'SAWERA',
      storeTagline VARCHAR(191) NOT NULL DEFAULT 'STEP INTO ELEGANCE',
      logoUrl VARCHAR(512) NULL DEFAULT '/brand/sawera-logo.png',
      businessPhone VARCHAR(64) NOT NULL DEFAULT '03481702710',
      whatsappNumber VARCHAR(64) NOT NULL DEFAULT '923481702710',
      telephoneLink VARCHAR(64) NOT NULL DEFAULT 'tel:+923481702710',
      country VARCHAR(100) NOT NULL DEFAULT 'Pakistan',
      currencySymbol VARCHAR(16) NOT NULL DEFAULT 'PKR',
      freeShippingThreshold DECIMAL(10, 2) NOT NULL DEFAULT 5000.00,
      standardShippingFee DECIMAL(10, 2) NOT NULL DEFAULT 250.00,
      easypaisaInstructions TEXT NULL,
      bankInstructions TEXT NULL,
      announcementText TEXT NULL,
      showAnnouncement BOOLEAN NOT NULL DEFAULT TRUE,
      updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB;

    CREATE TABLE IF NOT EXISTS homepage_campaigns (
      id VARCHAR(64) PRIMARY KEY,
      title VARCHAR(191) NOT NULL,
      subtitle VARCHAR(191) NULL,
      tagline VARCHAR(191) NULL,
      ctaText VARCHAR(64) NOT NULL DEFAULT 'EXPLORE COLLECTION',
      ctaLink VARCHAR(255) NOT NULL DEFAULT '/all',
      imageUrl VARCHAR(512) NULL,
      isActive BOOLEAN NOT NULL DEFAULT TRUE,
      displayOrder INT NOT NULL DEFAULT 0,
      createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB;

    CREATE TABLE IF NOT EXISTS audit_logs (
      id VARCHAR(64) PRIMARY KEY,
      userId VARCHAR(64) NULL,
      action VARCHAR(100) NOT NULL,
      entity VARCHAR(100) NOT NULL,
      entityId VARCHAR(100) NULL,
      details TEXT NULL,
      ipAddress VARCHAR(64) NULL,
      createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_audit_act (action),
      INDEX idx_audit_created (createdAt)
    ) ENGINE=InnoDB;
  `;

  await conn.query(schemaSql);
  console.log("Database schema successfully verified and created in sawera_store_db!");
  await conn.end();
}

initDatabase().catch(err => {
  console.error("Database initialization failed:", err);
  process.exit(1);
});
