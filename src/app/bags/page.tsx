import React from "react";
import prisma from "@/lib/db";
import CollectionLayout from "@/components/storefront/CollectionLayout";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: { sub?: string; sort?: string };
}

export default async function BagsCollectionPage({ searchParams }: PageProps) {
  const currentSub = searchParams.sub;
  const currentSort = searchParams.sort || "newest";

  const category = await prisma.category.findUnique({
    where: { slug: "bags" },
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
      categoryId: "cat-bags",
      subcategoryId,
    },
    include: { images: true, variants: true },
    orderBy,
  });

  return (
    <CollectionLayout
      title="LEATHER BAGS & CARRIERS"
      tagline="ARTISANAL LEATHERWORK"
      description="Architectural structured totes, evening clutches with gold clasps, and grain calfskin weekenders tailored for discerning travelers."
      basePath="/bags"
      subcategories={subcategories}
      currentSub={currentSub}
      currentSort={currentSort}
      products={products}
    />
  );
}
