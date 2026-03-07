/**
 * @author Zakaria Tejjani
 * @date 2025-12-10
 */
"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { IconLoader2 } from "@tabler/icons-react";
import {
  ProductFilters,
  ProductGrid,
  Pagination,
  ShopBreadcrumb,
} from "@/components/shop";
import { priceRanges } from "@/data";
import { DBProduct, ProductsResponse } from "@/types/product";

const PRODUCTS_PER_PAGE = 12;

export default function ShopContent() {
  const t = useTranslations();

  // Product state
  const [products, setProducts] = useState<DBProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Filter states
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<string[]>([]);
  const [selectedBadges, setSelectedBadges] = useState<string[]>([]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Get search query and category from URL on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const search = params.get("search");
      if (search) {
        setSearchQuery(search);
      }
      const category = params.get("category");
      if (category) {
        setSelectedCategories([category]);
      }
    }
  }, []);

  // Build query string for API
  const buildQueryString = useCallback(() => {
    const params = new URLSearchParams();

    params.set("page", currentPage.toString());
    params.set("limit", PRODUCTS_PER_PAGE.toString());

    // Search query
    if (searchQuery) {
      params.set("search", searchQuery);
    }

    // Category filter
    if (selectedCategories.length === 1) {
      params.set("category", selectedCategories[0]);
    }

    // Badge filter
    if (selectedBadges.length === 1) {
      params.set("badge", selectedBadges[0]);
    }

    // Stock filter
    if (inStockOnly) {
      params.set("inStock", "true");
    }

    // Price range filter - get min/max from selected ranges
    if (selectedPriceRanges.length > 0) {
      const selectedRanges = priceRanges.filter(r => selectedPriceRanges.includes(r.id));
      if (selectedRanges.length > 0) {
        const minPrice = Math.min(...selectedRanges.map(r => r.min));
        const maxPrice = Math.max(...selectedRanges.map(r => r.max));
        if (minPrice > 0) params.set("minPrice", minPrice.toString());
        if (maxPrice < Infinity) params.set("maxPrice", maxPrice.toString());
      }
    }

    // Sort
    switch (sortBy) {
      case "newest":
        params.set("sort", "newest");
        break;
      case "price-asc":
        params.set("sort", "price");
        params.set("order", "asc");
        break;
      case "price-desc":
        params.set("sort", "price");
        params.set("order", "desc");
        break;
      case "rating":
        params.set("sort", "rating");
        break;
      default:
        params.set("sort", "bestseller");
    }

    return params.toString();
  }, [currentPage, selectedCategories, selectedBadges, inStockOnly, selectedPriceRanges, sortBy, searchQuery]);

  // Fetch products
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const queryString = buildQueryString();
      const response = await fetch(`/api/products?${queryString}`);
      const data: ProductsResponse = await response.json();

      if (data.success) {
        setProducts(data.products);
        setTotalProducts(data.pagination.total);
        setTotalPages(data.pagination.totalPages);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  }, [buildQueryString]);

  // Fetch on mount and when filters change
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Reset page when filters change
  const handleFilterChange = <T,>(setter: React.Dispatch<React.SetStateAction<T>>) => {
    return (value: T) => {
      setter(value);
      setCurrentPage(1);
    };
  };

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSelectedPriceRanges([]);
    setSelectedBadges([]);
    setInStockOnly(false);
    setCurrentPage(1);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <ShopBreadcrumb
        items={[{ labelKey: "shop.title" }]}
      />

      {/* Page title */}
      <div className="animate-fade-in-up mb-8">
        <h1 className="text-3xl font-bold text-neutral-900 lg:text-4xl">
          {searchQuery ? `${t("shop.searchResults")}: "${searchQuery}"` : t("shop.title")}
        </h1>
        <p className="mt-2 text-neutral-600">
          {searchQuery ? `${totalProducts} ${t("shop.productsFound")}` : t("shop.subtitle")}
        </p>
      </div>

      {/* Content */}
      <div className="flex gap-8">
        {/* Filters */}
        <ProductFilters
          selectedCategories={selectedCategories}
          selectedPriceRanges={selectedPriceRanges}
          selectedBadges={selectedBadges}
          inStockOnly={inStockOnly}
          onCategoryChange={handleFilterChange(setSelectedCategories)}
          onPriceRangeChange={handleFilterChange(setSelectedPriceRanges)}
          onBadgeChange={handleFilterChange(setSelectedBadges)}
          onInStockChange={handleFilterChange(setInStockOnly)}
          onClearAll={clearAllFilters}
          isMobileOpen={mobileFiltersOpen}
          onMobileClose={() => setMobileFiltersOpen(false)}
        />

        {/* Product grid */}
        <div className="flex-1">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <IconLoader2 size={40} className="animate-spin text-primary" />
            </div>
          ) : (
            <>
              <ProductGrid
                products={products}
                totalProducts={totalProducts}
                sortBy={sortBy}
                onSortChange={(sort) => {
                  setSortBy(sort);
                  setCurrentPage(1);
                }}
                onOpenFilters={() => setMobileFiltersOpen(true)}
              />

              {/* Pagination */}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
