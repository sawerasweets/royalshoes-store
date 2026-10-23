import React from "react";
import Link from "next/link";
import { Phone, MessageCircle, Mail, MapPin, ShieldCheck, Truck, RotateCcw } from "lucide-react";
import { BRAND, MAIN_CATEGORIES } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="w-full bg-[#080808] border-t border-[#2A2A2A] text-[#F5F0E6] mt-24">
      {/* Brand Value Pillars */}
      <div className="border-b border-[#2A2A2A] bg-[#111111]/60 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-4">
            <div className="w-12 h-12 rounded-full border border-[#D4AF37]/50 flex items-center justify-center text-[#D4AF37]">
              <Truck size={22} />
            </div>
            <div>
              <h4 className="text-xs uppercase tracking-luxury font-bold text-[#F5F0E6]">Pakistan Nationwide Delivery</h4>
              <p className="text-[12px] text-gray-400 mt-0.5">Complimentary shipping on orders above Rs. 5,000.</p>
            </div>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-4">
            <div className="w-12 h-12 rounded-full border border-[#D4AF37]/50 flex items-center justify-center text-[#D4AF37]">
              <ShieldCheck size={22} />
            </div>
            <div>
              <h4 className="text-xs uppercase tracking-luxury font-bold text-[#F5F0E6]">Artisanal Precision</h4>
              <p className="text-[12px] text-gray-400 mt-0.5">Handcrafted footwear and genuine leather accessories.</p>
            </div>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-4">
            <div className="w-12 h-12 rounded-full border border-[#D4AF37]/50 flex items-center justify-center text-[#D4AF37]">
              <RotateCcw size={22} />
            </div>
            <div>
              <h4 className="text-xs uppercase tracking-luxury font-bold text-[#F5F0E6]">Hassle-Free Exchange</h4>
              <p className="text-[12px] text-gray-400 mt-0.5">7-day sizing exchange and dedicated concierge support.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-block">
              <span className="font-brand text-2xl font-extrabold tracking-brand text-[#F5F0E6]">
                ROYAL SHOES
              </span>
              <div className="text-[9px] tracking-[0.3em] text-[#D4AF37] uppercase font-medium mt-0.5">
                {BRAND.tagline}
              </div>
            </Link>
            <p className="text-xs text-gray-400 leading-relaxed max-w-sm">
              {BRAND.description}
            </p>
            <div className="pt-2 text-xs text-gray-400 space-y-2">
              <div className="flex items-center gap-2.5">
                <Phone size={14} className="text-[#D4AF37]" />
                <span>Direct Line: </span>
                <a href={BRAND.contact.phoneTel} className="font-mono text-[#D4AF37] hover:underline font-medium">
                  {BRAND.contact.phoneDisplay}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <MessageCircle size={14} className="text-[#D4AF37]" />
                <span>WhatsApp: </span>
                <a
                  href={BRAND.contact.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-[#D4AF37] hover:underline font-medium"
                >
                  +{BRAND.contact.whatsappIntl}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <MapPin size={14} className="text-[#D4AF37]" />
                <span>{BRAND.contact.country}</span>
              </div>
            </div>
          </div>

          {/* Shopping Collections */}
          <div>
            <h4 className="text-xs uppercase tracking-luxury font-bold text-[#D4AF37] mb-4">
              Collections
            </h4>
            <ul className="space-y-2 text-xs text-gray-400">
              {MAIN_CATEGORIES.map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={cat.slug === "all" ? "/all" : `/${cat.slug}`}
                    className="hover:text-[#D4AF37] transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="text-xs uppercase tracking-luxury font-bold text-[#D4AF37] mb-4">
              Client Concierge
            </h4>
            <ul className="space-y-2 text-xs text-gray-400">
              <li>
                <Link href="/contact" className="hover:text-[#D4AF37] transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="hover:text-[#D4AF37] transition-colors">
                  Shipping & Delivery
                </Link>
              </li>
              <li>
                <Link href="/returns" className="hover:text-[#D4AF37] transition-colors">
                  Return & Exchange Policy
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-[#D4AF37] transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link href="/account/orders" className="hover:text-[#D4AF37] transition-colors">
                  Track Your Order
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Policies */}
          <div>
            <h4 className="text-xs uppercase tracking-luxury font-bold text-[#D4AF37] mb-4">
              Legal & Policy
            </h4>
            <ul className="space-y-2 text-xs text-gray-400">
              <li>
                <Link href="/privacy" className="hover:text-[#D4AF37] transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-[#D4AF37] transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#D4AF37] transition-colors">
                  About ROYAL SHOES
                </Link>
              </li>
              <li>
                <Link href="/admin" className="text-gray-500 hover:text-[#D4AF37] transition-colors">
                  Administration
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Subfooter */}
      <div className="border-t border-[#2A2A2A] py-6 px-4 sm:px-6 lg:px-8 text-center text-[11px] text-gray-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} ROYAL SHOES — {BRAND.edition}. Step into Elegance.</p>
          <div className="flex items-center gap-6">
            <span>Cash on Delivery</span>
            <span>•</span>
            <span>Easypaisa</span>
            <span>•</span>
            <span>Direct Bank Transfer</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
