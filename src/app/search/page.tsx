import React from "react";
import prisma from "@/lib/db";
import CollectionLayout from "@/components/storefront/CollectionLayout";

export const revalidate = 0; // Dynamic search

interface PageProps {
  searchParams: { q?: string; sort?: string };
}

export default async function SearchPage({ searchParams }: PageProps) {
  const query = searchParams.q || "";
  const currentSort = searchParams.sort || "newest";

  const orderBy: any = {};
  if (currentSort === "price-asc") orderBy.price = "asc";
  else if (currentSort === "price-desc") orderBy.price = "desc";
  else if (currentSort === "name-asc") orderBy.name = "asc";
  else orderBy.createdAt = "desc";

  const products = query.trim()
    ? await prisma.product.findMany({
        where: {
          isPublished: true,
          search: query.trim(),
        },
        include: { images: true, variants: true },
        orderBy,
      })
    : [];

  return (
    <CollectionLayout
      title={query ? `SEARCH: "${query}"` : "SEARCH ATELIER"}
      tagline="SEARCH RESULTS"
      description={
        query
          ? `Displaying matching creations for "${query}".`
          : "Enter terms above to explore the ROYAL SHOES footwear and fashion catalogue."
      }
      basePath={`/search?q=${encodeURIComponent(query)}`}
      subcategories={[]}
      currentSort={currentSort}
      products={products}
    />
  );
}
