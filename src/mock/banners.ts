import { Banner } from "@/types/banner";

export const banners: Banner[] = [
  {
    id: "banner-1",
    title: "Summer Sale - Up to 50% Off",
    image: "https://picsum.photos/seed/banner1/1200/400",
    link: "/products?category=Men",
    linkText: "Shop Now",
    isActive: true,
    order: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "banner-2",
    title: "New Arrivals in Women's Fashion",
    image: "https://picsum.photos/seed/banner2/1200/400",
    link: "/categories/women",
    linkText: "Explore",
    isActive: true,
    order: 2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "banner-3",
    title: "Electronics Mega Sale",
    image: "https://picsum.photos/seed/banner3/1200/400",
    link: "/categories/electronics",
    linkText: "Buy Now",
    isActive: true,
    order: 3,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "banner-4",
    title: "Home & Kitchen Essentials",
    image: "https://picsum.photos/seed/banner4/1200/400",
    link: "/categories/home-kitchen",
    linkText: "Shop Now",
    isActive: false,
    order: 4,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

