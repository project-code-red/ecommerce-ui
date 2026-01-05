import { z } from "zod";

export const subSubCategorySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  slug: z.string().min(2, "Slug must be at least 2 characters"),
});

export const subCategorySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  slug: z.string().min(2, "Slug must be at least 2 characters"),
  subSubCategories: z.array(subSubCategorySchema).optional(),
});

export const categorySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  slug: z.string().min(2, "Slug must be at least 2 characters"),
  subCategories: z.array(subCategorySchema).min(1, "At least one subcategory is required"),
  image: z.string().url().optional(),
  description: z.string().optional(),
});

export type CategoryInput = z.infer<typeof categorySchema>;
export type SubCategoryInput = z.infer<typeof subCategorySchema>;
export type SubSubCategoryInput = z.infer<typeof subSubCategorySchema>;

