import React from "react";
import { Phone, MessageCircle, MapPin, Clock, ShieldCheck, Mail } from "lucide-react";
import prisma from "@/lib/db";
import { BRAND } from "@/lib/constants";

export const dynamic = "force-dynamic";

export default async function ContactPage() {
  const settings = await prisma.storeSettings.findUnique();

  const businessPhone = settings?.businessPhone || BRAND.contact.phoneDisplay;
  const whatsappNumber = settings?.whatsappNumber || BRAND.contact.whatsappIntl;
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent("Hello ROYAL SHOES Concierge. I would like assistance with an inquiry.")}`;

  return (
    <div className="space-y-12 pb-20 pt-4 max-w-4xl mx-auto">
      {/* Title */}
      <div className="text-center space-y-2">
        <span className="text-[10px] font-bold tracking-brand uppercase text-[#795548]">
          DIRECT CLIENT ASSISTANCE
        </span>
        <h1 className="font-brand text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-luxury text-[#4A342E]">
          CONTACT THE ATELIER
        </h1>
        <p className="text-xs sm:text-sm text-[#6B635B] max-w-lg mx-auto leading-relaxed">
          Our dedicated team is on hand to assist with footwear fittings, bespoke enquiries, order reservations, and delivery tracking.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Contact Channels */}
        <div className="p-8 bg-[#FFFFFF] border border-[#E4DDD3] space-y-6">
          <h2 className="font-brand text-base font-bold tracking-luxury uppercase text-[#4A342E] pb-3 border-b border-[#E4DDD3]">
            Official Business Channels
          </h2>

          <div className="space-y-5 text-xs text-[#5C5855]">
            {/* Phone */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full border border-[#795548]/50 flex items-center justify-center text-[#795548] flex-shrink-0 bg-[#F5F0E6]">
                <Phone size={18} />
              </div>
              <div className="space-y-0.5">
                <span className="text-gray-500 block text-[10px] uppercase font-bold tracking-wider">
                  Direct Telephone
                </span>
                <a
                  href={`tel:+${whatsappNumber}`}
                  className="font-mono text-base font-bold text-[#4A342E] hover:text-[#795548] transition-colors"
                >
                  {businessPhone}
                </a>
                <div className="text-[11px] text-[#6B635B]">Available Monday through Saturday, 10 AM - 9 PM PKT</div>
              </div>
            </div>

            {/* WhatsApp */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full border border-[#795548]/50 flex items-center justify-center text-[#795548] flex-shrink-0 bg-[#F5F0E6]">
                <MessageCircle size={18} />
              </div>
              <div className="space-y-0.5">
                <span className="text-gray-500 block text-[10px] uppercase font-bold tracking-wider">
                  Official WhatsApp Concierge
                </span>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-base font-bold text-[#795548] hover:underline"
                >
                  +{whatsappNumber}
                </a>
                <div className="text-[11px] text-[#6B635B]">Instant messaging for sizing checks & order status</div>
              </div>
            </div>

            {/* Country & Coverage */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full border border-[#795548]/50 flex items-center justify-center text-[#795548] flex-shrink-0 bg-[#F5F0E6]">
                <MapPin size={18} />
              </div>
              <div className="space-y-0.5">
                <span className="text-gray-500 block text-[10px] uppercase font-bold tracking-wider">
                  Jurisdiction & Shipping
                </span>
                <div className="text-sm font-semibold text-[#292D30]">Pakistan Nationwide</div>
                <div className="text-[11px] text-[#6B635B]">
                  Express courier delivery to Karachi, Lahore, Islamabad, and all cities across Pakistan
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#E4DDD3]">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 bg-[#795548] hover:bg-[#5D4037] text-white font-bold text-xs uppercase tracking-luxury py-3.5 px-6 transition-all"
            >
              <MessageCircle size={16} />
              <span>Initiate WhatsApp Conversation</span>
            </a>
          </div>
        </div>

        {/* Client Message Form */}
        <div className="p-8 bg-[#FFFFFF] border border-[#E4DDD3] space-y-4">
          <h2 className="font-brand text-base font-bold tracking-luxury uppercase text-[#4A342E] pb-3 border-b border-[#E4DDD3]">
            Direct Concierge Dispatch
          </h2>
          <p className="text-xs text-[#6B635B]">
            Submit an inquiry and our client desk will connect with you promptly.
          </p>

          <form className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#5C5855] mb-1">
                Your Name
              </label>
              <input
                type="text"
                required
                placeholder="Full name"
                className="w-full bg-[#F5F0E6] border border-[#E4DDD3] focus:border-[#795548] text-xs text-[#292D30] px-3.5 py-2.5 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#5C5855] mb-1">
                Contact Phone / WhatsApp
              </label>
              <input
                type="tel"
                required
                placeholder="03001234567"
                className="w-full bg-[#F5F0E6] border border-[#E4DDD3] focus:border-[#795548] text-xs text-[#292D30] px-3.5 py-2.5 outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#5C5855] mb-1">
                Inquiry Nature
              </label>
              <select className="w-full bg-[#F5F0E6] border border-[#E4DDD3] focus:border-[#795548] text-xs text-[#292D30] px-3.5 py-2.5 outline-none cursor-pointer">
                <option>Size & Fit Consultation</option>
                <option>Order Reservation Status</option>
                <option>Exchange / Return Request</option>
                <option>Wholesale / Bulk Inquiry</option>
                <option>General Atelier Inquiry</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#5C5855] mb-1">
                Your Message
              </label>
              <textarea
                rows={4}
                required
                placeholder="Detail your inquiry..."
                className="w-full bg-[#F5F0E6] border border-[#E4DDD3] focus:border-[#795548] text-xs text-[#292D30] px-3.5 py-2.5 outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#FFFFFF] hover:bg-[#E4DDD3] border border-[#795548] text-[#795548] hover:text-white font-bold text-xs uppercase tracking-luxury py-3 transition-colors"
            >
              Dispatch Inquiry
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
