import React from "react";
import { RotateCcw, ShieldCheck, CheckCircle2 } from "lucide-react";
import { BRAND } from "@/lib/constants";

export const metadata = {
  title: "Return & Size Exchange Policy",
  description: "ROYAL SHOES 7-day hassle-free size exchange policy across Pakistan.",
};

export default function ReturnsPolicyPage() {
  return (
    <div className="py-12 max-w-3xl mx-auto space-y-8">
      <div className="border-b border-[#E4DDD3] pb-4">
        <span className="text-[10px] font-bold tracking-brand uppercase text-[#795548]">
          CLIENT ASSURANCE
        </span>
        <h1 className="font-brand text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-luxury text-[#4A342E] mt-0.5">
          RETURN & SIZE EXCHANGE POLICY
        </h1>
      </div>

      <div className="space-y-6 text-xs sm:text-sm text-[#5C5855] leading-relaxed">
        <section className="p-6 bg-[#FFFFFF] border border-[#E4DDD3] space-y-3">
          <div className="flex items-center gap-2 text-[#795548] font-bold uppercase tracking-luxury">
            <RotateCcw size={18} />
            <h2>7-Day Sizing Guarantee</h2>
          </div>
          <p>
            We take pride in our precision shoe lasts. If your shoes do not fit with the exact comfort and poise you expect, you may exchange for another size within 7 calendar days of parcel receipt.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-brand text-base font-bold text-[#4A342E] tracking-luxury uppercase">
            1. Conditions for Exchange
          </h2>
          <ul className="list-disc pl-5 space-y-1.5 text-[#6B635B]">
            <li>Footwear must be unworn and in uncreased pristine condition with protective sole coverings intact.</li>
            <li>Original ROYAL SHOES presentation box, satin dustbags, and accessories must accompany the returned pair.</li>
            <li>Request must be registered within 7 calendar days from courier delivery timestamp.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-brand text-base font-bold text-[#4A342E] tracking-luxury uppercase">
            2. How to Initiate an Exchange
          </h2>
          <p className="text-[#6B635B]">
            Contact our concierge team via WhatsApp at <a href={BRAND.contact.whatsappUrl} className="text-[#795548] font-mono font-bold underline">+{BRAND.contact.whatsappIntl}</a> or telephone <strong className="font-mono text-[#795548]">{BRAND.contact.phoneDisplay}</strong> with your Order Number and preferred replacement size. Our concierge will arrange return collection.
          </p>
        </section>
      </div>
    </div>
  );
}
