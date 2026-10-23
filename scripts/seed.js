const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

async function seed() {
  console.log("Starting SAWERA database seeding...");
  const conn = await mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'sawera_store_db',
    multipleStatements: true,
  });

  // 1. Seed Store Settings
  console.log("Seeding Store Settings...");
  await conn.query(`
    INSERT INTO store_settings (
      id, storeName, storeTagline, logoUrl, businessPhone, whatsappNumber, 
      telephoneLink, country, currencySymbol, freeShippingThreshold, 
      standardShippingFee, easypaisaInstructions, bankInstructions, 
      announcementText, showAnnouncement
    ) VALUES (
      'singleton', 'SAWERA', 'STEP INTO ELEGANCE', '/brand/sawera-logo.png',
      '03481702710', '923481702710', 'tel:+923481702710', 'Pakistan', 'PKR',
      5000.00, 250.00,
      'Transfer to SAWERA Official Easypaisa Account: 03481702710 (Title: SAWERA). Enter the 11-digit TRX ID below after sending.',
      'Bank: Meezan Bank Ltd | Account Title: SAWERA LUXURY | Account/IBAN: PK00MEZN0000001234567890 | Reference: Your Order Number.',
      'COMPLIMENTARY NATIONWIDE SHIPPING ACROSS PAKISTAN ON ORDERS OVER RS. 5,000',
      TRUE
    ) ON DUPLICATE KEY UPDATE 
      storeName=VALUES(storeName),
      businessPhone=VALUES(businessPhone),
      whatsappNumber=VALUES(whatsappNumber);
  `);

  // 2. Seed Admin User
  console.log("Seeding Admin User...");
  const adminPasswordHash = await bcrypt.hash("SaweraAdmin2026!", 10);
  await conn.query(`
    INSERT INTO users (id, email, passwordHash, name, phone, role)
    VALUES ('admin-01', 'admin@sawera.com', ?, 'Sawera Administrator', '03481702710', 'ADMIN')
    ON DUPLICATE KEY UPDATE passwordHash=VALUES(passwordHash), role='ADMIN';
  `, [adminPasswordHash]);

  // 3. Seed Main Categories & Subcategories
  console.log("Seeding Categories & Subcategories...");
  const categories = [
    {
      id: "cat-all",
      name: "ALL",
      slug: "all",
      description: "Explore the comprehensive catalogue of SAWERA handcrafted footwear and leather luxuries.",
      displayOrder: 1,
      subs: [],
    },
    {
      id: "cat-men",
      name: "MEN",
      slug: "men",
      description: "Commanding silhouettes, bespoke brogues, and supple leather slip-ons tailored for gentlemen.",
      displayOrder: 2,
      subs: [
        { name: "Formal Shoes", slug: "men-formal-shoes" },
        { name: "Casual Shoes", slug: "men-casual-shoes" },
        { name: "Sneakers", slug: "men-sneakers" },
        { name: "Sandals", slug: "men-sandals" },
        { name: "Slippers", slug: "men-slippers" },
        { name: "Loafers", slug: "men-loafers" },
        { name: "Moccasins", slug: "men-moccasins" },
        { name: "Boots", slug: "men-boots" },
        { name: "Sports Shoes", slug: "men-sports-shoes" },
      ],
    },
    {
      id: "cat-women",
      name: "WOMEN",
      slug: "women",
      description: "Sculpted stilettos, poise-inducing flats, and artisanal leather heels crafted for pure grace.",
      displayOrder: 3,
      subs: [
        { name: "Heels", slug: "women-heels" },
        { name: "Flats", slug: "women-flats" },
        { name: "Sandals", slug: "women-sandals" },
        { name: "Comfort Shoes", slug: "women-comfort-shoes" },
        { name: "Block Heels", slug: "women-block-heels" },
        { name: "Kitten Heels", slug: "women-kitten-heels" },
        { name: "Mules", slug: "women-mules" },
        { name: "Moccasins", slug: "women-moccasins" },
        { name: "Pumps", slug: "women-pumps" },
        { name: "Sneakers", slug: "women-sneakers" },
        { name: "Slippers", slug: "women-slippers" },
        { name: "Wedges", slug: "women-wedges" },
      ],
    },
    {
      id: "cat-bags",
      name: "BAGS",
      slug: "bags",
      description: "Architectural totes, crossbody companions, and weekenders in grain calfskin.",
      displayOrder: 4,
      subs: [
        { name: "Handbags", slug: "bags-handbags" },
        { name: "Shoulder Bags", slug: "bags-shoulder-bags" },
        { name: "Tote Bags", slug: "bags-tote-bags" },
        { name: "Backpacks", slug: "bags-backpacks" },
        { name: "Crossbody Bags", slug: "bags-crossbody-bags" },
        { name: "Travel Bags", slug: "bags-travel-bags" },
        { name: "Clutches", slug: "bags-clutches" },
      ],
    },
    {
      id: "cat-accessories",
      name: "ACCESSORIES",
      slug: "accessories",
      description: "Fine leather card cases, brass-buckle reversible belts, and essential travel accessories.",
      displayOrder: 5,
      subs: [
        { name: "Wallets", slug: "accessories-wallets" },
        { name: "Belts", slug: "accessories-belts" },
        { name: "Leather Accessories", slug: "accessories-leather" },
      ],
    },
    {
      id: "cat-kids",
      name: "KIDS",
      slug: "kids",
      description: "Heirloom-grade children's leather shoes, festive Mary Janes, and durable activity trainers.",
      displayOrder: 6,
      subs: [
        { name: "Boys' Shoes", slug: "kids-boys-shoes" },
        { name: "Girls' Shoes", slug: "kids-girls-shoes" },
        { name: "Sneakers", slug: "kids-sneakers" },
        { name: "Sandals", slug: "kids-sandals" },
        { name: "Slippers", slug: "kids-slippers" },
        { name: "School Shoes", slug: "kids-school-shoes" },
      ],
    },
  ];

  for (const cat of categories) {
    await conn.query(`
      INSERT INTO categories (id, name, slug, description, displayOrder, isActive, showInNav)
      VALUES (?, ?, ?, ?, ?, TRUE, TRUE)
      ON DUPLICATE KEY UPDATE name=VALUES(name), description=VALUES(description), displayOrder=VALUES(displayOrder);
    `, [cat.id, cat.name, cat.slug, cat.description, cat.displayOrder]);

    let subOrder = 1;
    for (const sub of cat.subs) {
      const subId = `sub-${sub.slug}`;
      await conn.query(`
        INSERT INTO subcategories (id, categoryId, name, slug, displayOrder, isActive)
        VALUES (?, ?, ?, ?, ?, TRUE)
        ON DUPLICATE KEY UPDATE name=VALUES(name), displayOrder=VALUES(displayOrder);
      `, [subId, cat.id, sub.name, sub.slug, subOrder++]);
    }
  }

  // 4. Seed Premium Products
  console.log("Seeding Products, Images, and Variants...");
  const initialProducts = [
    // Men Shoes
    {
      id: "prod-m-01",
      categoryId: "cat-men",
      subcategoryId: "sub-men-formal-shoes",
      name: "Imperial Black Oxford Brogues",
      slug: "imperial-black-oxford-brogues",
      sku: "SW-M-OX-001",
      description: "Crafted from hand-selected full-grain calfskin with delicate Goodyear-welted construction. Finished in deep onyx black with signature gold-foil insole stamping.",
      price: 8950,
      originalPrice: 10500,
      isFeatured: true,
      isNewArrival: true,
      isBestseller: true,
      images: ["/products/1618825646.jpg", "/products/1618825870.jpg"],
      sizes: ["40", "41", "42", "43", "44"],
      colors: ["Onyx Black", "Rich Burgundy"],
      stockPerVariant: 6,
    },
    {
      id: "prod-m-02",
      categoryId: "cat-men",
      subcategoryId: "sub-men-loafers",
      name: "Aureus Gold Bit Velvet Loafers",
      slug: "aureus-gold-bit-velvet-loafers",
      sku: "SW-M-LF-002",
      description: "Opulent evening loafers in plush midnight black velvet crowned with a brushed gold horsebit ornament. Lined in breathable goat leather.",
      price: 7450,
      originalPrice: 8800,
      isFeatured: true,
      isNewArrival: false,
      isBestseller: true,
      images: ["/products/1618826514.jpg", "/products/1618826402.jpg"],
      sizes: ["40", "41", "42", "43", "44"],
      colors: ["Midnight Black", "Antique Brown"],
      stockPerVariant: 5,
    },
    {
      id: "prod-m-03",
      categoryId: "cat-men",
      subcategoryId: "sub-men-moccasins",
      name: "Sovereign Grain Leather Driving Moccasins",
      slug: "sovereign-grain-leather-driving-moccasins",
      sku: "SW-M-MC-003",
      description: "Supple tumbled leather driving shoes with hand-stitched apron toe and flexible studded rubber soles. The pinnacle of relaxed weekend luxury.",
      price: 6850,
      originalPrice: null,
      isFeatured: false,
      isNewArrival: true,
      isBestseller: false,
      images: ["/products/1618826786.JPG", "/products/1618826643.jpeg"],
      sizes: ["39", "40", "41", "42", "43"],
      colors: ["Cognac Tan", "Onyx Black"],
      stockPerVariant: 8,
    },
    {
      id: "prod-m-04",
      categoryId: "cat-men",
      subcategoryId: "sub-men-boots",
      name: "Black & Gold Chelsea Dress Boots",
      slug: "black-gold-chelsea-dress-boots",
      sku: "SW-M-BT-004",
      description: "Streamlined Chelsea boots featuring elasticated side gussets woven with subtle gold lurex threads and a hand-burnished Italian leather silhouette.",
      price: 11500,
      originalPrice: 13900,
      isFeatured: true,
      isNewArrival: true,
      isBestseller: false,
      images: ["/products/1618827118.jpg", "/products/1618827036.jpg"],
      sizes: ["40", "41", "42", "43", "44"],
      colors: ["Onyx Black"],
      stockPerVariant: 4,
    },
    {
      id: "prod-m-05",
      categoryId: "cat-men",
      subcategoryId: "sub-men-sneakers",
      name: "Monochrome Minimalist Dress Sneakers",
      slug: "monochrome-minimalist-dress-sneakers",
      sku: "SW-M-SN-005",
      description: "Clean low-top sneakers in pristine Italian box calf leather with discreet gold eyelets and cupsoles.",
      price: 6990,
      originalPrice: 7990,
      isFeatured: false,
      isNewArrival: true,
      isBestseller: true,
      images: ["/products/1618827428.jpg", "/products/1618827333.jpg"],
      sizes: ["40", "41", "42", "43", "44"],
      colors: ["Obsidian Black", "Warm Ivory"],
      stockPerVariant: 7,
    },

    // Women Shoes
    {
      id: "prod-w-01",
      categoryId: "cat-women",
      subcategoryId: "sub-women-flats",
      name: "Juliana Pointed D'Orsay Flats",
      slug: "juliana-pointed-dorsay-flats",
      sku: "SW-W-FL-001",
      description: "Flawlessly proportioned pointed flats inspired by classic haute couture silhouettes. Finished in supple nappa leather with delicate gold heel rim accents.",
      price: 4950,
      originalPrice: 5800,
      isFeatured: true,
      isNewArrival: true,
      isBestseller: true,
      images: ["/products/1618827581.png", "/products/1618827642.jpg"],
      sizes: ["36", "37", "38", "39", "40", "41"],
      colors: ["Jet Black", "Champagne Gold"],
      stockPerVariant: 10,
    },
    {
      id: "prod-w-02",
      categoryId: "cat-women",
      subcategoryId: "sub-women-heels",
      name: "Empress Stiletto Pumps 90mm",
      slug: "empress-stiletto-pumps-90mm",
      sku: "SW-W-HL-002",
      description: "A commanding stiletto profile engineered with internal arch balance and an elongated toe box for unmatched red-carpet poise.",
      price: 7950,
      originalPrice: 9200,
      isFeatured: true,
      isNewArrival: true,
      isBestseller: true,
      images: ["/products/1618827714.jpg", "/products/1683458548.png"],
      sizes: ["36", "37", "38", "39", "40"],
      colors: ["Gloss Noir", "Metallic Gold"],
      stockPerVariant: 6,
    },
    {
      id: "prod-w-03",
      categoryId: "cat-women",
      subcategoryId: "sub-women-mules",
      name: "Sienna Gold Buckle Leather Mules",
      slug: "sienna-gold-buckle-leather-mules",
      sku: "SW-W-ML-003",
      description: "Slip-on luxury mules featuring an oversized architectural gold buckle, rounded square toe, and padded nappa footbed.",
      price: 5450,
      originalPrice: null,
      isFeatured: false,
      isNewArrival: true,
      isBestseller: false,
      images: ["/products/1683458611.jpg", "/products/1683458633.jpg"],
      sizes: ["36", "37", "38", "39", "40"],
      colors: ["Raven Black", "Desert Tan"],
      stockPerVariant: 7,
    },
    {
      id: "prod-w-04",
      categoryId: "cat-women",
      subcategoryId: "sub-women-block-heels",
      name: "Verona Mid-Height Block Heels",
      slug: "verona-mid-height-block-heels",
      sku: "SW-W-BH-004",
      description: "Designed for day-to-evening endurance. A stable 55mm block heel accented with brushed gold inlays and an ankle buckle strap.",
      price: 6250,
      originalPrice: 7200,
      isFeatured: true,
      isNewArrival: false,
      isBestseller: true,
      images: ["/products/1683458711.png", "/products/1683458723.png"],
      sizes: ["36", "37", "38", "39", "40"],
      colors: ["Onyx Black", "Warm Taupe"],
      stockPerVariant: 5,
    },

    // Bags
    {
      id: "prod-b-01",
      categoryId: "cat-bags",
      subcategoryId: "sub-bags-tote-bags",
      name: "Grand Palace Textured Leather Tote",
      slug: "grand-palace-textured-leather-tote",
      sku: "SW-B-TT-001",
      description: "An everyday masterpiece with structured base studs, spacious microfiber interior, and solid brass turn-lock closures in polished gold.",
      price: 12500,
      originalPrice: 14900,
      isFeatured: true,
      isNewArrival: true,
      isBestseller: true,
      images: ["/products/1618826914.png", "/brand/sawera-logo-dark.png"],
      sizes: ["One Size"],
      colors: ["Caviar Black", "Cognac Brown"],
      stockPerVariant: 8,
    },
    {
      id: "prod-b-02",
      categoryId: "cat-bags",
      subcategoryId: "sub-bags-clutches",
      name: "Aura Minaudière Evening Clutch",
      slug: "aura-minaudiere-evening-clutch",
      sku: "SW-B-CL-002",
      description: "Hard-shell evening clutch wrapped in black satin leather with a jewel-faceted gold clasp and detachable box chain.",
      price: 7200,
      originalPrice: 8500,
      isFeatured: false,
      isNewArrival: true,
      isBestseller: false,
      images: ["/brand/sawera-emblem.jpg", "/brand/sawera-logo-dark.png"],
      sizes: ["One Size"],
      colors: ["Black & Gold"],
      stockPerVariant: 5,
    },

    // Accessories
    {
      id: "prod-a-01",
      categoryId: "cat-accessories",
      subcategoryId: "sub-accessories-belts",
      name: "Reversible Monogram Dress Belt 35mm",
      slug: "reversible-monogram-dress-belt-35mm",
      sku: "SW-A-BL-001",
      description: "Two-in-one luxury belt featuring smooth black calf on one side and embossed rich brown on reverse. Sculpted SAWERA buckle in 24k gold-plated brass.",
      price: 3850,
      originalPrice: 4500,
      isFeatured: true,
      isNewArrival: true,
      isBestseller: true,
      images: ["/brand/sawera-logo.png", "/brand/sawera-logo-dark.png"],
      sizes: ["32", "34", "36", "38", "40"],
      colors: ["Black / Brown Reversible"],
      stockPerVariant: 12,
    },
    {
      id: "prod-a-02",
      categoryId: "cat-accessories",
      subcategoryId: "sub-accessories-wallets",
      name: "Savoy Slim Leather Card Billfold",
      slug: "savoy-slim-leather-card-billfold",
      sku: "SW-A-WL-002",
      description: "Ultra-slim bi-fold wallet featuring RFID shielding, 8 credit card slots, and hot-stamped gold foil logo signature.",
      price: 2450,
      originalPrice: 2950,
      isFeatured: false,
      isNewArrival: true,
      isBestseller: true,
      images: ["/brand/sawera-logo-dark.png", "/brand/sawera-logo.png"],
      sizes: ["Standard"],
      colors: ["Onyx Black", "Forest Green"],
      stockPerVariant: 15,
    },

    // Kids
    {
      id: "prod-k-01",
      categoryId: "cat-kids",
      subcategoryId: "sub-kids-boys-shoes",
      name: "Junior Prince Brogued Loafers",
      slug: "junior-prince-brogued-loafers",
      sku: "SW-K-BY-001",
      description: "Miniature formal brogues hand-crafted in genuine breathable leather with cushioned ankle collars and non-slip rubber soles.",
      price: 3650,
      originalPrice: 4200,
      isFeatured: false,
      isNewArrival: true,
      isBestseller: false,
      images: ["/products/1618826402.jpg", "/products/1618826514.jpg"],
      sizes: ["28", "29", "30", "31", "32", "33"],
      colors: ["Classic Black", "Tan"],
      stockPerVariant: 6,
    },
  ];

  for (const p of initialProducts) {
    await conn.query(`
      INSERT INTO products (
        id, categoryId, subcategoryId, name, slug, sku, description, 
        price, originalPrice, isPublished, isFeatured, isNewArrival, isBestseller
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, TRUE, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        name=VALUES(name), price=VALUES(price), originalPrice=VALUES(originalPrice),
        isFeatured=VALUES(isFeatured), isNewArrival=VALUES(isNewArrival), isBestseller=VALUES(isBestseller);
    `, [
      p.id, p.categoryId, p.subcategoryId, p.name, p.slug, p.sku, p.description,
      p.price, p.originalPrice, p.isFeatured, p.isNewArrival, p.isBestseller
    ]);

    // Images
    let imgOrder = 1;
    for (const imgUrl of p.images) {
      const imgId = `img-${p.id}-${imgOrder}`;
      await conn.query(`
        INSERT INTO product_images (id, productId, url, displayOrder, isPrimary)
        VALUES (?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE url=VALUES(url), isPrimary=VALUES(isPrimary);
      `, [imgId, p.id, imgUrl, imgOrder, imgOrder === 1]);
      imgOrder++;
    }

    // Variants
    for (const size of p.sizes) {
      for (const color of p.colors) {
        const varId = `var-${p.id}-${size}-${color.replace(/\s+/g, '')}`;
        const varSku = `${p.sku}-${size}-${color.slice(0, 2).toUpperCase()}`;
        await conn.query(`
          INSERT INTO product_variants (id, productId, size, color, sku, stock, additionalPrice)
          VALUES (?, ?, ?, ?, ?, ?, 0.00)
          ON DUPLICATE KEY UPDATE stock=VALUES(stock);
        `, [varId, p.id, size, color, varSku, p.stockPerVariant]);
      }
    }
  }

  // 5. Seed Promotional Coupons
  console.log("Seeding Coupons...");
  await conn.query(`
    INSERT INTO coupons (id, code, discountPercent, minOrderAmount, isActive)
    VALUES ('cp-gold10', 'GOLD10', 10.00, 3000.00, TRUE)
    ON DUPLICATE KEY UPDATE discountPercent=10.00, isActive=TRUE;

    INSERT INTO coupons (id, code, discountAmount, minOrderAmount, isActive)
    VALUES ('cp-sawera500', 'SAWERA500', 500.00, 4000.00, TRUE)
    ON DUPLICATE KEY UPDATE discountAmount=500.00, isActive=TRUE;

    INSERT INTO coupons (id, code, discountPercent, minOrderAmount, isActive)
    VALUES ('cp-elegance15', 'ELEGANCE15', 15.00, 8000.00, TRUE)
    ON DUPLICATE KEY UPDATE discountPercent=15.00, isActive=TRUE;
  `);

  // 6. Seed Homepage Campaigns
  console.log("Seeding Homepage Campaign...");
  await conn.query(`
    INSERT INTO homepage_campaigns (id, title, subtitle, tagline, ctaText, ctaLink, isActive, displayOrder)
    VALUES (
      'camp-01', 
      'THE BLACK & GOLD COLLECTION', 
      'Handcrafted Pakistani Artistry Meets International Luxury',
      'STEP INTO ELEGANCE',
      'SHOP THE COLLECTION',
      '/all',
      TRUE,
      1
    ) ON DUPLICATE KEY UPDATE title=VALUES(title);
  `);

  console.log("SAWERA database seeding completed successfully!");
  await conn.end();
}

seed().catch(err => {
  console.error("Database seeding failed:", err);
  process.exit(1);
});
