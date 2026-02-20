/**
 * @author Zakaria Tejjani
 * @date 2025-12-14
 */
"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { IconHome, IconShoppingBag, IconMoodSad } from "@tabler/icons-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function NotFound() {
  const t = useTranslations("notFound");

  return (
    <>
      <Header />
      <main className="min-h-screen flex items-center justify-center relative overflow-hidden bg-white">
        {/* Animated Background Blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-blob" />
          <div className="absolute top-40 right-20 w-96 h-96 bg-secondary/5 rounded-full blur-3xl animate-blob animation-delay-2000" />
          <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-accent/5 rounded-full blur-3xl animate-blob animation-delay-4000" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 py-20 text-center">
          {/* Animated Icon */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/10 rounded-full blur-2xl animate-pulse" />
              <IconMoodSad
                size={120}
                className="text-primary relative animate-float"
                stroke={1.5}
              />
            </div>
          </div>

          {/* 404 Error Number */}
          <div className="mb-8">
            <h1 className="text-[12rem] md:text-[16rem] font-bold leading-none text-primary animate-fade-in-up">
              {t("error")}
            </h1>
          </div>

          {/* Title & Messages */}
          <div className="space-y-4 mb-12 animate-fade-in-up animation-delay-200">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900">
              {t("title")}
            </h2>
            <p className="text-lg md:text-xl text-neutral-600 max-w-2xl mx-auto">
              {t("message")}
            </p>
            <p className="text-base text-neutral-500 max-w-xl mx-auto">
              {t("description")}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up animation-delay-400">
            <Link
              href="/"
              className="group inline-flex items-center gap-3 px-8 py-4 bg-primary text-white rounded-xl font-semibold text-lg shadow-lg shadow-primary/20 hover:bg-primary-dark hover:shadow-xl hover:shadow-primary/30 hover:scale-105 transition-all duration-300"
            >
              <IconHome size={24} className="group-hover:rotate-12 transition-transform" />
              {t("backHome")}
            </Link>

            <Link
              href="/shop"
              className="group inline-flex items-center gap-3 px-8 py-4 bg-white text-secondary border-2 border-secondary rounded-xl font-semibold text-lg shadow-lg hover:bg-secondary hover:text-white hover:scale-105 transition-all duration-300"
            >
              <IconShoppingBag size={24} className="group-hover:rotate-12 transition-transform" />
              {t("browseProducts")}
            </Link>
          </div>

          {/* Help Text */}
          <div className="mt-16 animate-fade-in-up animation-delay-600">
            <p className="text-sm text-neutral-500">
              {t("helpText")}
            </p>
          </div>

          {/* Decorative Elements */}
          <div className="absolute top-1/4 left-10 w-20 h-20 border-4 border-accent/30 rounded-lg rotate-12 animate-float animation-delay-1000" />
          <div className="absolute bottom-1/4 right-10 w-16 h-16 border-4 border-secondary/30 rounded-full animate-float animation-delay-2000" />
          <div className="absolute top-1/2 right-1/4 w-12 h-12 border-4 border-primary/30 rounded-lg -rotate-12 animate-float" />
        </div>
      </main>
      <Footer />
    </>
  );
}
