"use client";

import React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

interface SubcategoryItem {
  name: string;
  slug: string;
}

interface SubcategoryPillsProps {
  basePath: string;
  subcategories: SubcategoryItem[];
  currentSub?: string | null;
}

export function SubcategoryPills({ basePath, subcategories, currentSub }: SubcategoryPillsProps) {
  if (!subcategories || subcategories.length === 0) return null;

  return (
    <div className="w-full py-4 border-b border-[#2A2A2A] mb-8 overflow-x-auto no-scrollbar">
      <div className="flex items-center gap-2.5 min-w-max px-2">
        <Link
          href={basePath}
          className={`text-[11px] font-semibold tracking-luxury uppercase px-4 py-2 border transition-all duration-200 ${
            !currentSub
              ? "bg-[#D4AF37] text-[#080808] border-[#D4AF37]"
              : "bg-[#111111] text-[#F5F0E6]/80 border-[#2A2A2A] hover:border-[#D4AF37]/50 hover:text-[#F5F0E6]"
          }`}
        >
          All Styles
        </Link>

        {subcategories.map((sub) => {
          const isSelected = currentSub?.toLowerCase() === sub.name.toLowerCase();
          return (
            <Link
              key={sub.slug}
              href={`${basePath}?sub=${encodeURIComponent(sub.name)}`}
              className={`text-[11px] font-semibold tracking-luxury uppercase px-4 py-2 border transition-all duration-200 ${
                isSelected
                  ? "bg-[#D4AF37] text-[#080808] border-[#D4AF37]"
                  : "bg-[#111111] text-[#F5F0E6]/80 border-[#2A2A2A] hover:border-[#D4AF37]/50 hover:text-[#F5F0E6]"
              }`}
            >
              {sub.name}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default SubcategoryPills;
