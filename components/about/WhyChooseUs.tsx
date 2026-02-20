/**
 * @author Zakaria Tejjani
 * @date 2025-12-10
 */
"use client";

import { useTranslations } from "next-intl";
import {
  IconTruck,
  IconShieldCheck,
  IconHeadset,
  IconCash,
  IconCheck,
  IconMapPin,
} from "@tabler/icons-react";

const reasons = [
  {
    id: "fastDelivery",
    icon: IconTruck,
  },
  {
    id: "securePayment",
    icon: IconShieldCheck,
  },
  {
    id: "support247",
    icon: IconHeadset,
  },
  {
    id: "codAvailable",
    icon: IconCash,
  },
  {
    id: "qualityGuarantee",
    icon: IconCheck,
  },
  {
    id: "nationwide",
    icon: IconMapPin,
  },
];

export default function WhyChooseUs() {
  const t = useTranslations();

  return (
    <section className="bg-neutral-50 py-16 lg:py-24">
      <div className="container mx-auto px-4">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Content */}
          <div>
            <h2 className="animate-fade-in-up mb-6 text-3xl font-bold text-neutral-900 lg:text-4xl">
              {t("about.whyChooseUs.title")}
            </h2>
            <p className="animate-fade-in-up animation-delay-200 mb-8 text-lg text-neutral-600">
              {t("about.whyChooseUs.subtitle")}
            </p>

            {/* Reasons grid */}
            <div className="grid gap-4 sm:grid-cols-2">
              {reasons.map((reason, index) => (
                <div
                  key={reason.id}
                  className="animate-fade-in-up flex items-start gap-4 rounded-2xl bg-white p-4 shadow-sm"
                  style={{ animationDelay: `${400 + index * 100}ms` }}
                >
                  <div className="rounded-xl bg-primary/10 p-3 text-primary">
                    <reason.icon size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-neutral-900">
                      {t(`about.whyChooseUs.reasons.${reason.id}.title`)}
                    </h3>
                    <p className="text-sm text-neutral-600">
                      {t(`about.whyChooseUs.reasons.${reason.id}.description`)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-6">
              {/* Products Stat */}
              <div className="animate-fade-in-up group relative overflow-hidden rounded-3xl bg-white p-8 text-center shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                {/* Background gradient blob */}
                <div className="absolute -end-4 -top-4 h-32 w-32 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 blur-2xl transition-all duration-300 group-hover:scale-150" />
                <div className="absolute -bottom-4 -start-4 h-24 w-24 rounded-full bg-gradient-to-br from-primary/10 to-transparent blur-xl" />

                <div className="relative">
                  <div className="mb-3 text-5xl font-bold text-primary lg:text-6xl">30+</div>
                  <div className="text-sm font-medium uppercase tracking-wider text-neutral-600">{t("about.stats.products")}</div>
                </div>

                {/* Decorative corner */}
                <div className="absolute end-0 top-0 h-20 w-20 -translate-y-1/2 translate-x-1/2 rounded-full bg-primary/5" />
              </div>

              {/* Customers Stat */}
              <div className="animate-fade-in-up animation-delay-200 group relative overflow-hidden rounded-3xl bg-white p-8 text-center shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                {/* Background gradient blob */}
                <div className="absolute -end-4 -top-4 h-32 w-32 rounded-full bg-gradient-to-br from-secondary/20 to-secondary/5 blur-2xl transition-all duration-300 group-hover:scale-150" />
                <div className="absolute -bottom-4 -start-4 h-24 w-24 rounded-full bg-gradient-to-br from-secondary/10 to-transparent blur-xl" />

                <div className="relative">
                  <div className="mb-3 text-5xl font-bold text-secondary lg:text-6xl">10K+</div>
                  <div className="text-sm font-medium uppercase tracking-wider text-neutral-600">{t("about.stats.customers")}</div>
                </div>

                {/* Decorative corner */}
                <div className="absolute end-0 top-0 h-20 w-20 -translate-y-1/2 translate-x-1/2 rounded-full bg-secondary/5" />
              </div>

              {/* Cities Stat */}
              <div className="animate-fade-in-up animation-delay-400 group relative overflow-hidden rounded-3xl bg-white p-8 text-center shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                {/* Background gradient blob */}
                <div className="absolute -end-4 -top-4 h-32 w-32 rounded-full bg-gradient-to-br from-accent/20 to-accent/5 blur-2xl transition-all duration-300 group-hover:scale-150" />
                <div className="absolute -bottom-4 -start-4 h-24 w-24 rounded-full bg-gradient-to-br from-accent/10 to-transparent blur-xl" />

                <div className="relative">
                  <div className="mb-3 text-5xl font-bold text-accent lg:text-6xl">40+</div>
                  <div className="text-sm font-medium uppercase tracking-wider text-neutral-600">{t("about.stats.cities")}</div>
                </div>

                {/* Decorative corner */}
                <div className="absolute end-0 top-0 h-20 w-20 -translate-y-1/2 translate-x-1/2 rounded-full bg-accent/5" />
              </div>

              {/* Satisfaction Stat */}
              <div className="animate-fade-in-up animation-delay-600 group relative overflow-hidden rounded-3xl bg-white p-8 text-center shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                {/* Background gradient blob */}
                <div className="absolute -end-4 -top-4 h-32 w-32 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 blur-2xl transition-all duration-300 group-hover:scale-150" />
                <div className="absolute -bottom-4 -start-4 h-24 w-24 rounded-full bg-gradient-to-br from-primary/10 to-transparent blur-xl" />

                <div className="relative">
                  <div className="mb-3 text-5xl font-bold text-neutral-900 lg:text-6xl">99%</div>
                  <div className="text-sm font-medium uppercase tracking-wider text-neutral-600">{t("about.stats.satisfaction")}</div>
                </div>

                {/* Decorative corner */}
                <div className="absolute end-0 top-0 h-20 w-20 -translate-y-1/2 translate-x-1/2 rounded-full bg-neutral-200/50" />
              </div>
            </div>

            {/* Decorative */}
            <div className="animate-float absolute -end-4 -top-4 -z-10 h-full w-full rounded-3xl border-2 border-dashed border-primary/20" />
          </div>
        </div>
      </div>
    </section>
  );
}
