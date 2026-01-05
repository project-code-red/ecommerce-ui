"use client";

import { useState } from "react";
import Link from "next/link";
import { Category, SubCategory } from "@/types/category";
import { ChevronRight, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface MegaMenuMobileProps {
  category: Category;
  isOpen: boolean;
  onClose: () => void;
}

export function MegaMenuMobile({ category, isOpen, onClose }: MegaMenuMobileProps) {
  const [expandedSubCategory, setExpandedSubCategory] = useState<string | null>(null);

  if (!isOpen) return null;

  const toggleSubCategory = (slug: string) => {
    setExpandedSubCategory(expandedSubCategory === slug ? null : slug);
  };

  return (
    <div className="fixed inset-0 z-50 bg-white overflow-y-auto animate-slide-in">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-4 flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">{category.name}</h2>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Close menu"
        >
          <span className="text-2xl">×</span>
        </button>
      </div>

      {/* Content */}
      <div className="px-4 py-6">
        {/* Main Category Link */}
        <Link
          href={`/categories/${category.slug}`}
          onClick={onClose}
          className="block py-4 px-4 bg-primary/5 rounded-lg mb-4 hover:bg-primary/10 transition-colors"
        >
          <div className="flex items-center justify-between">
            <span className="font-semibold text-primary">View All {category.name}</span>
            <ChevronRight className="h-5 w-5 text-primary" />
          </div>
        </Link>

        {/* Sub Categories */}
        <div className="space-y-2">
          {(category.subCategories || []).map((subCategory, index) => {
            const subCategorySlug = subCategory.slug || subCategory.name.toLowerCase().replace(/\s+/g, "-");
            const hasSubSubCategories = subCategory.subSubCategories && subCategory.subSubCategories.length > 0;
            const isExpanded = expandedSubCategory === subCategorySlug;

            return (
              <div key={subCategorySlug} className="border-b border-gray-100 last:border-0">
                <button
                  onClick={() => hasSubSubCategories && toggleSubCategory(subCategorySlug)}
                  className={cn(
                    "w-full flex items-center justify-between py-4 text-left",
                    "hover:bg-gray-50 rounded-lg px-2 transition-colors"
                  )}
                >
                  <Link
                    href={`/categories/${category.slug}/${subCategorySlug}`}
                    onClick={onClose}
                    className="flex-1 font-semibold text-gray-900"
                  >
                    {subCategory.name}
                  </Link>
                  {hasSubSubCategories && (
                    <ChevronDown
                      className={cn(
                        "h-5 w-5 text-gray-400 transition-transform",
                        isExpanded && "rotate-180"
                      )}
                    />
                  )}
                </button>

                {/* Sub-sub Categories */}
                {hasSubSubCategories && isExpanded && (
                  <div className="pl-4 pb-2 space-y-1">
                    {subCategory.subSubCategories?.map((subSubCategory) => (
                      <Link
                        key={subSubCategory.slug}
                        href={`/categories/${category.slug}/${subCategorySlug}/${subSubCategory.slug}`}
                        onClick={onClose}
                        className="block py-2.5 px-3 text-sm text-gray-600 hover:text-primary hover:bg-gray-50 rounded transition-colors"
                      >
                        {subSubCategory.name}
                      </Link>
                    ))}
                    <Link
                      href={`/categories/${category.slug}/${subCategorySlug}`}
                      onClick={onClose}
                      className="block py-2.5 px-3 text-sm font-medium text-primary hover:bg-primary/5 rounded transition-colors"
                    >
                      View All {subCategory.name}
                    </Link>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

