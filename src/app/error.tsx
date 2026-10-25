"use client";

import React, { useEffect } from "react";
import { AlertCircle, RotateCcw } from "lucide-react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Storefront Application Error:", error);
  }, [error]);

  return (
    <div className="py-24 text-center max-w-md mx-auto space-y-6">
      <div className="w-16 h-16 rounded-full border border-rose-500/50 flex items-center justify-center text-rose-400 mx-auto bg-[#FFFFFF]">
        <AlertCircle size={28} />
      </div>
      <div className="space-y-2">
        <span className="text-[10px] font-bold tracking-brand uppercase text-rose-400">
          UNEXPECTED ANOMALY
        </span>
        <h1 className="font-brand text-2xl font-extrabold tracking-luxury text-[#4A342E]">
          SOMETHING INTERRUPTED YOUR EXPERIENCE
        </h1>
        <p className="text-xs text-[#6B635B] leading-relaxed">
          Our engineering team has logged this occurrence. Please attempt to refresh the atelier view.
        </p>
      </div>
      <div>
        <button
          onClick={() => reset()}
          className="inline-flex items-center gap-2 bg-[#795548] hover:bg-[#5D4037] text-white font-bold text-xs uppercase tracking-luxury px-8 py-3.5 transition-all shadow-md"
        >
          <RotateCcw size={14} />
          <span>Retry Connection</span>
        </button>
      </div>
    </div>
  );
}
