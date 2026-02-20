/**
 * @author Zakaria Tejjani
 * @date 2025-12-10
 */
"use client";

import { useTranslations } from "next-intl";
import {
  IconX,
  IconFilter,
  IconChevronDown,
  IconCheck,
} from "@tabler/icons-react";
import { categories, priceRanges } from "@/data";
import { useState } from "react";

interface ProductFiltersProps {
  selectedCategories: string[];
  selectedPriceRanges: string[];
  selectedBadges: string[];
  inStockOnly: boolean;
  onCategoryChange: (categories: string[]) => void;
  onPriceRangeChange: (ranges: string[]) => void;
  onBadgeChange: (badges: string[]) => void;
  onInStockChange: (inStock: boolean) => void;
  onClearAll: () => void;
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

export default function ProductFilters({
  selectedCategories,
  selectedPriceRanges,
  selectedBadges,
  inStockOnly,
  onCategoryChange,
  onPriceRangeChange,
  onBadgeChange,
  onInStockChange,
  onClearAll,
  isMobileOpen = false,
  onMobileClose,
}: ProductFiltersProps) {
  const t = useTranslations();
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    price: true,
    badges: true,
    availability: true,
  });

  const badges = [
    { id: "new", labelKey: "badges.new" },
    { id: "sale", labelKey: "badges.sale" },
    { id: "bestseller", labelKey: "badges.bestseller" },
  ];

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const toggleCategory = (categoryId: string) => {
    if (selectedCategories.includes(categoryId)) {
      onCategoryChange(selectedCategories.filter((id) => id !== categoryId));
    } else {
      onCategoryChange([...selectedCategories, categoryId]);
    }
  };

  const togglePriceRange = (rangeId: string) => {
    if (selectedPriceRanges.includes(rangeId)) {
      onPriceRangeChange(selectedPriceRanges.filter((id) => id !== rangeId));
    } else {
      onPriceRangeChange([...selectedPriceRanges, rangeId]);
    }
  };

  const toggleBadge = (badgeId: string) => {
    if (selectedBadges.includes(badgeId)) {
      onBadgeChange(selectedBadges.filter((id) => id !== badgeId));
    } else {
      onBadgeChange([...selectedBadges, badgeId]);
    }
  };

  const hasActiveFilters =
    selectedCategories.length > 0 ||
    selectedPriceRanges.length > 0 ||
    selectedBadges.length > 0 ||
    inStockOnly;

  const filterContent = (
    <>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-neutral-200 p-4">
        <div className="flex items-center gap-2">
          <IconFilter size={20} className="text-primary" />
          <h2 className="text-lg font-semibold text-neutral-900">
            {t("shop.filters.title")}
          </h2>
        </div>
        {hasActiveFilters && (
          <button
            onClick={onClearAll}
            className="text-sm font-medium text-primary transition-colors hover:text-primary-dark"
          >
            {t("shop.filters.clearAll")}
          </button>
        )}
      </div>

      <div className="p-4">
        {/* Categories */}
        <div className="mb-6">
          <button
            onClick={() => toggleSection("categories")}
            className="flex w-full items-center justify-between py-2"
          >
            <h3 className="font-semibold text-neutral-900">
              {t("shop.filters.categories")}
            </h3>
            <IconChevronDown
              size={18}
              className={`text-neutral-500 transition-transform ${expandedSections.categories ? "rotate-180" : ""}`}
            />
          </button>
          {expandedSections.categories && (
            <div className="mt-2 space-y-2">
              {categories.map((category) => (
                <label
                  key={category.id}
                  className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-neutral-50"
                >
                  <div
                    className={`flex h-5 w-5 items-center justify-center rounded border-2 transition-colors ${
                      selectedCategories.includes(category.id)
                        ? "border-primary bg-primary text-white"
                        : "border-neutral-300"
                    }`}
                  >
                    {selectedCategories.includes(category.id) && (
                      <IconCheck size={14} />
                    )}
                  </div>
                  <div className={`rounded-lg ${category.color} p-1.5`}>
                    <category.icon size={14} className="text-white" />
                  </div>
                  <span className="text-sm text-neutral-700">
                    {t(category.translationKey)}
                  </span>
                  <input
                    type="checkbox"
                    className="hidden"
                    checked={selectedCategories.includes(category.id)}
                    onChange={() => toggleCategory(category.id)}
                  />
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Price Range */}
        <div className="mb-6">
          <button
            onClick={() => toggleSection("price")}
            className="flex w-full items-center justify-between py-2"
          >
            <h3 className="font-semibold text-neutral-900">
              {t("shop.filters.price.title")}
            </h3>
            <IconChevronDown
              size={18}
              className={`text-neutral-500 transition-transform ${expandedSections.price ? "rotate-180" : ""}`}
            />
          </button>
          {expandedSections.price && (
            <div className="mt-2 space-y-2">
              {priceRanges.map((range) => (
                <label
                  key={range.id}
                  className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-neutral-50"
                >
                  <div
                    className={`flex h-5 w-5 items-center justify-center rounded border-2 transition-colors ${
                      selectedPriceRanges.includes(range.id)
                        ? "border-primary bg-primary text-white"
                        : "border-neutral-300"
                    }`}
                  >
                    {selectedPriceRanges.includes(range.id) && (
                      <IconCheck size={14} />
                    )}
                  </div>
                  <span className="text-sm text-neutral-700">
                    {t(range.labelKey)}
                  </span>
                  <input
                    type="checkbox"
                    className="hidden"
                    checked={selectedPriceRanges.includes(range.id)}
                    onChange={() => togglePriceRange(range.id)}
                  />
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Badges */}
        <div className="mb-6">
          <button
            onClick={() => toggleSection("badges")}
            className="flex w-full items-center justify-between py-2"
          >
            <h3 className="font-semibold text-neutral-900">
              {t("shop.filters.badges")}
            </h3>
            <IconChevronDown
              size={18}
              className={`text-neutral-500 transition-transform ${expandedSections.badges ? "rotate-180" : ""}`}
            />
          </button>
          {expandedSections.badges && (
            <div className="mt-2 space-y-2">
              {badges.map((badge) => (
                <label
                  key={badge.id}
                  className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-neutral-50"
                >
                  <div
                    className={`flex h-5 w-5 items-center justify-center rounded border-2 transition-colors ${
                      selectedBadges.includes(badge.id)
                        ? "border-primary bg-primary text-white"
                        : "border-neutral-300"
                    }`}
                  >
                    {selectedBadges.includes(badge.id) && (
                      <IconCheck size={14} />
                    )}
                  </div>
                  <span className="text-sm text-neutral-700">
                    {t(badge.labelKey)}
                  </span>
                  <input
                    type="checkbox"
                    className="hidden"
                    checked={selectedBadges.includes(badge.id)}
                    onChange={() => toggleBadge(badge.id)}
                  />
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Availability */}
        <div>
          <button
            onClick={() => toggleSection("availability")}
            className="flex w-full items-center justify-between py-2"
          >
            <h3 className="font-semibold text-neutral-900">
              {t("shop.filters.availability")}
            </h3>
            <IconChevronDown
              size={18}
              className={`text-neutral-500 transition-transform ${expandedSections.availability ? "rotate-180" : ""}`}
            />
          </button>
          {expandedSections.availability && (
            <div className="mt-2">
              <label className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-neutral-50">
                <div
                  className={`flex h-5 w-5 items-center justify-center rounded border-2 transition-colors ${
                    inStockOnly
                      ? "border-primary bg-primary text-white"
                      : "border-neutral-300"
                  }`}
                >
                  {inStockOnly && <IconCheck size={14} />}
                </div>
                <span className="text-sm text-neutral-700">
                  {t("shop.filters.inStockOnly")}
                </span>
                <input
                  type="checkbox"
                  className="hidden"
                  checked={inStockOnly}
                  onChange={(e) => onInStockChange(e.target.checked)}
                />
              </label>
            </div>
          )}
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop filters */}
      <aside className="hidden w-72 flex-shrink-0 lg:block">
        <div className="sticky top-24 rounded-2xl bg-white shadow-sm">
          {filterContent}
        </div>
      </aside>

      {/* Mobile filters */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={onMobileClose}
          />
          <div className="absolute inset-y-0 start-0 w-full max-w-sm overflow-y-auto bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-neutral-200 p-4">
              <h2 className="text-lg font-semibold">{t("shop.filters.title")}</h2>
              <button
                onClick={onMobileClose}
                className="rounded-full p-2 text-neutral-500 transition-colors hover:bg-neutral-100"
              >
                <IconX size={20} />
              </button>
            </div>
            {filterContent}
            <div className="sticky bottom-0 border-t border-neutral-200 bg-white p-4">
              <button
                onClick={onMobileClose}
                className="w-full rounded-full bg-primary py-3 font-semibold text-white transition-colors hover:bg-primary-dark"
              >
                {t("shop.filters.apply")}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
