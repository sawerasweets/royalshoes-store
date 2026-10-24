export interface StoreSettingsModel {
  id: string;
  storeName: string;
  storeTagline: string;
  logoUrl?: string | null;
  businessPhone: string;
  whatsappNumber: string;
  telephoneLink: string;
  country: string;
  currencySymbol: string;
  freeShippingThreshold: number;
  standardShippingFee: number;
  easypaisaInstructions?: string | null;
  bankInstructions?: string | null;
  announcementText?: string | null;
  showAnnouncement: boolean;
  updatedAt: Date;
}

export interface UserModel {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  phone?: string | null;
  role: "CUSTOMER" | "ADMIN" | "STAFF";
  createdAt: Date;
  updatedAt?: Date;
}

export interface CategoryModel {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  imageUrl?: string | null;
  displayOrder: number;
  isActive: boolean;
  showInNav: boolean;
  createdAt: Date;
  updatedAt?: Date;
  subcategories?: SubcategoryModel[];
}

export interface SubcategoryModel {
  id: string;
  categoryId: string;
  name: string;
  slug: string;
  description?: string | null;
  imageUrl?: string | null;
  displayOrder: number;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ProductImageModel {
  id: string;
  productId: string;
  url: string;
  altText?: string | null;
  displayOrder: number;
  isPrimary: boolean;
  createdAt?: Date;
}

export interface ProductVariantModel {
  id: string;
  productId: string;
  productName?: string;
  size: string;
  color: string;
  sku?: string | null;
  stock: number;
  additionalPrice: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface InventoryMovementModel {
  id: string;
  variantId: string;
  quantity: number;
  reason: string;
  referenceId?: string | null;
  createdAt: Date;
}

export interface ProductModel {
  id: string;
  categoryId: string;
  subcategoryId?: string | null;
  name: string;
  slug: string;
  sku: string;
  description: string;
  price: number;
  originalPrice?: number | null;
  isPublished: boolean;
  isFeatured: boolean;
  isNewArrival: boolean;
  isBestseller: boolean;
  createdAt: Date;
  updatedAt: Date;
  categoryName?: string;
  categorySlug?: string;
  subcategoryName?: string | null;
  subcategorySlug?: string | null;
  images: ProductImageModel[];
  variants: ProductVariantModel[];
  category?: { id: string; name: string; slug: string };
  subcategory?: { id: string; name: string; slug: string } | null;
}

export interface OrderItemModel {
  id: string;
  orderId: string;
  productId?: string | null;
  variantId?: string | null;
  productName: string;
  productSku: string;
  size: string;
  color: string;
  price: number;
  quantity: number;
  lineTotal: number;
  imageUrl?: string | null;
}

export interface PaymentModel {
  id: string;
  orderId: string;
  method: string;
  status: string;
  amount: number;
  referenceNumber?: string | null;
  proofImageUrl?: string | null;
  verifiedBy?: string | null;
  verifiedAt?: Date | null;
  rejectionReason?: string | null;
  notes?: string | null;
  createdAt: Date;
  updatedAt?: Date;
  orderNumber?: string;
  customerName?: string;
  customerPhone?: string;
}

export interface OrderModel {
  id: string;
  orderNumber: string;
  userId?: string | null;
  customerName: string;
  customerPhone: string;
  customerEmail?: string | null;
  city: string;
  shippingAddress: string;
  deliveryNotes?: string | null;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  subtotal: number;
  discount: number;
  shippingFee: number;
  grandTotal: number;
  couponCode?: string | null;
  trackingNumber?: string | null;
  internalNotes?: string | null;
  createdAt: Date;
  updatedAt: Date;
  items: OrderItemModel[];
  payments: PaymentModel[];
}

export interface CouponModel {
  id: string;
  code: string;
  discountType: "PERCENTAGE" | "FIXED" | "FREE_SHIPPING";
  discountPercent?: number | null;
  discountAmount?: number | null;
  minOrderAmount: number;
  maxDiscount?: number | null;
  usageLimit?: number | null;
  timesUsed: number;
  perCustomerLimit?: number | null;
  description?: string | null;
  isActive: boolean;
  startDate?: Date | null;
  endDate?: Date | null;
  startsAt?: Date | null;
  expiresAt?: Date | null;
  createdAt: Date;
}

export interface CouponUsageModel {
  id: string;
  couponId: string;
  orderId: string;
  customerEmail?: string | null;
  customerPhone?: string | null;
  discountAmount: number;
  createdAt: Date;
  orderNumber?: string;
  customerName?: string;
}

export interface AuditLogModel {
  id: string;
  userId?: string | null;
  action: string;
  entity: string;
  entityId?: string | null;
  details?: string | null;
  ipAddress?: string | null;
  createdAt: Date;
  userName?: string | null;
  userEmail?: string | null;
}
