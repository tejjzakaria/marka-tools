/**
 * @author Zakaria Tejjani
 * @date 2025-12-10
 */
"use client";

import { useTranslations } from "next-intl";
import { IconArrowLeft, IconArrowRight, IconClock, IconFlame } from "@tabler/icons-react";
import { useRTL } from "@/hooks/useRTL";

export default function PromoBanner() {
  const t = useTranslations();
  const isRTL = useRTL();

  return (
    <section className="py-16 lg:py-24">
      <div className="container mx-auto px-4">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Main promo - Big sale */}
          <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary to-primary-dark p-8 lg:p-12">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div
                className="h-full w-full"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
                }}
              />
            </div>

            {/* Decorative circle */}
            <div className="absolute -end-16 -top-16 h-64 w-64 rounded-full bg-white/10 transition-transform duration-500 group-hover:scale-110" />
            <div className="absolute -bottom-20 -start-20 h-48 w-48 rounded-full bg-white/5" />

            <div className="relative">
              {/* Badge */}
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm font-semibold text-white backdrop-blur-sm">
                <IconFlame size={18} />
                {t("promo.hotDeal")}
              </div>

              {/* Discount */}
              <div className="mb-4">
                <span className="text-6xl font-bold text-white lg:text-8xl">
                  50%
                </span>
                <span className="ms-2 text-2xl font-bold text-white/80 lg:text-3xl">
                  {t("promo.off")}
                </span>
              </div>

              {/* Title */}
              <h3 className="mb-4 text-2xl font-bold text-white lg:text-3xl">
                {t("promo.bigSale.title")}
              </h3>

              {/* Description */}
              <p className="mb-6 max-w-sm text-white/80">
                {t("promo.bigSale.description")}
              </p>

              {/* CTA */}
              <a
                href="/shop"
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-semibold text-primary transition-all hover:-translate-y-0.5 hover:shadow-lg"
              >
                {t("common.shopNow")}
                {isRTL ? <IconArrowLeft size={18} /> : <IconArrowRight size={18} />}
              </a>
            </div>
          </div>

          {/* Secondary promos */}
          <div className="grid gap-6">
            {/* New arrivals promo */}
            <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-secondary via-secondary to-secondary-dark p-8">
              <div className="absolute -end-12 -top-12 h-48 w-48 rounded-full bg-white/10 transition-transform duration-500 group-hover:scale-110" />

              <div className="relative flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                  <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white">
                    {t("badges.new")}
                  </div>
                  <h3 className="mb-2 text-xl font-bold text-white lg:text-2xl">
                    {t("promo.newArrivals.title")}
                  </h3>
                  <p className="text-sm text-white/80">
                    {t("promo.newArrivals.description")}
                  </p>
                </div>
                <a
                  href="/shop?badge=new"
                  className="inline-flex flex-shrink-0 items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-secondary transition-all hover:-translate-y-0.5 hover:shadow-lg"
                >
                  {t("common.viewAll")}
                  {isRTL ? <IconArrowLeft size={16} /> : <IconArrowRight size={16} />}
                </a>
              </div>
            </div>

            {/* Limited time offer */}
            <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-accent via-accent to-accent-dark p-8">
              <div className="absolute -end-12 -bottom-12 h-48 w-48 rounded-full bg-white/10 transition-transform duration-500 group-hover:scale-110" />

              <div className="relative flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                  <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white">
                    <IconClock size={14} />
                    {t("promo.limitedTime")}
                  </div>
                  <h3 className="mb-2 text-xl font-bold text-white lg:text-2xl">
                    {t("promo.freeShipping.title")}
                  </h3>
                  <p className="text-sm text-white/80">
                    {t("promo.freeShipping.description")}
                  </p>
                </div>
                <a
                  href="/shop"
                  className="inline-flex flex-shrink-0 items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-accent-dark transition-all hover:-translate-y-0.5 hover:shadow-lg"
                >
                  {t("common.shopNow")}
                  {isRTL ? <IconArrowLeft size={16} /> : <IconArrowRight size={16} />}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
