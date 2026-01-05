/**
 * DummyJSON API Service
 * https://dummyjson.com/docs/products
 */

export interface DummyJsonProduct {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  tags: string[];
  brand: string;
  sku: string;
  weight: number;
  dimensions: {
    width: number;
    height: number;
    depth: number;
  };
  warrantyInformation: string;
  shippingInformation: string;
  availabilityStatus: string;
  reviews: Array<{
    rating: number;
    comment: string;
    date: string;
    reviewerName: string;
    reviewerEmail: string;
  }>;
  returnPolicy: string;
  minimumOrderQuantity: number;
  meta: {
    createdAt: string;
    updatedAt: string;
    barcode: string;
    qrCode: string;
  };
  thumbnail: string;
  images: string[];
}

export interface DummyJsonResponse {
  products: DummyJsonProduct[];
  total: number;
  skip: number;
  limit: number;
}

// Category mapping from our app categories to DummyJSON categories
// DummyJSON available categories: smartphones, laptops, fragrances, skincare, groceries, 
// home-decoration, furniture, tops, womens-dresses, womens-shoes, mens-shirts, mens-shoes, 
// mens-watches, womens-watches, womens-bags, womens-jewellery, sunglasses, automotive, motorcycle, lighting
const categoryMapping: Record<string, string[]> = {
  "Men": ["mens-shirts", "mens-shoes", "mens-watches"],
  "Women": ["womens-dresses", "womens-shoes", "womens-bags", "womens-jewellery", "womens-watches"],
  "Kids": ["tops"], // DummyJSON doesn't have kids category, use tops as fallback
  "Electronics": ["smartphones", "laptops"],
  "Beauty": ["fragrances", "skincare"],
  "Beauty & Personal Care": ["fragrances", "skincare"],
  "Home & Kitchen": ["home-decoration", "furniture", "groceries"],
};

// Reverse mapping for subcategories
const subCategoryMapping: Record<string, string> = {
  "Clothing": "mens-shirts",
  "Footwear": "mens-shoes",
  "Accessories": "mens-watches",
  "Beauty": "skincare",
  "Electronics": "smartphones",
};

const BASE_URL = "https://dummyjson.com/products";

/**
 * Get category string for DummyJSON API
 * DummyJSON categories: smartphones, laptops, fragrances, skincare, groceries, 
 * home-decoration, furniture, tops, womens-dresses, womens-shoes, mens-shirts, 
 * mens-shoes, mens-watches, womens-watches, womens-bags, womens-jewellery, 
 * sunglasses, automotive, motorcycle, lighting
 */
function getDummyJsonCategory(category?: string, subCategory?: string): string | null {
  if (!category) return null;

  // Try direct category mapping
  const mappedCategories = categoryMapping[category];
  if (mappedCategories && mappedCategories.length > 0) {
    return mappedCategories[0]; // Use first available category
  }

  // Try subcategory mapping
  if (subCategory) {
    const mappedSub = subCategoryMapping[subCategory];
    if (mappedSub) return mappedSub;
  }

  // Fallback: try to match category name directly
  const normalizedCategory = category.toLowerCase().replace(/\s+/g, "-");
  const dummyJsonCategories = [
    "smartphones", "laptops", "fragrances", "skincare", "groceries",
    "home-decoration", "furniture", "tops", "womens-dresses", "womens-shoes",
    "mens-shirts", "mens-shoes", "mens-watches", "womens-watches",
    "womens-bags", "womens-jewellery", "sunglasses", "automotive", "motorcycle", "lighting"
  ];
  
  if (dummyJsonCategories.includes(normalizedCategory)) {
    return normalizedCategory;
  }

  return null; // Return null to fetch all products
}

/**
 * Infer subSubCategory from product name or DummyJSON category
 */
function inferSubSubCategory(productName: string, dummyCategory: string): string | undefined {
  const nameLower = productName.toLowerCase();
  const categoryLower = dummyCategory.toLowerCase();

  // Common sub-subcategory keywords
  const subSubCategoryMap: Record<string, string> = {
    "t-shirt": "t-shirts",
    "tshirt": "t-shirts",
    "shirt": "casual-shirts",
    "jean": "jeans",
    "trouser": "trousers",
    "pant": "trousers",
    "shoe": "casual-shoes",
    "sneaker": "sports-shoes",
    "dress": "dresses",
    "kurta": "kurtas-kurtis",
    "kurti": "kurtas-kurtis",
    "saree": "sarees",
    "suit": "suit-sets",
    "top": "tops-tunics",
    "tunic": "tops-tunics",
    "jacket": "jackets",
    "sweater": "sweaters",
    "sweatshirt": "sweatshirts",
    "blazer": "blazers-coats",
    "coat": "blazers-coats",
    "short": "shorts",
    "sandals": "sandals",
    "flip": "flip-flops",
    "boot": "boots",
    "heel": "heels",
    "flat": "flats",
  };

  // Check product name for keywords
  for (const [keyword, subSub] of Object.entries(subSubCategoryMap)) {
    if (nameLower.includes(keyword)) {
      return subSub;
    }
  }

  // Check DummyJSON category
  if (categoryLower.includes("shirt")) return "t-shirts";
  if (categoryLower.includes("dress")) return "dresses";
  if (categoryLower.includes("shoe")) return "casual-shoes";

  return undefined;
}

/**
 * Map DummyJSON product to our Product type
 */
function mapDummyJsonToProduct(
  dummyProduct: DummyJsonProduct,
  category: string,
  subCategory: string,
  subSubCategory?: string
): import("@/types/product").Product {
  const mrp = dummyProduct.price / (1 - dummyProduct.discountPercentage / 100);
  const slug = dummyProduct.title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

  // Infer subSubCategory if not provided
  const inferredSubSub = subSubCategory || inferSubSubCategory(dummyProduct.title, dummyProduct.category);

  return {
    id: `prod-${dummyProduct.id}`,
    slug: slug, // Slug without ID - ID will be in URL path separately
    name: dummyProduct.title,
    description: dummyProduct.description,
    images: dummyProduct.images.length > 0 ? dummyProduct.images : [dummyProduct.thumbnail],
    price: Math.round(dummyProduct.price),
    mrp: Math.round(mrp),
    discountPercentage: Math.round(dummyProduct.discountPercentage),
    stock: dummyProduct.stock,
    category,
    subCategory,
    subSubCategory: inferredSubSub,
    variants: {
      sizes: ["S", "M", "L", "XL"],
      colors: ["Black", "White", "Blue", "Red"],
    },
    specifications: {
      Brand: dummyProduct.brand,
      Weight: `${dummyProduct.weight}kg`,
      SKU: dummyProduct.sku,
    },
    features: dummyProduct.tags || [],
    deliveryEstimate: "3-5 days",
    rating: dummyProduct.rating,
    ratingCount: dummyProduct.reviews?.length || Math.floor(Math.random() * 500) + 10,
    reviews: dummyProduct.reviews?.map((review, index) => ({
      id: `review-${dummyProduct.id}-${index}`,
      username: review.reviewerName || `User${index + 1}`,
      rating: review.rating,
      comment: review.comment,
      date: review.date,
      verified: Math.random() > 0.5,
    })) || [],
    returnInfo: dummyProduct.returnPolicy || "10-day return",
    codAvailable: true,
    isActive: dummyProduct.availabilityStatus === "In Stock",
    createdAt: dummyProduct.meta?.createdAt || new Date().toISOString(),
    updatedAt: dummyProduct.meta?.updatedAt || new Date().toISOString(),
  };
}

/**
 * Fetch products from DummyJSON API
 */
export async function fetchDummyJsonProducts(
  category?: string,
  subCategory?: string,
  subSubCategory?: string,
  page: number = 1,
  limit: number = 20
): Promise<{
  products: import("@/types/product").Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}> {
  try {
    const dummyCategory = getDummyJsonCategory(category, subCategory);
    const skip = (page - 1) * limit;

    let url = `${BASE_URL}?limit=${limit}&skip=${skip}`;
    if (dummyCategory) {
      url = `${BASE_URL}/category/${dummyCategory}?limit=${limit}&skip=${skip}`;
    }

    const response = await fetch(url, {
      cache: "force-cache",
      next: { revalidate: 3600 }, // Revalidate every hour
    });
    
    if (!response.ok) {
      // If category endpoint fails, fallback to all products with client-side filtering
      if (dummyCategory) {
        const fallbackResponse = await fetch(`${BASE_URL}?limit=100&skip=0`, {
          cache: "force-cache",
          next: { revalidate: 3600 },
        });
        if (fallbackResponse.ok) {
          const fallbackData: DummyJsonResponse = await fallbackResponse.json();
          const filtered = fallbackData.products.filter((p) => {
            const productCategory = p.category.toLowerCase();
            const searchCategory = category?.toLowerCase() || "";
            return productCategory.includes(searchCategory) ||
                   p.title.toLowerCase().includes(searchCategory);
          });
          
          const start = skip;
          const end = start + limit;
          const paginated = filtered.slice(start, end);
          
          const mappedProducts = paginated.map((product) =>
            mapDummyJsonToProduct(product, category || "All", subCategory || "All", subSubCategory)
          );

          return {
            products: mappedProducts,
            total: filtered.length,
            page,
            limit,
            totalPages: Math.ceil(filtered.length / limit),
          };
        }
      }
      throw new Error(`Failed to fetch products: ${response.statusText}`);
    }

    const data: DummyJsonResponse = await response.json();

    const mappedProducts = data.products.map((product) =>
      mapDummyJsonToProduct(product, category || "All", subCategory || "All", subSubCategory)
    );

    return {
      products: mappedProducts,
      total: data.total,
      page,
      limit: data.limit,
      totalPages: Math.ceil(data.total / limit),
    };
  } catch (error) {
    console.error("Error fetching products from DummyJSON:", error);
    // Return empty result on error
    return {
      products: [],
      total: 0,
      page,
      limit,
      totalPages: 0,
    };
  }
}

/**
 * Fetch a single product by ID
 */
export async function fetchDummyJsonProductById(id: number): Promise<import("@/types/product").Product | null> {
  try {
    const response = await fetch(`${BASE_URL}/${id}`);
    if (!response.ok) {
      return null;
    }

    const product: DummyJsonProduct = await response.json();
    // Extract category from product category or use default
    const category = "All";
    const subCategory = "All";

    return mapDummyJsonToProduct(product, category, subCategory);
  } catch (error) {
    console.error("Error fetching product from DummyJSON:", error);
    return null;
  }
}

/**
 * Search products
 */
export async function searchDummyJsonProducts(
  query: string,
  page: number = 1,
  limit: number = 20
): Promise<{
  products: import("@/types/product").Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}> {
  try {
    const skip = (page - 1) * limit;
    const response = await fetch(`${BASE_URL}/search?q=${encodeURIComponent(query)}&limit=${limit}&skip=${skip}`);

    if (!response.ok) {
      throw new Error(`Failed to search products: ${response.statusText}`);
    }

    const data: DummyJsonResponse = await response.json();

    const mappedProducts = data.products.map((product) =>
      mapDummyJsonToProduct(product, "All", "All")
    );

    return {
      products: mappedProducts,
      total: data.total,
      page,
      limit: data.limit,
      totalPages: Math.ceil(data.total / limit),
    };
  } catch (error) {
    console.error("Error searching products from DummyJSON:", error);
    return {
      products: [],
      total: 0,
      page,
      limit,
      totalPages: 0,
    };
  }
}

