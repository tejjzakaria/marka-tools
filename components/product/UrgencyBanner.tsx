/**
 * @author Zakaria Tejjani
 * @date 2025-12-10
 */
"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { IconFlame, IconEye, IconPackage, IconClock } from "@tabler/icons-react";
import type { Product } from "@/data/products";

interface UrgencyBannerProps {
  product: Product;
}

export default function UrgencyBanner({ product }: UrgencyBannerProps) {
  const t = useTranslations();
  const [currentViewers, setCurrentViewers] = useState(product.viewersCount || 0);
  const [timeLeft, setTimeLeft] = useState({ hours: 2, minutes: 45, seconds: 30 });

  // Simulate live viewers count fluctuation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentViewers((prev) => {
        const change = Math.floor(Math.random() * 5) - 2;
        return Math.max(5, prev + change);
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Countdown timer for limited offer
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const showLowStock = product.stockCount && product.stockCount < 20;
  const showViewers = currentViewers > 0;
  const showTimer = product.badge === "sale";

  if (!showLowStock && !showViewers && !showTimer) return null;

  return (
    <div className="space-y-3">
      {/* Low Stock Warning */}
      {showLowStock && (
        <div className="flex items-center gap-3 rounded-xl bg-red-50 p-4 animate-pulse">
          <IconPackage size={24} className="shrink-0 text-red-500" />
          <div>
            <p className="font-semibold text-red-700">
              {t("productPage.urgency.lowStock")}
            </p>
            <p className="text-sm text-red-600">
              {t("productPage.urgency.onlyLeft", { count: product.stockCount || 0 })}
            </p>
          </div>
        </div>
      )}

      {/* Live Viewers */}
      {showViewers && (
        <div className="flex items-center gap-3 rounded-xl bg-orange-50 p-4">
          <div className="relative">
            <IconEye size={24} className="text-orange-500" />
            <span className="absolute -end-1 -top-1 flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange-400 opacity-75"></span>
              <span className="relative inline-flex h-3 w-3 rounded-full bg-orange-500"></span>
            </span>
          </div>
          <p className="text-orange-700">
            <span className="font-bold">{currentViewers}</span>{" "}
            {t("productPage.urgency.viewingNow")}
          </p>
        </div>
      )}

      {/* Limited Time Offer */}
      {showTimer && (
        <div className="rounded-xl bg-gradient-to-r from-primary to-primary-dark p-4 text-white">
          <div className="mb-3 flex items-center gap-2">
            <IconFlame size={24} />
            <span className="font-bold">{t("productPage.urgency.limitedOffer")}</span>
          </div>
          <div className="flex items-center gap-2">
            <IconClock size={18} />
            <span className="text-sm">{t("productPage.urgency.endsIn")}</span>
            <div className="flex gap-1">
              <span className="rounded bg-white/20 px-2 py-1 font-mono font-bold">
                {String(timeLeft.hours).padStart(2, "0")}
              </span>
              <span className="font-bold">:</span>
              <span className="rounded bg-white/20 px-2 py-1 font-mono font-bold">
                {String(timeLeft.minutes).padStart(2, "0")}
              </span>
              <span className="font-bold">:</span>
              <span className="rounded bg-white/20 px-2 py-1 font-mono font-bold">
                {String(timeLeft.seconds).padStart(2, "0")}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
