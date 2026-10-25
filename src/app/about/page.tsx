import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { BRAND } from "@/lib/constants";

export const metadata = {
  title: "About ROYAL SHOES — The Black & Gold Edition",
  description: "Learn about the heritage, craftsmanship, and bespoke footwear philosophy of ROYAL SHOES.",
};

export default function AboutPage() {
  return (
    <div className="py-12 max-w-4xl mx-auto space-y-16">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 border border-[#795548]/40 bg-[#FFFFFF] text-[#795548] text-[10px] font-bold tracking-brand uppercase">
          <Sparkles size={12} />
          <span>HERITAGE & CRAFTSMANSHIP</span>
        </div>
        <h1 className="font-brand text-3xl sm:text-5xl font-extrabold tracking-luxury text-[#4A342E]">
          THE STORY OF ROYAL SHOES
        </h1>
        <p className="font-luxury text-sm sm:text-base text-[#795548] tracking-brand uppercase">
          {BRAND.tagline}
        </p>
      </div>

      {/* Story Content */}
      <div className="space-y-8 text-xs sm:text-sm text-[#5C5855] leading-relaxed">
        <p className="text-sm sm:text-base text-[#292D30] font-light leading-relaxed">
          Founded on the uncompromising pursuit of shoemaking refinement, ROYAL SHOES embodies the union of authentic Pakistani artisanal leatherwork and international high-fashion ergonomics.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
          <div className="p-6 bg-[#FFFFFF] border border-[#E4DDD3] space-y-3">
            <h3 className="font-brand text-sm font-bold tracking-luxury uppercase text-[#795548]">
              Artisanal Selection
            </h3>
            <p className="text-[#6B635B] text-xs leading-relaxed">
              Every hide of full-grain calf, suede, and patent leather is individually inspected for grain density and structural resilience before entering the cutting room.
            </p>
          </div>

          <div className="p-6 bg-[#FFFFFF] border border-[#E4DDD3] space-y-3">
            <h3 className="font-brand text-sm font-bold tracking-luxury uppercase text-[#795548]">
              The Black & Gold Aesthetic
            </h3>
            <p className="text-[#6B635B] text-xs leading-relaxed">
              Restrained, regal, and timeless. Deep obsidian blacks paired with brushed brass and 24k gold-plated hardware accents define our signature presence.
            </p>
          </div>
        </div>

        <div className="p-8 border border-[#795548]/40 bg-[#FFFFFF] text-center space-y-4">
          <h2 className="font-brand text-xl sm:text-2xl font-extrabold tracking-luxury text-[#4A342E]">
            EXPERIENCE THE COLLECTION
          </h2>
          <p className="text-xs text-[#6B635B] max-w-md mx-auto">
            Discover commanding men&apos;s brogues, sculpted women&apos;s heels, and fine leather goods delivered anywhere in Pakistan.
          </p>
          <div className="pt-2">
            <Link
              href="/all"
              className="inline-flex items-center gap-2 bg-[#795548] hover:bg-[#5D4037] text-white font-bold text-xs uppercase tracking-luxury px-8 py-3.5 transition-all shadow-md"
            >
              <span>Explore Boutique</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
