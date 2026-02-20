/**
 * @author Zakaria Tejjani
 * @date 2025-12-10
 */
"use client";
import { useRTL } from "@/hooks/useRTL";

import { useTranslations } from "next-intl";
import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";
import { categories } from "@/data";

export default function CategoryShowcase() {
  const t = useTranslations();
  const isRTL = useRTL();

  // Take first 4 categories for the showcase
  const showcaseCategories = categories.slice(0, 4);

  return (
    <section className="py-16 lg:py-24">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-neutral-900 lg:text-4xl">
            {t("sections.categories.title")}
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-neutral-600">
            {t("sections.categories.subtitle")}
          </p>
        </div>

        {/* Categories grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {showcaseCategories.map((category, index) => (
            <a
              key={category.id}
              href={`/shop?category=${category.id}`}
              className="group relative overflow-hidden rounded-3xl"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Background with gradient overlay */}
              <div className="aspect-[4/5] w-full">
                <div
                  className={`absolute inset-0 ${category.color} opacity-90 transition-opacity group-hover:opacity-100`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                {/* Decorative pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div
                    className="h-full w-full"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    }}
                  />
                </div>

                {/* Icon */}
                <div className="absolute start-6 top-6">
                  <div className="rounded-2xl bg-white/20 p-4 backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
                    <category.icon size={32} className="text-white" />
                  </div>
                </div>

                {/* Content */}
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <h3 className="mb-2 text-2xl font-bold text-white">
                    {t(category.translationKey)}
                  </h3>
                  <div className="flex items-center gap-2 text-white/80 transition-colors group-hover:text-white">
                    <span className="text-sm font-medium">
                      {t("common.shopNow")}
                    </span>
                    {isRTL ? (
                      <IconArrowLeft
                        size={16}
                        className="transition-transform group-hover:-translate-x-1"
                      />
                    ) : (
                      <IconArrowRight
                        size={16}
                        className="transition-transform group-hover:translate-x-1"
                      />
                    )}
                  </div>
                </div>

                {/* Hover effect circle */}
                <div className="absolute -end-20 -top-20 h-40 w-40 rounded-full bg-white/10 transition-transform duration-500 group-hover:scale-150" />
              </div>
            </a>
          ))}
        </div>

        {/* View all button */}
        <div className="mt-12 text-center">
          <a
            href="/categories"
            className="inline-flex items-center gap-2 rounded-full border-2 border-neutral-200 bg-white px-8 py-4 font-semibold text-neutral-700 transition-all hover:-translate-y-0.5 hover:border-primary hover:text-primary hover:shadow-lg"
          >
            {t("sections.categories.viewAll")}
            {isRTL ? <IconArrowLeft size={18} /> : <IconArrowRight size={18} />}
          </a>
        </div>
      </div>
    </section>
  );
}
