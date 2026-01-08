"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Search, X, ArrowLeft } from "lucide-react";
import { useProducts } from "@/services/queries/productQueries";
import { Product } from "@/types/product";
import { formatCurrency, getProductUrl, cn } from "@/lib/utils";
import Image from "next/image";

interface SearchBarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchBar({ isOpen, onClose }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const { data: searchResults, isLoading } = useProducts(
    undefined,
    1,
    1000
  );

  // Generate search suggestions from products
  const getSearchSuggestions = () => {
    if (!query.trim() || !searchResults?.data) return [];
    
    const queryLower = query.toLowerCase();
    const suggestions = new Set<string>();
    
    searchResults.data.forEach((product) => {
      // Add category matches
      if (product.category.toLowerCase().includes(queryLower)) {
        suggestions.add(product.category);
      }
      // Add subcategory matches
      if (product.subCategory.toLowerCase().includes(queryLower)) {
        suggestions.add(product.subCategory);
      }
      // Add product name matches (first few words)
      const nameWords = product.name.split(' ').slice(0, 3).join(' ');
      if (product.name.toLowerCase().includes(queryLower)) {
        suggestions.add(nameWords);
      }
    });
    
    return Array.from(suggestions).slice(0, 10);
  };

  // Filter products based on search query
  const filteredProducts = searchResults?.data.filter(
    (product) =>
      product.name.toLowerCase().includes(query.toLowerCase()) ||
      product.description.toLowerCase().includes(query.toLowerCase()) ||
      product.category.toLowerCase().includes(query.toLowerCase()) ||
      product.subCategory.toLowerCase().includes(query.toLowerCase())
  ) || [];

  const suggestions = getSearchSuggestions();
  const showSuggestions = query && suggestions.length > 0 && filteredProducts.length === 0;

  const handleProductClick = useCallback((product: Product) => {
    router.push(getProductUrl(product.slug, product.id));
    onClose();
    setQuery("");
  }, [router, onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/products?search=${encodeURIComponent(query.trim())}`);
      onClose();
      setQuery("");
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    inputRef.current?.focus();
  };

  // Close on outside click (desktop only)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      // Only add click outside for desktop
      if (window.innerWidth >= 768) {
        document.addEventListener("mousedown", handleClickOutside);
      }
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

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!query) return;
      
      const totalItems = showSuggestions ? suggestions.length : filteredProducts.length;
      
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev < totalItems - 1 ? prev + 1 : prev));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
      } else if (e.key === "Enter" && selectedIndex >= 0) {
        e.preventDefault();
        if (showSuggestions) {
          setQuery(suggestions[selectedIndex]);
          setSelectedIndex(-1);
        } else {
          handleProductClick(filteredProducts[selectedIndex]);
        }
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [query, selectedIndex, suggestions, filteredProducts, showSuggestions, isOpen, handleProductClick]);

  // Reset selected index when query changes
  useEffect(() => {
    setSelectedIndex(-1);
  }, [query]);

  if (!isOpen) return null;

  return (
    <>
      {/* Mobile: Full Screen */}
      <div className="md:hidden fixed inset-0 z-50 bg-white">
        <div ref={searchRef} className="h-full flex flex-col">
          {/* Mobile Header */}
          <div className="flex items-center px-4 py-3 border-b border-gray-200 bg-gray-50">
            <button
              onClick={onClose}
              className="p-2 -ml-2 text-gray-600 hover:text-gray-900 transition-colors"
              aria-label="Go back"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <form onSubmit={handleSubmit} className="flex-1 flex items-center ml-2">
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedIndex(-1);
                }}
                onFocus={() => setIsFocused(true)}
                placeholder="Search for brands & products"
                className="flex-1 px-3 py-2 bg-transparent border-0 focus:outline-none text-gray-900 placeholder:text-gray-400 text-sm"
              />
              <button
                type="submit"
                className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
                aria-label="Search"
              >
                <Search className="h-5 w-5" />
              </button>
            </form>
          </div>

          {/* Mobile Content */}
          <div className="flex-1 overflow-y-auto">
            {/* Search Suggestions */}
            {showSuggestions && (
              <div className="py-2">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={suggestion}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className={cn(
                      "w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors",
                      selectedIndex === index && "bg-gray-50"
                    )}
                  >
                    <span className="text-gray-900">{suggestion}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Search Results */}
            {query && !showSuggestions && (
              <div className="py-2">
                {isLoading ? (
                  <div className="p-4 text-center text-gray-500">Searching...</div>
                ) : filteredProducts.length > 0 ? (
                  <>
                    <div className="px-4 py-2 text-sm font-semibold text-gray-700 border-b">
                      {filteredProducts.length} result{filteredProducts.length !== 1 ? "s" : ""} found
                    </div>
                    {filteredProducts.slice(0, 10).map((product, index) => (
                      <button
                        key={product.id}
                        onClick={() => handleProductClick(product)}
                        className={cn(
                          "w-full px-4 py-3 hover:bg-gray-50 flex items-center space-x-4 text-left border-b border-gray-100",
                          selectedIndex === index && "bg-gray-50"
                        )}
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
                    {filteredProducts.length > 10 && (
                      <div className="px-4 py-3 border-t">
                        <button
                          onClick={handleSubmit}
                          className="w-full text-center text-primary hover:text-pink-600 font-medium"
                        >
                          View all {filteredProducts.length} results
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="p-4 text-center text-gray-500">
                    No products found for "{query}"
                  </div>
                )}
              </div>
            )}

            {/* Popular Searches */}
            {!query && (
              <div className="px-4 py-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-4">Popular Searches</h3>
                <div className="flex flex-wrap gap-2">
                  {["T-Shirts", "Jeans", "Shoes", "Watches", "Bags", "Electronics", "Men", "Women", "Kids"].map((term) => (
                    <button
                      key={term}
                      onClick={() => {
                        setQuery(term);
                        inputRef.current?.focus();
                      }}
                      className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-700"
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

      {/* Desktop: Modal Overlay */}
      <div className="hidden md:block fixed inset-0 z-50 bg-black/50" onClick={onClose}>
        <div
          ref={searchRef}
          className="absolute top-0 left-0 right-0 bg-white shadow-xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="max-w-4xl mx-auto px-6 py-5">
            <form onSubmit={handleSubmit} className="relative">
              <div className="flex items-center">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => {
                      setQuery(e.target.value);
                      setSelectedIndex(-1);
                    }}
                    onFocus={() => setIsFocused(true)}
                    placeholder="Search for products, brands, categories..."
                    className="w-full pl-12 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-gray-900 bg-white text-base"
                  />
                  {query && (
                    <button
                      type="button"
                      onClick={() => {
                        setQuery("");
                        setSelectedIndex(-1);
                        inputRef.current?.focus();
                      }}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  )}
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="ml-4 px-4 py-3 text-gray-600 hover:text-gray-800 font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>

            {/* Desktop Search Suggestions Dropdown */}
            {showSuggestions && (
              <div ref={resultsRef} className="mt-2 border-t border-gray-200 bg-white rounded-b-lg shadow-lg">
                <div className="py-2">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={suggestion}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className={cn(
                        "w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors",
                        selectedIndex === index && "bg-gray-50"
                      )}
                    >
                      <span className="text-gray-900">{suggestion}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Desktop Search Results */}
            {query && !showSuggestions && (
              <div ref={resultsRef} className="mt-4 max-h-[60vh] overflow-y-auto border-t border-gray-200">
                {isLoading ? (
                  <div className="p-6 text-center text-gray-500">Searching...</div>
                ) : filteredProducts.length > 0 ? (
                  <div className="py-2">
                    <div className="px-4 py-3 text-sm font-semibold text-gray-700 border-b">
                      {filteredProducts.length} result{filteredProducts.length !== 1 ? "s" : ""} found
                    </div>
                    <div className="grid grid-cols-1 gap-0">
                      {filteredProducts.slice(0, 8).map((product, index) => (
                        <button
                          key={product.id}
                          onClick={() => handleProductClick(product)}
                          className={cn(
                            "w-full px-4 py-4 hover:bg-gray-50 flex items-center space-x-4 text-left border-b border-gray-100 transition-colors",
                            selectedIndex === index && "bg-gray-50"
                          )}
                        >
                          <div className="relative w-20 h-20 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                            <Image
                              src={product.images[0]}
                              alt={product.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-gray-900 text-base mb-1">{product.name}</h3>
                            <p className="text-sm text-gray-500 mb-1">{product.category}</p>
                            <p className="text-base font-semibold text-primary">
                              {formatCurrency(product.price)}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                    {filteredProducts.length > 8 && (
                      <div className="px-4 py-3 border-t">
                        <button
                          onClick={handleSubmit}
                          className="w-full text-center text-primary hover:text-pink-600 font-medium"
                        >
                          View all {filteredProducts.length} results
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-6 text-center text-gray-500">
                    No products found for "{query}"
                  </div>
                )}
              </div>
            )}

            {/* Desktop Popular Searches */}
            {!query && (
              <div className="mt-6 border-t border-gray-200 pt-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-4">Popular Searches</h3>
                <div className="flex flex-wrap gap-2">
                  {["T-Shirts", "Jeans", "Shoes", "Watches", "Bags", "Electronics", "Men", "Women", "Kids"].map((term) => (
                    <button
                      key={term}
                      onClick={() => {
                        setQuery(term);
                        inputRef.current?.focus();
                      }}
                      className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-700 transition-colors"
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
    </>
  );
}

