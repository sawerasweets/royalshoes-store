import React from "react";
import ProductCard from "./ProductCard";
import SubcategoryPills from "./SubcategoryPills";
import FilterBar from "./FilterBar";

interface SubcategoryItem {
  id: string;
  name: string;
  slug: string;
}

interface ProductItem {
  id: string;
  name: string;
  slug: string;
  sku: string;
  price: number;
  originalPrice?: number | null;
  categoryName?: string;
  subcategoryName?: string | null;
  images: { url: string; isPrimary?: boolean }[];
  isNewArrival?: boolean;
  isBestseller?: boolean;
  variants?: { id: string; size: string; color: string; stock: number; additionalPrice?: number }[];
}

interface CollectionLayoutProps {
  title: string;
  tagline?: string;
  description?: string;
  basePath: string;
  subcategories: SubcategoryItem[];
  currentSub?: string | null;
  currentSort?: string;
  products: ProductItem[];
}

export function CollectionLayout({
  title,
  tagline = "STEP INTO ELEGANCE",
  description,
  basePath,
  subcategories,
  currentSub,
  currentSort = "newest",
  products,
}: CollectionLayoutProps) {
  return (
    <div className="space-y-8 pb-16">
      {/* Centered Category Header (Phase 9 Reference Inspired Simplicity) */}
      <div className="text-center max-w-2xl mx-auto pt-4 sm:pt-8 space-y-2">
        <div className="text-[10px] tracking-brand uppercase font-bold text-[#795548]">
          {tagline}
        </div>
        <h1 className="font-brand text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-luxury text-[#4A342E]">
          {currentSub ? `${title} — ${currentSub}` : title}
        </h1>
        {description && (
          <p className="text-xs sm:text-sm text-[#6B635B] leading-relaxed max-w-xl mx-auto">
            {description}
          </p>
        )}
      </div>

      {/* Subcategory Pills / Navigation */}
      <SubcategoryPills
        basePath={basePath}
        subcategories={subcategories}
        currentSub={currentSub}
      />

      {/* Filter and Sort Control Bar */}
      <FilterBar totalCount={products.length} currentSort={currentSort} />

      {/* Responsive Product Grid: 2 cols on mobile, 3 on tablet, 4 on desktop */}
      {products.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          {products.map((prod) => (
            <ProductCard
              key={prod.id}
              product={{
                id: prod.id,
                name: prod.name,
                slug: prod.slug,
                sku: prod.sku,
                price: prod.price,
                originalPrice: prod.originalPrice,
                categoryName: prod.categoryName || title,
                subcategoryName: prod.subcategoryName,
                primaryImage: prod.images[0]?.url || "/products/men-formal/men-formal-1.jpg",
                isNewArrival: prod.isNewArrival,
                isBestseller: prod.isBestseller,
                variants: prod.variants,
              }}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 border border-[#E4DDD3] bg-[#FFFFFF] p-8 space-y-4">
          <p className="text-sm text-[#6B635B]">
            No products found matching the selected criteria in this collection.
          </p>
          <a
            href={basePath}
            className="inline-block border border-[#795548] text-[#795548] hover:bg-[#795548] hover:text-white px-6 py-2 text-xs uppercase tracking-luxury font-bold transition-colors"
          >
            Clear Filters
          </a>
        </div>
      )}
    </div>
  );
}

export default CollectionLayout;
