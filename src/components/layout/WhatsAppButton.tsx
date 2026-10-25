"use client";

import React, { useState } from "react";
import Link from "next/link";
import { MessageCircle, X, Home } from "lucide-react";
import { BRAND } from "@/lib/constants";

export function WhatsAppButton() {
  const [showTooltip, setShowTooltip] = useState(false);
  const message = encodeURIComponent(
    "Hello ROYAL SHOES Concierge. I am visiting your online boutique and would like personalized assistance."
  );
  const href = `${BRAND.contact.whatsappUrl}?text=${message}`;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* 1-Tap Floating Return to Main Homepage Button */}
      <Link
        href="/"
        className="group relative flex items-center justify-center w-12 h-12 rounded-full bg-[#FFFFFF] border-2 border-[#795548] text-[#795548] hover:bg-[#795548] hover:text-white shadow-[0_4px_16px_rgba(121,85,72,0.25)] transition-all duration-300 hover:scale-110 active:scale-95"
        title="Return to Main Homepage"
        aria-label="Return to Main Homepage"
      >
        <Home size={20} />
      </Link>

      {/* WhatsApp Concierge Button */}
      <div className="flex items-center gap-3">
        {showTooltip && (
          <div className="relative bg-[#FFFFFF] text-[#292D30] text-xs px-4 py-2.5 rounded border border-[#795548]/40 shadow-2xl flex items-center gap-2 animate-fade-in max-w-xs">
            <span>
              Connect with our <strong className="text-[#795548]">ROYAL SHOES Concierge</strong> on WhatsApp:{" "}
              <span className="font-mono">{BRAND.contact.phoneDisplay}</span>
            </span>
            <button
              onClick={() => setShowTooltip(false)}
              className="text-[#6B635B] hover:text-[#4A342E] p-0.5"
              aria-label="Close message"
            >
              <X size={14} />
            </button>
          </div>
        )}

        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          onMouseEnter={() => setShowTooltip(true)}
          className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-[#FFFFFF] border-2 border-[#795548] text-[#795548] hover:bg-[#795548] hover:text-white shadow-[0_4px_20px_rgba(121,85,72,0.25)] transition-all duration-300 hover:scale-105 active:scale-95"
          aria-label="Chat with ROYAL SHOES on WhatsApp (03481702710)"
        >
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-[#F5F0E6]" />
          <MessageCircle size={26} strokeWidth={2} />
        </a>
      </div>
    </div>
  );
}

export default WhatsAppButton;
