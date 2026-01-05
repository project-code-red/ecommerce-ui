/**
 * Category Image API Service
 * Fetches representative product images from DummyJSON for categories and banners
 */

const BASE_URL = "https://dummyjson.com/products";

// Category to DummyJSON category mapping for images
const categoryImageMapping: Record<string, string> = {
  men: "mens-shirts",
  women: "womens-dresses",
  kids: "tops",
  "home-kitchen": "home-decoration",
  "beauty-personal-care": "skincare",
  electronics: "smartphones",
};

// Banner category mapping
const bannerCategoryMapping: Record<string, string> = {
  fashion: "mens-shirts",
  electronics: "smartphones",
  beauty: "skincare",
  home: "home-decoration",
  women: "womens-dresses",
  men: "mens-shoes",
};

export interface CategoryImageResult {
  image: string;
  productTitle: string;
  productId: number;
}

/**
 * Fetch representative product image for a category
 * Returns the highest-rated product image from the category
 */
export async function fetchCategoryImage(
  categorySlug: string
): Promise<CategoryImageResult | null> {
  try {
    const dummyCategory = categoryImageMapping[categorySlug];
    if (!dummyCategory) {
      console.warn(`No DummyJSON category mapping for: ${categorySlug}`);
      return null;
    }

    const url = `${BASE_URL}/category/${dummyCategory}?limit=10`;
    const response = await fetch(url, {
      cache: "force-cache",
      next: { revalidate: 3600 }, // Revalidate every hour
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch category image: ${response.statusText}`);
    }

    const data = await response.json();
    if (!data.products || data.products.length === 0) {
      return null;
    }

    // Get the highest-rated product
    const sortedProducts = [...data.products].sort(
      (a, b) => (b.rating || 0) - (a.rating || 0)
    );
    const bestProduct = sortedProducts[0];

    // Use first image from product images array, or thumbnail as fallback
    const imageUrl =
      bestProduct.images && bestProduct.images.length > 0
        ? bestProduct.images[0]
        : bestProduct.thumbnail;

    return {
      image: imageUrl,
      productTitle: bestProduct.title,
      productId: bestProduct.id,
    };
  } catch (error) {
    console.error(`Error fetching category image for ${categorySlug}:`, error);
    return null;
  }
}

/**
 * Fetch banner image from a specific DummyJSON category
 * Returns highest quality image available
 */
export async function fetchBannerImage(
  category: string
): Promise<CategoryImageResult | null> {
  try {
    const dummyCategory = bannerCategoryMapping[category] || category;
    const url = `${BASE_URL}/category/${dummyCategory}?limit=10`; // Fetch more for better selection
    
    const response = await fetch(url, {
      cache: "force-cache",
      next: { revalidate: 1800 }, // Revalidate every 30 minutes for banners
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch banner image: ${response.statusText}`);
    }

    const data = await response.json();
    if (!data.products || data.products.length === 0) {
      return null;
    }

    // Get highest-rated product with best image quality
    const sortedProducts = [...data.products].sort(
      (a, b) => (b.rating || 0) - (a.rating || 0)
    );
    const selectedProduct = sortedProducts[0];

    // Prefer high-resolution images (first image in array is usually highest quality)
    // DummyJSON images are already high quality, use the first one
    const imageUrl =
      selectedProduct.images && selectedProduct.images.length > 0
        ? selectedProduct.images[0]
        : selectedProduct.thumbnail;

    return {
      image: imageUrl,
      productTitle: selectedProduct.title,
      productId: selectedProduct.id,
    };
  } catch (error) {
    console.error(`Error fetching banner image for ${category}:`, error);
    return null;
  }
}

/**
 * Fetch composite banner image from multiple categories
 * Returns the best image from the first available category
 */
export async function fetchCompositeBannerImage(
  categories: string[]
): Promise<CategoryImageResult | null> {
  // Try each category in order, return first successful result
  for (const category of categories) {
    const result = await fetchBannerImage(category);
    if (result) {
      return result;
    }
  }
  return null;
}

/**
 * Fetch multiple category images in parallel
 */
export async function fetchMultipleCategoryImages(
  categorySlugs: string[]
): Promise<Record<string, CategoryImageResult | null>> {
  const results = await Promise.all(
    categorySlugs.map(async (slug) => {
      const image = await fetchCategoryImage(slug);
      return { slug, image };
    })
  );

  return results.reduce(
    (acc, { slug, image }) => {
      acc[slug] = image;
      return acc;
    },
    {} as Record<string, CategoryImageResult | null>
  );
}

