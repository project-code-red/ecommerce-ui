import { HeroBanner } from "@/components/features/banner/HeroBannerCarousel";

// Banner configuration - images will be fetched dynamically from DummyJSON
// 4 slides following best practice carousel UX
export const heroBannersConfig: Omit<HeroBanner, "image">[] = [
  {
    id: "hero-1",
    headline: "UP TO 75% OFF",
    subtext: "Limited Time Offer – All Categories",
    ctaText: "Shop Now",
    ctaLink: "/",
    discountBadge: "FLASH SALE",
  },
  {
    id: "hero-2",
    headline: "FASHION COLLECTION",
    subtext: "Men, Women & Kids – Latest Trends",
    ctaText: "Explore Fashion",
    ctaLink: "/categories/men",
    discountBadge: "NEW ARRIVALS",
  },
  {
    id: "hero-3",
    headline: "ELECTRONICS & HOME",
    subtext: "Smart Devices & Kitchen Essentials",
    ctaText: "Shop Now",
    ctaLink: "/categories/electronics",
    discountBadge: "UP TO 50% OFF",
  },
  {
    id: "hero-4",
    headline: "BEAUTY & PERSONAL CARE",
    subtext: "Premium Skincare & Fragrances",
    ctaText: "Discover Beauty",
    ctaLink: "/categories/beauty-personal-care",
    discountBadge: "SPECIAL OFFERS",
  },
];

// Banner category mapping for fetching images
// Using multiple categories for composite banners
export const bannerCategoryMap: Record<string, string[]> = {
  "hero-1": ["mens-shirts", "womens-dresses", "smartphones"], // All Categories
  "hero-2": ["mens-shirts", "womens-dresses", "tops"], // Fashion (Men/Women/Kids)
  "hero-3": ["smartphones", "home-decoration"], // Electronics + Home
  "hero-4": ["skincare", "fragrances"], // Beauty
};

