"use client";

import { useProducts } from "@/services/queries/productQueries";
import { HeroBannerCarousel } from "@/components/features/banner/HeroBannerCarousel";
import { ProductSection } from "@/components/features/product/ProductSection";
import { OfferStrip } from "@/components/features/banner/OfferStrip";
import { TrendingProductsSection } from "@/components/features/product/TrendingProductsSection";
import { CategoryGrid } from "@/components/features/category/CategoryGrid";
import { useHeroBanners } from "@/hooks/useHeroBanners";
import { categories } from "@/mock/categories";

export const dynamic = 'force-dynamic';

export default function HomePage() {
  // Fetch hero banners with DummyJSON images
  const { banners: heroBanners, isLoading: bannersLoading } = useHeroBanners();

  // Fetch products for different sections
  const { data: fashionProducts } = useProducts(
    { category: "Men", sortBy: "popularity" },
    1,
    8
  );
  const { data: electronicsProducts } = useProducts(
    { category: "Electronics", sortBy: "popularity" },
    1,
    8
  );
  const { data: trendingProducts } = useProducts(
    { sortBy: "popularity" },
    1,
    8
  );

  // Filter categories: Men, Women, Kids, Home & Kitchen, Beauty, Electronics
  const featuredCategories = categories.filter((cat) =>
    ["men", "women", "kids", "home-kitchen", "beauty-personal-care", "electronics"].includes(
      cat.slug
    )
  );

  return (
    <div className="bg-background min-h-screen">
      {/* Hero Banner Carousel */}
      <section className="px-4 sm:px-6 lg:px-8 py-6 md:py-8 bg-background">
        <div className="max-w-7xl mx-auto">
          {bannersLoading ? (
            <div className="relative w-full h-[380px] md:h-[420px] rounded-2xl overflow-hidden shadow-lg bg-gray-200 animate-pulse" />
          ) : (
            <HeroBannerCarousel banners={heroBanners} />
          )}
        </div>
      </section>

      {/* Categories Grid - Card Style */}
      <section className="px-4 sm:px-6 lg:px-8 py-12 bg-white">
        <div className="max-w-7xl mx-auto">
          <CategoryGrid categories={featuredCategories} />
        </div>
      </section>

      {/* Fashion Deals Section */}
      <ProductSection
        title="Fashion Deals"
        products={fashionProducts?.data || []}
        viewAllLink="/categories/men"
        variant="fashion"
        isLoading={!fashionProducts}
      />

      {/* Offer Strip - Transition between sections */}
      <OfferStrip
        headline="Flash Sale - Limited Time Offer"
        subtext="Don't miss out on these exclusive deals"
        discountText="UP TO 60% OFF"
        ctaText="Shop Now"
        ctaLink="/products?discount=true"
      />

      {/* Electronics Deals Section */}
      <ProductSection
        title="Top Deals in Electronics"
        products={electronicsProducts?.data || []}
        viewAllLink="/categories/electronics"
        variant="electronics"
        isLoading={!electronicsProducts}
      />

      {/* Combined Trending Products */}
      <TrendingProductsSection
        title="Trending Now"
        products={trendingProducts?.data || []}
        viewAllLink="/products?sort=popularity"
        isLoading={!trendingProducts}
      />
    </div>
  );
}

