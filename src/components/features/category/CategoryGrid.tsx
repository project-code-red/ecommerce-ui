"use client";

import { Category } from "@/types/category";
import { CategoryCard } from "./CategoryCard";
import { cn } from "@/lib/utils";

interface CategoryGridProps {
  categories: Category[];
  className?: string;
}

export function CategoryGrid({ categories, className }: CategoryGridProps) {
  return (
    <div className={cn("w-full", className)}>
      {/* Desktop: Grid Layout */}
      <div className="hidden md:grid md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 md:gap-6">
        {categories.map((category) => (
          <CategoryCard key={category.slug} category={category} />
        ))}
      </div>

      {/* Mobile: Horizontal Scrollable */}
      <div className="md:hidden overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4">
        <div className="flex gap-4 min-w-max">
          {categories.map((category) => (
            <CategoryCard
              key={category.slug}
              category={category}
              className="w-[140px] flex-shrink-0"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

