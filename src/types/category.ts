export interface SubSubCategory {
  name: string;
  slug: string;
}

export interface SubCategory {
  name: string;
  slug: string;
  subSubCategories?: SubSubCategory[];
}

export interface Category {
  name: string;
  slug: string;
  subCategories: SubCategory[];
  image?: string;
  description?: string;
}

