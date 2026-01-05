import { Product } from "@/types/product";
import { productApi } from "./productApi";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// In-memory wishlist storage
let wishlistItems: string[] = [];

export const wishlistApi = {
  get: async (): Promise<Product[]> => {
    await delay(200);
    const products = await Promise.all(
      wishlistItems.map((id) => productApi.getById(id).catch(() => null))
    );
    return products.filter((p): p is Product => p !== null);
  },

  add: async (productId: string): Promise<void> => {
    await delay(300);
    if (!wishlistItems.includes(productId)) {
      wishlistItems.push(productId);
    }
  },

  remove: async (productId: string): Promise<void> => {
    await delay(300);
    wishlistItems = wishlistItems.filter((id) => id !== productId);
  },

  isInWishlist: async (productId: string): Promise<boolean> => {
    await delay(100);
    return wishlistItems.includes(productId);
  },
};

