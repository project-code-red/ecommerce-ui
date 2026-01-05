"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { useProducts } from "@/services/queries/productQueries";
import { Product } from "@/types/product";
import { formatCurrency, getProductUrl } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";

interface SearchBarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchBar({ isOpen, onClose }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { data: searchResults, isLoading } = useProducts(
    undefined,
    1,
    10
  );

  // Filter products based on search query
  const filteredProducts = searchResults?.data.filter(
    (product) =>
      product.name.toLowerCase().includes(query.toLowerCase()) ||
      product.description.toLowerCase().includes(query.toLowerCase()) ||
      product.category.toLowerCase().includes(query.toLowerCase()) ||
      product.subCategory.toLowerCase().includes(query.toLowerCase())
  ) || [];

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      inputRef.current?.focus();
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/products?search=${encodeURIComponent(query.trim())}`);
      onClose();
      setQuery("");
    }
  };

  const handleProductClick = (product: Product) => {
    router.push(getProductUrl(product.slug, product.id));
    onClose();
    setQuery("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50" onClick={onClose}>
      <div
        ref={searchRef}
        className="absolute top-0 left-0 right-0 bg-white shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <form onSubmit={handleSubmit} className="relative">
            <div className="flex items-center space-x-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  placeholder="Search for products, brands, categories..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-gray-900 bg-white"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-3 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
            </div>
          </form>

          {/* Search Results */}
          {query && (
            <div className="mt-4 max-h-96 overflow-y-auto border-t">
              {isLoading ? (
                <div className="p-4 text-center text-gray-500">Searching...</div>
              ) : filteredProducts.length > 0 ? (
                <div className="py-2">
                  <div className="px-4 py-2 text-sm font-semibold text-gray-700">
                    {filteredProducts.length} result{filteredProducts.length !== 1 ? "s" : ""} found
                  </div>
                  {filteredProducts.slice(0, 8).map((product) => (
                    <button
                      key={product.id}
                      onClick={() => handleProductClick(product)}
                      className="w-full px-4 py-3 hover:bg-gray-50 flex items-center space-x-4 text-left"
                    >
                      <div className="relative w-16 h-16 flex-shrink-0 bg-gray-100 rounded">
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          fill
                          className="object-cover rounded"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 truncate">{product.name}</h3>
                        <p className="text-sm text-gray-500 truncate">{product.category}</p>
                        <p className="text-sm font-semibold text-primary mt-1">
                          {formatCurrency(product.price)}
                        </p>
                      </div>
                    </button>
                  ))}
                  {filteredProducts.length > 8 && (
                    <div className="px-4 py-2 border-t">
                      <button
                        onClick={handleSubmit}
                        className="w-full text-center text-primary hover:underline font-medium"
                      >
                        View all {filteredProducts.length} results
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-4 text-center text-gray-500">
                  No products found for "{query}"
                </div>
              )}
            </div>
          )}

          {/* Popular Searches */}
          {!query && (
            <div className="mt-4 border-t pt-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-2 px-4">Popular Searches</h3>
              <div className="flex flex-wrap gap-2 px-4">
                {["T-Shirts", "Jeans", "Shoes", "Watches", "Bags", "Electronics"].map((term) => (
                  <button
                    key={term}
                    onClick={() => {
                      setQuery(term);
                      inputRef.current?.focus();
                    }}
                    className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-700"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

