import React from "react";
import Link from "next/link";
import { ArrowRight, Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="py-24 text-center max-w-md mx-auto space-y-6">
      <div className="w-16 h-16 rounded-full border border-[#D4AF37]/50 flex items-center justify-center text-[#D4AF37] mx-auto bg-[#111111]">
        <Compass size={28} />
      </div>
      <div className="space-y-2">
        <span className="text-[10px] font-bold tracking-brand uppercase text-[#D4AF37]">
          404 — ATELIER NOTICE
        </span>
        <h1 className="font-brand text-3xl font-extrabold tracking-luxury text-[#F5F0E6]">
          CREATION NOT FOUND
        </h1>
        <p className="text-xs text-gray-400 leading-relaxed">
          The collection silhouette or page you are seeking is either unavailable or has been archived.
        </p>
      </div>
      <div>
        <Link
          href="/all"
          className="inline-flex items-center gap-2 bg-[#D4AF37] hover:bg-[#AA8822] text-[#080808] font-bold text-xs uppercase tracking-luxury px-8 py-3.5 transition-all shadow-md hover:scale-105"
        >
          <span>Return to Collections</span>
          <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}
