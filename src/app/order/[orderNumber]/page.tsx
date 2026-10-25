import React from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { CheckCircle2, Truck, ShieldCheck, MapPin, Phone, MessageCircle, ArrowRight } from "lucide-react";
import prisma from "@/lib/db";
import { formatPKR } from "@/lib/utils";
import { BRAND } from "@/lib/constants";

export const revalidate = 0; // Always fresh

interface OrderConfirmationPageProps {
  params: { orderNumber: string };
}

export default async function OrderConfirmationPage({ params }: OrderConfirmationPageProps) {
  const order = await prisma.order.findUnique({
    where: { orderNumber: params.orderNumber },
  });

  if (!order) {
    notFound();
  }

  const payment = order.payments?.[0];

  const statusColors: Record<string, string> = {
    PENDING: "bg-amber-500/10 text-amber-400 border-amber-500/40",
    CONFIRMED: "bg-blue-500/10 text-blue-400 border-blue-500/40",
    PROCESSING: "bg-purple-500/10 text-purple-400 border-purple-500/40",
    SHIPPED: "bg-cyan-500/10 text-cyan-400 border-cyan-500/40",
    DELIVERED: "bg-emerald-500/10 text-emerald-400 border-emerald-500/40",
    CANCELLED: "bg-rose-500/10 text-rose-400 border-rose-500/40",
  };

  const paymentMethodLabels: Record<string, string> = {
    COD: "Cash on Delivery",
    EASYPAISA: "Easypaisa Mobile Wallet",
    BANK_TRANSFER: "Direct Bank Transfer",
  };

  const whatsappMessage = encodeURIComponent(
    `Hello ROYAL SHOES Concierge. I am inquiring about my Order #${order.orderNumber}.`
  );
  const whatsappUrl = `${BRAND.contact.whatsappUrl}?text=${whatsappMessage}`;

  return (
    <div className="space-y-10 pb-20 pt-6 max-w-4xl mx-auto">
      {/* Confirmation Header Banner */}
      <div className="p-8 sm:p-10 bg-[#FFFFFF] border border-[#795548]/40 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-[#FFFFFF] border-2 border-[#795548] flex items-center justify-center text-[#795548] mx-auto shadow-lg">
          <CheckCircle2 size={32} />
        </div>
        <div className="space-y-1">
          <span className="text-[10px] font-bold tracking-brand uppercase text-[#795548]">
            RESERVATION CONFIRMED
          </span>
          <h1 className="font-brand text-2xl sm:text-4xl font-extrabold tracking-luxury text-[#4A342E]">
            THANK YOU FOR CHOOSING ROYAL SHOES
          </h1>
          <p className="text-xs sm:text-sm text-[#6B635B] max-w-lg mx-auto">
            Your order has been recorded in our atelier ledger and will be packaged with artisanal care.
          </p>
        </div>

        {/* Order Identifier & Badges */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
          <div className="px-4 py-1.5 bg-[#F5F0E6] border border-[#E4DDD3] text-xs font-mono">
            Order: <strong className="text-[#795548]">{order.orderNumber}</strong>
          </div>
          <div className={`px-3 py-1 text-xs border font-bold uppercase tracking-luxury ${statusColors[order.status] || ""}`}>
            Status: {order.status}
          </div>
          <div className="px-3 py-1 bg-[#FFFFFF] border border-[#E4DDD3] text-xs font-semibold text-[#5C5855]">
            Payment: {paymentMethodLabels[order.paymentMethod] || order.paymentMethod}
          </div>
        </div>
      </div>

      {/* Payment Verification Instructions (Phase 16) */}
      {order.paymentMethod === "EASYPAISA" && (
        <div className="p-6 bg-[#FFFFFF] border border-[#795548]/50 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-luxury text-[#795548]">
            <ShieldCheck size={16} />
            <span>Easypaisa Payment Verification</span>
          </div>
          <p className="text-xs text-[#5C5855] leading-relaxed">
            Your transaction reference ID is recorded as <strong className="font-mono text-[#795548]">{payment?.referenceNumber || "Provided"}</strong>. Our accounts desk will verify this transfer with Easypaisa before order dispatch.
          </p>
          <div className="text-[11px] text-[#6B635B]">
            Official ROYAL SHOES Easypaisa Account: <strong className="font-mono text-[#4A342E]">03481702710</strong> (Title: ROYAL SHOES).
          </div>
        </div>
      )}

      {order.paymentMethod === "BANK_TRANSFER" && (
        <div className="p-6 bg-[#FFFFFF] border border-[#795548]/50 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-luxury text-[#795548]">
            <ShieldCheck size={16} />
            <span>Bank Transfer Verification</span>
          </div>
          <p className="text-xs text-[#5C5855] leading-relaxed">
            Your transfer reference number is recorded as <strong className="font-mono text-[#795548]">{payment?.referenceNumber || "Provided"}</strong>. Once our finance department confirms funds in our Meezan Bank account, dispatch tracking will update.
          </p>
        </div>
      )}

      {/* Order Details & Summary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Left: Purchased Products Snapshot */}
        <div className="md:col-span-7 space-y-4">
          <div className="p-6 bg-[#FFFFFF] border border-[#E4DDD3] space-y-4">
            <h3 className="font-brand text-xs font-bold tracking-luxury uppercase text-[#4A342E] pb-3 border-b border-[#E4DDD3]">
              Purchased Creations Snapshot ({order.items.length})
            </h3>

            <div className="space-y-4 divide-y divide-[#E4DDD3]">
              {order.items.map((item: any) => (
                <div key={item.id} className="pt-3 first:pt-0 flex items-center gap-4">
                  <div className="relative w-16 h-20 bg-[#FAF7F2] border border-[#E4DDD3] flex-shrink-0 overflow-hidden">
                    <Image
                      src={item.imageUrl || "/products/luxury-oxford.svg"}
                      alt={item.productName}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0 space-y-0.5">
                    <h4 className="text-xs sm:text-sm font-bold text-[#4A342E] truncate">
                      {item.productName}
                    </h4>
                    <div className="text-[11px] text-[#6B635B]">
                      Size: <strong className="text-[#4A342E]">{item.size}</strong> • Color: <strong className="text-[#4A342E]">{item.color}</strong>
                    </div>
                    <div className="text-[10px] text-gray-500 font-mono">
                      SKU: {item.productSku} • Qty: {item.quantity}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs sm:text-sm font-bold font-mono text-[#292D30]">
                      {formatPKR(item.lineTotal)}
                    </div>
                    {item.quantity > 1 && (
                      <div className="text-[10px] text-gray-500">
                        {formatPKR(item.price)} each
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Customer & Financial Summary */}
        <div className="md:col-span-5 space-y-6">
          {/* Destination Summary */}
          <div className="p-6 bg-[#FFFFFF] border border-[#E4DDD3] space-y-3 text-xs">
            <h3 className="font-brand text-xs font-bold tracking-luxury uppercase text-[#4A342E] pb-2 border-b border-[#E4DDD3] flex items-center gap-2">
              <MapPin size={14} className="text-[#795548]" />
              <span>Delivery Details</span>
            </h3>

            <div className="space-y-1 text-[#5C5855]">
              <div className="font-bold text-[#4A342E]">{order.customerName}</div>
              <div className="font-mono text-[#795548]">{order.customerPhone}</div>
              {order.customerEmail && <div className="text-[#6B635B]">{order.customerEmail}</div>}
              <div className="pt-1 text-[#6B635B]">{order.shippingAddress}</div>
              <div className="font-semibold text-[#4A342E]">{order.city}, Pakistan</div>
              {order.deliveryNotes && (
                <div className="pt-2 text-[11px] italic text-[#6B635B]">
                  Note: &quot;{order.deliveryNotes}&quot;
                </div>
              )}
            </div>
          </div>

          {/* Pricing Totals */}
          <div className="p-6 bg-[#FFFFFF] border border-[#E4DDD3] space-y-3 text-xs">
            <h3 className="font-brand text-xs font-bold tracking-luxury uppercase text-[#4A342E] pb-2 border-b border-[#E4DDD3]">
              Financial Summary
            </h3>

            <div className="space-y-2 text-[#5C5855]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-mono text-[#292D30]">{formatPKR(order.subtotal)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Privilege Discount ({order.couponCode})</span>
                  <span className="font-mono">-{formatPKR(order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span className="font-mono">
                  {order.shippingFee === 0 ? (
                    <strong className="text-emerald-400">FREE</strong>
                  ) : (
                    formatPKR(order.shippingFee)
                  )}
                </span>
              </div>
              <div className="pt-3 border-t border-[#E4DDD3] flex justify-between items-baseline text-sm font-bold">
                <span className="text-[#292D30] uppercase tracking-luxury">Total Amount</span>
                <span className="font-mono text-xl text-[#795548]">{formatPKR(order.grandTotal)}</span>
              </div>
            </div>
          </div>

          {/* Direct Concierge WhatsApp Action */}
          <div className="p-5 bg-[#FFFFFF] border border-[#E4DDD3] space-y-3 text-center">
            <div className="text-xs text-[#5C5855]">
              Need immediate dispatch updates or customized adjustments?
            </div>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full bg-[#FFFFFF] hover:bg-[#795548] text-[#795548] hover:text-white border border-[#795548] font-bold text-xs uppercase tracking-luxury py-3 px-4 transition-all"
            >
              <MessageCircle size={16} />
              <span>Inquire via WhatsApp Concierge</span>
            </a>
          </div>

          {/* Continue Shopping */}
          <div className="text-center">
            <Link
              href="/all"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-luxury text-[#6B635B] hover:text-[#795548] transition-colors"
            >
              <span>Explore More Creations</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
