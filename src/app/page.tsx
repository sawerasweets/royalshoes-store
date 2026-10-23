import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ShieldCheck, Truck, RotateCcw, Sparkles, Home } from "lucide-react";
import prisma from "@/lib/db";
import { BRAND, MAIN_CATEGORIES } from "@/lib/constants";
import ProductCard from "@/components/storefront/ProductCard";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  // Fetch all homepage data in parallel for maximum speed
  const [
    campaign,
    featuredProducts,
    newArrivals,
    bestsellers,
    menProducts,
    womenProducts,
    categories,
  ] = await Promise.all([
    prisma.homepageCampaign.findFirst(),
    prisma.product.findMany({
      where: { isPublished: true, isFeatured: true },
      include: { images: true, variants: true },
      take: 8,
    }),
    prisma.product.findMany({
      where: { isPublished: true, isNewArrival: true },
      include: { images: true, variants: true },
      take: 4,
    }),
    prisma.product.findMany({
      where: { isPublished: true, isBestseller: true },
      include: { images: true, variants: true },
      take: 4,
    }),
    prisma.product.findMany({
      where: { isPublished: true, categoryId: "cat-men" },
      include: { images: true, variants: true },
      take: 4,
    }),
    prisma.product.findMany({
      where: { isPublished: true, categoryId: "cat-women" },
      include: { images: true, variants: true },
      take: 4,
    }),
    prisma.category.findMany({
      where: { isActive: true },
      include: { subcategories: true },
    }),
  ]);

  const categoryThumbnails: Record<string, string> = {
    men: "/products/prod-men-formal-shoes-1-1.svg",
    women: "/products/prod-women-block-heels-1-1.svg",
    bags: "/products/prod-bags-backpacks-1-1.svg",
    accessories: "/products/prod-accessories-wallets-1-1.svg",
    kids: "/products/prod-kids-boys-shoes-1-1.svg",
    all: "/products/prod-men-formal-shoes-1-1.svg",
  };

  return (
    <div className="space-y-12 sm:space-y-20 pb-12">
      {/* 1. Curated Circular Category Bar (Compact, 1 Single Row, With HOME) */}
      <section className="space-y-3 pt-1">
        <div className="text-center space-y-0.5">
          <span className="text-[9px] sm:text-[10px] font-bold tracking-brand uppercase text-[#D4AF37]">
            Curated Boutiques
          </span>
          <h1 className="font-brand text-xl sm:text-2xl font-extrabold tracking-luxury text-[#F5F0E6]">
            SHOP BY CATEGORY
          </h1>
        </div>

        {/* 1 Row of Circular Story Icons (WhatsApp Icon Style) */}
        <div className="flex items-center justify-start sm:justify-center gap-3.5 sm:gap-6 overflow-x-auto py-2 px-1 scrollbar-none">
          {/* HOME Circle */}
          <Link
            href="/"
            className="flex flex-col items-center gap-1.5 flex-shrink-0 group"
          >
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 border-[#D4AF37] bg-[#111111] overflow-hidden flex items-center justify-center shadow-[0_0_12px_rgba(212,175,55,0.25)] group-hover:scale-110 group-hover:bg-[#D4AF37] text-[#D4AF37] group-hover:text-[#080808] transition-all">
              <Home size={22} className="transition-transform group-hover:scale-110" />
            </div>
            <span className="text-[10px] sm:text-[11px] font-bold tracking-luxury uppercase text-[#D4AF37] group-hover:text-white transition-colors whitespace-nowrap">
              Home
            </span>
          </Link>

          {/* Category Circles (Men, Women, Bags, Accessories, Kids, All) */}
          {[
            { name: "Men", slug: "men", image: "/products/prod-men-formal-shoes-1-1.svg" },
            { name: "Women", slug: "women", image: "/products/prod-women-block-heels-1-1.svg" },
            { name: "Bags", slug: "bags", image: "/products/prod-bags-backpacks-1-1.svg" },
            { name: "Accessories", slug: "accessories", image: "/products/prod-accessories-wallets-1-1.svg" },
            { name: "Kids", slug: "kids", image: "/products/prod-kids-boys-shoes-1-1.svg" },
            { name: "All", slug: "all", image: "/products/prod-men-formal-shoes-1-1.svg" },
          ].map((cat) => (
            <Link
              key={cat.slug}
              href={`/${cat.slug}`}
              className="flex flex-col items-center gap-1.5 flex-shrink-0 group"
            >
              <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 border-[#D4AF37] bg-[#0A0A0A] overflow-hidden flex items-center justify-center shadow-[0_0_12px_rgba(212,175,55,0.2)] group-hover:scale-110 group-hover:border-[#F5E0A9] transition-all">
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  sizes="64px"
                  className="object-cover scale-150 object-center transition-transform duration-300 group-hover:scale-175"
                />
              </div>
              <span className="text-[10px] sm:text-[11px] font-bold tracking-luxury uppercase text-[#F5F0E6] group-hover:text-[#D4AF37] transition-colors whitespace-nowrap">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. New Arrivals Section */}
      {newArrivals.length > 0 && (
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-[#2A2A2A] pb-4">
            <div>
              <span className="text-[10px] font-bold tracking-brand uppercase text-[#D4AF37]">
                Freshly Handcrafted
              </span>
              <h2 className="font-brand text-2xl font-extrabold tracking-luxury text-[#F5F0E6] mt-0.5">
                NEW ARRIVALS
              </h2>
            </div>
            <Link
              href="/all?filter=new"
              className="inline-flex items-center gap-1.5 text-xs uppercase tracking-luxury text-[#D4AF37] hover:text-[#E5C158] font-semibold mt-2 sm:mt-0 transition-colors"
            >
              <span>View All New</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {newArrivals.map((prod) => (
              <ProductCard
                key={prod.id}
                product={{
                  id: prod.id,
                  name: prod.name,
                  slug: prod.slug,
                  sku: prod.sku,
                  price: prod.price,
                  originalPrice: prod.originalPrice,
                  categoryName: prod.categoryName,
                  subcategoryName: prod.subcategoryName,
                  primaryImage: prod.images[0]?.url || "/products/luxury-oxford.svg",
                  isNewArrival: prod.isNewArrival,
                  isBestseller: prod.isBestseller,
                }}
              />
            ))}
          </div>
        </section>
      )}

      {/* 4. Featured Men's Collection */}
      {menProducts.length > 0 && (
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-[#2A2A2A] pb-4">
            <div>
              <span className="text-[10px] font-bold tracking-brand uppercase text-[#D4AF37]">
                Gentlemen&apos;s Footwear
              </span>
              <h2 className="font-brand text-2xl font-extrabold tracking-luxury text-[#F5F0E6] mt-0.5">
                MEN&apos;S SIGNATURE COLLECTION
              </h2>
            </div>
            <Link
              href="/men"
              className="inline-flex items-center gap-1.5 text-xs uppercase tracking-luxury text-[#D4AF37] hover:text-[#E5C158] font-semibold mt-2 sm:mt-0 transition-colors"
            >
              <span>Explore Men&apos;s</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {menProducts.map((prod) => (
              <ProductCard
                key={prod.id}
                product={{
                  id: prod.id,
                  name: prod.name,
                  slug: prod.slug,
                  sku: prod.sku,
                  price: prod.price,
                  originalPrice: prod.originalPrice,
                  categoryName: "MEN",
                  subcategoryName: prod.subcategoryName,
                  primaryImage: prod.images[0]?.url || "/products/luxury-oxford.svg",
                  isNewArrival: prod.isNewArrival,
                  isBestseller: prod.isBestseller,
                }}
              />
            ))}
          </div>
        </section>
      )}

      {/* 5. Featured Women's Collection */}
      {womenProducts.length > 0 && (
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-[#2A2A2A] pb-4">
            <div>
              <span className="text-[10px] font-bold tracking-brand uppercase text-[#D4AF37]">
                Feminine Elegance & Poise
              </span>
              <h2 className="font-brand text-2xl font-extrabold tracking-luxury text-[#F5F0E6] mt-0.5">
                WOMEN&apos;S SIGNATURE COLLECTION
              </h2>
            </div>
            <Link
              href="/women"
              className="inline-flex items-center gap-1.5 text-xs uppercase tracking-luxury text-[#D4AF37] hover:text-[#E5C158] font-semibold mt-2 sm:mt-0 transition-colors"
            >
              <span>Explore Women&apos;s</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {womenProducts.map((prod) => (
              <ProductCard
                key={prod.id}
                product={{
                  id: prod.id,
                  name: prod.name,
                  slug: prod.slug,
                  sku: prod.sku,
                  price: prod.price,
                  originalPrice: prod.originalPrice,
                  categoryName: "WOMEN",
                  subcategoryName: prod.subcategoryName,
                  primaryImage: prod.images[0]?.url || "/products/luxury-oxford.svg",
                  isNewArrival: prod.isNewArrival,
                  isBestseller: prod.isBestseller,
                }}
              />
            ))}
          </div>
        </section>
      )}

      {/* 6. Bestsellers Showcase (Real DB Data) */}
      {bestsellers.length > 0 && (
        <section className="space-y-6 bg-[#111111]/40 border border-[#2A2A2A] p-6 sm:p-10">
          <div className="text-center space-y-1">
            <span className="text-[10px] font-bold tracking-brand uppercase text-[#D4AF37]">
              Customer Favorites
            </span>
            <h2 className="font-brand text-2xl sm:text-3xl font-extrabold tracking-luxury text-[#F5F0E6]">
              ROYAL SHOES BESTSELLERS
            </h2>
            <p className="text-xs text-gray-400 max-w-md mx-auto">
              Our most celebrated silhouettes, defined by immaculate stitching and unmatched poise.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 pt-4">
            {bestsellers.map((prod) => (
              <ProductCard
                key={prod.id}
                product={{
                  id: prod.id,
                  name: prod.name,
                  slug: prod.slug,
                  sku: prod.sku,
                  price: prod.price,
                  originalPrice: prod.originalPrice,
                  categoryName: prod.categoryName,
                  subcategoryName: prod.subcategoryName,
                  primaryImage: prod.images[0]?.url || "/products/luxury-oxford.svg",
                  isNewArrival: prod.isNewArrival,
                  isBestseller: prod.isBestseller,
                }}
              />
            ))}
          </div>
        </section>
      )}

      {/* 7. Active Campaign Banner: Gold & Black */}
      <section className="border border-[#D4AF37]/50 bg-gradient-to-r from-[#111111] via-[#171717] to-[#111111] p-8 sm:p-12 text-center space-y-4">
        <span className="text-[10px] tracking-brand font-bold uppercase text-[#D4AF37]">
          EXCLUSIVE PRIVILEGE
        </span>
        <h3 className="font-brand text-2xl sm:text-3xl font-extrabold text-[#F5F0E6] tracking-luxury">
          USE CODE <span className="text-[#D4AF37] px-2 py-0.5 border border-[#D4AF37] bg-[#080808]">GOLD10</span> FOR 10% OFF
        </h3>
        <p className="text-xs text-gray-400 max-w-lg mx-auto">
          Apply code <span className="font-mono text-[#D4AF37]">GOLD10</span> during checkout on orders over Rs. 3,000 for immediate complimentary discount.
        </p>
        <div className="pt-2">
          <Link
            href="/all"
            className="inline-block bg-[#080808] hover:bg-[#D4AF37] text-[#D4AF37] hover:text-[#080808] border border-[#D4AF37] px-6 py-2.5 text-xs font-bold uppercase tracking-luxury transition-all"
          >
            Claim Your Privilege
          </Link>
        </div>
      </section>

      {/* 8. Trust & Delivery Information (Phase 8 requirement) */}
      <section className="border-t border-[#2A2A2A] pt-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="p-6 bg-[#111111] border border-[#2A2A2A]">
            <Truck size={28} className="mx-auto text-[#D4AF37] mb-3" />
            <h4 className="font-brand text-sm font-bold tracking-luxury uppercase text-[#F5F0E6]">Pakistan Nationwide Delivery</h4>
            <p className="text-xs text-gray-400 mt-2 leading-relaxed">
              Express tracked delivery to Karachi, Lahore, Islamabad, Faisalabad, and all across Pakistan.
            </p>
          </div>
          <div className="p-6 bg-[#111111] border border-[#2A2A2A]">
            <ShieldCheck size={28} className="mx-auto text-[#D4AF37] mb-3" />
            <h4 className="font-brand text-sm font-bold tracking-luxury uppercase text-[#F5F0E6]">Genuine Craftsmanship</h4>
            <p className="text-xs text-gray-400 mt-2 leading-relaxed">
              100% authentic materials, premium leather insoles, and master-stitched durability in every pair.
            </p>
          </div>
          <div className="p-6 bg-[#111111] border border-[#2A2A2A]">
            <RotateCcw size={28} className="mx-auto text-[#D4AF37] mb-3" />
            <h4 className="font-brand text-sm font-bold tracking-luxury uppercase text-[#F5F0E6]">Direct Concierge Care</h4>
            <p className="text-xs text-gray-400 mt-2 leading-relaxed">
              Personalized size and styling advice via phone & WhatsApp at <strong className="text-[#D4AF37] font-mono">{BRAND.contact.phoneDisplay}</strong>.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
