import React from "react";
import { BRAND } from "@/lib/constants";

export const metadata = {
  title: "Privacy Policy",
  description: "ROYAL SHOES client privacy and data protection policy.",
};

export default function PrivacyPage() {
  return (
    <div className="py-12 max-w-3xl mx-auto space-y-8">
      <div className="border-b border-[#2A2A2A] pb-4">
        <span className="text-[10px] font-bold tracking-brand uppercase text-[#D4AF37]">
          LEGAL NOTICE
        </span>
        <h1 className="font-brand text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-luxury text-[#F5F0E6] mt-0.5">
          PRIVACY POLICY
        </h1>
      </div>

      <div className="space-y-6 text-xs sm:text-sm text-gray-300 leading-relaxed">
        <p>
          At ROYAL SHOES, your privacy and personal confidentiality are paramount. This policy describes how we collect, store, and utilize your personal information.
        </p>
        <section className="space-y-2">
          <h2 className="font-bold text-[#F5F0E6] uppercase tracking-wider text-xs">Information We Collect</h2>
          <p className="text-gray-400">
            We collect contact details provided during checkout (full name, phone number, shipping address, email) strictly for processing and delivering your orders. We never sell, rent, or trade your personal data with unauthorized third parties.
          </p>
        </section>
        <section className="space-y-2">
          <h2 className="font-bold text-[#F5F0E6] uppercase tracking-wider text-xs">Courier & Payment Information</h2>
          <p className="text-gray-400">
            Delivery details are shared securely with verified courier logistics partners solely to facilitate delivery. Payment receipts for Easypaisa and bank transfers are verified securely and never publicized.
          </p>
        </section>
      </div>
    </div>
  );
}
