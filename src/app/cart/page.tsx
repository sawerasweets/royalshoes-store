"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Trash2, ArrowRight, ShieldCheck, Tag, ShoppingBag, Truck, MessageCircle } from "lucide-react";
import { formatPKR } from "@/lib/utils";
import { BRAND } from "@/lib/constants";

interface CartLineItem {
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

interface CartState {
  items: CartLineItem[];
  subtotal: number;
  discount: number;
  shippingFee: number;
  grandTotal: number;
  freeShippingThreshold: number;
  qualifiesForFreeShipping: boolean;
  couponCode?: string;
  errors: string[];
}

export default function CartPage() {
  const [cart, setCart] = useState<CartState | null>(null);
  const [loading, setLoading] = useState(true);
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // Sync and fetch from server
  const refreshCart = async (couponToApply?: string | null) => {
    setIsUpdating(true);
    try {
      const stored = localStorage.getItem("royal_cart") || localStorage.getItem("sawera_cart");
      const items = stored ? JSON.parse(stored) : [];

      if (items.length === 0) {
        setCart({
          items: [],
          subtotal: 0,
          discount: 0,
          shippingFee: 0,
          grandTotal: 0,
          freeShippingThreshold: BRAND.commerce.freeShippingThreshold,
          qualifiesForFreeShipping: false,
          errors: [],
        });
        setLoading(false);
        setIsUpdating(false);
        return;
      }

      const activeCoupon = couponToApply !== undefined ? couponToApply : (appliedCoupon || (typeof window !== "undefined" ? localStorage.getItem("royal_coupon") : null));

      const res = await fetch("/api/cart/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          couponCode: activeCoupon,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setCart(data);
        if (data.couponCode) {
          setAppliedCoupon(data.couponCode);
          if (typeof window !== "undefined") {
            localStorage.setItem("royal_coupon", data.couponCode);
          }
          setCouponError(null);
        } else {
          setAppliedCoupon(null);
          if (typeof window !== "undefined") {
            localStorage.removeItem("royal_coupon");
          }
          if (couponToApply) {
            setCouponError(data.errors?.[0] || "Invalid or ineligible promo code.");
          }
        }
      }
    } catch {
      // fallback
    } finally {
      setLoading(false);
      setIsUpdating(false);
    }
  };

  useEffect(() => {
    const savedPromo = typeof window !== "undefined" ? localStorage.getItem("royal_coupon") : null;
    refreshCart(savedPromo);
  }, []);

  const updateQuantity = (variantId: string, newQty: number, maxStock: number) => {
    try {
      const stored = localStorage.getItem("royal_cart") || localStorage.getItem("sawera_cart");
      let items: any[] = stored ? JSON.parse(stored) : [];

      if (newQty <= 0) {
        items = items.filter((i) => i.variantId !== variantId);
      } else {
        const item = items.find((i) => i.variantId === variantId);
        if (item) {
          item.quantity = Math.min(newQty, maxStock);
        }
      }

      localStorage.setItem("royal_cart", JSON.stringify(items));
      window.dispatchEvent(new Event("cart-updated"));
      refreshCart();
    } catch {
      // fallback
    }
  };

  const removeItem = (variantId: string) => {
    updateQuantity(variantId, 0, 0);
  };

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    refreshCart(couponInput.trim());
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponInput("");
    setCouponError(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("royal_coupon");
    }
    refreshCart(null);
  };

  if (loading) {
    return (
      <div className="py-24 text-center">
        <div className="inline-block w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
        <p className="text-xs uppercase tracking-luxury text-gray-400 mt-4">Reviewing Atelier Selection...</p>
      </div>
    );
  }

  const isEmpty = !cart || cart.items.length === 0;

  if (isEmpty) {
    return (
      <div className="py-24 text-center max-w-md mx-auto space-y-6">
        <div className="w-16 h-16 rounded-full border border-[#D4AF37]/50 flex items-center justify-center text-[#D4AF37] mx-auto">
          <ShoppingBag size={28} />
        </div>
        <div className="space-y-2">
          <h1 className="font-brand text-2xl sm:text-3xl font-extrabold tracking-luxury text-[#F5F0E6]">
            YOUR SHOPPING BAG IS EMPTY
          </h1>
          <p className="text-xs text-gray-400 leading-relaxed">
            You have not placed any ROYAL SHOES handcrafted creations into your shopping bag yet.
          </p>
        </div>
        <div>
          <Link
            href="/all"
            className="inline-flex items-center gap-2 bg-[#D4AF37] hover:bg-[#AA8822] text-[#080808] font-bold text-xs uppercase tracking-luxury px-8 py-3.5 transition-all shadow-md hover:scale-105"
          >
            <span>Explore Boutique</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    );
  }

  const freeShippingThreshold = cart.freeShippingThreshold || BRAND.commerce.freeShippingThreshold;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - cart.subtotal);
  const progressPercent = Math.min(100, Math.round((cart.subtotal / freeShippingThreshold) * 100));

  return (
    <div className="space-y-10 pb-20 pt-4">
      {/* Header */}
      <div className="border-b border-[#2A2A2A] pb-4">
        <span className="text-[10px] font-bold tracking-brand uppercase text-[#D4AF37]">
          ROYAL SHOES ATELIER
        </span>
        <h1 className="font-brand text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-luxury text-[#F5F0E6] mt-0.5">
          YOUR SHOPPING BAG ({cart.items.length})
        </h1>
      </div>

      {/* Free Shipping Progress Indicator */}
      <div className="p-4 bg-[#111111] border border-[#2A2A2A] space-y-2">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Truck size={15} className="text-[#D4AF37]" />
            <span className="text-[#F5F0E6]">
              {cart.qualifiesForFreeShipping ? (
                <strong className="text-emerald-400 uppercase tracking-luxury font-bold">
                  You have unlocked Complimentary Delivery Across Pakistan!
                </strong>
              ) : (
                <span>
                  Add <strong className="text-[#D4AF37]">{formatPKR(remainingForFreeShipping)}</strong> more to enjoy Complimentary Delivery
                </span>
              )}
            </span>
          </div>
          <span className="font-mono text-xs text-gray-400">{progressPercent}%</span>
        </div>
        <div className="w-full bg-[#080808] h-1.5 overflow-hidden">
          <div
            className="bg-[#D4AF37] h-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Cart Items List */}
        <div className="lg:col-span-8 space-y-4">
          {cart.items.map((item) => (
            <div
              key={item.variantId}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-[#111111] border border-[#2A2A2A]"
            >
              <div className="flex items-center gap-4">
                <Link
                  href={`/product/${item.slug}`}
                  className="relative w-20 h-24 sm:w-24 sm:h-28 bg-[#0A0A0A] border border-[#2A2A2A] flex-shrink-0 overflow-hidden"
                >
                  <Image
                    src={item.imageUrl}
                    alt={item.productName}
                    fill
                    className="object-cover object-center"
                  />
                </Link>

                <div className="space-y-1">
                  <Link
                    href={`/product/${item.slug}`}
                    className="font-brand text-sm sm:text-base font-bold text-[#F5F0E6] hover:text-[#D4AF37] transition-colors"
                  >
                    {item.productName}
                  </Link>
                  <div className="text-xs text-gray-400 flex flex-wrap gap-2">
                    <span>Size: <strong className="text-[#F5F0E6]">{item.size}</strong></span>
                    <span>•</span>
                    <span>Color: <strong className="text-[#F5F0E6]">{item.color}</strong></span>
                  </div>
                  <div className="text-[11px] text-gray-500 font-mono">
                    SKU: {item.sku}
                  </div>
                  <div className="text-xs font-bold text-[#D4AF37] sm:hidden pt-1">
                    {formatPKR(item.lineTotal)}
                  </div>
                </div>
              </div>

              {/* Quantity controls & Line Total */}
              <div className="flex items-center justify-between w-full sm:w-auto gap-6 sm:gap-8 pt-2 sm:pt-0 border-t sm:border-0 border-[#2A2A2A]">
                {/* Quantity */}
                <div className="flex items-center border border-[#2A2A2A] bg-[#080808] text-xs">
                  <button
                    onClick={() => updateQuantity(item.variantId, item.quantity - 1, item.availableStock)}
                    className="px-2.5 py-1.5 hover:text-[#D4AF37]"
                  >
                    -
                  </button>
                  <span className="px-3 py-1.5 font-mono font-bold text-center w-8">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.variantId, item.quantity + 1, item.availableStock)}
                    disabled={item.quantity >= item.availableStock}
                    className="px-2.5 py-1.5 hover:text-[#D4AF37] disabled:opacity-30"
                  >
                    +
                  </button>
                </div>

                {/* Line Total */}
                <div className="hidden sm:block text-right">
                  <div className="text-sm font-bold text-[#F5F0E6]">
                    {formatPKR(item.lineTotal)}
                  </div>
                  {item.quantity > 1 && (
                    <div className="text-[10px] text-gray-500">
                      {formatPKR(item.unitPrice)} each
                    </div>
                  )}
                </div>

                {/* Remove Item */}
                <button
                  onClick={() => removeItem(item.variantId)}
                  className="p-2 text-gray-500 hover:text-rose-400 transition-colors"
                  aria-label="Remove Item"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}

          {/* Continue Shopping Button */}
          <div className="pt-2">
            <Link
              href="/all"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-luxury text-[#D4AF37] hover:underline font-semibold"
            >
              <span>← Continue Browsing Collections</span>
            </Link>
          </div>
        </div>

        {/* Right Column: Order Summary & Coupon Form */}
        <div className="lg:col-span-4 space-y-6">
          {/* Summary Card */}
          <div className="p-6 bg-[#111111] border border-[#2A2A2A] space-y-4">
            <h3 className="font-brand text-sm font-bold tracking-luxury uppercase text-[#F5F0E6] pb-3 border-b border-[#2A2A2A]">
              ORDER SUMMARY
            </h3>

            <div className="space-y-2.5 text-xs text-gray-300">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-mono text-[#F5F0E6]">{formatPKR(cart.subtotal)}</span>
              </div>

              {cart.discount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span className="flex items-center gap-1">
                    <Tag size={12} />
                    <span>Privilege Discount ({appliedCoupon})</span>
                  </span>
                  <span className="font-mono">-{formatPKR(cart.discount)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Nationwide Shipping</span>
                <span className="font-mono">
                  {cart.shippingFee === 0 ? (
                    <strong className="text-emerald-400 uppercase tracking-luxury">
                      {appliedCoupon && cart.discount === 0 ? "WAIVED (VIP PRIVILEGE)" : "FREE"}
                    </strong>
                  ) : (
                    formatPKR(cart.shippingFee)
                  )}
                </span>
              </div>
            </div>

            {/* Grand Total */}
            <div className="pt-4 border-t border-[#2A2A2A] flex justify-between items-baseline">
              <div>
                <span className="font-brand text-sm font-bold uppercase tracking-luxury text-[#F5F0E6]">
                  Grand Total
                </span>
                <div className="text-[10px] text-gray-500">Including all duties and charges</div>
              </div>
              <span className="text-xl font-bold font-mono text-[#D4AF37]">
                {formatPKR(cart.grandTotal)}
              </span>
            </div>

            {/* Checkout Button */}
            <div className="pt-4">
              <Link
                href="/checkout"
                className="w-full flex items-center justify-center gap-2 bg-[#D4AF37] hover:bg-[#AA8822] text-[#080808] font-bold text-xs uppercase tracking-luxury py-4 px-6 transition-all duration-200 shadow-md hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>

          {/* Promotional Coupon Form */}
          <div className="p-5 bg-[#111111] border border-[#2A2A2A] space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-luxury text-[#F5F0E6]">
              Privilege Promo Code
            </h4>
            {appliedCoupon ? (
              <div className="flex items-center justify-between p-2.5 bg-[#171717] border border-emerald-500/40 text-xs text-emerald-400">
                <span className="flex items-center gap-2">
                  <Tag size={14} />
                  <span>Code <strong>{appliedCoupon}</strong> Applied</span>
                </span>
                <button
                  onClick={handleRemoveCoupon}
                  className="text-gray-400 hover:text-white text-[11px] underline"
                >
                  Remove
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                  placeholder="e.g. GOLD10"
                  className="flex-1 bg-[#080808] border border-[#2A2A2A] focus:border-[#D4AF37] text-xs text-[#F5F0E6] px-3 py-2 outline-none uppercase font-mono"
                />
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="bg-[#171717] hover:bg-[#2A2A2A] border border-[#2A2A2A] hover:border-[#D4AF37] text-[#F5F0E6] text-[11px] font-bold uppercase tracking-luxury px-4 py-2 transition-colors"
                >
                  Apply
                </button>
              </form>
            )}
            {couponError && (
              <p className="text-[11px] text-rose-400">{couponError}</p>
            )}
          </div>

          {/* Concierge Ordering Assistance */}
          <div className="p-4 border border-[#2A2A2A] bg-[#111111]/40 flex items-center gap-3 text-xs text-gray-400">
            <MessageCircle size={18} className="text-[#D4AF37] flex-shrink-0" />
            <div>
              <span>Prefer to order via WhatsApp? </span>
              <a
                href={BRAND.contact.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#D4AF37] font-bold underline font-mono ml-1"
              >
                Chat with Concierge ({BRAND.contact.phoneDisplay})
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
