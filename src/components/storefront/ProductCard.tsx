"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, Check, Sparkles, X, ChevronRight } from "lucide-react";
import { formatPKR } from "@/lib/utils";

export interface ProductCardVariant {
  id: string;
  size: string;
  color: string;
  stock: number;
  additionalPrice?: number;
}

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
  variants?: ProductCardVariant[];
}

interface ProductCardProps {
  product: ProductCardData;
}

export function ProductCard({ product }: ProductCardProps) {
  const [imageError, setImageError] = useState(false);
  const [showQuickSelect, setShowQuickSelect] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const isOnSale = Boolean(product.originalPrice && product.originalPrice > product.price);
  const discountPercent = isOnSale
    ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
    : 0;

  // Determine stock
  const hasVariants = product.variants && product.variants.length > 0;
  const inStockVariants = hasVariants
    ? product.variants!.filter((v) => v.stock > 0)
    : [];
  const isOutOfStock =
    product.inStock === false || (hasVariants && inStockVariants.length === 0);

  // Group variants by unique size
  const uniqueSizes = hasVariants
    ? Array.from(new Set(inStockVariants.map((v) => v.size)))
    : [];

  const handleQuickAdd = (e: React.MouseEvent, variant?: ProductCardVariant) => {
    e.preventDefault();
    e.stopPropagation();

    if (isOutOfStock) return;

    // If product has multiple sizes and no specific variant is passed, open the size picker
    if (hasVariants && uniqueSizes.length > 1 && !variant) {
      setShowQuickSelect(true);
      return;
    }

    const targetVariant = variant || inStockVariants[0];

    // If no variant could be resolved, navigate to detail page
    if (!targetVariant) {
      window.location.href = `/product/${product.slug}`;
      return;
    }

    setIsAdding(true);
    try {
      const stored = localStorage.getItem("royal_cart") || localStorage.getItem("sawera_cart");
      const cartItems: Array<{ productId: string; variantId: string; quantity: number }> = stored
        ? JSON.parse(stored)
        : [];

      const existingIndex = cartItems.findIndex((i) => i.variantId === targetVariant.id);
      if (existingIndex > -1) {
        cartItems[existingIndex].quantity = Math.min(
          cartItems[existingIndex].quantity + 1,
          targetVariant.stock
        );
      } else {
        cartItems.push({
          productId: product.id,
          variantId: targetVariant.id,
          quantity: 1,
        });
      }

      localStorage.setItem("royal_cart", JSON.stringify(cartItems));
      window.dispatchEvent(new Event("cart-updated"));
      setJustAdded(true);
      setShowQuickSelect(false);
      setTimeout(() => setJustAdded(false), 2400);
    } catch {
      // fallback
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="group relative flex flex-col bg-[#111111] border border-[#2A2A2A] hover:border-[#D4AF37]/70 transition-all duration-300 shadow-sm hover:shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
      {/* Product Image Frame */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#0A0A0A]">
        <Link href={`/product/${product.slug}`} className="absolute inset-0 block">
          {/* Badges */}
          <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1.5 pointer-events-none">
            {isOnSale && (
              <span className="bg-[#D4AF37] text-[#080808] text-[9px] sm:text-[10px] font-bold tracking-luxury uppercase px-2 py-0.5 shadow-md">
                -{discountPercent}%
              </span>
            )}
            {product.isNewArrival && !isOnSale && (
              <span className="bg-[#171717]/90 text-[#F5F0E6] border border-[#D4AF37]/50 text-[9px] sm:text-[10px] font-semibold tracking-luxury uppercase px-2 py-0.5 backdrop-blur-sm">
                NEW
              </span>
            )}
            {product.isBestseller && (
              <span className="bg-[#2A2A2A] text-[#D4AF37] text-[9px] sm:text-[10px] font-semibold tracking-luxury uppercase px-2 py-0.5">
                BESTSELLER
              </span>
            )}
          </div>

          {/* Primary Product Image or Luxury Fallback */}
          {!imageError && product.primaryImage ? (
            <Image
              src={product.primaryImage}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              onError={() => setImageError(true)}
              className="object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-4 bg-gradient-to-b from-[#141414] to-[#0A0A0A] border border-[#2A2A2A] text-center">
              <Sparkles className="w-8 h-8 text-[#D4AF37]/70 mb-2" />
              <span className="text-[10px] font-brand tracking-widest uppercase text-[#D4AF37]">
                ROYAL SHOES
              </span>
              <span className="text-[9px] text-gray-500 tracking-wide mt-1 line-clamp-1">
                {product.name}
              </span>
            </div>
          )}

          {/* Stock Overlay if Out of Stock */}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-black/70 backdrop-blur-[2px] flex items-center justify-center z-10">
              <span className="text-[10px] sm:text-[11px] font-bold tracking-luxury uppercase text-[#F5F0E6] border border-[#2A2A2A] bg-[#111111] px-3 py-1">
                Sold Out
              </span>
            </div>
          )}
        </Link>

        {/* Quick Add Overlay on Desktop Hover / Quick Select Box */}
        {!isOutOfStock && (
          <div className="absolute inset-x-0 bottom-0 z-20 p-2 sm:p-2.5 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200">
            {showQuickSelect ? (
              <div className="bg-[#0A0A0A] border border-[#D4AF37]/80 p-2.5 shadow-2xl space-y-2">
                <div className="flex items-center justify-between text-[10px] uppercase tracking-luxury text-[#D4AF37]">
                  <span className="font-bold">Select Size:</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowQuickSelect(false);
                    }}
                    className="text-gray-400 hover:text-white p-0.5"
                  >
                    <X size={12} />
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                  {inStockVariants.map((v) => (
                    <button
                      key={v.id}
                      onClick={(e) => handleQuickAdd(e, v)}
                      className="px-2 py-1 text-[10px] font-mono border border-[#2A2A2A] bg-[#171717] hover:border-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#080808] text-[#F5F0E6] transition-all"
                    >
                      {v.size}
                    </button>
                  ))}
                </div>
              </div>
            ) : justAdded ? (
              <button
                disabled
                className="w-full py-2 px-3 bg-[#D4AF37] text-[#080808] text-[10px] sm:text-[11px] font-bold uppercase tracking-luxury flex items-center justify-center gap-1.5 shadow-lg"
              >
                <Check size={13} className="stroke-[3]" />
                <span>Added to Bag</span>
              </button>
            ) : (
              <button
                onClick={(e) => handleQuickAdd(e)}
                disabled={isAdding}
                className="w-full py-2 px-3 bg-[#080808]/90 hover:bg-[#D4AF37] text-[#F5F0E6] hover:text-[#080808] border border-[#D4AF37]/60 hover:border-[#D4AF37] text-[10px] sm:text-[11px] font-bold uppercase tracking-luxury transition-all flex items-center justify-center gap-1.5 backdrop-blur-sm shadow-md"
              >
                <ShoppingBag size={12} />
                <span>{hasVariants && uniqueSizes.length > 1 ? "Quick Add" : "Add to Bag"}</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Product Details (Below Image) */}
      <div className="p-3 sm:p-4 flex flex-col flex-1 justify-between bg-[#111111]">
        <div>
          {/* Subcategory / Category Label */}
          <div className="text-[9px] sm:text-[10px] tracking-luxury uppercase text-[#D4AF37] mb-1 truncate">
            {product.subcategoryName || product.categoryName || "ROYAL SHOES"}
          </div>

          {/* Product Title */}
          <Link href={`/product/${product.slug}`} className="block">
            <h3 className="text-xs sm:text-sm font-medium text-[#F5F0E6] group-hover:text-[#D4AF37] transition-colors line-clamp-1">
              {product.name}
            </h3>
          </Link>
        </div>

        {/* Price Tag & Action */}
        <div className="mt-2.5 pt-2 border-t border-[#2A2A2A]/40 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-xs sm:text-sm font-bold text-[#F5F0E6] tracking-wide">
              {formatPKR(product.price)}
            </span>
            {isOnSale && (
              <span className="text-[10px] sm:text-xs text-gray-500 line-through">
                {formatPKR(product.originalPrice!)}
              </span>
            )}
          </div>

          {/* Direct link arrow */}
          <Link
            href={`/product/${product.slug}`}
            className="text-gray-500 hover:text-[#D4AF37] transition-colors p-1"
            aria-label={`View ${product.name}`}
          >
            <ChevronRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
