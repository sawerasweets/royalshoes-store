import mysql from "mysql2/promise";
import { Pool as PgPool } from "pg";
import {
  StoreSettingsModel,
  UserModel,
  CategoryModel,
  SubcategoryModel,
  ProductModel,
  ProductVariantModel,
  OrderModel,
  PaymentModel,
  CouponModel,
  CouponUsageModel,
  AuditLogModel,
  InventoryMovementModel,
} from "@/types";

declare global {
  // eslint-disable-next-line no-var
  var mysqlPoolGlobal: mysql.Pool | undefined;
  // eslint-disable-next-line no-var
  var pgPoolGlobal: PgPool | undefined;
}

const dbUrl = process.env.DATABASE_URL || "";
const isPostgres = dbUrl.startsWith("postgres://") || dbUrl.startsWith("postgresql://");

let mysqlPool: mysql.Pool | undefined;
let pgPool: PgPool | undefined;

if (isPostgres) {
  pgPool =
    globalThis.pgPoolGlobal ??
    new PgPool({
      connectionString: dbUrl,
      ssl: process.env.NODE_ENV === "production" || dbUrl.includes("supabase.co") ? { rejectUnauthorized: false } : undefined,
      max: 15,
      idleTimeoutMillis: 30000,
    });
  if (process.env.NODE_ENV !== "production") {
    globalThis.pgPoolGlobal = pgPool;
  }
} else {
  mysqlPool =
    globalThis.mysqlPoolGlobal ??
    mysql.createPool({
      host: process.env.DB_HOST || "127.0.0.1",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB_NAME || "sawera_store_db",
      waitForConnections: true,
      connectionLimit: 15,
      queueLimit: 0,
      enableKeepAlive: true,
      keepAliveInitialDelay: 10000,
    });
  if (process.env.NODE_ENV !== "production") {
    globalThis.mysqlPoolGlobal = mysqlPool;
  }
}

const CAMEL_MAP: Record<string, string> = {
  storename: "storeName",
  storetagline: "storeTagline",
  logourl: "logoUrl",
  businessphone: "businessPhone",
  whatsappnumber: "whatsappNumber",
  telephonelink: "telephoneLink",
  freeshippingthreshold: "freeShippingThreshold",
  standardshippingfee: "standardShippingFee",
  easypaisainstructions: "easypaisaInstructions",
  bankinstructions: "bankInstructions",
  announcementtext: "announcementText",
  showannouncement: "showAnnouncement",
  createdat: "createdAt",
  updatedat: "updatedAt",
  categoryid: "categoryId",
  categoryname: "categoryName",
  categoryslug: "categorySlug",
  subcategoryid: "subcategoryId",
  subcategoryname: "subcategoryName",
  subcategoryslug: "subcategorySlug",
  displayorder: "displayOrder",
  isactive: "isActive",
  showinnav: "showInNav",
  originalprice: "originalPrice",
  ispublished: "isPublished",
  isfeatured: "isFeatured",
  isnewarrival: "isNewArrival",
  isbestseller: "isBestseller",
  productid: "productId",
  isprimary: "isPrimary",
  additionalprice: "additionalPrice",
  ordernumber: "orderNumber",
  userid: "userId",
  customername: "customerName",
  customerphone: "customerPhone",
  customeremail: "customerEmail",
  shippingaddress: "shippingAddress",
  deliverynotes: "deliveryNotes",
  paymentmethod: "paymentMethod",
  paymentstatus: "paymentStatus",
  shippingfee: "shippingFee",
  grandtotal: "grandTotal",
  couponcode: "couponCode",
  variantid: "variantId",
  productname: "productName",
  productsku: "productSku",
  linetotal: "lineTotal",
  imageurl: "imageUrl",
  orderid: "orderId",
  referencenumber: "referenceNumber",
  proofimageurl: "proofImageUrl",
  discountpercent: "discountPercent",
  discountamount: "discountAmount",
  minorderamount: "minOrderAmount",
  maxdiscount: "maxDiscount",
  usagelimit: "usageLimit",
  timesused: "timesUsed",
  startdate: "startDate",
  enddate: "endDate",
  referenceid: "referenceId",
  ipaddress: "ipAddress",
  passwordhash: "passwordHash",
  discounttype: "discountType",
  percustomerlimit: "perCustomerLimit",
  couponid: "couponId",
  entityid: "entityId",
  expiresat: "expiresAt",
  ctalink: "ctaLink",
  ctatext: "ctaText",
};

function normalizeRow(row: any): any {
  if (!row || typeof row !== "object" || row instanceof Date) return row;
  const out: any = { ...row };
  for (const [col, val] of Object.entries(row)) {
    const camel = CAMEL_MAP[col.toLowerCase()];
    if (camel && !(camel in out)) {
      out[camel] = val;
    }
  }
  return out;
}

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
  "fullName", "addressLine", "isDefault", "isPrimary", "additionalPrice",
  "discountType", "perCustomerLimit", "couponId",
  "entityId", "expiresAt", "ctaLink", "ctaText"
];
CAMEL_WORDS.sort((a, b) => b.length - a.length);
const CAMEL_REGEX = new RegExp(`(?<!["\`])\\b(${CAMEL_WORDS.join("|")})\\b(?!["\`])`, "g");

function convertQueryForPg(sql: string, params: any[] = []): { sql: string; params: any[] } {
  let idx = 0;
  // Convert backticks to quotes
  let pgSql = sql.replace(/`([a-zA-Z0-9_]+)`/g, '"$1"');
  // Quote all unquoted camelCase table columns so PostgreSQL doesn't lowercase them
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

const cacheMap = new Map<string, { rows: any; fields: any; expiry: number }>();

export function clearCache() {
  cacheMap.clear();
}

export const pool = {
  async query<T = any>(sql: string, params: any[] = []): Promise<[T, any]> {
    const isSelect = sql.trim().toUpperCase().startsWith("SELECT");
    const cacheKey = isSelect ? `${sql}::${JSON.stringify(params)}` : null;

    if (cacheKey) {
      const cached = cacheMap.get(cacheKey);
      if (cached && Date.now() < cached.expiry) {
        return [cached.rows as any, cached.fields];
      }
    } else {
      // Writing query: immediately invalidate cache
      cacheMap.clear();
    }

    if (isPostgres && pgPool) {
      const converted = convertQueryForPg(sql, params);
      const res = await pgPool.query(converted.sql, converted.params);
      const rows = res.rows.map(normalizeRow);

      if (cacheKey) {
        cacheMap.set(cacheKey, { rows, fields: res.fields, expiry: Date.now() + 30000 });
        if (cacheMap.size > 200) {
          const oldest = cacheMap.keys().next().value;
          if (oldest) cacheMap.delete(oldest);
        }
      }

      return [rows as any, res.fields];
    } else if (mysqlPool) {
      const [rows, fields] = await mysqlPool.query(sql, params);

      if (cacheKey) {
        cacheMap.set(cacheKey, { rows, fields, expiry: Date.now() + 30000 });
        if (cacheMap.size > 200) {
          const oldest = cacheMap.keys().next().value;
          if (oldest) cacheMap.delete(oldest);
        }
      }

      return [rows as any, fields];
    }
    throw new Error("No database pool available");
  },

  async getConnection() {
    if (isPostgres && pgPool) {
      const client = await pgPool.connect();
      return {
        async beginTransaction() {
          await client.query("BEGIN");
        },
        async commit() {
          await client.query("COMMIT");
          cacheMap.clear();
        },
        async rollback() {
          await client.query("ROLLBACK");
        },
        release() {
          client.release();
        },
        async query(sql: string, params: any[] = []) {
          const converted = convertQueryForPg(sql, params);
          const res = await client.query(converted.sql, converted.params);
          const rows = res.rows.map(normalizeRow);
          return [rows as any, res.fields];
        },
      };
    } else if (mysqlPool) {
      return await mysqlPool.getConnection();
    }
    throw new Error("No database pool available");
  },
};

export const prisma = {
  storeSettings: {
    findUnique: async (_args?: { where?: { id: string } }): Promise<StoreSettingsModel | null> => {
      const [rows] = await pool.query<mysql.RowDataPacket[]>(
        "SELECT * FROM store_settings WHERE id = 'singleton' LIMIT 1"
      );
      if (!rows.length) return null;
      const r: any = rows[0];
      return {
        ...r,
        freeShippingThreshold: Number(r.freeShippingThreshold),
        standardShippingFee: Number(r.standardShippingFee),
        showAnnouncement: Boolean(r.showAnnouncement),
      };
    },
    upsert: async (args: { create: any; update: any }): Promise<StoreSettingsModel | null> => {
      const data = args.update || args.create;
      const fields = Object.keys(data).filter(k => k !== 'id');
      const setClause = fields.map(k => `\`${k}\` = ?`).join(', ');
      const values = fields.map(k => data[k]);
      await pool.query(
        `UPDATE store_settings SET ${setClause} WHERE id = 'singleton'`,
        values
      );
      return prisma.storeSettings.findUnique();
    },
  },

  user: {
    findUnique: async (args: { where: { id?: string; email?: string }; select?: any }): Promise<UserModel | null> => {
      let sql = "SELECT * FROM users WHERE ";
      const params: any[] = [];
      if (args.where.id) {
        sql += "id = ? LIMIT 1";
        params.push(args.where.id);
      } else if (args.where.email) {
        sql += "email = ? LIMIT 1";
        params.push(args.where.email.toLowerCase().trim());
      } else {
        return null;
      }
      const [rows] = await pool.query<mysql.RowDataPacket[]>(sql, params);
      return (rows[0] as any) || null;
    },
    create: async (args: { data: { id?: string; email: string; passwordHash: string; name: string; phone?: string | null; role?: string } }): Promise<UserModel> => {
      const id = args.data.id || `usr-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      const role = args.data.role || "CUSTOMER";
      await pool.query(
        `INSERT INTO users (id, email, passwordHash, name, phone, role) VALUES (?, ?, ?, ?, ?, ?)`,
        [id, args.data.email.toLowerCase().trim(), args.data.passwordHash, args.data.name, args.data.phone || null, role]
      );
      const user = await prisma.user.findUnique({ where: { id } });
      return user!;
    },
    update: async (args: { where: { id: string }; data: any }): Promise<UserModel | null> => {
      const fields = Object.keys(args.data);
      const setClause = fields.map(k => `\`${k}\` = ?`).join(', ');
      const values = [...fields.map(k => args.data[k]), args.where.id];
      await pool.query(`UPDATE users SET ${setClause} WHERE id = ?`, values);
      return prisma.user.findUnique({ where: { id: args.where.id } });
    },
    count: async (args?: { where?: any }): Promise<number> => {
      let sql = "SELECT COUNT(*) as count FROM users";
      const params: any[] = [];
      if (args?.where?.role) {
        sql += " WHERE role = ?";
        params.push(args.where.role);
      }
      const [rows] = await pool.query<mysql.RowDataPacket[]>(sql, params);
      return Number(rows[0]?.count || 0);
    },
    findMany: async (args?: { where?: any; orderBy?: any; take?: number }): Promise<any[]> => {
      let sql = "SELECT id, email, name, phone, role, createdAt FROM users";
      const params: any[] = [];
      if (args?.where?.role) {
        sql += " WHERE role = ?";
        params.push(args.where.role);
      }
      sql += " ORDER BY createdAt DESC";
      if (args?.take) {
        sql += " LIMIT ?";
        params.push(args.take);
      }
      const [rows] = await pool.query<mysql.RowDataPacket[]>(sql, params);
      return rows;
    },
  },

  category: {
    findMany: async (args?: { where?: { isActive?: boolean; showInNav?: boolean }; include?: { subcategories?: boolean; products?: boolean }; orderBy?: any }): Promise<CategoryModel[]> => {
      let sql = "SELECT * FROM categories";
      const whereParts: string[] = [];
      const params: any[] = [];

      if (args?.where?.isActive !== undefined) {
        whereParts.push("isActive = ?");
        params.push(Boolean(args.where.isActive));
      }
      if (args?.where?.showInNav !== undefined) {
        whereParts.push("showInNav = ?");
        params.push(Boolean(args.where.showInNav));
      }
      if (whereParts.length) {
        sql += " WHERE " + whereParts.join(" AND ");
      }
      sql += " ORDER BY displayOrder ASC";

      const [categories] = await pool.query<mysql.RowDataPacket[]>(sql, params);

      if (args?.include?.subcategories) {
        const [subs] = await pool.query<mysql.RowDataPacket[]>(
          "SELECT * FROM subcategories WHERE isActive = TRUE ORDER BY displayOrder ASC"
        );
        return categories.map((cat: any) => ({
          ...cat,
          isActive: Boolean(cat.isActive),
          showInNav: Boolean(cat.showInNav),
          subcategories: subs.filter((s: any) => s.categoryId === cat.id).map((s: any) => ({ ...s, isActive: Boolean(s.isActive) })),
        }));
      }

      return categories.map((cat: any) => ({ ...cat, isActive: Boolean(cat.isActive), showInNav: Boolean(cat.showInNav) }));
    },
    findUnique: async (args: { where: { id?: string; slug?: string }; include?: { subcategories?: boolean } }): Promise<CategoryModel | null> => {
      let sql = "SELECT * FROM categories WHERE ";
      const params: any[] = [];
      if (args.where.id) {
        sql += "id = ? LIMIT 1";
        params.push(args.where.id);
      } else if (args.where.slug) {
        sql += "slug = ? LIMIT 1";
        params.push(args.where.slug);
      } else {
        return null;
      }
      const [rows] = await pool.query<mysql.RowDataPacket[]>(sql, params);
      if (!rows.length) return null;
      const cat: any = rows[0];

      if (args.include?.subcategories) {
        const [subs] = await pool.query<mysql.RowDataPacket[]>(
          "SELECT * FROM subcategories WHERE categoryId = ? AND isActive = TRUE ORDER BY displayOrder ASC",
          [cat.id]
        );
        return {
          ...cat,
          isActive: Boolean(cat.isActive),
          showInNav: Boolean(cat.showInNav),
          subcategories: subs.map((s: any) => ({ ...s, isActive: Boolean(s.isActive) })),
        };
      }

      return { ...cat, isActive: Boolean(cat.isActive), showInNav: Boolean(cat.showInNav) };
    },
    create: async (args: { data: any }): Promise<CategoryModel | null> => {
      const id = args.data.id || `cat-${Date.now()}`;
      await pool.query(
        "INSERT INTO categories (id, name, slug, description, imageUrl, displayOrder, isActive, showInNav) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [id, args.data.name, args.data.slug, args.data.description || null, args.data.imageUrl || null, args.data.displayOrder || 0, args.data.isActive ?? true, args.data.showInNav ?? true]
      );
      return prisma.category.findUnique({ where: { id } });
    },
    update: async (args: { where: { id: string }; data: any }): Promise<CategoryModel | null> => {
      const fields = Object.keys(args.data);
      const setClause = fields.map(k => `\`${k}\` = ?`).join(', ');
      const values = [...fields.map(k => args.data[k]), args.where.id];
      await pool.query(`UPDATE categories SET ${setClause} WHERE id = ?`, values);
      return prisma.category.findUnique({ where: { id: args.where.id } });
    },
  },

  subcategory: {
    findMany: async (args?: { where?: { categoryId?: string; isActive?: boolean }; orderBy?: any }): Promise<SubcategoryModel[]> => {
      let sql = "SELECT * FROM subcategories";
      const whereParts: string[] = [];
      const params: any[] = [];
      if (args?.where?.categoryId) {
        whereParts.push("categoryId = ?");
        params.push(args.where.categoryId);
      }
      if (args?.where?.isActive !== undefined) {
        whereParts.push("isActive = ?");
        params.push(Boolean(args.where.isActive));
      }
      if (whereParts.length) sql += " WHERE " + whereParts.join(" AND ");
      sql += " ORDER BY displayOrder ASC";
      const [rows] = await pool.query<mysql.RowDataPacket[]>(sql, params);
      return rows.map((r: any) => ({ ...r, isActive: Boolean(r.isActive) }));
    },
    findUnique: async (args: { where: { id?: string; slug?: string } }): Promise<SubcategoryModel | null> => {
      let sql = "SELECT * FROM subcategories WHERE ";
      const params: any[] = [];
      if (args.where.id) {
        sql += "id = ? LIMIT 1";
        params.push(args.where.id);
      } else if (args.where.slug) {
        sql += "slug = ? LIMIT 1";
        params.push(args.where.slug);
      } else {
        return null;
      }
      const [rows] = await pool.query<mysql.RowDataPacket[]>(sql, params);
      return (rows[0] as any) || null;
    },
  },

  product: {
    findMany: async (args?: {
      where?: {
        categoryId?: string;
        subcategoryId?: string;
        isPublished?: boolean;
        isFeatured?: boolean;
        isNewArrival?: boolean;
        isBestseller?: boolean;
        search?: string;
        minPrice?: number;
        maxPrice?: number;
        id?: { not?: string };
      };
      include?: { images?: boolean; variants?: boolean; category?: boolean; subcategory?: boolean };
      orderBy?: { createdAt?: "asc" | "desc"; price?: "asc" | "desc"; name?: "asc" | "desc" };
      take?: number;
      skip?: number;
    }): Promise<ProductModel[]> => {
      let sql = "SELECT p.*, c.name as categoryName, s.name as subcategoryName FROM products p LEFT JOIN categories c ON p.categoryId = c.id LEFT JOIN subcategories s ON p.subcategoryId = s.id";
      const whereParts: string[] = [];
      const params: any[] = [];

      if (args?.where?.categoryId) {
        whereParts.push("p.categoryId = ?");
        params.push(args.where.categoryId);
      }
      if (args?.where?.subcategoryId) {
        whereParts.push("p.subcategoryId = ?");
        params.push(args.where.subcategoryId);
      }
      if (args?.where?.isPublished !== undefined) {
        whereParts.push("p.isPublished = ?");
        params.push(Boolean(args.where.isPublished));
      }
      if (args?.where?.isFeatured !== undefined) {
        whereParts.push("p.isFeatured = ?");
        params.push(Boolean(args.where.isFeatured));
      }
      if (args?.where?.isNewArrival !== undefined) {
        whereParts.push("p.isNewArrival = ?");
        params.push(Boolean(args.where.isNewArrival));
      }
      if (args?.where?.isBestseller !== undefined) {
        whereParts.push("p.isBestseller = ?");
        params.push(Boolean(args.where.isBestseller));
      }
      if (args?.where?.id?.not) {
        whereParts.push("p.id != ?");
        params.push(args.where.id.not);
      }
      if (args?.where?.search) {
        whereParts.push("(p.name LIKE ? OR p.description LIKE ? OR p.sku LIKE ?)");
        const searchPattern = `%${args.where.search}%`;
        params.push(searchPattern, searchPattern, searchPattern);
      }
      if (args?.where?.minPrice !== undefined) {
        whereParts.push("p.price >= ?");
        params.push(args.where.minPrice);
      }
      if (args?.where?.maxPrice !== undefined) {
        whereParts.push("p.price <= ?");
        params.push(args.where.maxPrice);
      }

      if (whereParts.length) {
        sql += " WHERE " + whereParts.join(" AND ");
      }

      if (args?.orderBy?.price) {
        sql += ` ORDER BY p.price ${args.orderBy.price.toUpperCase()}`;
      } else if (args?.orderBy?.name) {
        sql += ` ORDER BY p.name ${args.orderBy.name.toUpperCase()}`;
      } else {
        sql += " ORDER BY p.createdAt DESC";
      }

      if (args?.take) {
        sql += " LIMIT ?";
        params.push(args.take);
        if (args?.skip) {
          sql += " OFFSET ?";
          params.push(args.skip);
        }
      }

      const [products] = await pool.query<mysql.RowDataPacket[]>(sql, params);

      if (products.length && (args?.include?.images || args?.include?.variants)) {
        const productIds = products.map(p => p.id);
        const placeholders = productIds.map(() => '?').join(',');

        let images: any[] = [];
        let variants: any[] = [];

        if (args.include.images) {
          const [imgRows] = await pool.query<mysql.RowDataPacket[]>(
            `SELECT * FROM product_images WHERE productId IN (${placeholders}) ORDER BY displayOrder ASC`,
            productIds
          );
          images = imgRows;
        }

        if (args.include.variants) {
          const [varRows] = await pool.query<mysql.RowDataPacket[]>(
            `SELECT * FROM product_variants WHERE productId IN (${placeholders}) ORDER BY size ASC, color ASC`,
            productIds
          );
          variants = varRows;
        }

        return products.map((p: any) => ({
          ...p,
          price: Number(p.price),
          originalPrice: p.originalPrice ? Number(p.originalPrice) : null,
          isPublished: Boolean(p.isPublished),
          isFeatured: Boolean(p.isFeatured),
          isNewArrival: Boolean(p.isNewArrival),
          isBestseller: Boolean(p.isBestseller),
          images: images.filter(i => i.productId === p.id).map((i: any) => ({ ...i, isPrimary: Boolean(i.isPrimary) })),
          variants: variants.filter(v => v.productId === p.id).map((v: any) => ({ ...v, stock: Number(v.stock), additionalPrice: Number(v.additionalPrice) })),
        }));
      }

      return products.map((p: any) => ({
        ...p,
        price: Number(p.price),
        originalPrice: p.originalPrice ? Number(p.originalPrice) : null,
        isPublished: Boolean(p.isPublished),
        isFeatured: Boolean(p.isFeatured),
        isNewArrival: Boolean(p.isNewArrival),
        isBestseller: Boolean(p.isBestseller),
        images: [],
        variants: [],
      }));
    },

    count: async (args?: { where?: any }): Promise<number> => {
      let sql = "SELECT COUNT(*) as count FROM products p";
      const whereParts: string[] = [];
      const params: any[] = [];
      if (args?.where?.categoryId) {
        whereParts.push("p.categoryId = ?");
        params.push(args.where.categoryId);
      }
      if (args?.where?.subcategoryId) {
        whereParts.push("p.subcategoryId = ?");
        params.push(args.where.subcategoryId);
      }
      if (args?.where?.isPublished !== undefined) {
        whereParts.push("p.isPublished = ?");
        params.push(Boolean(args.where.isPublished));
      }
      if (whereParts.length) sql += " WHERE " + whereParts.join(" AND ");
      const [rows] = await pool.query<mysql.RowDataPacket[]>(sql, params);
      return Number(rows[0]?.count || 0);
    },

    findUnique: async (args: { where: { id?: string; slug?: string }; include?: { images?: any; variants?: boolean; category?: boolean; subcategory?: boolean } }): Promise<ProductModel | null> => {
      let sql = "SELECT p.*, c.name as categoryName, c.slug as categorySlug, s.name as subcategoryName, s.slug as subcategorySlug FROM products p LEFT JOIN categories c ON p.categoryId = c.id LEFT JOIN subcategories s ON p.subcategoryId = s.id WHERE ";
      const params: any[] = [];
      if (args.where.id) {
        sql += "p.id = ? LIMIT 1";
        params.push(args.where.id);
      } else if (args.where.slug) {
        sql += "p.slug = ? LIMIT 1";
        params.push(args.where.slug);
      } else {
        return null;
      }
      const [rows] = await pool.query<mysql.RowDataPacket[]>(sql, params);
      if (!rows.length) return null;
      const p: any = rows[0];

      let images: any[] = [];
      let variants: any[] = [];

      if (args.include?.images) {
        const [imgRows] = await pool.query<mysql.RowDataPacket[]>(
          "SELECT * FROM product_images WHERE productId = ? ORDER BY displayOrder ASC",
          [p.id]
        );
        images = imgRows.map((i: any) => ({ ...i, isPrimary: Boolean(i.isPrimary) }));
      }

      if (args.include?.variants) {
        const [varRows] = await pool.query<mysql.RowDataPacket[]>(
          "SELECT * FROM product_variants WHERE productId = ? ORDER BY size ASC, color ASC",
          [p.id]
        );
        variants = varRows.map((v: any) => ({ ...v, stock: Number(v.stock), additionalPrice: Number(v.additionalPrice) }));
      }

      return {
        ...p,
        price: Number(p.price),
        originalPrice: p.originalPrice ? Number(p.originalPrice) : null,
        isPublished: Boolean(p.isPublished),
        isFeatured: Boolean(p.isFeatured),
        isNewArrival: Boolean(p.isNewArrival),
        isBestseller: Boolean(p.isBestseller),
        images,
        variants,
        category: { id: p.categoryId, name: p.categoryName, slug: p.categorySlug },
        subcategory: p.subcategoryId ? { id: p.subcategoryId, name: p.subcategoryName, slug: p.subcategorySlug } : null,
      };
    },

    create: async (args: { data: any }): Promise<ProductModel | null> => {
      const p = args.data;
      const id = p.id || `prod-${Date.now()}`;
      await pool.query(
        `INSERT INTO products (
          id, categoryId, subcategoryId, name, slug, sku, description,
          price, originalPrice, isPublished, isFeatured, isNewArrival, isBestseller
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          id, p.categoryId, p.subcategoryId || null, p.name, p.slug, p.sku, p.description,
          p.price, p.originalPrice || null, p.isPublished ?? true, p.isFeatured ?? false,
          p.isNewArrival ?? false, p.isBestseller ?? false
        ]
      );
      return prisma.product.findUnique({ where: { id }, include: { images: true, variants: true } });
    },

    update: async (args: { where: { id: string }; data: any }): Promise<ProductModel | null> => {
      const fields = Object.keys(args.data);
      const setClause = fields.map(k => `\`${k}\` = ?`).join(', ');
      const values = [...fields.map(k => args.data[k]), args.where.id];
      await pool.query(`UPDATE products SET ${setClause} WHERE id = ?`, values);
      return prisma.product.findUnique({ where: { id: args.where.id }, include: { images: true, variants: true } });
    },

    delete: async (args: { where: { id: string } }) => {
      await pool.query("DELETE FROM products WHERE id = ?", [args.where.id]);
      return { id: args.where.id };
    },
  },

  productVariant: {
    findMany: async (args: { where: { productId: string } }): Promise<ProductVariantModel[]> => {
      const [rows] = await pool.query<mysql.RowDataPacket[]>(
        "SELECT * FROM product_variants WHERE productId = ? ORDER BY size ASC, color ASC",
        [args.where.productId]
      );
      return rows.map((r: any) => ({ ...r, stock: Number(r.stock), additionalPrice: Number(r.additionalPrice) }));
    },
    update: async (args: { where: { id: string }; data: any }) => {
      const fields = Object.keys(args.data);
      const setClause = fields.map(k => `\`${k}\` = ?`).join(', ');
      const values = [...fields.map(k => args.data[k]), args.where.id];
      await pool.query(`UPDATE product_variants SET ${setClause} WHERE id = ?`, values);
      return { id: args.where.id };
    },
    create: async (args: { data: any }): Promise<ProductVariantModel> => {
      const v = args.data;
      const id = v.id || `var-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      await pool.query(
        "INSERT INTO product_variants (id, productId, size, color, sku, stock, additionalPrice) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [id, v.productId, v.size, v.color, v.sku || null, v.stock || 0, v.additionalPrice || 0]
      );
      return { id, ...v };
    },
  },

  order: {
    create: async (args: { data: any }): Promise<OrderModel> => {
      const conn = await pool.getConnection();
      try {
        await conn.beginTransaction();
        const o = args.data;
        const orderId = `ord-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

        await conn.query(
          `INSERT INTO orders (
            id, orderNumber, userId, customerName, customerPhone, customerEmail,
            city, shippingAddress, deliveryNotes, status, paymentMethod, paymentStatus,
            subtotal, discount, shippingFee, grandTotal, couponCode
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'PENDING', ?, ?, ?, ?, ?, ?, ?)`,
          [
            orderId, o.orderNumber, o.userId || null, o.customerName, o.customerPhone, o.customerEmail || null,
            o.city, o.shippingAddress, o.deliveryNotes || null, o.paymentMethod, o.paymentStatus || 'PENDING',
            o.subtotal, o.discount || 0, o.shippingFee || 0, o.grandTotal, o.couponCode || null
          ]
        );

        for (const item of o.items.create) {
          const itemId = `oi-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
          await conn.query(
            `INSERT INTO order_items (
              id, orderId, productId, variantId, productName, productSku,
              size, color, price, quantity, lineTotal, imageUrl
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              itemId, orderId, item.productId || null, item.variantId || null, item.productName, item.productSku,
              item.size, item.color, item.price, item.quantity, item.lineTotal, item.imageUrl || null
            ]
          );

          if (item.variantId) {
            await conn.query(
              "UPDATE product_variants SET stock = GREATEST(0, stock - ?) WHERE id = ?",
              [item.quantity, item.variantId]
            );
            await conn.query(
              "INSERT INTO inventory_movements (id, variantId, quantity, reason, referenceId) VALUES (?, ?, ?, 'ORDER_PLACED', ?)",
              [`mov-${Date.now()}-${Math.floor(Math.random() * 1000)}`, item.variantId, -item.quantity, orderId]
            );
          }
        }

        if (o.payments?.create) {
          const p = o.payments.create;
          const payId = `pay-${Date.now()}`;
          await conn.query(
            `INSERT INTO payments (id, orderId, method, status, amount, referenceNumber, proofImageUrl)
             VALUES (?, ?, ?, 'PENDING', ?, ?, ?)`,
            [payId, orderId, p.method, p.amount, p.referenceNumber || null, p.proofImageUrl || null]
          );
        }

        if (o.couponCode) {
          const [couponRows] = await conn.query(
            "SELECT id, discountType, discountPercent, discountAmount FROM coupons WHERE code = ? LIMIT 1",
            [o.couponCode.trim().toUpperCase()]
          );
          const matched = Array.isArray(couponRows) ? couponRows[0] : couponRows;
          if (matched && matched.id) {
            await conn.query(
              "UPDATE coupons SET timesUsed = timesUsed + 1 WHERE id = ?",
              [matched.id]
            );
            const usageId = `usg-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
            await conn.query(
              "INSERT INTO coupon_usages (id, couponId, orderId, customerEmail, customerPhone, discountAmount) VALUES (?, ?, ?, ?, ?, ?)",
              [usageId, matched.id, orderId, o.customerEmail || null, o.customerPhone || null, o.discount || 0]
            );
          }
        }

        await conn.commit();
        conn.release();
        const created = await prisma.order.findUnique({ where: { id: orderId } });
        return created!;
      } catch (err) {
        await conn.rollback();
        conn.release();
        throw err;
      }
    },

    findUnique: async (args: { where: { id?: string; orderNumber?: string }; include?: any }): Promise<OrderModel | null> => {
      let sql = "SELECT * FROM orders WHERE ";
      const params: any[] = [];
      if (args.where.id) {
        sql += "id = ? LIMIT 1";
        params.push(args.where.id);
      } else if (args.where.orderNumber) {
        sql += "orderNumber = ? LIMIT 1";
        params.push(args.where.orderNumber);
      } else {
        return null;
      }
      const [rows] = await pool.query<mysql.RowDataPacket[]>(sql, params);
      if (!rows.length) return null;
      const order: any = rows[0];

      const [items] = await pool.query<mysql.RowDataPacket[]>(
        "SELECT * FROM order_items WHERE orderId = ?",
        [order.id]
      );
      const [payments] = await pool.query<mysql.RowDataPacket[]>(
        "SELECT * FROM payments WHERE orderId = ? ORDER BY createdAt DESC",
        [order.id]
      );

      return {
        ...order,
        subtotal: Number(order.subtotal),
        discount: Number(order.discount),
        shippingFee: Number(order.shippingFee),
        grandTotal: Number(order.grandTotal),
        items: items.map((i: any) => ({ ...i, price: Number(i.price), lineTotal: Number(i.lineTotal) })),
        payments: payments.map((p: any) => ({ ...p, amount: Number(p.amount) })),
      };
    },

    findMany: async (args?: { where?: any; orderBy?: any; take?: number; skip?: number }): Promise<OrderModel[]> => {
      let sql = "SELECT * FROM orders";
      const whereParts: string[] = [];
      const params: any[] = [];

      if (args?.where?.userId) {
        whereParts.push("userId = ?");
        params.push(args.where.userId);
      }
      if (args?.where?.status) {
        whereParts.push("status = ?");
        params.push(args.where.status);
      }
      if (args?.where?.paymentStatus) {
        whereParts.push("paymentStatus = ?");
        params.push(args.where.paymentStatus);
      }
      if (whereParts.length) {
        sql += " WHERE " + whereParts.join(" AND ");
      }
      sql += " ORDER BY createdAt DESC";

      if (args?.take) {
        sql += " LIMIT ?";
        params.push(args.take);
      }

      const [orders] = await pool.query<mysql.RowDataPacket[]>(sql, params);

      if (orders.length) {
        const orderIds = orders.map(o => o.id);
        const placeholders = orderIds.map(() => '?').join(',');
        const [items] = await pool.query<mysql.RowDataPacket[]>(
          `SELECT * FROM order_items WHERE orderId IN (${placeholders})`,
          orderIds
        );
        const [payments] = await pool.query<mysql.RowDataPacket[]>(
          `SELECT * FROM payments WHERE orderId IN (${placeholders})`,
          orderIds
        );

        return orders.map((o: any) => ({
          ...o,
          subtotal: Number(o.subtotal),
          discount: Number(o.discount),
          shippingFee: Number(o.shippingFee),
          grandTotal: Number(o.grandTotal),
          items: items.filter((i: any) => i.orderId === o.id).map((i: any) => ({ ...i, price: Number(i.price), lineTotal: Number(i.lineTotal) })),
          payments: payments.filter((p: any) => p.orderId === o.id).map((p: any) => ({ ...p, amount: Number(p.amount) })),
        }));
      }

      return orders as any[];
    },

    update: async (args: { where: { id: string }; data: any }): Promise<OrderModel | null> => {
      const fields = Object.keys(args.data);
      const setClause = fields.map(k => `\`${k}\` = ?`).join(', ');
      const values = [...fields.map(k => args.data[k]), args.where.id];
      await pool.query(`UPDATE orders SET ${setClause} WHERE id = ?`, values);
      return prisma.order.findUnique({ where: { id: args.where.id } });
    },

    count: async (args?: { where?: any }): Promise<number> => {
      let sql = "SELECT COUNT(*) as count FROM orders";
      const whereParts: string[] = [];
      const params: any[] = [];
      if (args?.where?.status) {
        whereParts.push("status = ?");
        params.push(args.where.status);
      }
      if (args?.where?.paymentStatus) {
        whereParts.push("paymentStatus = ?");
        params.push(args.where.paymentStatus);
      }
      if (whereParts.length) sql += " WHERE " + whereParts.join(" AND ");
      const [rows] = await pool.query<mysql.RowDataPacket[]>(sql, params);
      return Number(rows[0]?.count || 0);
    },
  },

  payment: {
    findMany: async (args?: { where?: any; orderBy?: any; take?: number }): Promise<PaymentModel[]> => {
      let sql = "SELECT p.*, o.orderNumber, o.customerName, o.customerPhone FROM payments p LEFT JOIN orders o ON p.orderId = o.id";
      const whereParts: string[] = [];
      const params: any[] = [];
      if (args?.where?.status) {
        whereParts.push("p.status = ?");
        params.push(args.where.status);
      }
      if (whereParts.length) sql += " WHERE " + whereParts.join(" AND ");
      sql += " ORDER BY p.createdAt DESC";
      if (args?.take) {
        sql += " LIMIT ?";
        params.push(args.take);
      }
      const [rows] = await pool.query<mysql.RowDataPacket[]>(sql, params);
      return rows.map((r: any) => ({ ...r, amount: Number(r.amount) }));
    },
    update: async (args: { where: { id: string }; data: any }) => {
      const fields = Object.keys(args.data);
      const setClause = fields.map(k => `\`${k}\` = ?`).join(', ');
      const values = [...fields.map(k => args.data[k]), args.where.id];
      await pool.query(`UPDATE payments SET ${setClause} WHERE id = ?`, values);
      return { id: args.where.id };
    },
  },

  coupon: {
    findUnique: async (args: { where: { code?: string; id?: string } }): Promise<CouponModel | null> => {
      let sql = "SELECT * FROM coupons WHERE ";
      const params: any[] = [];
      if (args.where.id) {
        sql += "id = ? LIMIT 1";
        params.push(args.where.id);
      } else if (args.where.code) {
        sql += "code = ? LIMIT 1";
        params.push(args.where.code.toUpperCase().trim());
      } else {
        return null;
      }
      const [rows] = await pool.query<mysql.RowDataPacket[]>(sql, params);
      if (!rows.length) return null;
      const c: any = rows[0];
      return {
        ...c,
        discountType: c.discountType || (c.discountPercent ? "PERCENTAGE" : "FIXED"),
        discountPercent: c.discountPercent ? Number(c.discountPercent) : null,
        discountAmount: c.discountAmount ? Number(c.discountAmount) : null,
        minOrderAmount: Number(c.minOrderAmount || 0),
        maxDiscount: c.maxDiscount ? Number(c.maxDiscount) : null,
        usageLimit: c.usageLimit != null ? Number(c.usageLimit) : null,
        timesUsed: Number(c.timesUsed || 0),
        perCustomerLimit: c.perCustomerLimit != null ? Number(c.perCustomerLimit) : 1,
        description: c.description || null,
        isActive: Boolean(c.isActive),
        startDate: c.startDate ? new Date(c.startDate) : null,
        endDate: c.endDate ? new Date(c.endDate) : null,
        startsAt: c.startDate ? new Date(c.startDate) : null,
        expiresAt: c.endDate ? new Date(c.endDate) : null,
      };
    },
    findMany: async (args?: { where?: any; orderBy?: any }): Promise<CouponModel[]> => {
      let sql = "SELECT * FROM coupons";
      const params: any[] = [];
      if (args?.where?.search) {
        sql += " WHERE (code ILIKE ? OR description ILIKE ?)";
        params.push(`%${args.where.search}%`, `%${args.where.search}%`);
      }
      sql += " ORDER BY createdAt DESC";
      const [rows] = await pool.query<mysql.RowDataPacket[]>(sql, params);
      return rows.map((c: any) => ({
        ...c,
        discountType: c.discountType || (c.discountPercent ? "PERCENTAGE" : "FIXED"),
        discountPercent: c.discountPercent ? Number(c.discountPercent) : null,
        discountAmount: c.discountAmount ? Number(c.discountAmount) : null,
        minOrderAmount: Number(c.minOrderAmount || 0),
        maxDiscount: c.maxDiscount ? Number(c.maxDiscount) : null,
        usageLimit: c.usageLimit != null ? Number(c.usageLimit) : null,
        timesUsed: Number(c.timesUsed || 0),
        perCustomerLimit: c.perCustomerLimit != null ? Number(c.perCustomerLimit) : 1,
        description: c.description || null,
        isActive: Boolean(c.isActive),
        startDate: c.startDate ? new Date(c.startDate) : null,
        endDate: c.endDate ? new Date(c.endDate) : null,
        startsAt: c.startDate ? new Date(c.startDate) : null,
        expiresAt: c.endDate ? new Date(c.endDate) : null,
      }));
    },
    create: async (args: { data: any }): Promise<CouponModel | null> => {
      const c = args.data;
      const id = c.id || `cp-${Date.now()}`;
      const code = c.code.toUpperCase().trim();
      const discountType = c.discountType || "PERCENTAGE";
      const discountPercent = c.discountPercent != null ? Number(c.discountPercent) : null;
      const discountAmount = c.discountAmount != null ? Number(c.discountAmount) : null;
      const minOrderAmount = Number(c.minOrderAmount || 0);
      const maxDiscount = c.maxDiscount != null ? Number(c.maxDiscount) : null;
      const usageLimit = c.usageLimit != null ? Number(c.usageLimit) : null;
      const perCustomerLimit = c.perCustomerLimit != null ? Number(c.perCustomerLimit) : 1;
      const description = c.description || null;
      const isActive = c.isActive ?? true;
      const startDate = c.startDate || c.startsAt || null;
      const endDate = c.endDate || c.expiresAt || null;

      await pool.query(
        `INSERT INTO coupons (
          id, code, discountType, discountPercent, discountAmount, 
          minOrderAmount, maxDiscount, usageLimit, perCustomerLimit, 
          description, startDate, endDate, isActive
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          id, code, discountType, discountPercent, discountAmount,
          minOrderAmount, maxDiscount, usageLimit, perCustomerLimit,
          description, startDate, endDate, isActive
        ]
      );
      return prisma.coupon.findUnique({ where: { id } });
    },
    update: async (args: { where: { id?: string; code?: string }; data: any }): Promise<CouponModel | null> => {
      const targetId = args.where.id;
      let existingId = targetId;
      if (!existingId && args.where.code) {
        const found = await prisma.coupon.findUnique({ where: { code: args.where.code } });
        existingId = found?.id;
      }
      if (!existingId) return null;

      const fields = Object.keys(args.data);
      if (fields.length === 0) return prisma.coupon.findUnique({ where: { id: existingId } });

      const setClauses: string[] = [];
      const values: any[] = [];
      for (const field of fields) {
        setClauses.push(`"${field}" = ?`);
        let val = args.data[field];
        if (field === "code" && typeof val === "string") val = val.toUpperCase().trim();
        values.push(val);
      }
      values.push(existingId);

      await pool.query(
        `UPDATE coupons SET ${setClauses.join(", ")} WHERE id = ?`,
        values
      );
      return prisma.coupon.findUnique({ where: { id: existingId } });
    },
    delete: async (args: { where: { id: string } }): Promise<boolean> => {
      await pool.query("DELETE FROM coupons WHERE id = ?", [args.where.id]);
      return true;
    },
  },

  couponUsage: {
    create: async (args: { data: any }): Promise<CouponUsageModel> => {
      const id = args.data.id || `usg-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      await pool.query(
        "INSERT INTO coupon_usages (id, couponId, orderId, customerEmail, customerPhone, discountAmount) VALUES (?, ?, ?, ?, ?, ?)",
        [id, args.data.couponId, args.data.orderId, args.data.customerEmail || null, args.data.customerPhone || null, args.data.discountAmount || 0]
      );
      return { id, ...args.data, createdAt: new Date() };
    },
    findMany: async (args?: { where?: { couponId?: string; customerEmail?: string; customerPhone?: string }; take?: number }): Promise<CouponUsageModel[]> => {
      const take = args?.take || 100;
      let sql = `
        SELECT cu.*, o.orderNumber, o.customerName
        FROM coupon_usages cu
        LEFT JOIN orders o ON cu.orderId = o.id
      `;
      const params: any[] = [];
      const conds: string[] = [];
      if (args?.where?.couponId) {
        conds.push('cu."couponId" = ?');
        params.push(args.where.couponId);
      }
      if (args?.where?.customerEmail) {
        conds.push('cu."customerEmail" = ?');
        params.push(args.where.customerEmail);
      }
      if (args?.where?.customerPhone) {
        conds.push('cu."customerPhone" = ?');
        params.push(args.where.customerPhone);
      }
      if (conds.length > 0) {
        sql += " WHERE " + conds.join(" AND ");
      }
      sql += " ORDER BY cu.createdAt DESC LIMIT ?";
      params.push(take);
      const [rows] = await pool.query<mysql.RowDataPacket[]>(sql, params);
      return rows.map((r: any) => ({
        ...r,
        discountAmount: Number(r.discountAmount || 0),
      }));
    },
    count: async (args?: { where?: { couponId?: string; customerEmail?: string; customerPhone?: string } }): Promise<number> => {
      let sql = "SELECT COUNT(*) as count FROM coupon_usages WHERE 1=1";
      const params: any[] = [];
      if (args?.where?.couponId) {
        sql += ' AND "couponId" = ?';
        params.push(args.where.couponId);
      }
      if (args?.where?.customerPhone && args?.where?.customerEmail) {
        sql += ' AND ("customerPhone" = ? OR "customerEmail" = ?)';
        params.push(args.where.customerPhone, args.where.customerEmail);
      } else if (args?.where?.customerPhone) {
        sql += ' AND "customerPhone" = ?';
        params.push(args.where.customerPhone);
      } else if (args?.where?.customerEmail) {
        sql += ' AND "customerEmail" = ?';
        params.push(args.where.customerEmail);
      }
      const [rows] = await pool.query<mysql.RowDataPacket[]>(sql, params);
      return Number(rows[0]?.count || 0);
    },
  },

  wishlistItem: {
    findMany: async (args: { where: { userId: string } }): Promise<any[]> => {
      const [rows] = await pool.query<mysql.RowDataPacket[]>(
        `SELECT w.*, p.name, p.slug, p.price, p.originalPrice, 
          (SELECT url FROM product_images WHERE productId = p.id AND isPrimary = TRUE LIMIT 1) as imageUrl
         FROM wishlist_items w
         JOIN products p ON w.productId = p.id
         WHERE w.userId = ?
         ORDER BY w.createdAt DESC`,
        [args.where.userId]
      );
      return rows.map((r: any) => ({
        ...r,
        price: Number(r.price),
        originalPrice: r.originalPrice ? Number(r.originalPrice) : null,
      }));
    },
    create: async (args: { data: { userId: string; productId: string } }) => {
      const id = `wish-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      await pool.query(
        "INSERT INTO wishlist_items (id, userId, productId) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE createdAt=CURRENT_TIMESTAMP",
        [id, args.data.userId, args.data.productId]
      );
      return { id, ...args.data };
    },
    delete: async (args: { where: { userId_productId?: { userId: string; productId: string }; id?: string } }) => {
      if (args.where.userId_productId) {
        await pool.query(
          "DELETE FROM wishlist_items WHERE userId = ? AND productId = ?",
          [args.where.userId_productId.userId, args.where.userId_productId.productId]
        );
      } else if (args.where.id) {
        await pool.query("DELETE FROM wishlist_items WHERE id = ?", [args.where.id]);
      }
      return { success: true };
    },
  },

  homepageCampaign: {
    findFirst: async (_args?: { where?: { isActive?: boolean } }): Promise<any | null> => {
      const [rows] = await pool.query<mysql.RowDataPacket[]>(
        "SELECT * FROM homepage_campaigns WHERE isActive = TRUE ORDER BY displayOrder ASC LIMIT 1"
      );
      if (!rows.length) return null;
      return { ...rows[0], isActive: Boolean(rows[0].isActive) };
    },
  },

  auditLog: {
    create: async (args: { data: { userId?: string | null; action: string; entity: string; entityId?: string | null; details?: string | null; ipAddress?: string | null } }) => {
      const id = `aud-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      await pool.query(
        "INSERT INTO audit_logs (id, `userId`, action, entity, `entityId`, details, `ipAddress`) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [id, args.data.userId || null, args.data.action, args.data.entity, args.data.entityId || null, args.data.details || null, args.data.ipAddress || null]
      );
      return { id, ...args.data, createdAt: new Date() };
    },
    findMany: async (args?: { take?: number }): Promise<any[]> => {
      const take = args?.take || 50;
      const [rows] = await pool.query<mysql.RowDataPacket[]>(
        "SELECT a.*, u.name as userName, u.email as userEmail FROM audit_logs a LEFT JOIN users u ON a.userId = u.id ORDER BY a.createdAt DESC LIMIT ?",
        [take]
      );
      return rows;
    },
  },

  inventoryMovement: {
    create: async (args: { data: { variantId: string; quantity: number; reason: string; referenceId?: string | null } }) => {
      const id = `mov-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      await pool.query(
        "INSERT INTO inventory_movements (id, variantId, quantity, reason, referenceId) VALUES (?, ?, ?, ?, ?)",
        [id, args.data.variantId, args.data.quantity, args.data.reason, args.data.referenceId || null]
      );
      return { id, ...args.data, createdAt: new Date() };
    },
    findMany: async (args?: { where?: { variantId?: string; referenceId?: string }; take?: number }) => {
      const take = args?.take || 50;
      let sql = "SELECT * FROM inventory_movements";
      const params: any[] = [];
      const conds: string[] = [];
      if (args?.where?.variantId) {
        conds.push("variantId = ?");
        params.push(args.where.variantId);
      }
      if (args?.where?.referenceId) {
        conds.push("referenceId = ?");
        params.push(args.where.referenceId);
      }
      if (conds.length > 0) {
        sql += " WHERE " + conds.join(" AND ");
      }
      sql += " ORDER BY createdAt DESC LIMIT ?";
      params.push(take);
      const [rows] = await pool.query<any[]>(sql, params);
      return rows;
    },
  },
};

export default prisma;
