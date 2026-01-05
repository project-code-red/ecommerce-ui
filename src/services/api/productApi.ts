import { Product, ProductFilters } from "@/types/product";
import { PaginatedResponse } from "@/types/common";
import { fetchDummyJsonProducts, fetchDummyJsonProductById, searchDummyJsonProducts } from "./dummyJsonApi";

// Simulate network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const productApi = {
  getAll: async (filters?: ProductFilters, page = 1, limit = 20): Promise<PaginatedResponse<Product>> => {
    await delay(300);
    
    // Use DummyJSON API for product listings
    try {
      // Handle search query if present
      const searchQuery = (filters as any)?.search;
      if (searchQuery) {
        const result = await searchDummyJsonProducts(searchQuery, page, limit);
        return {
          data: result.products,
          total: result.total,
          page: result.page,
          limit: result.limit,
          totalPages: result.totalPages,
        };
      }

      // Fetch from DummyJSON API
      const result = await fetchDummyJsonProducts(
        filters?.category,
        filters?.subCategory,
        filters?.subSubCategory,
        page,
        limit
      );

      let filtered = result.products;

      // Filter by category (flexible matching)
      if (filters?.category) {
        const categoryLower = filters.category.toLowerCase();
        filtered = filtered.filter((p) => {
          const productCategory = p.category.toLowerCase();
          // Match exact or partial (e.g., "Men" matches "mens-shirts")
          return (
            productCategory === categoryLower ||
            productCategory.includes(categoryLower) ||
            categoryLower.includes(productCategory) ||
            // Also check if product name contains category
            p.name.toLowerCase().includes(categoryLower)
          );
        });
      }
      
      // Filter by subCategory (flexible matching)
      if (filters?.subCategory) {
        const subCategoryLower = filters.subCategory.toLowerCase();
        filtered = filtered.filter((p) => {
          const productSubCategory = p.subCategory?.toLowerCase() || "";
          return (
            productSubCategory === subCategoryLower ||
            productSubCategory.includes(subCategoryLower) ||
            subCategoryLower.includes(productSubCategory) ||
            // Also check product name
            p.name.toLowerCase().includes(subCategoryLower)
          );
        });
      }
      
      // Filter by subSubCategory (flexible matching)
      if (filters?.subSubCategory) {
        const subSubCategoryLower = filters.subSubCategory.toLowerCase();
        filtered = filtered.filter((p) => {
          const productSubSubCategory = p.subSubCategory?.toLowerCase() || "";
          return (
            productSubSubCategory === subSubCategoryLower ||
            productSubSubCategory.includes(subSubCategoryLower) ||
            subSubCategoryLower.includes(productSubSubCategory) ||
            // Also check product name (e.g., "T-Shirts" in product name)
            p.name.toLowerCase().includes(subSubCategoryLower) ||
            p.name.toLowerCase().includes(subSubCategoryLower.replace(/-/g, " "))
          );
        });
      }
      // Apply additional client-side filters
      if (filters?.minPrice) {
        filtered = filtered.filter((p) => p.price >= filters.minPrice!);
      }
      if (filters?.maxPrice) {
        filtered = filtered.filter((p) => p.price <= filters.maxPrice!);
      }
      if (filters?.sizes && filters.sizes.length > 0) {
        filtered = filtered.filter((p) =>
          filters.sizes!.some((size) => p.variants.sizes?.includes(size))
        );
      }
      if (filters?.colors && filters.colors.length > 0) {
        filtered = filtered.filter((p) =>
          filters.colors!.some((color) => p.variants.colors?.includes(color))
        );
      }
      if (filters?.minRating) {
        filtered = filtered.filter((p) => p.rating >= filters.minRating!);
      }

      // Sort
      if (filters?.sortBy) {
        switch (filters.sortBy) {
          case "price-low":
            filtered.sort((a, b) => a.price - b.price);
            break;
          case "price-high":
            filtered.sort((a, b) => b.price - a.price);
            break;
          case "newest":
            filtered.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
            break;
          case "rating":
            filtered.sort((a, b) => b.rating - a.rating);
            break;
          default:
            // popularity (by rating count)
            filtered.sort((a, b) => b.ratingCount - a.ratingCount);
        }
      }

      // Filter active products
      filtered = filtered.filter((p) => p.isActive);

      return {
        data: filtered,
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
      };
    } catch (error) {
      console.error("Error fetching products:", error);
      // Return empty result on error
      return {
        data: [],
        total: 0,
        page,
        limit,
        totalPages: 0,
      };
    }
  },

  getBySlug: async (slug: string): Promise<Product> => {
    await delay(200);
    // Extract ID from slug (format: product-name-123)
    const idMatch = slug.match(/-(\d+)$/);
    if (idMatch) {
      const productId = parseInt(idMatch[1]);
      const product = await fetchDummyJsonProductById(productId);
      if (product) {
        return product;
      }
    }
    throw new Error("Product not found");
  },

  getById: async (id: string): Promise<Product> => {
    await delay(200);
    // Extract numeric ID from our ID format (prod-123)
    const idMatch = id.match(/prod-(\d+)/);
    if (idMatch) {
      const productId = parseInt(idMatch[1]);
      const product = await fetchDummyJsonProductById(productId);
      if (product) {
        return product;
      }
    }
    throw new Error("Product not found");
  },

  create: async (data: Partial<Product>): Promise<Product> => {
    await delay(500);
    // For admin operations, we'll create a mock product
    // In a real app, this would POST to your backend API
    const newProduct: Product = {
      id: `prod-${Date.now()}`,
      slug: data.name?.toLowerCase().replace(/\s+/g, "-") || "",
      name: data.name || "",
      description: data.description || "",
      images: data.images || [],
      price: data.price || 0,
      mrp: data.mrp || 0,
      discountPercentage: data.discountPercentage || 0,
      stock: data.stock || 0,
      category: data.category || "",
      subCategory: data.subCategory || "",
      subSubCategory: data.subSubCategory,
      type: data.type,
      variants: data.variants || {},
      specifications: data.specifications,
      features: data.features,
      deliveryEstimate: data.deliveryEstimate || "3-5 days",
      rating: 0,
      ratingCount: 0,
      reviews: [],
      returnInfo: data.returnInfo || "10-day return",
      codAvailable: data.codAvailable ?? true,
      isActive: data.isActive ?? true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return newProduct;
  },

  update: async (id: string, data: Partial<Product>): Promise<Product> => {
    await delay(500);
    // For admin operations, fetch existing product and merge
    const existing = await productApi.getById(id);
    const updated: Product = {
      ...existing,
      ...data,
      updatedAt: new Date().toISOString(),
    };
    return updated;
  },

  delete: async (id: string): Promise<void> => {
    await delay(300);
    // For admin operations, this would DELETE from your backend API
    // Just verify product exists
    await productApi.getById(id);
  },
};

