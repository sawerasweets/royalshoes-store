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
  errors: string[];
}

export async function calculateCart(
  rawItems: CartItemInput[],
  couponCode?: string
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
    const imageUrl = primaryImage ? primaryImage.url : "/products/luxury-oxford.svg";

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

  // Calculate Coupon discount
  let discount = 0;
  let validCouponCode: string | undefined = undefined;

  if (couponCode && couponCode.trim()) {
    const cleanCode = couponCode.trim().toUpperCase();
    const coupon = await prisma.coupon.findUnique({
      where: { code: cleanCode },
    });

    if (!coupon || !coupon.isActive) {
      errors.push(`Coupon "${cleanCode}" is invalid or expired.`);
    } else if (coupon.startsAt > new Date()) {
      errors.push(`Coupon "${cleanCode}" is not active yet.`);
    } else if (coupon.expiresAt && coupon.expiresAt < new Date()) {
      errors.push(`Coupon "${cleanCode}" has expired.`);
    } else if (coupon.usageLimit && coupon.timesUsed >= coupon.usageLimit) {
      errors.push(`Coupon "${cleanCode}" usage limit has been reached.`);
    } else if (subtotal < coupon.minOrderAmount) {
      errors.push(
        `Coupon "${cleanCode}" requires a minimum order subtotal of Rs. ${coupon.minOrderAmount}.`
      );
    } else {
      validCouponCode = cleanCode;
      if (coupon.discountPercent) {
        discount = (subtotal * coupon.discountPercent) / 100;
      } else if (coupon.discountAmount) {
        discount = coupon.discountAmount;
      }

      if (coupon.maxDiscount && discount > coupon.maxDiscount) {
        discount = coupon.maxDiscount;
      }

      discount = Math.min(discount, subtotal);
    }
  }

  const qualifiesForFreeShipping = subtotal >= freeShippingThreshold;
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
    errors,
  };
}
