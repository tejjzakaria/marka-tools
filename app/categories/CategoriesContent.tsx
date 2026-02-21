/**
 * @author Zakaria Tejjani
 * @date 2025-12-11
 */
"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import Image from "next/image";
import {
  IconArrowRight,
  IconLoader2,
  IconCategory,
  IconBox,
} from "@tabler/icons-react";
import { categories } from "@/data/categories";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function CategoriesContent() {
  const t = useTranslations();
  const [productCounts, setProductCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const response = await fetch("/api/categories");
        const data = await response.json();

        if (data.success) {
          setProductCounts(data.counts);
        }
      } catch (error) {
        console.error("Error fetching category counts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCounts();
  }, []);

  const getCategoryCount = (categoryId: string) => {
    return productCounts[categoryId] || 0;
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-neutral-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary via-primary to-primary-dark py-10 text-white lg:py-24">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center">
              <div className="mb-4 inline-flex items-center justify-center rounded-2xl bg-white/20 p-3 backdrop-blur-sm sm:mb-6 sm:p-4">
                <IconCategory size={28} className="text-white sm:size-10" />
              </div>
              <h1 className="mb-3 text-2xl font-bold sm:text-3xl lg:mb-4 lg:text-5xl">
                {t("categories.title")}
              </h1>
              <p className="text-sm text-white/90 sm:text-lg">
                {t("categories.subtitle")}
              </p>
            </div>
          </div>
        </section>

        {/* Categories Grid */}
        <section className="py-8 lg:py-16">
          <div className="container mx-auto px-4">
            {loading ? (
              <div className="flex h-64 items-center justify-center">
                <IconLoader2 size={40} className="animate-spin text-primary" />
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
                {categories.map((category) => {
                  const Icon = category.icon;
                  const count = getCategoryCount(category.id);

                  return (
                    <Link
                      key={category.id}
                      href={`/shop?category=${category.id}`}
                      className="group relative overflow-hidden rounded-2xl bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                    >
                      {/* Category image or icon header */}
                      {category.image ? (
                        <div className="relative aspect-[4/3] w-full overflow-hidden">
                          <Image
                            src={category.image}
                            alt={t(category.translationKey)}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                          />
                        </div>
                      ) : (
                        <div className="relative h-24 sm:h-32 overflow-hidden">
                          <div className={`absolute -end-8 -top-8 h-32 w-32 rounded-full ${category.color} opacity-10 transition-all duration-300 group-hover:scale-110`} />
                          <div className="flex h-full items-center justify-center">
                            <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl sm:h-16 sm:w-16 ${category.color} bg-opacity-10 transition-all duration-300 group-hover:scale-110`}>
                              <Icon size={24} className={`sm:size-8 ${category.color.replace('bg-', 'text-')}`} />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Content */}
                      <div className="p-3 sm:p-5">
                        <h3 className="mb-1 text-sm font-bold text-neutral-900 transition-colors group-hover:text-primary sm:mb-2 sm:text-lg">
                          {t(category.translationKey)}
                        </h3>

                        <div className="mb-2 flex items-center gap-1.5 text-xs text-neutral-500 sm:mb-3 sm:gap-2 sm:text-sm">
                          <IconBox size={14} className="sm:size-4" />
                          <span>
                            {count} {t("categories.products")}
                          </span>
                        </div>

                        {/* Arrow */}
                        <div className="flex items-center gap-1 text-xs font-medium text-primary sm:gap-2 sm:text-sm">
                          <span>{t("categories.browse")}</span>
                          <IconArrowRight
                            size={14}
                            className="sm:size-4 transition-transform group-hover:translate-x-1"
                          />
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}

            {/* Empty State */}
            {!loading && categories.length === 0 && (
              <div className="rounded-2xl bg-white p-8 text-center shadow-sm sm:p-12">
                <IconCategory size={48} className="mx-auto mb-4 text-neutral-200 sm:size-16" />
                <h3 className="mb-2 text-lg font-semibold text-neutral-700 sm:text-xl">
                  {t("categories.noCategories")}
                </h3>
                <p className="text-sm text-neutral-500 sm:text-base">
                  {t("categories.noCategoriesDesc")}
                </p>
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-white py-8 sm:py-12">
          <div className="container mx-auto px-4">
            <div className="rounded-2xl bg-gradient-to-br from-secondary via-secondary to-[#2a8e86] p-6 text-center text-white sm:p-8 lg:p-12">
              <h2 className="mb-3 text-xl font-bold sm:mb-4 sm:text-3xl">
                {t("categories.ctaTitle")}
              </h2>
              <p className="mb-5 text-sm text-white/90 sm:mb-6 sm:text-lg">
                {t("categories.ctaSubtitle")}
              </p>
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-secondary transition-all hover:-translate-y-0.5 hover:shadow-lg sm:px-8 sm:py-4 sm:text-base"
              >
                {t("categories.shopAll")}
                <IconArrowRight size={18} className="sm:size-5" />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
