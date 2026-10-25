import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ShieldCheck, Truck, RotateCcw, Sparkles, Home, MessageCircle } from "lucide-react";
import prisma from "@/lib/db";
import { BRAND } from "@/lib/constants";
import ProductCard from "@/components/storefront/ProductCard";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  // Fetch real database records in parallel
  const [
    campaign,
    featuredProducts,
    newArrivals,
    bestsellers,
    menProducts,
    womenProducts,
    categories,
  ] = await Promise.all([
    prisma.homepageCampaign.findFirst().catch(() => null),
    prisma.product.findMany({
      where: { isPublished: true, isFeatured: true },
      include: {
        images: true,
        variants: true,
      },
      take: 8,
    }),
    prisma.product.findMany({
      where: { isPublished: true, isNewArrival: true },
      include: {
        images: true,
        variants: true,
      },
      orderBy: { createdAt: "desc" },
      take: 8,
    }),
    prisma.product.findMany({
      where: { isPublished: true, isBestseller: true },
      include: {
        images: true,
        variants: true,
      },
      orderBy: { createdAt: "desc" },
      take: 8,
    }),
    prisma.product.findMany({
      where: { isPublished: true, categoryId: "cat-men" },
      include: {
        images: true,
        variants: true,
      },
      take: 4,
    }),
    prisma.product.findMany({
      where: { isPublished: true, categoryId: "cat-women" },
      include: {
        images: true,
        variants: true,
      },
      take: 4,
    }),
    prisma.category.findMany({
      where: { isActive: true },
      include: { subcategories: true },
    }),
  ]);

  return (
    <div className="space-y-12 sm:space-y-16 pb-12">
      {/* 1. PREMIUM HERO SECTION (Requirement 1) */}
      <section className="relative overflow-hidden bg-gradient-to-r from-[#FFFFFF] via-[#FFFFFF] to-[#FAF7F2] border border-[#E4DDD3] shadow-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center min-h-[380px] lg:min-h-[440px]">
          {/* Left Text Column */}
          <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 space-y-4 sm:space-y-6 z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#EFE9DF] border border-[#795548]/40 text-[#795548] text-[10px] sm:text-[11px] font-bold uppercase tracking-brand">
              <Sparkles size={12} className="text-[#795548]" />
              <span>Royal Shoes Luxury Footwear</span>
            </div>

            <div className="space-y-2">
              <h1 className="font-brand text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-luxury text-[#4A342E] leading-tight">
                DISCOVER YOUR STYLE
              </h1>
              <p className="text-xs sm:text-sm text-[#5C5855] max-w-xl leading-relaxed">
                Explore footwear and accessories designed for everyday comfort and timeless style.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <Link
                href="/all"
                className="bg-[#795548] hover:bg-[#5D4037] text-white font-bold text-xs uppercase tracking-luxury px-7 py-3.5 transition-all shadow-[0_4px_20px_rgba(121,85,72,0.25)] flex items-center gap-2 group"
              >
                <span>SHOP NOW</span>
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/all?filter=new"
                className="border border-[#E4DDD3] hover:border-[#795548] text-[#292D30] hover:text-[#795548] font-semibold text-xs uppercase tracking-luxury px-6 py-3.5 transition-all bg-[#FFFFFF]/80 backdrop-blur-sm"
              >
                Explore New Arrivals
              </Link>
            </div>
          </div>

          {/* Right Campaign Image Visual */}
          <div className="relative lg:col-span-5 h-64 sm:h-80 lg:h-full min-h-[260px] lg:min-h-[440px] w-full overflow-hidden bg-[#FAF7F2]">
            <Image
              src="/hero/hero-campaign.jpg"
              alt="ROYAL SHOES Luxury Footwear Collection"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 42vw"
              className="object-cover object-center transform scale-100 hover:scale-105 transition-transform duration-700"
            />
            {/* Subtle Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-[#FFFFFF] via-transparent to-transparent pointer-events-none" />
            <div className="absolute inset-0 border-t lg:border-t-0 lg:border-l border-[#E4DDD3] pointer-events-none" />
          </div>
        </div>
      </section>

      {/* 2. Curated Circular Category Bar (Requirement 3 & User Request 9) */}
      <section className="space-y-3 pt-2">
        <div className="text-center space-y-0.5">
          <span className="text-[9px] sm:text-[10px] font-bold tracking-brand uppercase text-[#795548]">
            Curated Boutiques
          </span>
          <h2 className="font-brand text-xl sm:text-2xl font-extrabold tracking-luxury text-[#4A342E]">
            SHOP BY CATEGORY
          </h2>
        </div>

        {/* 1 Row of Circular Story Icons */}
        <div className="flex items-center justify-start sm:justify-center gap-3.5 sm:gap-6 overflow-x-auto py-2 px-1 scrollbar-none">
          {/* HOME Circle */}
          <Link
            href="/"
            className="flex flex-col items-center gap-1.5 flex-shrink-0 group"
          >
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 border-[#795548] bg-[#FFFFFF] overflow-hidden flex items-center justify-center shadow-[0_0_12px_rgba(121,85,72,0.2)] group-hover:scale-110 group-hover:bg-[#795548] text-[#795548] group-hover:text-white transition-all">
              <Home size={22} className="transition-transform group-hover:scale-110" />
            </div>
            <span className="text-[10px] sm:text-[11px] font-bold tracking-luxury uppercase text-[#795548] group-hover:text-[#4A342E] transition-colors whitespace-nowrap">
              Home
            </span>
          </Link>

          {/* Category Circles (Men, Women, Bags, Accessories, Kids, All) with genuine JPG photography */}
          {[
            { name: "Men", slug: "men", image: "/products/men-formal/men-formal-1.jpg" },
            { name: "Women", slug: "women", image: "/products/women-heels/women-heels-1.jpg" },
            { name: "Bags", slug: "bags", image: "/products/bags/bags-1.jpg" },
            { name: "Accessories", slug: "accessories", image: "/products/accessories/accessories-1.jpg" },
            { name: "Kids", slug: "kids", image: "/products/kids/kids-1.jpg" },
            { name: "All", slug: "all", image: "/products/men-loafers/men-loafers-1.jpg" },
          ].map((cat) => (
            <Link
              key={cat.slug}
              href={`/${cat.slug}`}
              className="flex flex-col items-center gap-1.5 flex-shrink-0 group"
            >
              <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 border-[#795548] bg-[#FAF7F2] overflow-hidden flex items-center justify-center shadow-[0_0_12px_rgba(121,85,72,0.15)] group-hover:scale-110 group-hover:border-[#5D4037] transition-all">
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  sizes="64px"
                  className="object-cover object-center transition-transform duration-300 group-hover:scale-115"
                />
              </div>
              <span className="text-[10px] sm:text-[11px] font-bold tracking-luxury uppercase text-[#292D30] group-hover:text-[#795548] transition-colors whitespace-nowrap">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. New Arrivals Section (Requirement 4: 4 desktop cols, 2 mobile cols, real DB products) */}
      {newArrivals.length > 0 && (
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-[#E4DDD3] pb-4">
            <div>
              <span className="text-[10px] font-bold tracking-brand uppercase text-[#795548]">
                Freshly Handcrafted
              </span>
              <h2 className="font-brand text-2xl font-extrabold tracking-luxury text-[#4A342E] mt-0.5">
                NEW ARRIVALS
              </h2>
            </div>
            <Link
              href="/all?filter=new"
              className="inline-flex items-center gap-1.5 text-xs uppercase tracking-luxury text-[#795548] hover:text-[#8D6E63] font-semibold mt-2 sm:mt-0 transition-colors"
            >
              <span>View All New</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
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
                  primaryImage: prod.images[0]?.url || "/products/men-formal/men-formal-1.jpg",
                  isNewArrival: prod.isNewArrival,
                  isBestseller: prod.isBestseller,
                  variants: prod.variants.map((v) => ({
                    id: v.id,
                    size: v.size,
                    color: v.color,
                    stock: v.stock,
                    additionalPrice: v.additionalPrice,
                  })),
                }}
              />
            ))}
          </div>
        </section>
      )}

      {/* 4. Best Sellers Showcase (Requirement 5: Separate Section, Real DB Data) */}
      {bestsellers.length > 0 && (
        <section className="space-y-6 bg-[#FFFFFF]/40 border border-[#E4DDD3] p-6 sm:p-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-[#E4DDD3]/60 pb-4">
            <div>
              <span className="text-[10px] font-bold tracking-brand uppercase text-[#795548]">
                Customer Favorites
              </span>
              <h2 className="font-brand text-2xl sm:text-3xl font-extrabold tracking-luxury text-[#4A342E] mt-0.5">
                BEST SELLERS
              </h2>
              <p className="text-xs text-[#6B635B] mt-1 max-w-md">
                Our most celebrated silhouettes, defined by immaculate stitching and unmatched poise.
              </p>
            </div>
            <Link
              href="/all?filter=bestseller"
              className="inline-flex items-center gap-1.5 text-xs uppercase tracking-luxury text-[#795548] hover:text-[#8D6E63] font-semibold mt-2 sm:mt-0 transition-colors"
            >
              <span>View All Bestsellers</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 pt-2">
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
                  primaryImage: prod.images[0]?.url || "/products/men-loafers/men-loafers-1.jpg",
                  isNewArrival: prod.isNewArrival,
                  isBestseller: prod.isBestseller,
                  variants: prod.variants.map((v) => ({
                    id: v.id,
                    size: v.size,
                    color: v.color,
                    stock: v.stock,
                    additionalPrice: v.additionalPrice,
                  })),
                }}
              />
            ))}
          </div>
        </section>
      )}

      {/* 5. Featured Men's Collection */}
      {menProducts.length > 0 && (
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-[#E4DDD3] pb-4">
            <div>
              <span className="text-[10px] font-bold tracking-brand uppercase text-[#795548]">
                Gentlemen&apos;s Footwear
              </span>
              <h2 className="font-brand text-2xl font-extrabold tracking-luxury text-[#4A342E] mt-0.5">
                MEN&apos;S SIGNATURE COLLECTION
              </h2>
            </div>
            <Link
              href="/men"
              className="inline-flex items-center gap-1.5 text-xs uppercase tracking-luxury text-[#795548] hover:text-[#8D6E63] font-semibold mt-2 sm:mt-0 transition-colors"
            >
              <span>Explore Men&apos;s</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
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
                  primaryImage: prod.images[0]?.url || "/products/men-formal/men-formal-1.jpg",
                  isNewArrival: prod.isNewArrival,
                  isBestseller: prod.isBestseller,
                  variants: prod.variants.map((v) => ({
                    id: v.id,
                    size: v.size,
                    color: v.color,
                    stock: v.stock,
                    additionalPrice: v.additionalPrice,
                  })),
                }}
              />
            ))}
          </div>
        </section>
      )}

      {/* 6. Featured Women's Collection */}
      {womenProducts.length > 0 && (
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-[#E4DDD3] pb-4">
            <div>
              <span className="text-[10px] font-bold tracking-brand uppercase text-[#795548]">
                Feminine Elegance & Poise
              </span>
              <h2 className="font-brand text-2xl font-extrabold tracking-luxury text-[#4A342E] mt-0.5">
                WOMEN&apos;S SIGNATURE COLLECTION
              </h2>
            </div>
            <Link
              href="/women"
              className="inline-flex items-center gap-1.5 text-xs uppercase tracking-luxury text-[#795548] hover:text-[#8D6E63] font-semibold mt-2 sm:mt-0 transition-colors"
            >
              <span>Explore Women&apos;s</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
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
                  primaryImage: prod.images[0]?.url || "/products/women-heels/women-heels-1.jpg",
                  isNewArrival: prod.isNewArrival,
                  isBestseller: prod.isBestseller,
                  variants: prod.variants.map((v) => ({
                    id: v.id,
                    size: v.size,
                    color: v.color,
                    stock: v.stock,
                    additionalPrice: v.additionalPrice,
                  })),
                }}
              />
            ))}
          </div>
        </section>
      )}

      {/* 7. Active Campaign Banner: Gold & Black */}
      <section className="border border-[#795548]/50 bg-gradient-to-r from-[#FFFFFF] via-[#FFFFFF] to-[#FFFFFF] p-8 sm:p-12 text-center space-y-4">
        <span className="text-[10px] tracking-brand font-bold uppercase text-[#795548]">
          EXCLUSIVE PRIVILEGE
        </span>
        <h3 className="font-brand text-2xl sm:text-3xl font-extrabold text-[#4A342E] tracking-luxury">
          USE CODE <span className="text-[#795548] px-2 py-0.5 border border-[#795548] bg-[#F5F0E6]">GOLD10</span> FOR 10% OFF
        </h3>
        <p className="text-xs text-[#6B635B] max-w-lg mx-auto">
          Apply code <span className="font-mono text-[#795548]">GOLD10</span> during checkout on orders over Rs. 3,000 for immediate complimentary discount.
        </p>
        <div className="pt-2">
          <Link
            href="/all"
            className="inline-block bg-[#F5F0E6] hover:bg-[#795548] text-[#795548] hover:text-white border border-[#795548] px-6 py-2.5 text-xs font-bold uppercase tracking-luxury transition-all"
          >
            Claim Your Privilege
          </Link>
        </div>
      </section>

      {/* 8. Trust and Customer Support (Requirement 7) */}
      <section className="border-t border-[#E4DDD3] pt-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 text-center">
          <Link
            href="/shipping"
            className="p-6 bg-[#FFFFFF] border border-[#E4DDD3] hover:border-[#795548]/60 transition-all group flex flex-col items-center justify-between"
          >
            <div>
              <Truck size={28} className="mx-auto text-[#795548] mb-3 group-hover:scale-110 transition-transform" />
              <h4 className="font-brand text-sm font-bold tracking-luxury uppercase text-[#4A342E]">Cash on Delivery</h4>
              <p className="text-xs text-[#6B635B] mt-2 leading-relaxed">
                Pay safely with Cash on Delivery at your doorstep anywhere across Pakistan.
              </p>
            </div>
            <span className="text-[10px] font-bold tracking-luxury uppercase text-[#795548] mt-4 flex items-center gap-1 group-hover:underline">
              Shipping Info <ArrowRight size={11} />
            </span>
          </Link>

          <Link
            href="/shipping"
            className="p-6 bg-[#FFFFFF] border border-[#E4DDD3] hover:border-[#795548]/60 transition-all group flex flex-col items-center justify-between"
          >
            <div>
              <ShieldCheck size={28} className="mx-auto text-[#795548] mb-3 group-hover:scale-110 transition-transform" />
              <h4 className="font-brand text-sm font-bold tracking-luxury uppercase text-[#4A342E]">Delivery Information</h4>
              <p className="text-xs text-[#6B635B] mt-2 leading-relaxed">
                Express tracked dispatch to Karachi, Lahore, Islamabad, Faisalabad, & nationwide.
              </p>
            </div>
            <span className="text-[10px] font-bold tracking-luxury uppercase text-[#795548] mt-4 flex items-center gap-1 group-hover:underline">
              Delivery Details <ArrowRight size={11} />
            </span>
          </Link>

          <Link
            href="/returns"
            className="p-6 bg-[#FFFFFF] border border-[#E4DDD3] hover:border-[#795548]/60 transition-all group flex flex-col items-center justify-between"
          >
            <div>
              <RotateCcw size={28} className="mx-auto text-[#795548] mb-3 group-hover:scale-110 transition-transform" />
              <h4 className="font-brand text-sm font-bold tracking-luxury uppercase text-[#4A342E]">Returns & Exchange</h4>
              <p className="text-xs text-[#6B635B] mt-2 leading-relaxed">
                7-day easy size exchange guarantee ensuring your absolute comfort.
              </p>
            </div>
            <span className="text-[10px] font-bold tracking-luxury uppercase text-[#795548] mt-4 flex items-center gap-1 group-hover:underline">
              Exchange Policy <ArrowRight size={11} />
            </span>
          </Link>

          <a
            href={BRAND.contact.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-6 bg-[#FFFFFF] border border-[#E4DDD3] hover:border-[#795548]/60 transition-all group flex flex-col items-center justify-between"
          >
            <div>
              <MessageCircle size={28} className="mx-auto text-[#795548] mb-3 group-hover:scale-110 transition-transform" />
              <h4 className="font-brand text-sm font-bold tracking-luxury uppercase text-[#4A342E]">WhatsApp Support</h4>
              <p className="text-xs text-[#6B635B] mt-2 leading-relaxed">
                Live sizing concierge and order tracking at <span className="font-mono text-[#795548]">{BRAND.contact.phoneDisplay}</span>.
              </p>
            </div>
            <span className="text-[10px] font-bold tracking-luxury uppercase text-[#795548] mt-4 flex items-center gap-1 group-hover:underline">
              Chat on WhatsApp <ArrowRight size={11} />
            </span>
          </a>
        </div>
      </section>
    </div>
  );
}
