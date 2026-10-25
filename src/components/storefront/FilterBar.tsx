"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SlidersHorizontal, ArrowUpDown } from "lucide-react";

interface FilterBarProps {
  totalCount: number;
  currentSort?: string;
}

export function FilterBar({ totalCount, currentSort = "newest" }: FilterBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSortChange = (newSort: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", newSort);
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 mb-6 border-b border-[#E4DDD3] text-xs">
      {/* Product Count */}
      <div className="text-[#6B635B] font-medium">
        Showing <span className="text-[#292D30] font-bold">{totalCount}</span> luxury creations
      </div>

      {/* Sort Selector */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 text-[#6B635B] uppercase tracking-luxury text-[10px]">
          <ArrowUpDown size={13} className="text-[#795548]" />
          <span>Sort By:</span>
        </div>
        <select
          value={currentSort}
          onChange={(e) => handleSortChange(e.target.value)}
          className="bg-[#FFFFFF] text-[#292D30] border border-[#E4DDD3] px-3 py-1.5 text-xs outline-none focus:border-[#795548] cursor-pointer"
        >
          <option value="newest">Newest Arrivals</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="name-asc">Alphabetical: A to Z</option>
        </select>
      </div>
    </div>
  );
}

export default FilterBar;
