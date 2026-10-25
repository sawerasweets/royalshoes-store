import React from "react";
import { Truck, Clock, ShieldCheck, MapPin } from "lucide-react";
import { BRAND } from "@/lib/constants";

export const metadata = {
  title: "Shipping & Nationwide Delivery Policy",
  description: "ROYAL SHOES nationwide shipping policy across Pakistan. Complimentary shipping on orders over PKR 5,000.",
};

export default function ShippingPolicyPage() {
  return (
    <div className="py-12 max-w-3xl mx-auto space-y-8">
      <div className="border-b border-[#E4DDD3] pb-4">
        <span className="text-[10px] font-bold tracking-brand uppercase text-[#795548]">
          CLIENT SERVICE
        </span>
        <h1 className="font-brand text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-luxury text-[#4A342E] mt-0.5">
          SHIPPING & DELIVERY POLICY
        </h1>
      </div>

      <div className="space-y-6 text-xs sm:text-sm text-[#5C5855] leading-relaxed">
        <section className="p-6 bg-[#FFFFFF] border border-[#E4DDD3] space-y-3">
          <div className="flex items-center gap-2 text-[#795548] font-bold uppercase tracking-luxury">
            <Truck size={18} />
            <h2>Nationwide Pakistan Coverage</h2>
          </div>
          <p>
            ROYAL SHOES delivers handcrafted footwear and fashion accessories to all major cities and remote destinations across Pakistan via premier courier partners.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-brand text-base font-bold text-[#4A342E] tracking-luxury uppercase">
            1. Shipping Charges & Free Delivery Threshold
          </h2>
          <ul className="list-disc pl-5 space-y-1.5 text-[#6B635B]">
            <li>
              <strong>Complimentary Delivery:</strong> All orders exceeding <strong className="text-[#795548]">Rs. 5,000</strong> receive complimentary standard shipping nationwide.
            </li>
            <li>
              <strong>Standard Shipping Fee:</strong> For orders under Rs. 5,000, a flat nominal delivery fee of <strong className="text-[#795548]">Rs. 250</strong> is applied.
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-brand text-base font-bold text-[#4A342E] tracking-luxury uppercase">
            2. Estimated Delivery Timeframes
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-4 bg-[#FFFFFF] border border-[#E4DDD3]">
              <div className="font-bold text-[#4A342E] text-xs uppercase tracking-wider">Major Metropolitan Cities</div>
              <div className="text-[11px] text-[#795548] font-mono mt-1">2 to 4 Working Days</div>
              <p className="text-[11px] text-[#6B635B] mt-1">Karachi, Lahore, Islamabad, Rawalpindi, Faisalabad, Multan.</p>
            </div>
            <div className="p-4 bg-[#FFFFFF] border border-[#E4DDD3]">
              <div className="font-bold text-[#4A342E] text-xs uppercase tracking-wider">Regional & Secondary Cities</div>
              <div className="text-[11px] text-[#795548] font-mono mt-1">3 to 6 Working Days</div>
              <p className="text-[11px] text-[#6B635B] mt-1">Peshawar, Quetta, Sialkot, Gujranwala, Hyderabad, and all other towns.</p>
            </div>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="font-brand text-base font-bold text-[#4A342E] tracking-luxury uppercase">
            3. Order Tracking & Dispatch Confirmation
          </h2>
          <p className="text-[#6B635B]">
            Once your order is processed by our atelier, you will receive an SMS and/or WhatsApp confirmation with your consignment tracking number. You can also monitor your status anytime at <a href="/account" className="text-[#795548] underline">Your Account</a> or by contacting our concierge desk at <strong className="font-mono text-[#795548]">{BRAND.contact.phoneDisplay}</strong>.
          </p>
        </section>
      </div>
    </div>
  );
}
