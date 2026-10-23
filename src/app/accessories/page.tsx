import React from "react";
import prisma from "@/lib/db";
import CollectionLayout from "@/components/storefront/CollectionLayout";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: { sub?: string; sort?: string };
}

export default async function AccessoriesCollectionPage({ searchParams }: PageProps) {
  const currentSub = searchParams.sub;
  const currentSort = searchParams.sort || "newest";

  const category = await prisma.category.findUnique({
    where: { slug: "accessories" },
    include: { subcategories: true },
  });

  const subcategories = category?.subcategories || [];

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
      categoryId: "cat-accessories",
      subcategoryId,
    },
    include: { images: true, variants: true },
    orderBy,
  });

  return (
    <CollectionLayout
      title="ACCESSORIES & LEATHER GOODS"
      tagline="THE FINISHING TOUCH"
      description="Reversible dress belts with 24k gold-plated buckles, RFID-shielded card billfolds, and heirloom leather accessories."
      basePath="/accessories"
      subcategories={subcategories}
      currentSub={currentSub}
      currentSort={currentSort}
      products={products}
    />
  );
}
