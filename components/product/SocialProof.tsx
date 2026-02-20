/**
 * @author Zakaria Tejjani
 * @date 2025-12-10
 */
"use client";

import { useTranslations } from "next-intl";
import {
  IconStar,
  IconUsers,
  IconTrendingUp,
  IconMapPin,
  IconClock,
  IconRosetteDiscountCheck,
  IconShieldCheck,
  IconTruckDelivery,
} from "@tabler/icons-react";
import type { Product } from "@/data/products";

interface SocialProofProps {
  product: Product;
}

// Simulated recent purchases
const recentPurchases = [
  { city: "الدار البيضاء", timeAgo: 5 },
  { city: "الرباط", timeAgo: 12 },
  { city: "مراكش", timeAgo: 23 },
  { city: "فاس", timeAgo: 45 },
  { city: "طنجة", timeAgo: 67 },
];

export default function SocialProof({ product }: SocialProofProps) {
  const t = useTranslations();

  return (
    <div className="space-y-6">
      {/* Stats Bar */}
      <div className="grid grid-cols-3 gap-4 rounded-2xl bg-gradient-to-r from-secondary/10 to-primary/10 p-6">
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 text-2xl font-bold text-primary">
            <IconStar size={24} className="text-amber-400" />
            {product.rating}
          </div>
          <p className="text-sm text-neutral-600">{t("productPage.social.rating")}</p>
        </div>
        <div className="text-center border-x border-neutral-200">
          <div className="flex items-center justify-center gap-1 text-2xl font-bold text-primary">
            <IconUsers size={24} />
            {product.reviewCount}
          </div>
          <p className="text-sm text-neutral-600">{t("productPage.social.reviews")}</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 text-2xl font-bold text-primary">
            <IconTrendingUp size={24} />
            {product.soldCount?.toLocaleString() || "500+"}
          </div>
          <p className="text-sm text-neutral-600">{t("productPage.social.sold")}</p>
        </div>
      </div>

      {/* Recent Purchases */}
      {product.soldCount && product.soldCount > 100 && (
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h3 className="mb-4 flex items-center gap-2 font-semibold text-neutral-900">
            <IconTrendingUp size={20} className="text-secondary" />
            {t("productPage.social.recentPurchases")}
          </h3>
          <div className="space-y-3">
            {recentPurchases.slice(0, 3).map((purchase, index) => (
              <div
                key={index}
                className="flex items-center justify-between rounded-xl bg-neutral-50 px-4 py-3"
              >
                <div className="flex items-center gap-2">
                  <IconMapPin size={16} className="text-neutral-400" />
                  <span className="text-neutral-700">
                    {t("productPage.social.someoneFrom")} <strong>{purchase.city}</strong>
                  </span>
                </div>
                <div className="flex items-center gap-1 text-sm text-neutral-500">
                  <IconClock size={14} />
                  <span>
                    {t("productPage.social.minutesAgo", { minutes: purchase.timeAgo })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Trust Indicators */}
      <div className="flex flex-wrap items-center justify-center gap-4 rounded-2xl bg-neutral-50 p-4">
        <div className="flex items-center gap-2 text-sm text-neutral-600">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary/20">
            <IconRosetteDiscountCheck size={18} className="text-secondary" />
          </div>
          <span>{t("productPage.social.verifiedSeller")}</span>
        </div>
        <div className="h-4 w-px bg-neutral-300" />
        <div className="flex items-center gap-2 text-sm text-neutral-600">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary/20">
            <IconShieldCheck size={18} className="text-secondary" />
          </div>
          <span>{t("productPage.social.qualityGuarantee")}</span>
        </div>
        <div className="h-4 w-px bg-neutral-300" />
        <div className="flex items-center gap-2 text-sm text-neutral-600">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary/20">
            <IconTruckDelivery size={18} className="text-secondary" />
          </div>
          <span>{t("productPage.social.fastDelivery")}</span>
        </div>
      </div>
    </div>
  );
}
