/**
 * @author Zakaria Tejjani
 * @date 2025-12-10
 */
"use client";

import { useTranslations } from "next-intl";
import { IconArrowLeft, IconArrowRight, IconSparkles } from "@tabler/icons-react";
import Image from "next/image";
import { useRTL } from "@/hooks/useRTL";
import { getFeaturedCategories, heroStats, heroFeatures } from "@/data";

export default function Hero() {
  const t = useTranslations();
  const isRTL = useRTL();
  const featuredCategories = getFeaturedCategories();

  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-bl from-neutral-50 via-white to-neutral-100">
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

      <div className="container relative mx-auto px-4 py-12 lg:py-20">
        {/* Content Section — centered */}
        <div className="mx-auto mb-10 max-w-3xl text-center lg:mb-14">
          {/* Tagline badge */}
          <div className="animate-fade-in-up mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2">
            <IconSparkles size={18} className="text-primary" />
            <span className="text-sm font-medium text-primary">
              {t("hero.tagline")}
            </span>
          </div>

          {/* Main heading */}
          <h1 className="animate-fade-in-up animation-delay-200 mb-6 text-4xl font-bold leading-tight tracking-tight text-neutral-900 md:text-5xl lg:text-6xl">
            {t("hero.title")}{" "}
            <span className="relative">
              <span className="relative z-10 bg-gradient-to-l from-primary to-primary-dark bg-clip-text text-transparent">
                {t("hero.titleHighlight")}
              </span>
              <span className="absolute -inset-1 -z-10 -skew-y-1 bg-primary/10" />
            </span>
          </h1>

          {/* Subtitle */}
          <p className="animate-fade-in-up animation-delay-400 mb-8 text-lg leading-relaxed text-neutral-600">
            {t("hero.subtitle")}
          </p>

          {/* CTA Buttons */}
          <div className="animate-fade-in-up animation-delay-600 mb-10 flex flex-wrap justify-center gap-4">
            <a href="/shop" className="group flex items-center gap-2 rounded-full bg-primary px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-primary/25 transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary-dark hover:shadow-xl hover:shadow-primary/30">
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
            <a href="/categories" className="rounded-full border-2 border-neutral-200 bg-white px-8 py-4 text-lg font-semibold text-neutral-700 transition-all duration-300 hover:-translate-y-0.5 hover:border-secondary hover:text-secondary">
              {t("common.exploreCategories")}
            </a>
          </div>

          {/* Stats */}
          <div className="animate-fade-in-up animation-delay-800 flex flex-wrap justify-center gap-8 border-t border-neutral-200 pt-8">
            {heroStats.map((stat) => (
              <div key={stat.id} className="text-center">
                <div className="text-3xl font-bold text-neutral-900">
                  {stat.value}
                </div>
                <div className="text-sm text-neutral-500">
                  {t(stat.translationKey)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Hero Image — full width */}
        <div className="animate-fade-in-up animation-delay-400 relative">
          <div className="relative aspect-[1531/694] w-full overflow-hidden rounded-3xl shadow-2xl">
            <Image
              src="/hero-image-2.jpeg"
              alt={t("hero.title")}
              fill
              priority
              className="object-cover"
              sizes="100vw"
            />

            {/* Floating product cards */}
            <div className="animate-float absolute start-6 top-6 z-20 rounded-2xl bg-white p-4 shadow-xl">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-primary-dark" />
                <div>
                  <div className="h-3 w-20 rounded bg-neutral-200" />
                  <div className="mt-2 h-2 w-14 rounded bg-neutral-100" />
                </div>
              </div>
            </div>

            <div className="animate-float animation-delay-1000 absolute bottom-6 end-6 z-20 rounded-2xl bg-white p-4 shadow-xl">
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
        <div className="mt-16 lg:mt-24">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="animate-fade-in-up text-2xl font-bold text-neutral-900">
              {t("common.exploreCategories")}
            </h2>
            <button className="animate-fade-in-up text-sm font-medium text-primary transition-colors hover:text-primary-dark">
              {t("common.viewAll")}
            </button>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            {featuredCategories.map((category, index) => (
              <div
                key={category.id}
                className="animate-fade-in-up group w-[calc(50%-8px)] flex-1 cursor-pointer overflow-hidden rounded-2xl bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg sm:w-48 sm:flex-none lg:flex-1"
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
                  <div className="p-6 pb-2">
                    <div className={`inline-flex rounded-xl ${category.color} p-3 text-white transition-transform duration-300 group-hover:scale-110`}>
                      <category.icon size={24} />
                    </div>
                  </div>
                )}
                <div className="p-4 pt-3">
                  <h3 className="text-sm font-semibold text-neutral-700 transition-colors group-hover:text-primary">
                    {t(category.translationKey)}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Features bar */}
        <div className="mt-16 grid gap-6 rounded-3xl bg-white p-8 shadow-lg sm:grid-cols-3">
          {heroFeatures.map((feature, index) => (
            <div
              key={feature.id}
              className="animate-fade-in-up flex items-center gap-4"
              style={{ animationDelay: `${1200 + index * 100}ms` }}
            >
              <div className="rounded-2xl bg-primary/10 p-4 text-primary">
                <feature.icon size={28} />
              </div>
              <div>
                <h3 className="font-semibold text-neutral-900">
                  {t(feature.titleKey)}
                </h3>
                <p className="text-sm text-neutral-500">
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
