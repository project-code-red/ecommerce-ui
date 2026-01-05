import { Category } from "@/types/category";

export const categories: Category[] = [
  {
    name: "Men",
    slug: "men",
    subCategories: [
      {
        name: "Clothing",
        slug: "clothing",
        subSubCategories: [
          { name: "T-Shirts", slug: "t-shirts" },
          { name: "Casual Shirts", slug: "casual-shirts" },
          { name: "Formal Shirts", slug: "formal-shirts" },
          { name: "Sweatshirts", slug: "sweatshirts" },
          { name: "Sweaters", slug: "sweaters" },
          { name: "Jackets", slug: "jackets" },
          { name: "Blazers & Coats", slug: "blazers-coats" },
          { name: "Suits", slug: "suits" },
          { name: "Jeans", slug: "jeans" },
          { name: "Casual Trousers", slug: "casual-trousers" },
          { name: "Formal Trousers", slug: "formal-trousers" },
          { name: "Shorts", slug: "shorts" },
          { name: "Track Pants & Joggers", slug: "track-pants-joggers" },
        ],
      },
      {
        name: "Footwear",
        slug: "footwear",
        subSubCategories: [
          { name: "Casual Shoes", slug: "casual-shoes" },
          { name: "Sports Shoes", slug: "sports-shoes" },
          { name: "Formal Shoes", slug: "formal-shoes" },
          { name: "Sandals", slug: "sandals" },
          { name: "Flip Flops", slug: "flip-flops" },
          { name: "Boots", slug: "boots" },
        ],
      },
      {
        name: "Accessories",
        slug: "accessories",
        subSubCategories: [
          { name: "Wallets", slug: "wallets" },
          { name: "Belts", slug: "belts" },
          { name: "Sunglasses", slug: "sunglasses" },
          { name: "Caps & Hats", slug: "caps-hats" },
          { name: "Socks", slug: "socks" },
          { name: "Watches", slug: "watches" },
          { name: "Jewellery", slug: "jewellery" },
        ],
      },
      {
        name: "Personal Care",
        slug: "personal-care",
        subSubCategories: [
          { name: "Perfumes", slug: "perfumes" },
          { name: "Grooming", slug: "grooming" },
          { name: "Face care", slug: "face-care" },
          { name: "Hair care", slug: "hair-care" },
        ],
      },
    ],
  },
  {
    name: "Women",
    slug: "women",
    subCategories: [
      {
        name: "Clothing",
        slug: "clothing",
        subSubCategories: [
          { name: "Kurtas & Kurtis", slug: "kurtas-kurtis" },
          { name: "Sarees", slug: "sarees" },
          { name: "Suit Sets", slug: "suit-sets" },
          { name: "Dresses", slug: "dresses" },
          { name: "Tops & Tunics", slug: "tops-tunics" },
          { name: "T-Shirts", slug: "t-shirts" },
          { name: "Jeans", slug: "jeans" },
          { name: "Trousers & Palazzos", slug: "trousers-palazzos" },
          { name: "Skirts", slug: "skirts" },
          { name: "Shorts", slug: "shorts" },
          { name: "Ethnic Wear", slug: "ethnic-wear" },
          { name: "Lingerie", slug: "lingerie" },
          { name: "Nightwear", slug: "nightwear" },
        ],
      },
      {
        name: "Footwear",
        slug: "footwear",
        subSubCategories: [
          { name: "Flats", slug: "flats" },
          { name: "Heels", slug: "heels" },
          { name: "Sandals", slug: "sandals" },
          { name: "Casual Shoes", slug: "casual-shoes" },
          { name: "Sports Shoes", slug: "sports-shoes" },
        ],
      },
      {
        name: "Accessories",
        slug: "accessories",
        subSubCategories: [
          { name: "Handbags", slug: "handbags" },
          { name: "Shoulder Bags", slug: "shoulder-bags" },
          { name: "Backpacks", slug: "backpacks" },
          { name: "Jewellery", slug: "jewellery" },
          { name: "Sunglasses", slug: "sunglasses" },
          { name: "Watches", slug: "watches" },
        ],
      },
      {
        name: "Beauty",
        slug: "beauty",
        subSubCategories: [
          { name: "Makeup", slug: "makeup" },
          { name: "Skincare", slug: "skincare" },
          { name: "Haircare", slug: "haircare" },
          { name: "Fragrances", slug: "fragrances" },
        ],
      },
    ],
  },
  {
    name: "Kids",
    slug: "kids",
    subCategories: [
      {
        name: "Boys Clothing",
        slug: "boys-clothing",
        subSubCategories: [
          { name: "T-Shirts", slug: "t-shirts" },
          { name: "Shirts", slug: "shirts" },
          { name: "Shorts", slug: "shorts" },
          { name: "Jeans", slug: "jeans" },
          { name: "Clothing Sets", slug: "clothing-sets" },
        ],
      },
      {
        name: "Girls Clothing",
        slug: "girls-clothing",
        subSubCategories: [
          { name: "Dresses", slug: "dresses" },
          { name: "Tops", slug: "tops" },
          { name: "Skirts", slug: "skirts" },
          { name: "Leggings", slug: "leggings" },
          { name: "Clothing Sets", slug: "clothing-sets" },
        ],
      },
      {
        name: "Footwear",
        slug: "footwear",
        subSubCategories: [
          { name: "Sandals", slug: "sandals" },
          { name: "Sports Shoes", slug: "sports-shoes" },
          { name: "Casual Shoes", slug: "casual-shoes" },
        ],
      },
      {
        name: "Toys & Essentials",
        slug: "toys-essentials",
        subSubCategories: [
          { name: "Learning toys", slug: "learning-toys" },
          { name: "Soft toys", slug: "soft-toys" },
          { name: "Baby care", slug: "baby-care" },
        ],
      },
    ],
  },
  {
    name: "Home & Kitchen",
    slug: "home-kitchen",
    subCategories: [
      {
        name: "Bedding",
        slug: "bedding",
        subSubCategories: [
          { name: "Bedsheets", slug: "bedsheets" },
          { name: "Curtains", slug: "curtains" },
          { name: "Cushions", slug: "cushions" },
          { name: "Blankets", slug: "blankets" },
        ],
      },
      {
        name: "Kitchen",
        slug: "kitchen",
        subSubCategories: [
          { name: "Kitchen Essentials", slug: "kitchen-essentials" },
          { name: "Containers", slug: "containers" },
          { name: "Cookware", slug: "cookware" },
        ],
      },
      {
        name: "Decor",
        slug: "decor",
        subSubCategories: [
          { name: "Home Decor", slug: "home-decor" },
          { name: "Lamps", slug: "lamps" },
          { name: "Storage items", slug: "storage-items" },
        ],
      },
    ],
  },
  {
    name: "Beauty & Personal Care",
    slug: "beauty-personal-care",
    subCategories: [
      {
        name: "Makeup",
        slug: "makeup",
      },
      {
        name: "Skincare",
        slug: "skincare",
      },
      {
        name: "Haircare",
        slug: "haircare",
      },
      {
        name: "Men's Grooming",
        slug: "mens-grooming",
      },
      {
        name: "Fragrances",
        slug: "fragrances",
      },
      {
        name: "Appliances",
        slug: "appliances",
      },
    ],
  },
  {
    name: "Electronics",
    slug: "electronics",
    subCategories: [
      {
        name: "Wearables",
        slug: "wearables",
        subSubCategories: [
          { name: "Smartwatches", slug: "smartwatches" },
          { name: "Fitness Bands", slug: "fitness-bands" },
        ],
      },
      {
        name: "Audio",
        slug: "audio",
        subSubCategories: [
          { name: "Headphones", slug: "headphones" },
          { name: "Earbuds", slug: "earbuds" },
        ],
      },
      {
        name: "Mobile Accessories",
        slug: "mobile-accessories",
      },
    ],
  },
  {
    name: "Grocery",
    slug: "grocery",
    subCategories: [
      {
        name: "Snacks",
        slug: "snacks",
      },
      {
        name: "Beverages",
        slug: "beverages",
      },
    ],
  },
  {
    name: "Sports & Fitness",
    slug: "sports-fitness",
    subCategories: [
      {
        name: "Fitness Equipment",
        slug: "fitness-equipment",
      },
      {
        name: "Sports Accessories",
        slug: "sports-accessories",
      },
    ],
  },
];

