/**
 * @author Zakaria Tejjani
 * @date 2026-02-11
 */

"use client";

import { useTranslations } from "next-intl";
import {
  IconShoppingCart,
  IconTruck,
  IconGift,
  IconStarFilled,
  IconArrowRight,
  IconShieldCheck,
} from "@tabler/icons-react";

type CTAVariant = "primary" | "secondary" | "accent";

interface CTACardProps {
  variant?: CTAVariant;
}

export default function CTACard({ variant = "primary" }: CTACardProps) {
  const t = useTranslations();

  const variants = {
    primary: {
      gradient: "from-primary via-primary-dark to-primary",
      icon: IconShoppingCart,
      titleKey: "productPage.cta.primary.title",
      descKey: "productPage.cta.primary.description",
      buttonKey: "productPage.cta.primary.button",
      accentColor: "bg-accent",
    },
    secondary: {
      gradient: "from-secondary via-secondary-dark to-secondary",
      icon: IconTruck,
      titleKey: "productPage.cta.secondary.title",
      descKey: "productPage.cta.secondary.description",
      buttonKey: "productPage.cta.secondary.button",
      accentColor: "bg-primary",
    },
    accent: {
      gradient: "from-accent via-accent-dark to-accent",
      icon: IconGift,
      titleKey: "productPage.cta.accent.title",
      descKey: "productPage.cta.accent.description",
      buttonKey: "productPage.cta.accent.button",
      accentColor: "bg-secondary",
    },
  };

  const config = variants[variant];
  const IconComponent = config.icon;

  return (
    <div className="my-8 sm:my-12">
      <div className="relative overflow-hidden rounded-3xl shadow-2xl">
        {/* Background Gradient */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${config.gradient} opacity-95`}
        />

        {/* Decorative Elements */}
        <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-white/10 blur-3xl sm:h-64 sm:w-64" />
        <div className="absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-white/10 blur-3xl sm:h-72 sm:w-72" />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center gap-6 px-6 py-10 text-center sm:px-10 sm:py-14 lg:flex-row lg:text-start">
          {/* Icon Section */}
          <div className="flex-shrink-0">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm ring-4 ring-white/30 sm:h-24 sm:w-24">
              <IconComponent size={44} className="text-white" strokeWidth={2} />
            </div>
          </div>

          {/* Text Content */}
          <div className="flex-1 space-y-3">
            <h3 className="text-2xl font-bold text-white sm:text-3xl lg:text-4xl">
              {t(config.titleKey)}
            </h3>
            <p className="text-base text-white/90 sm:text-lg">
              {t(config.descKey)}
            </p>
          </div>

          {/* CTA Button */}
          <div className="flex-shrink-0">
            <a
              href="#checkout-form"
              onClick={(e) => {
                e.preventDefault();
                const element = document.getElementById("checkout-form");
                if (element) {
                  element.scrollIntoView({ behavior: "smooth", block: "center" });
                }
              }}
              className="group flex items-center gap-3 rounded-xl bg-white px-8 py-4 font-bold text-neutral-900 shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            >
              <span className="text-base sm:text-lg">{t(config.buttonKey)}</span>
              <IconArrowRight
                size={22}
                className="transition-transform duration-300 group-hover:translate-x-1"
                strokeWidth={2.5}
              />
            </a>
          </div>
        </div>

        {/* Trust Badge - Mobile Bottom */}
        <div className="relative z-10 border-t border-white/20 bg-black/10 px-6 py-4 backdrop-blur-sm">
          <div className="flex flex-wrap items-center justify-center gap-4 text-white/90 sm:gap-6">
            <div className="flex items-center gap-2">
              <IconShieldCheck size={20} strokeWidth={2} />
              <span className="text-sm font-medium">
                {t("productPage.cta.trust.secure")}
              </span>
            </div>
            <div className="h-4 w-px bg-white/30 hidden sm:block" />
            <div className="flex items-center gap-2">
              <IconTruck size={20} strokeWidth={2} />
              <span className="text-sm font-medium">
                {t("productPage.cta.trust.freeShipping")}
              </span>
            </div>
            <div className="h-4 w-px bg-white/30 hidden sm:block" />
            <div className="flex items-center gap-2">
              <IconStarFilled size={20} />
              <span className="text-sm font-medium">
                {t("productPage.cta.trust.quality")}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
