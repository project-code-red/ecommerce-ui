"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavbarSearchProps {
  className?: string;
}

export function NavbarSearch({ className }: NavbarSearchProps) {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/products?search=${encodeURIComponent(query.trim())}`);
      setQuery("");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn("relative flex-1 max-w-md", className)}
      onClick={() => inputRef.current?.focus()}
    >
      <div
        className={cn(
          "relative flex items-center bg-gray-50 rounded-full border transition-all",
          isFocused
            ? "border-primary bg-white shadow-sm"
            : "border-transparent hover:border-gray-300"
        )}
      >
        <Search className="absolute left-4 h-4 w-4 text-gray-400 pointer-events-none" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Search for products, brands and more"
          className="w-full pl-11 pr-10 py-2.5 bg-transparent border-0 focus:outline-none text-sm text-gray-900 placeholder:text-gray-400"
        />
        {query && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setQuery("");
              inputRef.current?.focus();
            }}
            className="absolute right-3 p-1 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Clear search"
          >
            <X className="h-3.5 w-3.5 text-gray-400" />
          </button>
        )}
      </div>
    </form>
  );
}

