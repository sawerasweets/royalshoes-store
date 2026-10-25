"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ShieldCheck, Truck, CreditCard, Banknote, ArrowRight, Check, AlertCircle, Phone, Tag } from "lucide-react";
import { formatPKR } from "@/lib/utils";
import { BRAND } from "@/lib/constants";

interface CartLineItem {
  productId: string;
  variantId: string;
  productName: string;
  sku: string;
  size: string;
  color: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
  imageUrl: string;
}

export default function CheckoutPage() {
  const router = useRouter();

  // Form Fields
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [city, setCity] = useState("Karachi");
  const [shippingAddress, setShippingAddress] = useState("");
  const [deliveryNotes, setDeliveryNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "EASYPAISA" | "BANK_TRANSFER">("COD");
  const [referenceNumber, setReferenceNumber] = useState("");

  // Cart & Calculation state
  const [items, setItems] = useState<any[]>([]);
  const [calculatedItems, setCalculatedItems] = useState<CartLineItem[]>([]);
  const [subtotal, setSubtotal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [shippingFee, setShippingFee] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);
  const [couponCode, setCouponCode] = useState<string | null>(null);

  // Promo code interaction state in checkout
  const [promoInput, setPromoInput] = useState("");
  const [promoError, setPromoError] = useState<string | null>(null);
  const [promoSuccess, setPromoSuccess] = useState<string | null>(null);
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);

  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const calculateTotals = async (rawItems: any[], codeToTry?: string | null) => {
    try {
      const activeCode =
        codeToTry !== undefined
          ? codeToTry
          : couponCode || (typeof window !== "undefined" ? localStorage.getItem("royal_coupon") : null);

      const res = await fetch("/api/cart/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: rawItems,
          couponCode: activeCode,
          customerPhone: customerPhone.trim() || undefined,
          customerEmail: customerEmail.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setCalculatedItems(data.items);
        setSubtotal(data.subtotal);
        setDiscount(data.discount);
        setShippingFee(data.shippingFee);
        setGrandTotal(data.grandTotal);

        if (data.couponCode) {
          setCouponCode(data.couponCode);
          if (typeof window !== "undefined") {
            localStorage.setItem("royal_coupon", data.couponCode);
          }
          if (codeToTry) {
            setPromoSuccess(`Privilege code ${data.couponCode} applied successfully!`);
            setPromoError(null);
          }
        } else {
          setCouponCode(null);
          if (typeof window !== "undefined") {
            localStorage.removeItem("royal_coupon");
          }
          if (codeToTry) {
            setPromoError(data.errors?.[0] || "Invalid or ineligible promo code.");
            setPromoSuccess(null);
          }
        }
      }
    } catch {
      // fallback
    }
  };

  useEffect(() => {
    const loadCart = async () => {
      try {
        const stored = localStorage.getItem("royal_cart") || localStorage.getItem("sawera_cart");
        const rawItems = stored ? JSON.parse(stored) : [];

        if (rawItems.length === 0) {
          router.push("/cart");
          return;
        }

        setItems(rawItems);
        const storedCoupon = localStorage.getItem("royal_coupon");
        await calculateTotals(rawItems, storedCoupon);
      } catch {
        // fallback
      } finally {
        setLoading(false);
      }
    };

    loadCart();
  }, [router]);

  const handleApplyPromoCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    setIsApplyingPromo(true);
    setPromoError(null);
    setPromoSuccess(null);
    await calculateTotals(items, promoInput.trim());
    setIsApplyingPromo(false);
  };

  const handleRemovePromoCode = async () => {
    setCouponCode(null);
    setPromoInput("");
    setPromoError(null);
    setPromoSuccess(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("royal_coupon");
    }
    await calculateTotals(items, null);
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!customerName.trim() || !customerPhone.trim() || !city.trim() || !shippingAddress.trim()) {
      setErrorMessage("Please fill in your full name, phone number, city, and delivery address.");
      return;
    }

    if ((paymentMethod === "EASYPAISA" || paymentMethod === "BANK_TRANSFER") && !referenceNumber.trim()) {
      setErrorMessage("Please enter your transaction reference number (TRX ID).");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName,
          customerPhone,
          customerEmail,
          city,
          shippingAddress,
          deliveryNotes,
          paymentMethod,
          referenceNumber: referenceNumber.trim(),
          couponCode,
          items,
        }),
      });

      const data = await res.json();

      if (data.success && data.orderNumber) {
        // Clear cart and saved promo code
        localStorage.removeItem("royal_cart");
        localStorage.removeItem("sawera_cart");
        localStorage.removeItem("royal_coupon");
        window.dispatchEvent(new Event("cart-updated"));
        // Redirect to confirmation
        router.push(`/order/${data.orderNumber}`);
      } else {
        setErrorMessage(data.error || "Unable to confirm your order. Please check your details.");
      }
    } catch {
      setErrorMessage("A network error occurred while submitting your order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center">
        <div className="inline-block w-8 h-8 border-2 border-[#795548] border-t-transparent rounded-full animate-spin" />
        <p className="text-xs uppercase tracking-luxury text-[#6B635B] mt-4">Preparing Checkout Gateway...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-20 pt-4 max-w-6xl mx-auto">
      {/* Title */}
      <div className="border-b border-[#E4DDD3] pb-4">
        <span className="text-[10px] font-bold tracking-brand uppercase text-[#795548]">
          CONFIDENTIAL & SECURE
        </span>
        <h1 className="font-brand text-2xl sm:text-3xl font-extrabold tracking-luxury text-[#4A342E] mt-0.5">
          CHECKOUT & DISPATCH
        </h1>
      </div>

      {errorMessage && (
        <div className="p-4 bg-rose-950/40 border border-rose-500/60 text-xs text-rose-300 flex items-center gap-3">
          <AlertCircle size={18} className="flex-shrink-0 text-rose-400" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Delivery & Payment Details */}
        <div className="lg:col-span-7 space-y-8">
          {/* Section 1: Customer Contact & Shipping */}
          <div className="p-6 bg-[#FFFFFF] border border-[#E4DDD3] space-y-5">
            <h2 className="font-brand text-sm font-bold tracking-luxury uppercase text-[#4A342E] pb-3 border-b border-[#E4DDD3] flex items-center justify-between">
              <span>1. Delivery Destination</span>
              <span className="text-[10px] font-normal text-[#795548] tracking-wider uppercase">Pakistan Nationwide</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#5C5855] mb-1.5">
                  Full Name <span className="text-[#795548]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Asad Malik"
                  className="w-full bg-[#FFFFFF] border border-[#E4DDD3] focus:border-[#795548] text-xs text-[#292D30] px-3.5 py-2.5 outline-none tracking-wide"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#5C5855] mb-1.5">
                  Phone Number (Active Mobile) <span className="text-[#795548]">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="e.g. 03001234567"
                  className="w-full bg-[#FFFFFF] border border-[#E4DDD3] focus:border-[#795548] text-xs text-[#292D30] px-3.5 py-2.5 outline-none font-mono tracking-wide"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#5C5855] mb-1.5">
                  Email Address (For Order Receipts)
                </label>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-[#FFFFFF] border border-[#E4DDD3] focus:border-[#795548] text-xs text-[#292D30] px-3.5 py-2.5 outline-none tracking-wide"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#5C5855] mb-1.5">
                  City <span className="text-[#795548]">*</span>
                </label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-[#FFFFFF] border border-[#E4DDD3] focus:border-[#795548] text-xs text-[#292D30] px-3.5 py-2.5 outline-none tracking-wide cursor-pointer"
                >
                  {BRAND.contact.cities.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#5C5855] mb-1.5">
                Complete Street Address <span className="text-[#795548]">*</span>
              </label>
              <textarea
                required
                rows={2}
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                placeholder="House / Apartment number, Street name, Sector / Area / Phase"
                className="w-full bg-[#FFFFFF] border border-[#E4DDD3] focus:border-[#795548] text-xs text-[#292D30] px-3.5 py-2.5 outline-none tracking-wide"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#5C5855] mb-1.5">
                Delivery Instructions (Optional)
              </label>
              <input
                type="text"
                value={deliveryNotes}
                onChange={(e) => setDeliveryNotes(e.target.value)}
                placeholder="e.g. Call before delivery / Deliver after 2 PM"
                className="w-full bg-[#FFFFFF] border border-[#E4DDD3] focus:border-[#795548] text-xs text-[#292D30] px-3.5 py-2.5 outline-none tracking-wide"
              />
            </div>
          </div>

          {/* Section 2: Payment Method (Phase 16) */}
          <div className="p-6 bg-[#FFFFFF] border border-[#E4DDD3] space-y-5">
            <h2 className="font-brand text-sm font-bold tracking-luxury uppercase text-[#4A342E] pb-3 border-b border-[#E4DDD3]">
              2. Payment Method
            </h2>

            <div className="space-y-3">
              {/* Option 1: Cash on Delivery */}
              <label
                className={`flex items-start gap-3.5 p-4 border cursor-pointer transition-all ${
                  paymentMethod === "COD"
                    ? "border-[#795548] bg-[#FAF7F2] ring-1 ring-[#795548]"
                    : "border-[#E4DDD3] bg-[#FFFFFF] hover:border-[#795548]/60"
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="COD"
                  checked={paymentMethod === "COD"}
                  onChange={() => setPaymentMethod("COD")}
                  className="mt-1 accent-[#795548]"
                />
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Banknote size={16} className="text-[#795548]" />
                    <span className="text-xs font-bold uppercase tracking-wider text-[#292D30]">
                      Cash on Delivery (COD)
                    </span>
                  </div>
                  <p className="text-[11px] text-[#6B635B]">
                    Pay securely in cash directly to the courier representative when receiving your luxury parcel.
                  </p>
                </div>
              </label>

              {/* Option 2: Easypaisa Manual Payment */}
              <label
                className={`flex items-start gap-3.5 p-4 border cursor-pointer transition-all ${
                  paymentMethod === "EASYPAISA"
                    ? "border-[#795548] bg-[#FAF7F2] ring-1 ring-[#795548]"
                    : "border-[#E4DDD3] bg-[#FFFFFF] hover:border-[#795548]/60"
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="EASYPAISA"
                  checked={paymentMethod === "EASYPAISA"}
                  onChange={() => setPaymentMethod("EASYPAISA")}
                  className="mt-1 accent-[#795548]"
                />
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <CreditCard size={16} className="text-[#795548]" />
                    <span className="text-xs font-bold uppercase tracking-wider text-[#292D30]">
                      Easypaisa Mobile Wallet
                    </span>
                  </div>
                  <p className="text-[11px] text-[#6B635B]">
                    Send total amount to ROYAL SHOES official account <strong className="text-[#795548] font-mono">03481702710</strong> and submit your Transaction ID below.
                  </p>

                  {paymentMethod === "EASYPAISA" && (
                    <div className="pt-3 mt-3 border-t border-[#E4DDD3] space-y-2">
                      <div className="p-3 bg-[#FAF7F2] border border-[#E4DDD3] text-[11px] text-[#5C5855] space-y-1">
                        <div>Account Title: <strong className="text-[#292D30]">ROYAL SHOES</strong></div>
                        <div>Account Number: <strong className="text-[#795548] font-mono">03481702710</strong></div>
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold uppercase text-[#5C5855] mb-1">
                          11-Digit Transaction ID (TRX ID) <span className="text-[#795548]">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={referenceNumber}
                          onChange={(e) => setReferenceNumber(e.target.value)}
                          placeholder="e.g. 29482710928"
                          className="w-full bg-[#FFFFFF] border border-[#E4DDD3] focus:border-[#795548] text-xs text-[#292D30] px-3 py-2 outline-none font-mono"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </label>

              {/* Option 3: Direct Bank Transfer */}
              <label
                className={`flex items-start gap-3.5 p-4 border cursor-pointer transition-all ${
                  paymentMethod === "BANK_TRANSFER"
                    ? "border-[#795548] bg-[#FAF7F2] ring-1 ring-[#795548]"
                    : "border-[#E4DDD3] bg-[#FFFFFF] hover:border-[#795548]/60"
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="BANK_TRANSFER"
                  checked={paymentMethod === "BANK_TRANSFER"}
                  onChange={() => setPaymentMethod("BANK_TRANSFER")}
                  className="mt-1 accent-[#795548]"
                />
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={16} className="text-[#795548]" />
                    <span className="text-xs font-bold uppercase tracking-wider text-[#292D30]">
                      Direct Bank Transfer
                    </span>
                  </div>
                  <p className="text-[11px] text-[#6B635B]">
                    Online transfer via any Pakistani banking app. Admin verifies transaction upon order review.
                  </p>

                  {paymentMethod === "BANK_TRANSFER" && (
                    <div className="pt-3 mt-3 border-t border-[#E4DDD3] space-y-2">
                      <div className="p-3 bg-[#FAF7F2] border border-[#E4DDD3] text-[11px] text-[#5C5855] space-y-1">
                        <div>Bank Name: <strong className="text-[#292D30]">Meezan Bank Ltd</strong></div>
                        <div>Account Title: <strong className="text-[#292D30]">ROYAL SHOES ATELIER</strong></div>
                        <div>IBAN: <strong className="text-[#795548] font-mono">PK00MEZN0000001234567890</strong></div>
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold uppercase text-[#5C5855] mb-1">
                          Bank Reference / Transaction Receipt Number <span className="text-[#795548]">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={referenceNumber}
                          onChange={(e) => setReferenceNumber(e.target.value)}
                          placeholder="e.g. FT26295719"
                          className="w-full bg-[#FFFFFF] border border-[#E4DDD3] focus:border-[#795548] text-xs text-[#292D30] px-3 py-2 outline-none font-mono"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary Preview & Confirmation Button */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 bg-[#FFFFFF] border border-[#E4DDD3] space-y-5">
            <h3 className="font-brand text-sm font-bold tracking-luxury uppercase text-[#4A342E] pb-3 border-b border-[#E4DDD3]">
              Items In Parcel ({calculatedItems.length})
            </h3>

            {/* List of snapshot items */}
            <div className="space-y-3 max-h-72 overflow-y-auto no-scrollbar pr-1">
              {calculatedItems.map((item) => (
                <div key={item.variantId} className="flex items-center gap-3 py-1 border-b border-[#E4DDD3]/40 pb-2">
                  <div className="relative w-12 h-16 bg-[#FAF7F2] border border-[#E4DDD3] flex-shrink-0">
                    <Image src={item.imageUrl} alt={item.productName} fill className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium text-[#292D30] truncate">{item.productName}</div>
                    <div className="text-[10px] text-[#6B635B]">
                      {item.size} • {item.color} • Qty {item.quantity}
                    </div>
                  </div>
                  <div className="text-xs font-mono font-bold text-[#4A342E]">
                    {formatPKR(item.lineTotal)}
                  </div>
                </div>
              ))}
            </div>

            {/* Promo Code Entry in Checkout */}
            <div className="pt-2 border-t border-[#E4DDD3] space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#6B635B] flex items-center gap-1.5">
                  <Tag size={13} className="text-[#795548]" />
                  <span>Privilege Promo Code</span>
                </span>
              </div>

              {couponCode ? (
                <div className="flex items-center justify-between p-2.5 bg-[#FFFFFF] border border-emerald-500/40 text-xs text-emerald-400">
                  <div className="flex items-center gap-2">
                    <Check size={14} />
                    <span>Code <strong className="font-mono">{couponCode}</strong> Active</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemovePromoCode}
                    className="text-[#6B635B] hover:text-[#4A342E] text-[11px] underline"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="space-y-1.5">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                      placeholder="e.g. GOLD10, ROYAL200"
                      className="flex-1 bg-[#FFFFFF] border border-[#E4DDD3] focus:border-[#795548] text-xs text-[#795548] font-mono font-bold px-3 py-2 outline-none uppercase"
                    />
                    <button
                      type="button"
                      disabled={isApplyingPromo || !promoInput.trim()}
                      onClick={handleApplyPromoCode}
                      className="bg-[#FFFFFF] hover:bg-[#795548] hover:text-white text-[#4A342E] text-xs font-bold uppercase tracking-wider px-4 py-2 border border-[#E4DDD3] transition-colors disabled:opacity-40"
                    >
                      {isApplyingPromo ? "Verifying..." : "Apply"}
                    </button>
                  </div>
                  {promoError && (
                    <p className="text-[11px] text-rose-600">{promoError}</p>
                  )}
                  {promoSuccess && (
                    <p className="text-[11px] text-emerald-600">{promoSuccess}</p>
                  )}
                </div>
              )}
            </div>

            {/* Breakdown */}
            <div className="space-y-2 text-xs text-[#5C5855] pt-2 border-t border-[#E4DDD3]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-mono text-[#292D30]">{formatPKR(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span>Privilege Discount ({couponCode})</span>
                  <span className="font-mono">-{formatPKR(discount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Nationwide Shipping</span>
                <span className="font-mono">
                  {shippingFee === 0 ? (
                    <strong className="text-emerald-600 uppercase tracking-luxury">
                      {couponCode && discount === 0 ? "WAIVED (VIP PRIVILEGE)" : "FREE"}
                    </strong>
                  ) : (
                    formatPKR(shippingFee)
                  )}
                </span>
              </div>
            </div>

            {/* Grand Total */}
            <div className="pt-4 border-t border-[#E4DDD3] flex justify-between items-baseline">
              <span className="font-brand text-sm font-bold uppercase tracking-luxury text-[#4A342E]">
                Total Payable
              </span>
              <span className="text-2xl font-bold font-mono text-[#795548]">
                {formatPKR(grandTotal)}
              </span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 bg-[#795548] hover:bg-[#5D4037] text-white font-bold text-xs uppercase tracking-luxury py-4 px-6 transition-all duration-200 shadow-md hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>{isSubmitting ? "Securing Reservation..." : "Confirm & Place Luxury Order"}</span>
              <ArrowRight size={15} />
            </button>

            <p className="text-[10px] text-gray-500 text-center leading-relaxed">
              By confirming your order, you agree to ROYAL SHOES terms, 7-day sizing exchange, and privacy policies.
            </p>
          </div>

          {/* Concierge Assistance */}
          <div className="p-4 border border-[#E4DDD3] bg-[#FFFFFF]/40 text-xs text-[#6B635B] space-y-2">
            <div className="flex items-center gap-2 text-[#795548] font-semibold uppercase tracking-wider">
              <Phone size={14} />
              <span>Checkout Concierge Support</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              Questions regarding sizing, delivery timeframes, or payment verification? Contact our official line at{" "}
              <a href={BRAND.contact.phoneTel} className="text-[#795548] font-mono font-bold hover:underline">
                {BRAND.contact.phoneDisplay}
              </a>{" "}
              or via WhatsApp.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}
