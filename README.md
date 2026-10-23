# SAWERA — BLACK & GOLD EDITION
> **STEP INTO ELEGANCE**  
> Luxury Footwear & Fashion E-Commerce Platform (Rebuilt Production Architecture)

---

## 1. Executive Summary & Brand Identity

**SAWERA** is a premium online footwear and fashion boutique engineered for the Pakistan luxury retail market. The application has been rebuilt with a database-connected architecture, zero external runtime CDN dependencies, and adherence to the Black & Gold visual identity.

### Brand Standards
- **Brand Name**: `SAWERA`
- **Tagline**: `STEP INTO ELEGANCE`
- **Customer Support & Voice**: `03481702710`
- **WhatsApp Concierge**: `+92 348 1702710` ([Direct Chat](https://wa.me/923481702710))
- **Design Palette**:
  - Primary Obsidian Black: `#080808`
  - Secondary Charcoal Black: `#111111`
  - Metallic Gold Accent: `#D4AF37`
  - Warm Ivory Text: `#F5F0E6`
  - Subtle Border Line: `#2A2A2A`

---

## 2. Core Architecture & Tech Stack

- **Framework**: Next.js 14 (App Router, Server Components & Route Handlers)
- **Language**: TypeScript 5.6 (Strict Type Safety)
- **Styling**: Tailwind CSS 3.4 with custom gold metallic tokens
- **Database**: MySQL / MariaDB (InnoDB, Foreign Key Integrity, ACID transactions)
- **Database Driver**: `mysql2/promise` Connection Pooling
- **Repository Pattern**: Type-safe Prisma-compatible repository interface (`src/lib/db.ts`)
- **Authentication**: JWT HTTP-only Cookies with `bcryptjs` salt rounds (12)
- **State Management**: Client cart synchronized with Server calculation API

---

## 3. Shopping Categories & Structure

The storefront strictly enforces the mandated 6-tier primary taxonomy and full 37-subcategory structure, with **exactly 6 distinct luxury products populated per subcategory (222 total products, 2,210 active variants)**:

1. **ALL** (`/all`) — Unified active product catalogue across all categories (222 products).
2. **MEN** (`/men`) — 54 Products (6 per subcategory):
   - Formal Shoes, Casual Shoes, Sneakers, Sandals, Slippers, Loafers, Moccasins, Boots, Sports Shoes.
3. **WOMEN** (`/women`) — 72 Products (6 per subcategory):
   - Heels, Flats, Sandals, Comfort Shoes, Block Heels, Kitten Heels, Mules, Moccasins, Pumps, Sneakers, Slippers, Wedges.
4. **BAGS** (`/bags`) — 42 Products (6 per subcategory):
   - Handbags, Shoulder Bags, Tote Bags, Backpacks, Crossbody Bags, Travel Bags, Clutches.
5. **ACCESSORIES** (`/accessories`) — 18 Products (6 per subcategory):
   - Wallets, Belts, Leather Accessories.
6. **KIDS** (`/kids`) — 36 Products (6 per subcategory):
   - Boys' Shoes, Girls' Shoes, Sneakers, Sandals, Slippers, School Shoes.

---

## 4. Pakistan Nationwide Commerce & Payments

- **Free Delivery Policy**: Automatic complimentary shipping on orders over **PKR 5,000** (Standard nationwide courier fee: **PKR 250**).
- **Payment Methods Supported**:
  1. **Cash on Delivery (COD)**: Available nationwide across all cities in Pakistan.
  2. **Easypaisa Direct**: Account `03481702710` (Title: `SAWERA`) with manual TRX ID verification in the admin console.
  3. **Direct Bank Transfer**: Meezan Bank Ltd account with payment slip / reference tracking.
- **Server-Side Price Protection**: Cart calculations and order amounts are computed strictly on the server against live database prices; client-tampered totals are impossible.
- **Atomic Inventory**: Order placement atomically decreases stock inside transactional commits and blocks checkout if inventory is insufficient.

---

## 5. Admin Suite & Operations

- **Admin URL**: `http://localhost:3000/admin`
- **Default Superadmin**:
  - Email: `admin@sawera.com`
  - Password: `SaweraAdmin2026!`
- **Capabilities**:
  - **KPI Dashboard**: Gross revenue, total orders, pending verification queue, low stock alerts.
  - **Product Management**: Create, edit, toggle visibility, manage variants (sizes 39–45 / 36–41), update pricing and images.
  - **Order Operations**: Transition statuses (`PENDING`, `CONFIRMED`, `PROCESSING`, `SHIPPED`, `DELIVERED`, `CANCELLED`).
  - **Payment Verification**: One-click confirmation of Easypaisa TRX IDs and Bank Transfers.
  - **Storefront Settings**: Live update of business phone, WhatsApp number, free shipping threshold, and top banner text without code redeployment.
  - **Security Audit Logs**: Immutable chronological record of all administrative actions.

---

## 6. Quick Start & Execution

### Prerequisites
- Node.js LTS v20.x
- MySQL / MariaDB (e.g. XAMPP running on `127.0.0.1:3306`)

### Environment Setup
Create or verify `.env` in the root:
```env
PORT=3000
NODE_ENV=development
DATABASE_URL=mysql://root:@127.0.0.1:3306/sawera_store_db
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=sawera_store_db
JWT_SECRET=sawera_super_secret_jwt_key_2026_luxury_black_gold
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Database Initialization & Seeding
```powershell
# 1. Create database and schema tables
node scripts/init-db.js

# 2. Seed taxonomy, admin account, products, and coupons
node scripts/seed.js
```

### Running Automated Test Suite
```powershell
node scripts/test-runner.js
# Output: TOTAL TESTS RUN: 23 | PASSED: 23 | FAILED: 0
```

### Running Development Server
```powershell
$env:PATH = "C:\Users\hp\nodejs;C:\Users\hp\AppData\Roaming\Antigravity\bin;" + $env:PATH
npm run dev
# Open http://localhost:3000 in your browser
```

### Production Build & Execution
```powershell
npm run build
npm start
```

---

## 7. Disaster Recovery & Backups (Phase 22)

To take a complete snapshot of both the relational database and product media assets:
```powershell
powershell -ExecutionPolicy Bypass -File scripts/backup.ps1
```
Backups are archived into `c:\antigravity\backups\<timestamp>/` with an explicit manifest and checksum.

To restore from the latest snapshot:
```powershell
powershell -ExecutionPolicy Bypass -File scripts/restore.ps1
```

---

## 8. Preserved Legacy Artifacts

- Historical POS database `savera_db` remains completely untouched in MySQL on port 3306.
- 39 high-resolution product photographs and original SAWERA vector/raster emblems were recovered from host storage and indexed under `public/brand/` and `public/products/`.
- Full recovery ledger documented in `RECOVERY_REPORT.md`.
