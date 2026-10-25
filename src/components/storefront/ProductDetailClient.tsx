"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ShoppingBag, Heart, ShieldCheck, Truck, RotateCcw, Check, AlertCircle, Zap, ArrowRight } from "lucide-react";
import { formatPKR } from "@/lib/utils";
import { BRAND } from "@/lib/constants";

interface ProductImage {
  id: string;
  url: string;
  altText?: string | null;
  isPrimary?: boolean;
}

interface ProductVariant {
  id: string;
  size: string;
  color: string;
  stock: number;
  additionalPrice: number;
  sku?: string | null;
}

interface ProductDetailClientProps {
  product: {
    id: string;
    name: string;
    slug: string;
    sku: string;
    description: string;
    price: number;
    originalPrice?: number | null;
    categoryName?: string;
    subcategoryName?: string | null;
    images: ProductImage[];
    variants: ProductVariant[];
  };
  freeShippingThreshold?: number;
}

export function ProductDetailClient({ product, freeShippingThreshold = 5000 }: ProductDetailClientProps) {
  const images = product.images.length > 0 ? product.images : [{ id: "fallback", url: "/products/luxury-oxford.svg" }];
  const [selectedImage, setSelectedImage] = useState(images[0].url);

  // Extract distinct sizes and colors
  const availableSizes = useMemo(() => {
    const set = new Set<string>();
    product.variants.forEach((v) => set.add(v.size));
    return Array.from(set);
  }, [product.variants]);

  const availableColors = useMemo(() => {
    const set = new Set<string>();
    product.variants.forEach((v) => set.add(v.color));
    return Array.from(set);
  }, [product.variants]);

  const router = useRouter();
  const [selectedSize, setSelectedSize] = useState<string>(availableSizes[0] || "Standard");
  const [selectedColor, setSelectedColor] = useState<string>(availableColors[0] || "Default");
  const [quantity, setQuantity] = useState<number>(1);
  const [isAdding, setIsAdding] = useState(false);
  const [isBuyingNow, setIsBuyingNow] = useState(false);
  const [addedMessage, setAddedMessage] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Current active variant
  const currentVariant = useMemo(() => {
    return product.variants.find(
      (v) => v.size === selectedSize && v.color === selectedColor
    ) || product.variants[0];
  }, [product.variants, selectedSize, selectedColor]);

  const currentStock = currentVariant?.stock ?? 0;
  const isOutOfStock = currentStock <= 0;
  const currentPrice = product.price + (currentVariant?.additionalPrice || 0);

  const isOnSale = product.originalPrice && product.originalPrice > currentPrice;
  const discountPercent = isOnSale
    ? Math.round(((product.originalPrice! - currentPrice) / product.originalPrice!) * 100)
    : 0;

  const handleAddToCart = () => {
    if (isOutOfStock || !currentVariant) return;

    setIsAdding(true);
    try {
      const stored = localStorage.getItem("royal_cart") || localStorage.getItem("sawera_cart");
      const cartItems: any[] = stored ? JSON.parse(stored) : [];

      const existingIndex = cartItems.findIndex(
        (item) => item.variantId === currentVariant.id
      );

      if (existingIndex > -1) {
        const newQty = Math.min(cartItems[existingIndex].quantity + quantity, currentStock);
        cartItems[existingIndex].quantity = newQty;
      } else {
        cartItems.push({
          productId: product.id,
          variantId: currentVariant.id,
          quantity: Math.min(quantity, currentStock),
        });
      }

      localStorage.setItem("royal_cart", JSON.stringify(cartItems));
      window.dispatchEvent(new Event("cart-updated"));
      setAddedMessage(true);
      setTimeout(() => setAddedMessage(false), 3000);
    } catch {
      // fallback
    } finally {
      setIsAdding(false);
    }
  };

  const handleBuyNow = () => {
    if (isOutOfStock || !currentVariant) return;

    setIsBuyingNow(true);
    try {
      const stored = localStorage.getItem("royal_cart") || localStorage.getItem("sawera_cart");
      const cartItems: any[] = stored ? JSON.parse(stored) : [];

      const existingIndex = cartItems.findIndex(
        (item) => item.variantId === currentVariant.id
      );

      if (existingIndex > -1) {
        const newQty = Math.min(cartItems[existingIndex].quantity + quantity, currentStock);
        cartItems[existingIndex].quantity = newQty;
      } else {
        cartItems.push({
          productId: product.id,
          variantId: currentVariant.id,
          quantity: Math.min(quantity, currentStock),
        });
      }

      localStorage.setItem("royal_cart", JSON.stringify(cartItems));
      window.dispatchEvent(new Event("cart-updated"));
      router.push("/checkout");
    } catch {
      setIsBuyingNow(false);
    }
  };

  const handleToggleWishlist = () => {
    try {
      const stored = localStorage.getItem("royal_wishlist") || localStorage.getItem("sawera_wishlist");
      let list: string[] = stored ? JSON.parse(stored) : [];
      if (list.includes(product.id)) {
        list = list.filter((id) => id !== product.id);
        setIsWishlisted(false);
      } else {
        list.push(product.id);
        setIsWishlisted(true);
      }
      localStorage.setItem("royal_wishlist", JSON.stringify(list));
    } catch {
      // fallback
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 pt-4">
      {/* Left Column: Image Gallery (Thumbnails + Main Stage) */}
      <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4">
        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-y-auto max-h-[600px] no-scrollbar">
            {images.map((img) => (
              <button
                key={img.id}
                onClick={() => setSelectedImage(img.url)}
                className={`relative w-16 h-20 sm:w-20 sm:h-24 flex-shrink-0 border bg-white overflow-hidden transition-all ${
                  selectedImage === img.url
                    ? "border-[#D4AF37] ring-2 ring-[#D4AF37]"
                    : "border-[#2A2A2A] hover:border-gray-500 opacity-80 hover:opacity-100"
                }`}
              >
                <Image
                  src={img.url}
                  alt={img.altText || product.name}
                  fill
                  className="object-contain p-1"
                />
              </button>
            ))}
          </div>
        )}

        {/* Main Stage Image */}
        <div className="relative aspect-[3/4] w-full bg-white border border-[#D4AF37]/50 overflow-hidden flex-1 shadow-2xl">
          {isOnSale && (
            <span className="absolute top-4 left-4 z-10 bg-[#D4AF37] text-[#080808] text-xs font-bold tracking-luxury uppercase px-3 py-1 shadow-lg">
              -{discountPercent}% OFF
            </span>
          )}
          <Image
            src={selectedImage}
            alt={product.name}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 60vw"
            className="object-contain p-3 transition-all duration-300"
          />
        </div>
      </div>

      {/* Right Column: Product Info & Purchase Options */}
      <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
        <div className="space-y-4">
          {/* Breadcrumb / Category */}
          <div className="text-[11px] font-bold tracking-brand uppercase text-[#D4AF37]">
            {product.subcategoryName ? `${product.categoryName} • ${product.subcategoryName}` : product.categoryName}
          </div>

          {/* Title */}
          <h1 className="font-brand text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-luxury text-[#F5F0E6]">
            {product.name}
          </h1>

          {/* SKU */}
          <div className="text-xs text-gray-500 font-mono tracking-wider">
            SKU: {currentVariant?.sku || product.sku}
          </div>

          {/* Price Tag */}
          <div className="flex items-baseline gap-3 pt-1 border-b border-[#2A2A2A] pb-4">
            <span className="text-2xl sm:text-3xl font-extrabold text-[#F5F0E6] tracking-wide">
              {formatPKR(currentPrice)}
            </span>
            {isOnSale && (
              <span className="text-base text-gray-500 line-through">
                {formatPKR(product.originalPrice!)}
              </span>
            )}
            <span className="text-[11px] text-[#D4AF37] tracking-wider uppercase font-medium">
              Tax Included
            </span>
          </div>

          {/* Color Selector */}
          {availableColors.length > 1 && (
            <div className="space-y-2 pt-2">
              <label className="text-xs font-bold uppercase tracking-luxury text-[#F5F0E6] flex items-center justify-between">
                <span>Color: <strong className="text-[#D4AF37]">{selectedColor}</strong></span>
              </label>
              <div className="flex flex-wrap gap-2">
                {availableColors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-2 text-xs border font-medium transition-all ${
                      selectedColor === color
                        ? "border-[#D4AF37] bg-[#171717] text-[#D4AF37] ring-1 ring-[#D4AF37]"
                        : "border-[#2A2A2A] bg-[#111111] text-gray-300 hover:border-gray-500"
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Size Selector */}
          {availableSizes.length > 0 && availableSizes[0] !== "Standard" && (
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-luxury text-[#F5F0E6]">
                <span>Select Size: <strong className="text-[#D4AF37]">{selectedSize}</strong></span>
                <span className="text-[10px] text-gray-400 font-normal underline cursor-pointer hover:text-white">
                  Size Guide (EU)
                </span>
              </div>
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                {availableSizes.map((size) => {
                  const sizeVariant = product.variants.find(
                    (v) => v.size === size && v.color === selectedColor
                  );
                  const isSizeOOS = !sizeVariant || sizeVariant.stock <= 0;

                  return (
                    <button
                      key={size}
                      onClick={() => !isSizeOOS && setSelectedSize(size)}
                      disabled={isSizeOOS}
                      className={`py-2.5 text-xs font-bold tracking-wider border transition-all ${
                        isSizeOOS
                          ? "border-[#2A2A2A]/40 bg-[#0A0A0A] text-gray-600 cursor-not-allowed line-through"
                          : selectedSize === size
                          ? "border-[#D4AF37] bg-[#D4AF37] text-[#080808]"
                          : "border-[#2A2A2A] bg-[#111111] text-[#F5F0E6] hover:border-[#D4AF37]"
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Availability / Stock Notice */}
          <div className="pt-2 text-xs">
            {isOutOfStock ? (
              <div className="flex items-center gap-2 text-rose-400 font-semibold uppercase tracking-wider">
                <AlertCircle size={15} />
                <span>Currently Sold Out in this Variant</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-emerald-400 font-medium">
                <Check size={15} />
                <span>Available for immediate dispatch ({currentStock} in atelier stock)</span>
              </div>
            )}
          </div>

          {/* Quantity and Actions */}
          <div className="pt-4 space-y-3">
            {/* Action Row 1: Quantity Selector + Add To Shopping Bag + Wishlist */}
            <div className="flex items-center gap-2.5 sm:gap-3">
              {/* Quantity Selector */}
              <div className="flex items-center border border-[#2A2A2A] bg-[#111111] text-sm flex-shrink-0">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1 || isOutOfStock}
                  className="px-3.5 py-3 hover:text-[#D4AF37] disabled:opacity-30 disabled:hover:text-current"
                >
                  -
                </button>
                <span className="px-3 py-3 font-mono font-bold text-center w-10 text-xs">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(Math.min(currentStock, quantity + 1))}
                  disabled={quantity >= currentStock || isOutOfStock}
                  className="px-3.5 py-3 hover:text-[#D4AF37] disabled:opacity-30 disabled:hover:text-current"
                >
                  +
                </button>
              </div>

              {/* Add To Cart Button */}
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={isOutOfStock || isAdding}
                className="flex-1 flex items-center justify-center gap-2 bg-[#171717] hover:bg-[#202020] text-[#F5F0E6] hover:text-[#D4AF37] border border-[#D4AF37]/60 hover:border-[#D4AF37] font-bold text-xs uppercase tracking-luxury py-3.5 px-4 transition-all duration-200 shadow-sm disabled:bg-gray-900 disabled:text-gray-600 disabled:border-gray-800 disabled:cursor-not-allowed active:scale-[0.98]"
              >
                <ShoppingBag size={16} className="text-[#D4AF37]" />
                <span className="truncate">
                  {isOutOfStock ? "Out of Stock" : isAdding ? "Adding..." : "Add to Shopping Bag"}
                </span>
              </button>

              {/* Wishlist Button */}
              <button
                type="button"
                onClick={handleToggleWishlist}
                className={`p-3.5 border transition-colors flex-shrink-0 ${
                  isWishlisted
                    ? "border-rose-500 text-rose-500 bg-rose-500/10"
                    : "border-[#2A2A2A] text-gray-400 hover:text-white hover:border-[#D4AF37] bg-[#111111]"
                }`}
                aria-label="Save to Wishlist"
              >
                <Heart size={18} fill={isWishlisted ? "currentColor" : "none"} />
              </button>
            </div>

            {/* Action Row 2: DIRECT BUY NOW BUTTON (Full Width VIP Royal Gold) */}
            <button
              type="button"
              onClick={handleBuyNow}
              disabled={isOutOfStock || isBuyingNow}
              className="w-full flex items-center justify-center gap-2.5 bg-[#D4AF37] hover:bg-[#AA8822] text-[#080808] font-extrabold text-xs uppercase tracking-[0.2em] py-4 px-6 transition-all duration-200 shadow-lg hover:scale-[1.01] active:scale-[0.99] disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed group cursor-pointer"
            >
              <Zap size={16} className="fill-[#080808] group-hover:scale-110 transition-transform" />
              <span>
                {isOutOfStock ? "Currently Sold Out" : isBuyingNow ? "Opening Secure Checkout..." : "Buy Now — Direct Order"}
              </span>
              <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
            </button>

            {/* Added confirmation alert */}
            {addedMessage && (
              <div className="p-3 bg-[#111111] border border-[#D4AF37] text-xs text-[#F5F0E6] flex items-center justify-between animate-fade-in">
                <span className="flex items-center gap-2">
                  <Check size={16} className="text-[#D4AF37]" />
                  <span>Added to bag! Ready for checkout.</span>
                </span>
                <a href="/cart" className="text-[#D4AF37] font-bold underline uppercase tracking-luxury">
                  View Bag
                </a>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="pt-6 border-t border-[#2A2A2A] space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-luxury text-[#F5F0E6]">
              Atelier Details & Materials
            </h3>
            <p className="text-xs text-gray-400 leading-relaxed whitespace-pre-line">
              {product.description}
            </p>
          </div>
        </div>

        {/* Value Trust Points */}
        <div className="pt-6 border-t border-[#2A2A2A] space-y-3 text-xs text-gray-400">
          <div className="flex items-center gap-3">
            <Truck size={16} className="text-[#D4AF37]" />
            <span>
              Complimentary nationwide delivery on orders above <strong>Rs. {freeShippingThreshold.toLocaleString()}</strong>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <ShieldCheck size={16} className="text-[#D4AF37]" />
            <span>100% genuine handcrafted leather with premium shock-absorbent footbeds</span>
          </div>
          <div className="flex items-center gap-3">
            <RotateCcw size={16} className="text-[#D4AF37]" />
            <span>Hassle-free 7-day size exchange across all Pakistan cities</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetailClient;
