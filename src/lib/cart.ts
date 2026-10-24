import prisma from "./db";
import { BRAND } from "./constants";

export interface CartItemInput {
  productId: string;
  variantId: string;
  quantity: number;
}

export interface CalculatedCartItem {
  productId: string;
  variantId: string;
  productName: string;
  sku: string;
  slug: string;
  size: string;
  color: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
  imageUrl: string;
  availableStock: number;
}

export interface CartCalculationResult {
  items: CalculatedCartItem[];
  subtotal: number;
  discount: number;
  shippingFee: number;
  grandTotal: number;
  freeShippingThreshold: number;
  qualifiesForFreeShipping: boolean;
  couponCode?: string;
  couponDiscountType?: "PERCENTAGE" | "FIXED" | "FREE_SHIPPING";
  couponMessage?: string;
  errors: string[];
}

export async function calculateCart(
  rawItems: CartItemInput[],
  couponCode?: string,
  customerInfo?: { email?: string; phone?: string }
): Promise<CartCalculationResult> {
  const settings = await prisma.storeSettings.findUnique({
    where: { id: "singleton" },
  }).catch(() => null);

  const freeShippingThreshold = settings?.freeShippingThreshold ?? BRAND.commerce.freeShippingThreshold;
  const standardShippingFee = settings?.standardShippingFee ?? BRAND.commerce.standardShippingFee;

  const errors: string[] = [];
  const calculatedItems: CalculatedCartItem[] = [];
  let subtotal = 0;

  for (const item of rawItems) {
    if (item.quantity <= 0) continue;

    const product = await prisma.product.findUnique({
      where: { id: item.productId },
      include: {
        images: { orderBy: { displayOrder: "asc" } },
        variants: true,
      },
    });

    if (!product || !product.isPublished) {
      errors.push(`A requested product is no longer available.`);
      continue;
    }

    const variant = product.variants.find((v) => v.id === item.variantId);
    if (!variant) {
      errors.push(`Selected variant for "${product.name}" is no longer available.`);
      continue;
    }

    if (variant.stock <= 0) {
      errors.push(`"${product.name}" (${variant.size} / ${variant.color}) is out of stock.`);
      continue;
    }

    const quantity = Math.min(item.quantity, variant.stock);
    if (quantity < item.quantity) {
      errors.push(
        `Quantity for "${product.name}" (${variant.size}) reduced to available stock of ${variant.stock}.`
      );
    }

    const unitPrice = product.price + variant.additionalPrice;
    const lineTotal = unitPrice * quantity;
    subtotal += lineTotal;

    const primaryImage = product.images.find((img) => img.isPrimary) || product.images[0];
    const imageUrl = primaryImage ? primaryImage.url : "/products/men-formal/men-formal-1.jpg";

    calculatedItems.push({
      productId: product.id,
      variantId: variant.id,
      productName: product.name,
      sku: variant.sku || product.sku,
      slug: product.slug,
      size: variant.size,
      color: variant.color,
      unitPrice,
      quantity,
      lineTotal,
      imageUrl,
      availableStock: variant.stock,
    });
  }

  // Calculate Privilege Coupon discount
  let discount = 0;
  let validCouponCode: string | undefined = undefined;
  let couponDiscountType: "PERCENTAGE" | "FIXED" | "FREE_SHIPPING" | undefined = undefined;
  let couponMessage: string | undefined = undefined;
  let freeShippingPromoApplied = false;

  if (couponCode && couponCode.trim()) {
    const cleanCode = couponCode.trim().toUpperCase();
    const coupon = await prisma.coupon.findUnique({
      where: { code: cleanCode },
    });

    const now = new Date();
    const effectiveStart = coupon?.startDate || coupon?.startsAt;
    const effectiveEnd = coupon?.endDate || coupon?.expiresAt;

    if (!coupon || !coupon.isActive) {
      errors.push(`Privilege Promo Code "${cleanCode}" is invalid or inactive.`);
    } else if (effectiveStart && new Date(effectiveStart) > now) {
      errors.push(`Privilege Promo Code "${cleanCode}" is not active yet.`);
    } else if (effectiveEnd && new Date(effectiveEnd) < now) {
      errors.push(`Privilege Promo Code "${cleanCode}" has expired.`);
    } else if (coupon.usageLimit != null && coupon.timesUsed >= coupon.usageLimit) {
      errors.push(`Privilege Promo Code "${cleanCode}" total redemption limit has been reached.`);
    } else if (subtotal < (coupon.minOrderAmount || 0)) {
      errors.push(
        `Privilege Promo Code "${cleanCode}" requires a minimum order subtotal of Rs. ${(coupon.minOrderAmount || 0).toLocaleString()}.`
      );
    } else {
      // Check per-customer usage limit if email or phone is provided
      let customerLimitReached = false;
      if (coupon.perCustomerLimit && (customerInfo?.email || customerInfo?.phone)) {
        const usageCount = await prisma.couponUsage.count({
          where: {
            couponId: coupon.id,
            customerEmail: customerInfo.email || undefined,
            customerPhone: customerInfo.phone || undefined,
          },
        });
        if (usageCount >= coupon.perCustomerLimit) {
          customerLimitReached = true;
          errors.push(
            `You have already reached the redemption limit (${coupon.perCustomerLimit} use${coupon.perCustomerLimit > 1 ? "s" : ""}) for code "${cleanCode}".`
          );
        }
      }

      if (!customerLimitReached) {
        validCouponCode = cleanCode;
        couponDiscountType = (coupon.discountType as any) || (coupon.discountPercent ? "PERCENTAGE" : "FIXED");

        if (couponDiscountType === "FREE_SHIPPING") {
          freeShippingPromoApplied = true;
          discount = 0;
          couponMessage = `Complimentary nationwide delivery granted via code ${cleanCode}`;
        } else if (couponDiscountType === "PERCENTAGE" || coupon.discountPercent) {
          const rawDiscount = Math.round((subtotal * (coupon.discountPercent || 0)) / 100);
          discount = coupon.maxDiscount ? Math.min(rawDiscount, coupon.maxDiscount) : rawDiscount;
          discount = Math.min(discount, subtotal);
          couponMessage = `${coupon.discountPercent}% privilege discount applied via code ${cleanCode}`;
        } else if (couponDiscountType === "FIXED" || coupon.discountAmount) {
          discount = Math.min(coupon.discountAmount || 0, subtotal);
          couponMessage = `Rs. ${discount.toLocaleString()} privilege discount applied via code ${cleanCode}`;
        }
      }
    }
  }

  const qualifiesForFreeShipping = subtotal >= freeShippingThreshold || freeShippingPromoApplied;
  const shippingFee = calculatedItems.length === 0 ? 0 : qualifiesForFreeShipping ? 0 : standardShippingFee;
  const grandTotal = Math.max(0, subtotal - discount + shippingFee);

  return {
    items: calculatedItems,
    subtotal,
    discount,
    shippingFee,
    grandTotal,
    freeShippingThreshold,
    qualifiesForFreeShipping,
    couponCode: validCouponCode,
    couponDiscountType,
    couponMessage,
    errors,
  };
}
