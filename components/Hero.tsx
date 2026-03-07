/**
 * @author Zakaria Tejjani
 * @date 2025-12-10
 */
"use client";

import { useTranslations } from "next-intl";
import { IconArrowLeft, IconArrowRight, IconSparkles } from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import { useRTL } from "@/hooks/useRTL";
import { getFeaturedCategories, heroStats, heroFeatures } from "@/data";

export default function Hero() {
  const t = useTranslations();
  const isRTL = useRTL();
  const featuredCategories = getFeaturedCategories();

  return (
    <section className="relative overflow-hidden bg-gradient-to-bl from-neutral-50 via-white to-neutral-100">
      {/* Animated background elements */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="animate-blob absolute -start-20 top-20 h-72 w-72 rounded-full bg-primary/10 mix-blend-multiply blur-3xl" />
        <div className="animate-blob animation-delay-2000 absolute -end-20 top-40 h-72 w-72 rounded-full bg-secondary/10 mix-blend-multiply blur-3xl" />
        <div className="animate-blob animation-delay-4000 absolute bottom-20 start-1/3 h-72 w-72 rounded-full bg-accent/10 mix-blend-multiply blur-3xl" />
      </div>

      {/* Grid pattern overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="container relative mx-auto px-4 py-8 lg:py-20">
        {/* Content Section — centered */}
        <div className="mx-auto mb-8 max-w-3xl text-center lg:mb-14">
          {/* Tagline badge */}
          <div className="animate-fade-in-up mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 sm:mb-6 sm:px-4 sm:py-2">
            <IconSparkles size={16} className="text-primary sm:size-[18px]" />
            <span className="text-xs font-medium text-primary sm:text-sm">
              {t("hero.tagline")}
            </span>
          </div>

          {/* Main heading */}
          <h1 className="animate-fade-in-up animation-delay-200 mb-4 text-3xl font-bold leading-tight tracking-tight text-neutral-900 sm:text-4xl md:text-5xl lg:mb-6 lg:text-6xl">
            {t("hero.title")}{" "}
            <span className="relative">
              <span className="relative z-10 bg-gradient-to-l from-primary to-primary-dark bg-clip-text text-transparent">
                {t("hero.titleHighlight")}
              </span>
              <span className="absolute -inset-1 -z-10 -skew-y-1 bg-primary/10" />
            </span>
          </h1>

          {/* Subtitle */}
          <p className="animate-fade-in-up animation-delay-400 mb-6 text-base leading-relaxed text-neutral-600 sm:mb-8 sm:text-lg">
            {t("hero.subtitle")}
          </p>

          {/* CTA Buttons */}
          <div className="animate-fade-in-up animation-delay-600 mb-8 flex flex-col items-center gap-3 sm:mb-10 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-4">
            <a href="/shop" className="group flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-base font-semibold text-white shadow-lg shadow-primary/25 transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary-dark hover:shadow-xl hover:shadow-primary/30 sm:w-auto sm:px-8 sm:py-4 sm:text-lg">
              {t("common.shopNow")}
              {isRTL ? (
                <IconArrowLeft
                  size={20}
                  className="transition-transform duration-300 group-hover:-translate-x-1"
                />
              ) : (
                <IconArrowRight
                  size={20}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              )}
            </a>
            <a href="/categories" className="w-full rounded-full border-2 border-neutral-200 bg-white px-6 py-3 text-base font-semibold text-neutral-700 transition-all duration-300 hover:-translate-y-0.5 hover:border-secondary hover:text-secondary sm:w-auto sm:px-8 sm:py-4 sm:text-lg">
              {t("common.exploreCategories")}
            </a>
          </div>

          {/* Stats */}
          <div className="animate-fade-in-up animation-delay-800 flex flex-wrap justify-center gap-4 border-t border-neutral-200 pt-6 sm:gap-8 sm:pt-8">
            {heroStats.map((stat) => (
              <div key={stat.id} className="text-center">
                <div className="text-2xl font-bold text-neutral-900 sm:text-3xl">
                  {stat.value}
                </div>
                <div className="text-xs text-neutral-500 sm:text-sm">
                  {t(stat.translationKey)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Hero Image — full width */}
        <div className="animate-fade-in-up animation-delay-400 relative">
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl shadow-xl sm:aspect-[16/9] sm:rounded-3xl sm:shadow-2xl lg:aspect-[1531/694]">
            <Image
              src="/hero-image-2.jpeg"
              alt={t("hero.title")}
              fill
              priority
              className="object-cover"
              sizes="100vw"
            />

            {/* Floating product cards — hidden on mobile */}
            <div className="animate-float absolute start-6 top-6 z-20 hidden rounded-2xl bg-white p-4 shadow-xl sm:block">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-primary-dark" />
                <div>
                  <div className="h-3 w-20 rounded bg-neutral-200" />
                  <div className="mt-2 h-2 w-14 rounded bg-neutral-100" />
                </div>
              </div>
            </div>

            <div className="animate-float animation-delay-1000 absolute bottom-6 end-6 z-20 hidden rounded-2xl bg-white p-4 shadow-xl sm:block">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-secondary to-secondary-dark" />
                <div>
                  <div className="h-3 w-16 rounded bg-neutral-200" />
                  <div className="mt-2 text-sm font-bold text-accent">
                    199 {t("common.currency")}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Categories Section */}
        <div className="mt-10 lg:mt-24">
          <div className="mb-5 flex items-center justify-between sm:mb-8">
            <h2 className="animate-fade-in-up text-xl font-bold text-neutral-900 sm:text-2xl">
              {t("common.exploreCategories")}
            </h2>
            <Link href="/categories" className="animate-fade-in-up text-sm font-medium text-primary transition-colors hover:text-primary-dark">
              {t("common.viewAll")}
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:justify-center sm:gap-4">
            {featuredCategories.map((category, index) => (
              <Link
                key={category.id}
                href={`/shop?category=${category.id}`}
                className="animate-fade-in-up group cursor-pointer overflow-hidden rounded-2xl bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg sm:w-48 sm:flex-none lg:flex-1"
                style={{ animationDelay: `${800 + index * 100}ms` }}
              >
                {category.image ? (
                  <div className="relative aspect-[4/3] w-full overflow-hidden">
                    <Image
                      src={category.image}
                      alt={t(category.translationKey)}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 640px) 50vw, 192px"
                    />
                  </div>
                ) : (
                  <div className="p-4 pb-2 sm:p-6 sm:pb-2">
                    <div className={`inline-flex rounded-xl ${category.color} p-3 text-white transition-transform duration-300 group-hover:scale-110`}>
                      <category.icon size={24} />
                    </div>
                  </div>
                )}
                <div className="p-3 pt-2 sm:p-4 sm:pt-3">
                  <h3 className="text-xs font-semibold text-neutral-700 transition-colors group-hover:text-primary sm:text-sm">
                    {t(category.translationKey)}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Features bar */}
        <div className="mt-10 grid gap-4 rounded-2xl bg-white p-5 shadow-lg sm:grid-cols-3 sm:gap-6 sm:rounded-3xl sm:p-8 lg:mt-16">
          {heroFeatures.map((feature, index) => (
            <div
              key={feature.id}
              className="animate-fade-in-up flex items-center gap-3 sm:gap-4"
              style={{ animationDelay: `${1200 + index * 100}ms` }}
            >
              <div className="rounded-xl bg-primary/10 p-3 text-primary sm:rounded-2xl sm:p-4">
                <feature.icon size={24} className="sm:size-7" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-neutral-900 sm:text-base">
                  {t(feature.titleKey)}
                </h3>
                <p className="text-xs text-neutral-500 sm:text-sm">
                  {t(feature.descriptionKey)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
