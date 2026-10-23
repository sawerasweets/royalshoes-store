import React from "react";
import Link from "next/link";
import Image from "next/image";
import { formatPKR } from "@/lib/utils";

export interface ProductCardData {
  id: string;
  name: string;
  slug: string;
  sku: string;
  price: number;
  originalPrice?: number | null;
  categoryName?: string;
  subcategoryName?: string | null;
  primaryImage: string;
  secondaryImage?: string | null;
  isNewArrival?: boolean;
  isBestseller?: boolean;
  inStock?: boolean;
}

interface ProductCardProps {
  product: ProductCardData;
}

export function ProductCard({ product }: ProductCardProps) {
  const isOnSale = product.originalPrice && product.originalPrice > product.price;
  const discountPercent = isOnSale
    ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
    : 0;

  return (
    <div className="group relative flex flex-col bg-[#111111] border border-[#2A2A2A] hover:border-[#D4AF37]/70 transition-all duration-300">
      {/* Product Image Frame */}
      <Link href={`/product/${product.slug}`} className="relative block aspect-[3/4] w-full overflow-hidden bg-[#0A0A0A]">
        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1.5">
          {isOnSale && (
            <span className="bg-[#D4AF37] text-[#080808] text-[10px] font-bold tracking-luxury uppercase px-2 py-0.5 shadow-md">
              -{discountPercent}%
            </span>
          )}
          {product.isNewArrival && !isOnSale && (
            <span className="bg-[#171717]/90 text-[#F5F0E6] border border-[#D4AF37]/50 text-[10px] font-semibold tracking-luxury uppercase px-2 py-0.5 backdrop-blur-sm">
              NEW
            </span>
          )}
          {product.isBestseller && (
            <span className="bg-[#2A2A2A] text-[#D4AF37] text-[10px] font-semibold tracking-luxury uppercase px-2 py-0.5">
              BESTSELLER
            </span>
          )}
        </div>

        {/* Primary Product Image */}
        <Image
          src={product.primaryImage || "/products/luxury-oxford.svg"}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
        />

        {/* Stock Badge if Out of Stock */}
        {product.inStock === false && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center">
            <span className="text-[11px] font-bold tracking-luxury uppercase text-[#F5F0E6] border border-[#2A2A2A] bg-[#111111] px-3 py-1">
              Sold Out
            </span>
          </div>
        )}
      </Link>

      {/* Product Details (Below Image) */}
      <div className="p-3.5 sm:p-4 flex flex-col flex-1 justify-between bg-[#111111]">
        <div>
          {/* Subcategory / Category Label */}
          <div className="text-[10px] tracking-luxury uppercase text-[#D4AF37] mb-1 truncate">
            {product.subcategoryName || product.categoryName || "ROYAL SHOES"}
          </div>

          {/* Product Title */}
          <Link href={`/product/${product.slug}`} className="block">
            <h3 className="text-xs sm:text-sm font-medium text-[#F5F0E6] group-hover:text-[#D4AF37] transition-colors line-clamp-1">
              {product.name}
            </h3>
          </Link>
        </div>

        {/* Price Tag */}
        <div className="mt-2.5 pt-2 border-t border-[#2A2A2A]/40 flex items-baseline gap-2">
          <span className="text-xs sm:text-sm font-bold text-[#F5F0E6] tracking-wide">
            {formatPKR(product.price)}
          </span>
          {isOnSale && (
            <span className="text-[11px] sm:text-xs text-gray-500 line-through">
              {formatPKR(product.originalPrice!)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
