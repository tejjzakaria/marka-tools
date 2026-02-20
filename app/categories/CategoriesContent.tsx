/**
 * @author Zakaria Tejjani
 * @date 2025-12-11
 */
"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
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
        <section className="bg-gradient-to-br from-primary via-primary to-primary-dark py-16 text-white lg:py-24">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center">
              <div className="mb-6 inline-flex items-center justify-center rounded-2xl bg-white/20 p-4 backdrop-blur-sm">
                <IconCategory size={40} className="text-white" />
              </div>
              <h1 className="mb-4 text-4xl font-bold lg:text-5xl">
                {t("categories.title")}
              </h1>
              <p className="text-lg text-white/90">
                {t("categories.subtitle")}
              </p>
            </div>
          </div>
        </section>

        {/* Categories Grid */}
        <section className="py-12 lg:py-16">
          <div className="container mx-auto px-4">
            {loading ? (
              <div className="flex h-64 items-center justify-center">
                <IconLoader2 size={40} className="animate-spin text-primary" />
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {categories.map((category) => {
                  const Icon = category.icon;
                  const count = getCategoryCount(category.id);

                  return (
                    <Link
                      key={category.id}
                      href={`/shop?category=${category.id}`}
                      className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                    >
                      {/* Background decoration */}
                      <div
                        className={`absolute -end-8 -top-8 h-32 w-32 rounded-full ${category.color} opacity-10 transition-all duration-300 group-hover:scale-110`}
                      />

                      {/* Icon */}
                      <div
                        className={`mb-4 inline-flex h-16 w-16 items-center justify-center rounded-xl ${category.color} bg-opacity-10 text-white transition-all duration-300 group-hover:scale-110`}
                      >
                        <Icon size={32} className={category.color.replace('bg-', 'text-')} />
                      </div>

                      {/* Content */}
                      <div className="relative">
                        <h3 className="mb-2 text-xl font-bold text-neutral-900 transition-colors group-hover:text-primary">
                          {t(category.translationKey)}
                        </h3>

                        <div className="mb-4 flex items-center gap-2 text-sm text-neutral-600">
                          <IconBox size={16} />
                          <span>
                            {count} {t("categories.products")}
                          </span>
                        </div>

                        {/* Arrow */}
                        <div className="flex items-center gap-2 text-sm font-medium text-primary">
                          <span>{t("categories.browse")}</span>
                          <IconArrowRight
                            size={16}
                            className="transition-transform group-hover:translate-x-1"
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
              <div className="rounded-2xl bg-white p-12 text-center shadow-sm">
                <IconCategory size={64} className="mx-auto mb-4 text-neutral-200" />
                <h3 className="mb-2 text-xl font-semibold text-neutral-700">
                  {t("categories.noCategories")}
                </h3>
                <p className="text-neutral-500">
                  {t("categories.noCategoriesDesc")}
                </p>
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-white py-12">
          <div className="container mx-auto px-4">
            <div className="rounded-2xl bg-gradient-to-br from-secondary via-secondary to-[#2a8e86] p-8 text-center text-white lg:p-12">
              <h2 className="mb-4 text-3xl font-bold">
                {t("categories.ctaTitle")}
              </h2>
              <p className="mb-6 text-lg text-white/90">
                {t("categories.ctaSubtitle")}
              </p>
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 font-semibold text-secondary transition-all hover:-translate-y-0.5 hover:shadow-lg"
              >
                {t("categories.shopAll")}
                <IconArrowRight size={20} />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
