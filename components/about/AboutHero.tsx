/**
 * @author Zakaria Tejjani
 * @date 2025-12-10
 */
"use client";

import { useTranslations } from "next-intl";
import { IconSparkles } from "@tabler/icons-react";

export default function AboutHero() {
  const t = useTranslations();

  return (
    <section className="relative overflow-hidden bg-gradient-to-bl from-primary via-primary to-primary-dark py-20 lg:py-32">
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
      <div className="animate-blob absolute -end-32 -top-32 h-64 w-64 rounded-full bg-white/10" />
      <div className="animate-blob animation-delay-2000 absolute -bottom-20 -start-20 h-48 w-48 rounded-full bg-white/5" />

      <div className="container relative mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center">
          {/* Badge */}
          <div className="animate-fade-in-up mb-6 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 backdrop-blur-sm">
            <IconSparkles size={18} className="text-white" />
            <span className="text-sm font-medium text-white">
              {t("about.hero.badge")}
            </span>
          </div>

          {/* Title */}
          <h1 className="animate-fade-in-up animation-delay-200 mb-6 text-4xl font-bold text-white md:text-5xl lg:text-6xl">
            {t("about.hero.title")}
          </h1>

          {/* Subtitle */}
          <p className="animate-fade-in-up animation-delay-400 text-lg text-white/80 md:text-xl">
            {t("about.hero.subtitle")}
          </p>
        </div>
      </div>
    </section>
  );
}
