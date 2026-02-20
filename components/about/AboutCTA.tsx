/**
 * @author Zakaria Tejjani
 * @date 2025-12-10
 */
"use client";
import { useRTL } from "@/hooks/useRTL";

import { useTranslations } from "next-intl";
import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";

export default function AboutCTA() {
  const t = useTranslations();
  const isRTL = useRTL();

  return (
    <section className="py-16 lg:py-24">
      <div className="container mx-auto px-4">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary to-primary-dark p-8 lg:p-16">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div
              className="h-full w-full"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }}
            />
          </div>

          {/* Decorative circles */}
          <div className="animate-blob absolute -end-20 -top-20 h-64 w-64 rounded-full bg-white/10" />
          <div className="animate-blob animation-delay-2000 absolute -bottom-20 -start-20 h-48 w-48 rounded-full bg-white/5" />

          <div className="relative mx-auto max-w-2xl text-center">
            <h2 className="animate-fade-in-up mb-4 text-3xl font-bold text-white lg:text-4xl">
              {t("about.cta.title")}
            </h2>
            <p className="animate-fade-in-up animation-delay-200 mb-8 text-lg text-white/80">
              {t("about.cta.subtitle")}
            </p>
            <div className="animate-fade-in-up animation-delay-400 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a
                href="/shop"
                className="group flex items-center gap-2 rounded-full bg-white px-8 py-4 font-semibold text-primary transition-all hover:-translate-y-0.5 hover:shadow-lg"
              >
                {t("common.shopNow")}
                {isRTL ? (
                  <IconArrowLeft
                    size={18}
                    className="transition-transform group-hover:-translate-x-1"
                  />
                ) : (
                  <IconArrowRight
                    size={18}
                    className="transition-transform group-hover:translate-x-1"
                  />
                )}
              </a>
              <a
                href="/contact"
                className="rounded-full border-2 border-white/30 px-8 py-4 font-semibold text-white transition-all hover:-translate-y-0.5 hover:border-white hover:bg-white/10"
              >
                {t("about.cta.contact")}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
