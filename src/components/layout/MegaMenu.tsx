"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Category, SubCategory } from "@/types/category";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface MegaMenuProps {
  category: Category;
  isOpen: boolean;
  onClose: () => void;
  position: "left" | "center" | "right";
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export function MegaMenu({ category, isOpen, onClose, position, onMouseEnter, onMouseLeave }: MegaMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const isClosingRef = useRef(false);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Handle link clicks - close menu immediately
  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Close menu immediately - MUST happen first
    onClose();
    // Stop propagation to prevent any parent handlers from interfering
    e.stopPropagation();
  };

  if (!isOpen) return null;

  const subCategories = category.subCategories || [];
  const columnCount = Math.min(Math.max(subCategories.length, 3), 5);
  const hasFeaturedImage = category.image;

  // Calculate position classes
  const positionClasses = {
    left: "left-0",
    center: "left-1/2 -translate-x-1/2",
    right: "right-0",
  };

  return (
    <div
      ref={menuRef}
      data-mega-menu
      className={cn(
        "fixed top-[56px] md:top-[100px] left-0 right-0 w-full bg-white shadow-lg border-b border-gray-200 z-50",
        "animate-fade-in"
      )}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="px-6 py-8" style={{ maxWidth: "1400px", margin: "0 auto" }}>
        <div className={cn("grid gap-8", hasFeaturedImage ? "grid-cols-[1fr_280px]" : "grid-cols-1")}>
          {/* Main Content */}
          <div
            className={cn(
              "grid gap-6",
              columnCount === 3 && "grid-cols-3",
              columnCount === 4 && "grid-cols-4",
              columnCount === 5 && "grid-cols-5"
            )}
          >
            {subCategories.map((subCategory, index) => {
              const subCategorySlug = subCategory.slug || subCategory.name.toLowerCase().replace(/\s+/g, "-");
              return (
                <div
                  key={subCategorySlug}
                  className={cn(
                    "flex flex-col",
                    index < subCategories.length - 1 && "border-r border-gray-200 pr-6"
                  )}
                >
                  {/* Category Heading */}
                  <Link
                    href={`/categories/${category.slug}/${subCategorySlug}`}
                    className="mb-4 group"
                    onClick={handleLinkClick}
                  >
                    <h3 className="text-base font-bold text-gray-900 group-hover:text-primary transition-colors">
                      {subCategory.name}
                    </h3>
                  </Link>

                  {/* Sub-category Links */}
                  {subCategory.subSubCategories && subCategory.subSubCategories.length > 0 && (
                    <ul className="space-y-2.5 flex-1">
                      {subCategory.subSubCategories.map((subSubCategory) => (
                        <li key={subSubCategory.slug}>
                          <Link
                            href={`/categories/${category.slug}/${subCategorySlug}/${subSubCategory.slug}`}
                            className="flex items-center group text-sm text-gray-600 hover:text-primary transition-colors"
                            onClick={handleLinkClick}
                          >
                            <span className="flex-1">{subSubCategory.name}</span>
                            <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>

          {/* Featured Image/Banner */}
          {hasFeaturedImage && (
            <div className="relative h-full min-h-[300px] rounded-lg overflow-hidden">
              <div className="relative w-full h-full">
                <Image
                  src={category.image!}
                  alt={category.name}
                  fill
                  className="object-cover"
                  sizes="280px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                  <div className="p-4 text-white">
                    <p className="text-lg font-bold mb-1">{category.name}</p>
                    <p className="text-sm opacity-90">Shop Now</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

