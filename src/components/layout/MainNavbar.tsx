"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { ShoppingCart, Menu, Search, Heart } from "lucide-react";
import { useUIStore } from "@/store/useUIStore";
import { useCart } from "@/services/queries/cartQueries";
import { useWishlist } from "@/services/queries/wishlistQueries";
import { useAuthStore } from "@/store/useAuthStore";
import { SearchBar } from "@/components/features/product/SearchBar";
import { UserMenu } from "@/components/layout/UserMenu";
import { MegaMenu } from "@/components/layout/MegaMenu";
import { MegaMenuMobile } from "@/components/layout/MegaMenuMobile";
import { TopBar } from "@/components/layout/TopBar";
import { NavbarSearch } from "@/components/layout/NavbarSearch";
import { categories } from "@/mock/categories";
import { Category } from "@/types/category";
import { cn } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";

// Navigation items matching Nykaa style
const navigationItems = [
  { name: "Women", slug: "women", href: "/categories/women" },
  { name: "Men", slug: "men", href: "/categories/men" },
  { name: "Kids", slug: "kids", href: "/categories/kids" },
  { name: "Home", slug: "home", href: "/categories/home-kitchen" },
  { name: "All Brands", slug: "brands", href: "/brands" },
  { name: "More", slug: "more", href: "#", hasDropdown: true },
];

// Primary navigation categories (filter from all categories)
const primaryCategories = categories.filter((cat) =>
  ["men", "women", "kids", "home-kitchen"].includes(cat.slug)
);

export function MainNavbar() {
  const {
    toggleMobileMenu,
    openCartDrawer,
    searchOpen,
    openSearch,
    closeSearch,
  } = useUIStore();
  const { data: cart } = useCart();
  const { data: wishlist } = useWishlist();
  const { isAuthenticated } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);
  const [mobileMenuCategory, setMobileMenuCategory] = useState<Category | null>(
    null
  );
  const navRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const clickCooldownRef = useRef<number>(0);
  const router = useRouter();

  const pathname = usePathname();
  const itemCount =
    cart?.items.reduce((sum, item) => sum + item.quantity, 0) || 0;
  const wishlistCount = wishlist?.length || 0;

  // Check if a category is active based on pathname
  const isCategoryActive = (slug: string) => {
    return pathname?.startsWith(`/categories/${slug}`);
  };

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Close mega menu function - defined early so it can be used in effects
  const closeMegaMenu = useCallback(() => {
    // Clear any pending timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    // Set cooldown to prevent immediate reopening
    clickCooldownRef.current = Date.now();
    // Close immediately
    setActiveMegaMenu(null);
  }, []);

  // Close mega menu when pathname changes (navigation occurred)
  useEffect(() => {
    // Close menu immediately when pathname changes
    setActiveMegaMenu(null);
    // Also clear any pending timeouts
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, [pathname]);

  // Close mega menu when clicking anywhere outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      // Check if click is outside navbar and mega menu
      if (
        navRef.current &&
        !navRef.current.contains(target) &&
        !target.closest("[data-mega-menu]")
      ) {
        closeMegaMenu();
      }
    };

    if (activeMegaMenu) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [activeMegaMenu, closeMegaMenu]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleCategoryHover = (categorySlug: string) => {
    // Don't open if we just clicked (cooldown period)
    const now = Date.now();
    if (now - clickCooldownRef.current < 300) {
      return; // Prevent reopening immediately after click
    }

    // Clear any pending close timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setActiveMegaMenu(categorySlug);
  };

  const handleCategoryLeave = () => {
    // Delay to allow moving from navbar to mega menu
    timeoutRef.current = setTimeout(() => {
      setActiveMegaMenu(null);
    }, 200);
  };

  const handleMegaMenuEnter = () => {
    // Clear timeout when entering mega menu
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const handleMegaMenuLeave = () => {
    // Close immediately when leaving mega menu
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setActiveMegaMenu(null);
  };

  const handleMobileCategoryClick = (category: Category) => {
    setMobileMenuCategory(category);
  };

  const closeMobileMegaMenu = () => {
    setMobileMenuCategory(null);
  };

  // Calculate mega menu position based on category index
  const getMegaMenuPosition = (
    index: number,
    total: number
  ): "left" | "center" | "right" => {
    if (index === 0) return "left";
    if (index === total - 1) return "right";
    return "center";
  };

  // Show a placeholder during SSR
  if (!mounted) {
    return (
      <>
        <TopBar variant="static" dismissible={false} />
        <nav className="sticky top-0 md:top-[36px] z-50 bg-white border-b border-gray-200 shadow-sm">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <Link href="/" className="text-xl font-bold text-gray-900">
                E-Commerce
              </Link>
              <div className="hidden lg:flex items-center space-x-8">
                {navigationItems.slice(0, 3).map((item) => (
                  <Link
                    key={item.slug}
                    href={item.href}
                    className="text-sm font-medium text-gray-700 hover:text-primary transition-colors"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-64 h-10 bg-gray-50 rounded-full" />
                <div className="w-8 h-8 rounded-full bg-gray-100" />
                <div className="w-8 h-8 rounded-full bg-gray-100" />
              </div>
            </div>
          </div>
        </nav>
      </>
    );
  }

  return (
    <>
      <TopBar variant="static" dismissible={false} />
      <nav
        ref={navRef}
        className="sticky top-0 md:top-[36px] z-50 bg-white border-b border-gray-200 shadow-sm"
      >
        {/* Main Navbar Row */}
        <div className="px-4 sm:px-6 lg:px-8">
          {/* Mobile Layout: Menu | Logo | Wishlist + Cart */}
          <div className="lg:hidden flex items-center justify-between h-14">
            {/* Mobile Menu Button - Left */}
            <button
              onClick={toggleMobileMenu}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
              aria-label="Menu"
            >
              <Menu className="h-5 w-5 text-gray-600" />
            </button>

            {/* Logo - Center (Mobile) */}
            <Link
              href="/"
              className="absolute left-1/2 transform -translate-x-1/2 text-lg font-bold text-gray-900 hover:text-primary transition-colors"
            >
              E-Commerce
            </Link>

            {/* Right Actions - Wishlist + Cart (Mobile) */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {/* Wishlist */}
              <Link
                href="/user/wishlist"
                className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Wishlist"
              >
                <Heart className="h-5 w-5 text-gray-600" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-primary text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center min-w-[16px] text-[10px]">
                    {wishlistCount > 9 ? "9+" : wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <button
                onClick={openCartDrawer}
                className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Shopping cart"
              >
                <ShoppingCart className="h-5 w-5 text-gray-600" />
                {itemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-primary text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center min-w-[16px] text-[10px]">
                    {itemCount > 9 ? "9+" : itemCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden lg:flex items-center justify-between h-16 gap-4">
            {/* Logo - Left (Desktop) */}
            <Link
              href="/"
              className="text-xl md:text-2xl font-bold text-gray-900 hover:text-primary transition-colors flex-shrink-0"
            >
              E-Commerce
            </Link>

            {/* Center Navigation - Desktop */}
            <div className="flex items-center justify-center flex-1 px-8">
              <nav className="flex items-center space-x-8">
                {navigationItems.map((item, index) => {
                  const category = primaryCategories.find(
                    (c) => c.slug === item.slug
                  );
                  // Only show mega menu on hover, not just because we're on a category page
                  const isHovered = activeMegaMenu === item.slug;
                  const isActive = isCategoryActive(item.slug);
                  const hasMegaMenu =
                    category && category.subCategories.length > 0;

                  return (
                    <div
                      key={item.slug}
                      className="relative"
                      onMouseEnter={() =>
                        hasMegaMenu && handleCategoryHover(item.slug)
                      }
                      onMouseLeave={
                        hasMegaMenu ? handleCategoryLeave : undefined
                      }
                    >
                      <Link
                        href={item.href}
                        onClick={(e) => {
                          e.stopPropagation();
                          closeMegaMenu();
                        }}
                        className={cn(
                          "group relative text-sm font-medium text-gray-700 transition-colors",
                          "hover:text-primary",
                          isActive && "text-primary"
                        )}
                      >
                        <span className="relative inline-block py-2">
                          {item.name}
                          {/* Hover/Active Underline Animation */}
                          <span
                            className={cn(
                              "absolute bottom-0 left-0 right-0 h-0.5 bg-primary transform origin-left transition-transform duration-300",
                              isActive
                                ? "scale-x-100"
                                : "scale-x-0 group-hover:scale-x-100"
                            )}
                          />
                        </span>
                      </Link>
                      {/* Only show mega menu when hovered, not just because we're on the category page */}
                      {hasMegaMenu && isHovered && category && (
                        <MegaMenu
                          category={category}
                          isOpen={isHovered}
                          onClose={closeMegaMenu}
                          onMouseEnter={handleMegaMenuEnter}
                          onMouseLeave={handleMegaMenuLeave}
                          position={getMegaMenuPosition(
                            index,
                            navigationItems.length
                          )}
                        />
                      )}
                    </div>
                  );
                })}
              </nav>
            </div>

            {/* Right Side Actions - Desktop */}
            <div className="flex items-center gap-4 flex-shrink-0">
              {/* Search Bar - Pill Shaped */}
              <div className="flex-1 max-w-md">
                <NavbarSearch />
              </div>

              {/* Account */}
              {mounted && isAuthenticated ? (
                <UserMenu />
              ) : mounted && !isAuthenticated ? (
                <Link
                  href="/auth/login"
                  className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary transition-colors"
                >
                  Account
                </Link>
              ) : null}

              {/* Wishlist */}
              <Link
                href="/user/wishlist"
                className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Wishlist"
              >
                <Heart className="h-5 w-5 text-gray-600" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-primary text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center min-w-[16px] text-[10px]">
                    {wishlistCount > 9 ? "9+" : wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <button
                onClick={openCartDrawer}
                className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Shopping cart"
              >
                <ShoppingCart className="h-5 w-5 text-gray-600" />
                {itemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-primary text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center min-w-[16px] text-[10px]">
                    {itemCount > 9 ? "9+" : itemCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Search Bar - Below main nav */}
        <div className="lg:hidden border-t border-gray-100 px-4 py-2.5">
          <div
            onClick={openSearch}
            className="w-full flex items-center gap-3 px-4 py-2.5 bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors cursor-pointer"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                openSearch();
              }
            }}
            aria-label="Search"
          >
            <Search className="h-5 w-5 text-gray-400 flex-shrink-0" />
            <span className="text-sm text-gray-500 flex-1">
              Search for styles, brands & more
            </span>
            <div className="h-5 w-px bg-gray-300 mx-2" />
            <div
              className="p-1 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                // Handle visual search here if needed
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  e.stopPropagation();
                  // Handle visual search here if needed
                }
              }}
              role="button"
              tabIndex={0}
              aria-label="Visual search"
            >
              <svg
                className="h-5 w-5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
          </div>
        </div>
      </nav>

      {/* Search Bar */}
      <SearchBar isOpen={searchOpen} onClose={closeSearch} />

      {/* Mobile Mega Menu */}
      {mobileMenuCategory && (
        <MegaMenuMobile
          category={mobileMenuCategory}
          isOpen={!!mobileMenuCategory}
          onClose={closeMobileMegaMenu}
        />
      )}
    </>
  );
}
