export interface ProductVariant {
  sizes?: string[];
  colors?: string[];
}

export interface ProductSpecification {
  [key: string]: string | number | boolean;
}

export interface ProductReview {
  id: string;
  username: string;
  rating: number;
  comment: string;
  date: string;
  verified?: boolean;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  images: string[];
  price: number;
  mrp: number;
  discountPercentage: number;
  stock: number;
  category: string;
  subCategory: string;
  subSubCategory?: string;
  type?: string;
  variants: ProductVariant;
  specifications?: ProductSpecification;
  features?: string[];
  deliveryEstimate: string;
  rating: number;
  ratingCount: number;
  reviews: ProductReview[];
  returnInfo: string;
  codAvailable: boolean;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductFilters {
  category?: string;
  subCategory?: string;
  subSubCategory?: string;
  minPrice?: number;
  maxPrice?: number;
  sizes?: string[];
  colors?: string[];
  minRating?: number;
  sortBy?: "popularity" | "price-low" | "price-high" | "newest" | "rating";
}

