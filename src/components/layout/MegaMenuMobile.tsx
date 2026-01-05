"use client";

import { useState } from "react";
import Link from "next/link";
import { Category, SubCategory } from "@/types/category";
import { ChevronRight, ChevronDown, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface MegaMenuMobileProps {
  category: Category;
  isOpen: boolean;
  onClose: () => void;
  onBack?: () => void;
}

export function MegaMenuMobile({ category, isOpen, onClose, onBack }: MegaMenuMobileProps) {
  const [expandedSubCategory, setExpandedSubCategory] = useState<string | null>(null);

  if (!isOpen) return null;

  const toggleSubCategory = (slug: string) => {
    setExpandedSubCategory(expandedSubCategory === slug ? null : slug);
  };

  return (
    <div className="fixed inset-0 z-[60] pointer-events-none">
      {/* Overlay backdrop - only for category menu */}
      <div
        className="absolute inset-0 bg-black/30 transition-opacity duration-300 pointer-events-auto"
        onClick={onBack || onClose}
      />
      {/* Category Menu Panel - slides in from right */}
      <div className="absolute right-0 top-0 bottom-0 w-full max-w-[90vw] sm:max-w-sm bg-white shadow-2xl overflow-y-auto pointer-events-auto transform transition-transform duration-300 ease-out">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-4 flex items-center justify-between z-10 shadow-sm">
          <div className="flex items-center gap-2">
            {onBack && (
              <button
                onClick={onBack}
                className="p-2.5 hover:bg-gray-100 active:bg-gray-200 rounded-lg transition-colors -ml-1 min-w-[44px] min-h-[44px] flex items-center justify-center"
                aria-label="Back to menu"
              >
                <ArrowLeft className="h-6 w-6 text-gray-700" />
              </button>
            )}
            <h2 className="text-xl font-bold text-gray-900">{category.name}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2.5 hover:bg-gray-100 active:bg-gray-200 rounded-lg transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label="Close menu"
          >
            <span className="text-2xl text-gray-700 leading-none">×</span>
          </button>
        </div>

      {/* Content */}
      <div className="px-4 py-4">
        {/* Main Category Link */}
        <Link
          href={`/categories/${category.slug}`}
          onClick={onClose}
          className="block py-4 px-4 bg-primary/10 rounded-xl mb-5 hover:bg-primary/15 active:bg-primary/20 transition-colors"
        >
          <div className="flex items-center justify-between">
            <span className="font-bold text-base text-primary">View All {category.name}</span>
            <ChevronRight className="h-5 w-5 text-primary flex-shrink-0" />
          </div>
        </Link>

        {/* Sub Categories */}
        <div className="space-y-1">
          {(category.subCategories || []).map((subCategory, index) => {
            const subCategorySlug = subCategory.slug || subCategory.name.toLowerCase().replace(/\s+/g, "-");
            const hasSubSubCategories = subCategory.subSubCategories && subCategory.subSubCategories.length > 0;
            const isExpanded = expandedSubCategory === subCategorySlug;

            return (
              <div key={subCategorySlug} className="mb-2">
                {/* Sub Category Header - Clickable for both navigation and expansion */}
                <div className="flex items-center gap-2">
                  {/* Main Sub Category Link */}
                  <Link
                    href={`/categories/${category.slug}/${subCategorySlug}`}
                    onClick={onClose}
                    className={cn(
                      "flex-1 py-4 px-4 rounded-xl transition-colors",
                      "font-semibold text-base text-gray-900",
                      "hover:bg-gray-50 active:bg-gray-100",
                      "min-h-[56px] flex items-center"
                    )}
                  >
                    {subCategory.name}
                  </Link>
                  
                  {/* Expand/Collapse Button - Separate touch target */}
                  {hasSubSubCategories && (
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleSubCategory(subCategorySlug);
                      }}
                      className={cn(
                        "p-3 rounded-xl transition-all flex-shrink-0",
                        "hover:bg-gray-100 active:bg-gray-200",
                        "min-h-[56px] min-w-[56px] flex items-center justify-center",
                        isExpanded && "bg-gray-100"
                      )}
                      aria-label={isExpanded ? `Collapse ${subCategory.name}` : `Expand ${subCategory.name}`}
                    >
                      <ChevronDown
                        className={cn(
                          "h-6 w-6 text-gray-600 transition-transform duration-200",
                          isExpanded && "rotate-180"
                        )}
                      />
                    </button>
                  )}
                </div>

                {/* Sub-sub Categories - Expanded View */}
                {hasSubSubCategories && isExpanded && (
                  <div className="mt-2 ml-4 mb-4 space-y-1 bg-gray-50 rounded-xl p-3">
                    {subCategory.subSubCategories?.map((subSubCategory) => (
                      <Link
                        key={subSubCategory.slug}
                        href={`/categories/${category.slug}/${subCategorySlug}/${subSubCategory.slug}`}
                        onClick={onClose}
                        className={cn(
                          "block py-3 px-4 rounded-lg transition-colors",
                          "text-[15px] font-medium text-gray-700",
                          "hover:text-primary hover:bg-white",
                          "active:bg-gray-100",
                          "min-h-[44px] flex items-center"
                        )}
                      >
                        {subSubCategory.name}
                      </Link>
                    ))}
                    <Link
                      href={`/categories/${category.slug}/${subCategorySlug}`}
                      onClick={onClose}
                      className={cn(
                        "block py-3 px-4 rounded-lg transition-colors mt-2",
                        "text-[15px] font-semibold text-primary",
                        "hover:bg-primary/10 active:bg-primary/15",
                        "min-h-[44px] flex items-center"
                      )}
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
    </div>
  );
}

