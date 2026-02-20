/**
 * @author Zakaria Tejjani
 * @date 2026-02-11
 */

"use client";

import { useTranslations } from "next-intl";
import {
  IconTruck,
  IconShieldCheck,
  IconClock,
  IconHeadset,
  IconPackage,
  IconCreditCard,
  IconStar,
  IconRefresh,
} from "@tabler/icons-react";

export default function AnnouncementBar() {
  const t = useTranslations();

  const features = [
    { icon: IconTruck, text: "productPage.announcementBar.freeShipping" },
    { icon: IconShieldCheck, text: "productPage.announcementBar.securePayment" },
    { icon: IconClock, text: "productPage.announcementBar.fastDelivery" },
    { icon: IconHeadset, text: "productPage.announcementBar.support" },
    { icon: IconPackage, text: "productPage.announcementBar.qualityProducts" },
    { icon: IconCreditCard, text: "productPage.announcementBar.cashOnDelivery" },
    { icon: IconStar, text: "productPage.announcementBar.topRated" },
    { icon: IconRefresh, text: "productPage.announcementBar.easyReturns" },
  ];

  // Duplicate the features array for seamless loop
  const duplicatedFeatures = [...features, ...features];

  return (
    <div className="relative my-8 w-screen overflow-hidden border-y-2 border-primary/20 bg-white py-4" style={{ marginLeft: 'calc(-50vw + 50%)', marginRight: 'calc(-50vw + 50%)' }}>
      {/* Gradient Overlays */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-white to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-white to-transparent" />

      {/* Scrolling Container */}
      <div className="flex animate-scroll whitespace-nowrap">
        {duplicatedFeatures.map((feature, index) => {
          const IconComponent = feature.icon;
          return (
            <div
              key={index}
              className="mx-6 flex items-center gap-3 text-neutral-700"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <IconComponent size={20} className="text-primary" strokeWidth={2} />
              </div>
              <span className="text-sm font-semibold">
                {t(feature.text)}
              </span>
              <div className="ml-6 h-8 w-px bg-neutral-200" />
            </div>
          );
        })}
      </div>

      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .animate-scroll {
          animation: scroll 30s linear infinite;
        }

        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}
