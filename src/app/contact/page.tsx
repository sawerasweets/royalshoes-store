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
        <span className="text-[10px] font-bold tracking-brand uppercase text-[#D4AF37]">
          DIRECT CLIENT ASSISTANCE
        </span>
        <h1 className="font-brand text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-luxury text-[#F5F0E6]">
          CONTACT THE ATELIER
        </h1>
        <p className="text-xs sm:text-sm text-gray-400 max-w-lg mx-auto leading-relaxed">
          Our dedicated team is on hand to assist with footwear fittings, bespoke enquiries, order reservations, and delivery tracking.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Contact Channels */}
        <div className="p-8 bg-[#111111] border border-[#2A2A2A] space-y-6">
          <h2 className="font-brand text-base font-bold tracking-luxury uppercase text-[#F5F0E6] pb-3 border-b border-[#2A2A2A]">
            Official Business Channels
          </h2>

          <div className="space-y-5 text-xs text-gray-300">
            {/* Phone */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full border border-[#D4AF37]/50 flex items-center justify-center text-[#D4AF37] flex-shrink-0 bg-[#080808]">
                <Phone size={18} />
              </div>
              <div className="space-y-0.5">
                <span className="text-gray-500 block text-[10px] uppercase font-bold tracking-wider">
                  Direct Telephone
                </span>
                <a
                  href={`tel:+${whatsappNumber}`}
                  className="font-mono text-base font-bold text-[#F5F0E6] hover:text-[#D4AF37] transition-colors"
                >
                  {businessPhone}
                </a>
                <div className="text-[11px] text-gray-400">Available Monday through Saturday, 10 AM - 9 PM PKT</div>
              </div>
            </div>

            {/* WhatsApp */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full border border-[#D4AF37]/50 flex items-center justify-center text-[#D4AF37] flex-shrink-0 bg-[#080808]">
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
                  className="font-mono text-base font-bold text-[#D4AF37] hover:underline"
                >
                  +{whatsappNumber}
                </a>
                <div className="text-[11px] text-gray-400">Instant messaging for sizing checks & order status</div>
              </div>
            </div>

            {/* Country & Coverage */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full border border-[#D4AF37]/50 flex items-center justify-center text-[#D4AF37] flex-shrink-0 bg-[#080808]">
                <MapPin size={18} />
              </div>
              <div className="space-y-0.5">
                <span className="text-gray-500 block text-[10px] uppercase font-bold tracking-wider">
                  Jurisdiction & Shipping
                </span>
                <div className="text-sm font-semibold text-[#F5F0E6]">Pakistan Nationwide</div>
                <div className="text-[11px] text-gray-400">
                  Express courier delivery to Karachi, Lahore, Islamabad, and all cities across Pakistan
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#2A2A2A]">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 bg-[#D4AF37] hover:bg-[#AA8822] text-[#080808] font-bold text-xs uppercase tracking-luxury py-3.5 px-6 transition-all"
            >
              <MessageCircle size={16} />
              <span>Initiate WhatsApp Conversation</span>
            </a>
          </div>
        </div>

        {/* Client Message Form */}
        <div className="p-8 bg-[#111111] border border-[#2A2A2A] space-y-4">
          <h2 className="font-brand text-base font-bold tracking-luxury uppercase text-[#F5F0E6] pb-3 border-b border-[#2A2A2A]">
            Direct Concierge Dispatch
          </h2>
          <p className="text-xs text-gray-400">
            Submit an inquiry and our client desk will connect with you promptly.
          </p>

          <form className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1">
                Your Name
              </label>
              <input
                type="text"
                required
                placeholder="Full name"
                className="w-full bg-[#080808] border border-[#2A2A2A] focus:border-[#D4AF37] text-xs text-[#F5F0E6] px-3.5 py-2.5 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1">
                Contact Phone / WhatsApp
              </label>
              <input
                type="tel"
                required
                placeholder="03001234567"
                className="w-full bg-[#080808] border border-[#2A2A2A] focus:border-[#D4AF37] text-xs text-[#F5F0E6] px-3.5 py-2.5 outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1">
                Inquiry Nature
              </label>
              <select className="w-full bg-[#080808] border border-[#2A2A2A] focus:border-[#D4AF37] text-xs text-[#F5F0E6] px-3.5 py-2.5 outline-none cursor-pointer">
                <option>Size & Fit Consultation</option>
                <option>Order Reservation Status</option>
                <option>Exchange / Return Request</option>
                <option>Wholesale / Bulk Inquiry</option>
                <option>General Atelier Inquiry</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1">
                Your Message
              </label>
              <textarea
                rows={4}
                required
                placeholder="Detail your inquiry..."
                className="w-full bg-[#080808] border border-[#2A2A2A] focus:border-[#D4AF37] text-xs text-[#F5F0E6] px-3.5 py-2.5 outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#171717] hover:bg-[#2A2A2A] border border-[#D4AF37] text-[#D4AF37] hover:text-white font-bold text-xs uppercase tracking-luxury py-3 transition-colors"
            >
              Dispatch Inquiry
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
