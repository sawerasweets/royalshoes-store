import React from "react";
import { notFound } from "next/navigation";
import prisma from "@/lib/db";
import ProductDetailClient from "@/components/storefront/ProductDetailClient";
import ProductCard from "@/components/storefront/ProductCard";

export const dynamic = "force-dynamic";

interface ProductPageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: ProductPageProps) {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
  });

  if (!product) {
    return { title: "Product Not Found" };
  }

  return {
    title: `${product.name} — Handcrafted Luxury`,
    description: product.description.slice(0, 160),
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
    include: { images: true, variants: true },
  });

  if (!product || !product.isPublished) {
    notFound();
  }

  const settings = await prisma.storeSettings.findUnique();

  // Related products from same category
  const relatedProducts = await prisma.product.findMany({
    where: {
      categoryId: product.categoryId,
      isPublished: true,
      id: { not: product.id },
    },
    include: { images: true, variants: true },
    take: 4,
  });

  return (
    <div className="space-y-16 pb-16">
      {/* Product Detail Stage */}
      <ProductDetailClient
        product={{
          id: product.id,
          name: product.name,
          slug: product.slug,
          sku: product.sku,
          description: product.description,
          price: product.price,
          originalPrice: product.originalPrice,
          categoryName: product.categoryName,
          subcategoryName: product.subcategoryName,
          images: product.images,
          variants: product.variants,
        }}
        freeShippingThreshold={settings?.freeShippingThreshold ?? 5000}
      />

      {/* Related Creations */}
      {relatedProducts.length > 0 && (
        <section className="pt-12 border-t border-[#2A2A2A] space-y-6">
          <div className="text-center space-y-1">
            <span className="text-[10px] font-bold tracking-brand uppercase text-[#D4AF37]">
              Harmonizing Pieces
            </span>
            <h2 className="font-brand text-2xl font-extrabold tracking-luxury text-[#F5F0E6]">
              YOU MAY ALSO ADMIRE
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.map((rel) => (
              <ProductCard
                key={rel.id}
                product={{
                  id: rel.id,
                  name: rel.name,
                  slug: rel.slug,
                  sku: rel.sku,
                  price: rel.price,
                  originalPrice: rel.originalPrice,
                  categoryName: rel.categoryName,
                  subcategoryName: rel.subcategoryName,
                  primaryImage: rel.images[0]?.url || "/products/men-formal/men-formal-1.jpg",
                  isNewArrival: rel.isNewArrival,
                  isBestseller: rel.isBestseller,
                  variants: rel.variants,
                }}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
