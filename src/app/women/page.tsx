import React from "react";
import prisma from "@/lib/db";
import CollectionLayout from "@/components/storefront/CollectionLayout";

export const revalidate = 60;

interface PageProps {
  searchParams: { sub?: string; sort?: string };
}

export default async function WomenCollectionPage({ searchParams }: PageProps) {
  const currentSub = searchParams.sub;
  const currentSort = searchParams.sort || "newest";

  const category = await prisma.category.findUnique({
    where: { slug: "women" },
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
      categoryId: "cat-women",
      subcategoryId,
    },
    include: { images: true, variants: true },
    orderBy,
  });

  return (
    <CollectionLayout
      title="WOMEN'S COLLECTION"
      tagline="SCULPTED POISE & GRACE"
      description="Refined pointed flats, red-carpet stilettos, sculpted mules, and cushioned block heels. Engineered for effortless poise from dawn to twilight."
      basePath="/women"
      subcategories={subcategories}
      currentSub={currentSub}
      currentSort={currentSort}
      products={products}
    />
  );
}
