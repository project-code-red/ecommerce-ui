import { create } from "zustand";
import { ProductFilters } from "@/types/product";

interface FilterState extends ProductFilters {
  setCategory: (category?: string) => void;
  setSubCategory: (subCategory?: string) => void;
  setSubSubCategory: (subSubCategory?: string) => void;
  setPriceRange: (min?: number, max?: number) => void;
  setSizes: (sizes: string[]) => void;
  setColors: (colors: string[]) => void;
  setMinRating: (rating?: number) => void;
  setSortBy: (sortBy?: ProductFilters["sortBy"]) => void;
  resetFilters: () => void;
}

const initialState: ProductFilters = {};

export const useFilterStore = create<FilterState>((set) => ({
  ...initialState,
  setCategory: (category) => set({ category }),
  setSubCategory: (subCategory) => set({ subCategory }),
  setSubSubCategory: (subSubCategory) => set({ subSubCategory }),
  setPriceRange: (min, max) => set({ minPrice: min, maxPrice: max }),
  setSizes: (sizes) => set({ sizes }),
  setColors: (colors) => set({ colors }),
  setMinRating: (rating) => set({ minRating: rating }),
  setSortBy: (sortBy) => set({ sortBy }),
  resetFilters: () => set(initialState),
}));

