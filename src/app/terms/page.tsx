import React from "react";
import { BRAND } from "@/lib/constants";

export const metadata = {
  title: "Terms & Conditions",
  description: "ROYAL SHOES boutique terms of sale and service.",
};

export default function TermsPage() {
  return (
    <div className="py-12 max-w-3xl mx-auto space-y-8">
      <div className="border-b border-[#2A2A2A] pb-4">
        <span className="text-[10px] font-bold tracking-brand uppercase text-[#D4AF37]">
          TERMS OF ENGAGEMENT
        </span>
        <h1 className="font-brand text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-luxury text-[#F5F0E6] mt-0.5">
          TERMS & CONDITIONS
        </h1>
      </div>

      <div className="space-y-6 text-xs sm:text-sm text-gray-300 leading-relaxed">
        <section className="space-y-2">
          <h2 className="font-bold text-[#F5F0E6] uppercase tracking-wider text-xs">1. Orders & Pricing</h2>
          <p className="text-gray-400">
            All prices are quoted in Pakistani Rupees (PKR) and include all applicable taxes. Order confirmations are subject to inventory verification and stock availability.
          </p>
        </section>
        <section className="space-y-2">
          <h2 className="font-bold text-[#F5F0E6] uppercase tracking-wider text-xs">2. Payment Verification</h2>
          <p className="text-gray-400">
            Orders placed via Easypaisa or Bank Transfer remain in Pending verification status until confirmed by our finance desk. Cash on Delivery orders are payable in full upon receipt.
          </p>
        </section>
        <section className="space-y-2">
          <h2 className="font-bold text-[#F5F0E6] uppercase tracking-wider text-xs">3. Brand Representation</h2>
          <p className="text-gray-400">
            All imagery, leather formulations, product titles, and creative materials displayed on this platform are proprietary to ROYAL SHOES.
          </p>
        </section>
      </div>
    </div>
  );
}
