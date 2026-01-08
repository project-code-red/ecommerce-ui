"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { ShoppingCart, Menu, Search, Heart, ChevronRight, ArrowLeft, ChevronDown } from "lucide-react";
import { useUIStore } from "@/store/useUIStore";
import { useCart } from "@/services/queries/cartQueries";
import { useWishlist } from "@/services/queries/wishlistQueries";
import { useAuthStore } from "@/store/useAuthStore";
import { SearchBar } from "@/components/features/product/SearchBar";
import { UserMenu } from "@/components/layout/UserMenu";
import { MegaMenu } from "@/components/layout/MegaMenu";
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

// Category Menu Content Component for unified sidebar
function CategoryMenuContent({ category, onClose }: { category: Category; onClose: () => void }) {
  const [expandedSubCategory, setExpandedSubCategory] = useState<string | null>(null);

  const toggleSubCategory = (slug: string) => {
    setExpandedSubCategory(expandedSubCategory === slug ? null : slug);
  };

  return (
    <>
      {/* Sub Categories */}
      <div className="space-y-1">
        {(category.subCategories || []).map((subCategory) => {
          const subCategorySlug = subCategory.slug || subCategory.name.toLowerCase().replace(/\s+/g, "-");
          const hasSubSubCategories = subCategory.subSubCategories && subCategory.subSubCategories.length > 0;
          const isExpanded = expandedSubCategory === subCategorySlug;

          return (
            <div key={subCategorySlug} className="mb-2">
              {/* Sub Category Header - Clickable to expand/collapse */}
              {hasSubSubCategories ? (
                <>
                  <button
                    onClick={() => toggleSubCategory(subCategorySlug)}
                    className={cn(
                      "w-full flex items-center justify-between py-4 px-4 rounded-xl transition-colors",
                      "font-semibold text-base text-gray-900 text-left",
                      "hover:bg-gray-50 active:bg-gray-100",
                      "min-h-[56px]",
                      isExpanded && "bg-gray-50"
                    )}
                    aria-label={isExpanded ? `Collapse ${subCategory.name}` : `Expand ${subCategory.name}`}
                  >
                    <span>{subCategory.name}</span>
                    <ChevronDown
                      className={cn(
                        "h-5 w-5 text-gray-400 flex-shrink-0 transition-transform duration-200",
                        isExpanded && "rotate-180"
                      )}
                    />
                  </button>

                  {/* Sub-sub Categories - Expanded View */}
                  {isExpanded && (
                    <div className="mt-2 space-y-1">
                      {subCategory.subSubCategories?.map((subSubCategory) => (
                        <Link
                          key={subSubCategory.slug}
                          href={`/categories/${category.slug}/${subCategorySlug}/${subSubCategory.slug}`}
                          onClick={onClose}
                          className={cn(
                            "block py-3 px-4 rounded-lg transition-colors",
                            "text-[15px] font-medium text-gray-700",
                            "hover:text-primary hover:bg-gray-50",
                            "active:bg-gray-100",
                            "min-h-[44px] flex items-center"
                          )}
                        >
                          {subSubCategory.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                // If no sub-subcategories, make it a clickable link
                <Link
                  href={`/categories/${category.slug}/${subCategorySlug}`}
                  onClick={onClose}
                  className={cn(
                    "block py-4 px-4 rounded-xl transition-colors",
                    "font-semibold text-base text-gray-900",
                    "hover:bg-gray-50 active:bg-gray-100",
                    "min-h-[56px] flex items-center"
                  )}
                >
                  {subCategory.name}
                </Link>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}

export function MainNavbar() {
  const {
    mobileMenuOpen,
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

  // Check if we're on home page
  const isHomePage = pathname === "/";
  
  // Check if we're on a product detail page
  const isProductPage = pathname?.startsWith("/products/") && pathname !== "/products";

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

  const goBackToMainMenu = () => {
    setMobileMenuCategory(null);
  };

  const closeMobileMenu = () => {
    toggleMobileMenu();
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
          {/* Mobile Layout: Back + Menu | Logo | Search + Wishlist + Cart */}
          <div className="lg:hidden flex items-center justify-between h-14">
            {/* Left Actions - Back Button + Menu (Mobile) */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {/* Back Button - Show on all pages except home */}
              {!isHomePage && (
                <button
                  onClick={() => router.back()}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="Go back"
                >
                  <ArrowLeft className="h-5 w-5 text-gray-600" />
                </button>
              )}
              
              {/* Mobile Menu Button - Show only on home page */}
              {isHomePage && (
                <button
                  onClick={toggleMobileMenu}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="Menu"
                >
                  <Menu className="h-5 w-5 text-gray-600" />
                </button>
              )}
            </div>

            {/* Logo - Center (Mobile) */}
            <Link
              href="/"
              className="absolute left-1/2 transform -translate-x-1/2 text-lg font-bold text-gray-900 hover:text-primary transition-colors"
            >
              E-Commerce
            </Link>

            {/* Right Actions - Search + Wishlist + Cart (Mobile) */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {/* Search Icon Button - Hide on home page, show on other pages */}
              {!isHomePage && (
                <button
                  onClick={openSearch}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="Search"
                >
                  <Search className="h-5 w-5 text-gray-600" />
                </button>
              )}

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
                      {hasMegaMenu ? (
                        <span
                          className={cn(
                            "group relative text-sm font-medium text-gray-700 transition-colors cursor-pointer",
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
                        </span>
                      ) : (
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
                      )}
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

        {/* Mobile Search Bar - Below main nav (Home page only) */}
        {isHomePage && (
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
            </div>
          </div>
        )}
      </nav>

      {/* Search Bar */}
      <SearchBar isOpen={searchOpen} onClose={closeSearch} />

      {/* Mobile Menu Drawer - Single Unified Sidebar */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 transition-opacity"
            onClick={closeMobileMenu}
          />
          {/* Unified Sidebar */}
          <div className={cn(
            "absolute left-0 top-0 bottom-0 w-full max-w-[85vw] sm:max-w-sm bg-white shadow-xl overflow-y-auto transition-transform duration-300 ease-out",
            mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          )}>
            {/* Conditional Header - Shows back button when viewing category */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-4 flex items-center justify-between z-10 shadow-sm">
              <div className="flex items-center gap-3">
                {mobileMenuCategory && (
                  <button
                    onClick={goBackToMainMenu}
                    className="p-2.5 hover:bg-gray-100 active:bg-gray-200 rounded-lg transition-colors -ml-1 min-w-[44px] min-h-[44px] flex items-center justify-center"
                    aria-label="Back to menu"
                  >
                    <ArrowLeft className="h-6 w-6 text-gray-700" />
                  </button>
                )}
                <h2 className="text-xl font-bold text-gray-900">
                  {mobileMenuCategory ? mobileMenuCategory.name : "Menu"}
                </h2>
              </div>
              <button
                onClick={closeMobileMenu}
                className="p-2.5 hover:bg-gray-100 active:bg-gray-200 rounded-lg transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                aria-label="Close menu"
              >
                <span className="text-2xl text-gray-700 leading-none">×</span>
              </button>
            </div>

            {/* Content - Switches between main menu and category menu */}
            <div className="px-4 py-4">
              {mobileMenuCategory ? (
                /* Category Menu Content */
                <CategoryMenuContent
                  category={mobileMenuCategory}
                  onClose={closeMobileMenu}
                />
              ) : (
                /* Main Menu Content */
                <>
                  {/* Categories */}
                  <div className="space-y-1">
                    {primaryCategories.map((category) => (
                      <button
                        key={category.slug}
                        onClick={() => handleMobileCategoryClick(category)}
                        className={cn(
                          "w-full flex items-center justify-between py-4 px-4 text-left",
                          "hover:bg-gray-50 active:bg-gray-100 rounded-xl transition-colors",
                          "min-h-[56px]"
                        )}
                      >
                        <span className="font-semibold text-base text-gray-900">
                          {category.name}
                        </span>
                        <ChevronRight className="h-5 w-5 text-gray-400 flex-shrink-0" />
                      </button>
                    ))}
                  </div>

                  {/* Other Navigation Items */}
                  <div className="mt-6 pt-6 border-t border-gray-200 space-y-1">
                    {navigationItems
                      .filter((item) => !primaryCategories.some((cat) => cat.slug === item.slug))
                      .map((item) => (
                        <Link
                          key={item.slug}
                          href={item.href}
                          onClick={closeMobileMenu}
                          className={cn(
                            "block py-3 px-4 font-medium text-gray-700 rounded-xl",
                            "hover:bg-gray-50 active:bg-gray-100 transition-colors",
                            "min-h-[44px] flex items-center"
                          )}
                        >
                          {item.name}
                        </Link>
                      ))}
                  </div>

                  {/* Account Section */}
                  {mounted && (
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      {isAuthenticated ? (
                        <Link
                          href="/user/profile"
                          onClick={closeMobileMenu}
                          className="block py-3 px-4 font-medium text-gray-700 hover:bg-gray-50 active:bg-gray-100 rounded-xl transition-colors min-h-[44px] flex items-center"
                        >
                          My Account
                        </Link>
                      ) : (
                        <Link
                          href="/auth/login"
                          onClick={closeMobileMenu}
                          className="block py-3 px-4 font-medium text-primary hover:bg-primary/5 active:bg-primary/10 rounded-xl transition-colors min-h-[44px] flex items-center"
                        >
                          Sign In
                        </Link>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
