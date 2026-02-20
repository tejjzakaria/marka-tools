/**
 * @author Zakaria Tejjani
 * @date 2025-12-10
 */
"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import Link from "next/link";
import Image from "next/image";
import {
  IconSearch,
  IconShoppingCart,
  IconMenu2,
  IconX,
  IconChevronDown,
  IconPackage,
} from "@tabler/icons-react";
import { mainNavigation, getFeaturedCategories, siteConfig } from "@/data";
import { useCart, useTrackOrder } from "@/context";
import CartDrawer from "./CartDrawer";
import LanguageSwitcher, { MobileLanguageSwitcher } from "./LanguageSwitcher";

export default function Header() {
  const t = useTranslations();
  const pathname = usePathname();
  const { totalItems, openCart } = useCart();
  const { openModal } = useTrackOrder();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const featuredCategories = getFeaturedCategories();


  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/shop?search=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Top bar */}
      <div className="bg-primary text-white">
        <div className="container mx-auto flex items-center justify-between px-4 py-2 text-xs sm:text-sm">
          <p className="hidden sm:block">{t("header.freeShippingBanner")}</p>
          <p className="text-xs sm:hidden">{t("header.welcome")}</p>
          <div className="flex items-center gap-4">
            <a
              href={`tel:${siteConfig.contact.phone}`}
              className="transition-colors hover:text-white/80"
            >
              {siteConfig.contact.phone}
            </a>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="border-b border-neutral-100 bg-white shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between gap-4 lg:h-20">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0">
              <Image src="/marka-tools%20logo%20header.png" alt="Marka Tools Logo" width={160} height={80} priority className="h-auto w-[130px] sm:w-[145px] lg:w-[160px]" />
            </Link>

            {/* Search bar - Desktop */}
            <div className="hidden flex-1 items-center justify-center px-4 md:flex lg:px-8">
              <form onSubmit={handleSearch} className="relative w-full max-w-xl">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t("header.searchPlaceholder")}
                  className="h-12 w-full rounded-full border border-neutral-200 bg-neutral-50 pe-4 ps-12 text-sm transition-all placeholder:text-neutral-400 focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
                <button
                  type="submit"
                  className="absolute start-4 top-1/2 -translate-y-1/2 text-neutral-400 transition-colors hover:text-primary"
                >
                  <IconSearch size={20} />
                </button>
              </form>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 lg:gap-4">
              {/* Search icon - Mobile */}
              <button
                onClick={() => setMobileSearchOpen(true)}
                className="rounded-full p-2 text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-primary lg:hidden"
              >
                <IconSearch size={22} />
              </button>

              {/* Track Order */}
              <button
                onClick={openModal}
                className="hidden items-center gap-2 rounded-full border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-700 transition-all hover:border-primary hover:bg-primary/5 hover:text-primary lg:flex"
              >
                <IconPackage size={18} />
                <span>{t("trackOrder.title")}</span>
              </button>

              {/* Track Order - Mobile (icon only) */}
              <button
                onClick={openModal}
                className="rounded-full p-2 text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-primary lg:hidden"
                title={t("trackOrder.title")}
              >
                <IconPackage size={22} />
              </button>

              {/* Language Switcher */}
              <LanguageSwitcher />

              {/* Cart */}
              <button
                onClick={openCart}
                className="relative rounded-full p-2 text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-primary"
              >
                <IconShoppingCart size={22} />
                {totalItems > 0 && (
                  <span className="absolute -end-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-medium text-white">
                    {totalItems > 99 ? "99+" : totalItems}
                  </span>
                )}
              </button>

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="rounded-full p-2 text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-primary lg:hidden"
              >
                {mobileMenuOpen ? <IconX size={24} /> : <IconMenu2 size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Navigation - Desktop */}
        <nav className="hidden border-t border-neutral-100 bg-neutral-50/50 py-2 lg:block">
          <div className="container mx-auto px-4">
            <ul className="flex items-center gap-2">
              {/* Categories dropdown */}
              <li className="relative">
                <button
                  onClick={() => setCategoriesOpen(!categoriesOpen)}
                  onBlur={() => setTimeout(() => setCategoriesOpen(false), 200)}
                  className="flex items-center gap-2 rounded-xl bg-primary/10 px-5 py-2.5 font-semibold text-primary transition-all hover:bg-primary hover:text-white"
                >
                  <span>{t("nav.categories")}</span>
                  <IconChevronDown
                    size={16}
                    className={`transition-transform ${categoriesOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {/* Categories dropdown menu */}
                {categoriesOpen && (
                  <div className="absolute start-0 top-full z-50 mt-2 min-w-72 rounded-2xl border border-neutral-100 bg-white p-3 shadow-2xl">
                    {featuredCategories.map((category) => (
                      <Link
                        key={category.id}
                        href={`/shop?category=${category.id}`}
                        className="flex items-center gap-3 rounded-xl px-4 py-3 text-neutral-700 transition-all hover:bg-primary/5 hover:text-primary"
                      >
                        <div
                          className={`rounded-xl ${category.color} p-2.5 text-white shadow-sm`}
                        >
                          <category.icon size={18} />
                        </div>
                        <span className="font-medium">{t(category.translationKey)}</span>
                      </Link>
                    ))}
                    <div className="mt-2 border-t border-neutral-100 pt-2">
                      <Link
                        href="/shop"
                        className="block rounded-xl px-4 py-2.5 text-center text-sm font-semibold text-primary transition-colors hover:bg-primary/10"
                      >
                        {t("common.viewAll")}
                      </Link>
                    </div>
                  </div>
                )}
              </li>

              {/* Divider */}
              <li className="mx-2 h-6 w-px bg-neutral-200" aria-hidden="true" />

              {mainNavigation.map((item) => (
                <li key={item.id}>
                  <Link
                    href={item.href}
                    className={`relative block rounded-xl px-5 py-2.5 font-medium transition-all ${
                      isActive(item.href)
                        ? "bg-primary text-white shadow-sm"
                        : "text-neutral-600 hover:bg-white hover:text-primary hover:shadow-sm"
                    }`}
                  >
                    {t(item.translationKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </div>

      {/* Cart Drawer */}
      <CartDrawer />

      {/* Mobile Search Modal */}
      {mobileSearchOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 lg:hidden" onClick={() => setMobileSearchOpen(false)}>
          <div className="mx-auto max-w-md bg-white p-4" onClick={(e) => e.stopPropagation()}>
            <form onSubmit={(e) => { handleSearch(e); setMobileSearchOpen(false); }} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t("header.searchPlaceholder")}
                autoFocus
                className="h-12 w-full rounded-full border border-neutral-200 bg-neutral-50 pe-4 ps-12 text-sm transition-all placeholder:text-neutral-400 focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <button
                type="submit"
                className="absolute start-4 top-1/2 -translate-y-1/2 text-neutral-400 transition-colors hover:text-primary"
              >
                <IconSearch size={20} />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 top-[104px] z-40 bg-black/50 lg:hidden" onClick={() => setMobileMenuOpen(false)}>
          <div className="h-full w-full max-w-xs overflow-y-auto bg-white shadow-xl sm:max-w-sm" onClick={(e) => e.stopPropagation()}>
            {/* Mobile search */}
            <div className="border-b border-neutral-100 p-4">
              <form onSubmit={(e) => { handleSearch(e); setMobileMenuOpen(false); }} className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t("header.searchPlaceholder")}
                  className="h-12 w-full rounded-full border border-neutral-200 bg-neutral-50 pe-4 ps-12 text-sm transition-all placeholder:text-neutral-400 focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
                <button
                  type="submit"
                  className="absolute start-4 top-1/2 -translate-y-1/2 text-neutral-400 transition-colors hover:text-primary"
                >
                  <IconSearch size={20} />
                </button>
              </form>
            </div>

            {/* Mobile navigation */}
            <nav className="p-4">
              <ul className="space-y-1">
                {mainNavigation.map((item) => (
                  <li key={item.id}>
                    <Link
                      href={item.href}
                      className={`block rounded-lg px-4 py-3 font-medium transition-colors ${
                        isActive(item.href)
                          ? "bg-primary/10 text-primary"
                          : "text-neutral-700 hover:bg-neutral-50 hover:text-primary"
                      }`}
                    >
                      {t(item.translationKey)}
                    </Link>
                  </li>
                ))}
              </ul>

              {/* Mobile categories */}
              <div className="mt-6">
                <h3 className="mb-3 px-4 text-sm font-semibold text-neutral-500">
                  {t("nav.categories")}
                </h3>
                <ul className="space-y-1">
                  {featuredCategories.map((category) => (
                    <li key={category.id}>
                      <Link
                        href={`/shop?category=${category.id}`}
                        className="flex items-center gap-3 rounded-lg px-4 py-3 text-neutral-700 transition-colors hover:bg-neutral-50 hover:text-primary"
                      >
                        <div
                          className={`rounded-lg ${category.color} p-2 text-white`}
                        >
                          <category.icon size={18} />
                        </div>
                        <span>{t(category.translationKey)}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Mobile language switcher */}
              <div className="mt-6 border-t border-neutral-100 pt-6">
                <MobileLanguageSwitcher />
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
