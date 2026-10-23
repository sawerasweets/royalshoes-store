"use client";

import React, { useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { BRAND } from "@/lib/constants";

export function WhatsAppButton() {
  const [showTooltip, setShowTooltip] = useState(false);
  const message = encodeURIComponent(
    "Hello ROYAL SHOES Concierge. I am visiting your online boutique and would like personalized assistance."
  );
  const href = `${BRAND.contact.whatsappUrl}?text=${message}`;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
      {showTooltip && (
        <div className="relative bg-[#111111] text-[#F5F0E6] text-xs px-4 py-2.5 rounded border border-[#D4AF37]/40 shadow-2xl flex items-center gap-2 animate-fade-in max-w-xs">
          <span>
            Connect with our <strong className="text-[#D4AF37]">ROYAL SHOES Concierge</strong> on WhatsApp:{" "}
            <span className="font-mono">{BRAND.contact.phoneDisplay}</span>
          </span>
          <button
            onClick={() => setShowTooltip(false)}
            className="text-gray-400 hover:text-white p-0.5"
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
        className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-[#111111] border-2 border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#080808] shadow-[0_4px_20px_rgba(212,175,55,0.25)] transition-all duration-300 hover:scale-105 active:scale-95"
        aria-label="Chat with ROYAL SHOES on WhatsApp (03481702710)"
      >
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-[#080808]" />
        <MessageCircle size={26} strokeWidth={2} />
      </a>
    </div>
  );
}

export default WhatsAppButton;
