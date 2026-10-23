import React from "react";
import prisma from "@/lib/db";
import CollectionLayout from "@/components/storefront/CollectionLayout";

export const revalidate = 60;

interface PageProps {
  searchParams: { sub?: string; sort?: string };
}

export default async function AllProductsPage({ searchParams }: PageProps) {
  const currentSub = searchParams.sub;
  const currentSort = searchParams.sort || "newest";

  // Subcategories from all active categories
  const subcategories = await prisma.subcategory.findMany({
    where: { isActive: true },
  });

  let subcategoryId: string | undefined = undefined;
  if (currentSub) {
    const matchedSub = subcategories.find(
      (s) => s.name.toLowerCase() === currentSub.toLowerCase()
    );
    if (matchedSub) {
      subcategoryId = matchedSub.id;
    }
  }

  const orderBy: any = {};
  if (currentSort === "price-asc") orderBy.price = "asc";
  else if (currentSort === "price-desc") orderBy.price = "desc";
  else if (currentSort === "name-asc") orderBy.name = "asc";
  else orderBy.createdAt = "desc";

  const products = await prisma.product.findMany({
    where: {
      isPublished: true,
      subcategoryId,
    },
    include: { images: true, variants: true },
    orderBy,
  });

  return (
    <CollectionLayout
      title="ALL CREATIONS"
      tagline="THE COMPLETE ATELIER"
      description="Immerse yourself in the comprehensive ROYAL SHOES catalogue — handcrafted formal footwear, poise-defining heels, artisanal leather bags, and timeless accessories."
      basePath="/all"
      subcategories={subcategories.slice(0, 12)}
      currentSub={currentSub}
      currentSort={currentSort}
      products={products}
    />
  );
}
