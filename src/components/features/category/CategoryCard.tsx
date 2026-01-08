"use client";

import Link from "next/link";
import Image from "next/image";
import { Category } from "@/types/category";
import { cn } from "@/lib/utils";
import { useCategoryImage } from "@/hooks/useCategoryImages";
import { ProductImage } from "@/components/ui/ProductImage";

interface CategoryCardProps {
  category: Category;
  className?: string;
}

// No fallback needed - ProductImage component handles errors internally

export function CategoryCard({ category, className }: CategoryCardProps) {
  const { image: categoryImageData, isLoading } = useCategoryImage(category.slug);

  // Use DummyJSON image if available, otherwise use category.image or empty string
  // ProductImage component will handle the fallback display
  const categoryImage = categoryImageData?.image || category.image || "";

  return (
    <Link
      href={`/categories/${category.slug}`}
      className={cn(
        "group block bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer",
        "transform hover:-translate-y-2",
        className
      )}
    >
      <div className="flex flex-col h-full">
        {/* Image on Top */}
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          {isLoading ? (
            <div className="w-full h-full bg-gray-200 animate-pulse" />
          ) : (
            <ProductImage
              src={categoryImage}
              alt={category.name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-300"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            />
          )}
        </div>

        {/* Category Name Below */}
        <div className="p-3 md:p-4 text-center">
          <h3 className="text-sm md:text-base lg:text-lg font-semibold text-gray-900 group-hover:text-primary transition-colors">
            {category.name}
          </h3>
        </div>
      </div>
    </Link>
  );
}

