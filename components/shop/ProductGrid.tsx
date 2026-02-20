/**
 * @author Zakaria Tejjani
 * @date 2025-12-10
 */
"use client";

import { useTranslations } from "next-intl";
import {
  IconLayoutGrid,
  IconLayoutList,
  IconChevronDown,
  IconFilter,
} from "@tabler/icons-react";
import { sortOptions } from "@/data";
import { DBProduct } from "@/types/product";
import ProductCard from "./ProductCard";
import { useState } from "react";

interface ProductGridProps {
  products: DBProduct[];
  totalProducts: number;
  sortBy: string;
  onSortChange: (sort: string) => void;
  onOpenFilters: () => void;
}

export default function ProductGrid({
  products,
  totalProducts,
  sortBy,
  onSortChange,
  onOpenFilters,
}: ProductGridProps) {
  const t = useTranslations();
  const [view, setView] = useState<"grid" | "list">("grid");
  const [sortOpen, setSortOpen] = useState(false);

  const currentSort = sortOptions.find((s) => s.id === sortBy);

  return (
    <div className="flex-1">
      {/* Toolbar */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-white p-4 shadow-sm">
        <div className="flex items-center gap-4">
          {/* Mobile filter button */}
          <button
            onClick={onOpenFilters}
            className="flex items-center gap-2 rounded-full border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-700 transition-colors hover:border-primary hover:text-primary lg:hidden"
          >
            <IconFilter size={18} />
            {t("shop.filters.title")}
          </button>

          {/* Results count */}
          <p className="text-sm text-neutral-600">
            {t("shop.showingResults", { count: totalProducts })}
          </p>
        </div>

        <div className="flex items-center gap-4">
          {/* Sort dropdown */}
          <div className="relative">
            <button
              onClick={() => setSortOpen(!sortOpen)}
              onBlur={() => setTimeout(() => setSortOpen(false), 200)}
              className="flex items-center gap-2 rounded-full border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-700 transition-colors hover:border-primary"
            >
              <span>{t("shop.sortBy")}:</span>
              <span className="text-primary">
                {currentSort ? t(currentSort.labelKey) : ""}
              </span>
              <IconChevronDown
                size={16}
                className={`transition-transform ${sortOpen ? "rotate-180" : ""}`}
              />
            </button>

            {sortOpen && (
              <div className="absolute end-0 top-full z-10 mt-2 min-w-48 rounded-xl border border-neutral-100 bg-white py-2 shadow-xl">
                {sortOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => {
                      onSortChange(option.id);
                      setSortOpen(false);
                    }}
                    className={`block w-full px-4 py-2 text-start text-sm transition-colors hover:bg-neutral-50 ${
                      sortBy === option.id
                        ? "font-medium text-primary"
                        : "text-neutral-700"
                    }`}
                  >
                    {t(option.labelKey)}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* View toggle */}
          <div className="hidden items-center gap-1 rounded-full border border-neutral-200 p-1 sm:flex">
            <button
              onClick={() => setView("grid")}
              className={`rounded-full p-2 transition-colors ${
                view === "grid"
                  ? "bg-primary text-white"
                  : "text-neutral-500 hover:text-primary"
              }`}
            >
              <IconLayoutGrid size={18} />
            </button>
            <button
              onClick={() => setView("list")}
              className={`rounded-full p-2 transition-colors ${
                view === "list"
                  ? "bg-primary text-white"
                  : "text-neutral-500 hover:text-primary"
              }`}
            >
              <IconLayoutList size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Products */}
      {products.length > 0 ? (
        <div
          className={
            view === "grid"
              ? "grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4"
              : "space-y-4"
          }
        >
          {products.map((product, index) => (
            <div
              key={product._id}
              className="animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <ProductCard product={product} view={view} />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-2xl bg-white py-16">
          <div className="mb-4 rounded-full bg-neutral-100 p-6">
            <IconFilter size={32} className="text-neutral-400" />
          </div>
          <h3 className="mb-2 text-lg font-semibold text-neutral-900">
            {t("shop.noProducts")}
          </h3>
          <p className="text-neutral-600">{t("shop.noProductsDescription")}</p>
        </div>
      )}
    </div>
  );
}
