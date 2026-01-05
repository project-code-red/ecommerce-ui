import { Product } from "@/types/product";

const generateProductId = (index: number) => `prod-${String(index).padStart(3, "0")}`;
const generateSlug = (name: string) => name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

const productNames = {
  men: {
    "t-shirts": [
      "Classic Cotton T-Shirt",
      "Premium Polo T-Shirt",
      "V-Neck Casual T-Shirt",
      "Striped Round Neck T-Shirt",
      "Slim Fit Basic T-Shirt",
    ],
    "casual-shirts": [
      "Regular Fit Casual Shirt",
      "Slim Fit Checkered Shirt",
      "Long Sleeve Casual Shirt",
      "Denim Casual Shirt",
      "Linen Casual Shirt",
    ],
    "formal-shirts": [
      "White Formal Shirt",
      "Blue Formal Shirt",
      "Striped Formal Shirt",
      "Premium Cotton Formal Shirt",
      "Slim Fit Formal Shirt",
    ],
    "jeans": [
      "Slim Fit Blue Jeans",
      "Regular Fit Black Jeans",
      "Ripped Denim Jeans",
      "Straight Fit Jeans",
      "Skinny Fit Jeans",
    ],
    "casual-shoes": [
      "Leather Casual Shoes",
      "Canvas Sneakers",
      "Loafers",
      "Oxford Casual Shoes",
      "Derby Shoes",
    ],
    "sports-shoes": [
      "Running Shoes",
      "Training Shoes",
      "Basketball Shoes",
      "Walking Shoes",
      "Athletic Sneakers",
    ],
  },
  women: {
    "kurtas-kurtis": [
      "Cotton Printed Kurta",
      "Anarkali Kurta",
      "A-Line Kurta",
      "Straight Kurta",
      "Designer Kurta Set",
    ],
    "dresses": [
      "Floral Summer Dress",
      "A-Line Casual Dress",
      "Maxi Dress",
      "Midi Dress",
      "Bodycon Dress",
    ],
    "jeans": [
      "High Waist Skinny Jeans",
      "Straight Fit Jeans",
      "Ripped Jeans",
      "Wide Leg Jeans",
      "Bootcut Jeans",
    ],
    "heels": [
      "Stiletto Heels",
      "Block Heels",
      "Wedge Heels",
      "Pump Heels",
      "Ankle Strap Heels",
    ],
    "handbags": [
      "Leather Handbag",
      "Tote Bag",
      "Crossbody Bag",
      "Shoulder Bag",
      "Clutch Bag",
    ],
  },
  kids: {
    "t-shirts": [
      "Cartoon Print T-Shirt",
      "Colorful Kids T-Shirt",
      "Character T-Shirt",
      "Striped Kids T-Shirt",
      "Plain Kids T-Shirt",
    ],
    "dresses": [
      "Princess Dress",
      "Floral Kids Dress",
      "Party Dress",
      "Casual Kids Dress",
      "Fancy Dress",
    ],
  },
  "home-kitchen": {
    "bedsheets": [
      "Cotton Bedsheet Set",
      "Premium Bedsheet",
      "Printed Bedsheet",
      "Silk Bedsheet",
      "Microfiber Bedsheet",
    ],
    "cookware": [
      "Non-Stick Cookware Set",
      "Stainless Steel Cookware",
      "Ceramic Cookware",
      "Cast Iron Pan",
      "Pressure Cooker",
    ],
  },
  electronics: {
    "smartwatches": [
      "Fitness Smartwatch",
      "Sports Smartwatch",
      "Premium Smartwatch",
      "Budget Smartwatch",
      "Health Tracking Watch",
    ],
    "headphones": [
      "Wireless Headphones",
      "Noise Cancelling Headphones",
      "Gaming Headphones",
      "Bluetooth Earbuds",
      "Sports Earbuds",
    ],
  },
};

const sizes = ["S", "M", "L", "XL", "XXL"];
const colors = ["Black", "White", "Blue", "Red", "Green", "Grey", "Navy", "Brown"];

const generateProduct = (
  id: string,
  name: string,
  category: string,
  subCategory: string,
  subSubCategory: string,
  basePrice: number,
  hasVariants: boolean = true
): Product => {
  const mrp = basePrice * (1 + Math.random() * 0.5);
  const price = mrp * (0.6 + Math.random() * 0.3);
  const discountPercentage = Math.round(((mrp - price) / mrp) * 100);

  return {
    id,
    slug: generateSlug(name),
    name,
    description: `Premium quality ${name.toLowerCase()} with excellent design and comfort. Perfect for everyday wear. Made with high-quality materials for durability and style.`,
    images: Array.from({ length: 3 + Math.floor(Math.random() * 4) }, (_, i) =>
      `https://picsum.photos/seed/${id}-${i}/800/800`
    ),
    price: Math.round(price),
    mrp: Math.round(mrp),
    discountPercentage,
    stock: Math.floor(Math.random() * 100) + 10,
    category,
    subCategory,
    subSubCategory,
    variants: hasVariants
      ? {
          sizes: sizes.slice(0, 3 + Math.floor(Math.random() * 3)),
          colors: colors.slice(0, 2 + Math.floor(Math.random() * 4)),
        }
      : {},
    specifications: {
      Material: "Premium Quality",
      "Care Instructions": "Machine Wash",
      "Country of Origin": "India",
    },
    features: ["Premium Quality", "Comfortable", "Durable", "Stylish"],
    deliveryEstimate: `${Math.floor(Math.random() * 3) + 3}-${Math.floor(Math.random() * 3) + 5} days`,
    rating: 3.5 + Math.random() * 1.5,
    ratingCount: Math.floor(Math.random() * 500) + 10,
    reviews: Array.from({ length: Math.floor(Math.random() * 5) + 2 }, (_, i) => ({
      id: `review-${id}-${i}`,
      username: `User${Math.floor(Math.random() * 1000)}`,
      rating: 3 + Math.random() * 2,
      comment: `Great product! Very satisfied with the quality.`,
      date: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
      verified: Math.random() > 0.5,
    })),
    returnInfo: "10-day return",
    codAvailable: Math.random() > 0.2,
    isActive: true,
    createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  };
};

export const products: Product[] = [];

let productIndex = 1;

// Men's products
Object.entries(productNames.men).forEach(([subSubCategory, names]) => {
  names.forEach((name) => {
    products.push(
      generateProduct(
        generateProductId(productIndex++),
        name,
        "Men",
        "Clothing",
        subSubCategory,
        500 + Math.random() * 2000,
        subSubCategory !== "t-shirts"
      )
    );
  });
});

// Add men's footwear
productNames.men["casual-shoes"].forEach((name) => {
  products.push(
    generateProduct(
      generateProductId(productIndex++),
      name,
      "Men",
      "Footwear",
      "casual-shoes",
      1500 + Math.random() * 3000
    )
  );
});

productNames.men["sports-shoes"].forEach((name) => {
  products.push(
    generateProduct(
      generateProductId(productIndex++),
      name,
      "Men",
      "Footwear",
      "sports-shoes",
      2000 + Math.random() * 4000
    )
  );
});

// Women's products
Object.entries(productNames.women).forEach(([subSubCategory, names]) => {
  const subCat = subSubCategory === "kurtas-kurtis" ? "Clothing" : subSubCategory === "heels" || subSubCategory === "handbags" ? "Accessories" : "Clothing";
  names.forEach((name) => {
    products.push(
      generateProduct(
        generateProductId(productIndex++),
        name,
        "Women",
        subCat,
        subSubCategory,
        600 + Math.random() * 2500
      )
    );
  });
});

// Kids products
Object.entries(productNames.kids).forEach(([subSubCategory, names]) => {
  names.forEach((name) => {
    products.push(
      generateProduct(
        generateProductId(productIndex++),
        name,
        "Kids",
        subSubCategory.includes("dresses") ? "Girls Clothing" : "Boys Clothing",
        subSubCategory,
        300 + Math.random() * 800
      )
    );
  });
});

// Home & Kitchen
Object.entries(productNames["home-kitchen"]).forEach(([subSubCategory, names]) => {
  names.forEach((name) => {
    products.push(
      generateProduct(
        generateProductId(productIndex++),
        name,
        "Home & Kitchen",
        subSubCategory === "bedsheets" ? "Bedding" : "Kitchen",
        subSubCategory,
        800 + Math.random() * 2000,
        false
      )
    );
  });
});

// Electronics
Object.entries(productNames.electronics).forEach(([subSubCategory, names]) => {
  names.forEach((name) => {
    products.push(
      generateProduct(
        generateProductId(productIndex++),
        name,
        "Electronics",
        subSubCategory === "smartwatches" ? "Wearables" : "Audio",
        subSubCategory,
        2000 + Math.random() * 8000,
        false
      )
    );
  });
});

// Add some additional products to reach ~100
const additionalProducts = [
  { name: "Leather Wallet", category: "Men", subCategory: "Accessories", subSubCategory: "wallets", price: 500 },
  { name: "Leather Belt", category: "Men", subCategory: "Accessories", subSubCategory: "belts", price: 600 },
  { name: "Sunglasses", category: "Men", subCategory: "Accessories", subSubCategory: "sunglasses", price: 1500 },
  { name: "Sports Cap", category: "Men", subCategory: "Accessories", subSubCategory: "caps-hats", price: 400 },
  { name: "Formal Trousers", category: "Men", subCategory: "Clothing", subSubCategory: "formal-trousers", price: 1200 },
  { name: "Sweatshirt", category: "Men", subCategory: "Clothing", subSubCategory: "sweatshirts", price: 1500 },
  { name: "Jacket", category: "Men", subCategory: "Clothing", subSubCategory: "jackets", price: 2500 },
  { name: "Designer Saree", category: "Women", subCategory: "Clothing", subSubCategory: "sarees", price: 3000 },
  { name: "Suit Set", category: "Women", subCategory: "Clothing", subSubCategory: "suit-sets", price: 2500 },
  { name: "Top & Tunic", category: "Women", subCategory: "Clothing", subSubCategory: "tops-tunics", price: 800 },
  { name: "Flats", category: "Women", subCategory: "Footwear", subSubCategory: "flats", price: 1200 },
  { name: "Sandals", category: "Women", subCategory: "Footwear", subSubCategory: "sandals", price: 900 },
  { name: "Jewellery Set", category: "Women", subCategory: "Accessories", subSubCategory: "jewellery", price: 2000 },
  { name: "Kids Sports Shoes", category: "Kids", subCategory: "Footwear", subSubCategory: "sports-shoes", price: 800 },
  { name: "Curtains", category: "Home & Kitchen", subCategory: "Bedding", subSubCategory: "curtains", price: 1500 },
  { name: "Cushions", category: "Home & Kitchen", subCategory: "Bedding", subSubCategory: "cushions", price: 500 },
];

additionalProducts.forEach((prod) => {
  products.push(
    generateProduct(
      generateProductId(productIndex++),
      prod.name,
      prod.category,
      prod.subCategory,
      prod.subSubCategory,
      prod.price
    )
  );
});

export default products;

