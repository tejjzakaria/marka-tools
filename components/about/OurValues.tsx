/**
 * @author Zakaria Tejjani
 * @date 2025-12-10
 */
"use client";

import { useTranslations } from "next-intl";
import {
  IconHeart,
  IconShieldCheck,
  IconRocket,
  IconUsers,
  IconLeaf,
  IconAward,
} from "@tabler/icons-react";

const values = [
  {
    id: "quality",
    icon: IconAward,
    color: "bg-primary",
  },
  {
    id: "trust",
    icon: IconShieldCheck,
    color: "bg-secondary",
  },
  {
    id: "innovation",
    icon: IconRocket,
    color: "bg-accent",
  },
  {
    id: "customer",
    icon: IconHeart,
    color: "bg-pink-500",
  },
  {
    id: "community",
    icon: IconUsers,
    color: "bg-blue-500",
  },
  {
    id: "sustainability",
    icon: IconLeaf,
    color: "bg-green-500",
  },
];

export default function OurValues() {
  const t = useTranslations();

  return (
    <section className="bg-neutral-50 py-16 lg:py-24">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="mb-12 text-center">
          <h2 className="animate-fade-in-up mb-4 text-3xl font-bold text-neutral-900 lg:text-4xl">
            {t("about.values.title")}
          </h2>
          <p className="animate-fade-in-up animation-delay-200 mx-auto max-w-2xl text-neutral-600">
            {t("about.values.subtitle")}
          </p>
        </div>

        {/* Values grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {values.map((value, index) => (
            <div
              key={value.id}
              className="animate-fade-in-up group relative overflow-hidden rounded-3xl bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              style={{ animationDelay: `${400 + index * 100}ms` }}
            >
              {/* Icon */}
              <div
                className={`mb-6 inline-flex rounded-2xl ${value.color} p-4 text-white transition-transform duration-300 group-hover:scale-110`}
              >
                <value.icon size={28} />
              </div>

              {/* Content */}
              <h3 className="mb-3 text-xl font-semibold text-neutral-900">
                {t(`about.values.items.${value.id}.title`)}
              </h3>
              <p className="text-neutral-600">
                {t(`about.values.items.${value.id}.description`)}
              </p>

              {/* Decorative corner */}
              <div
                className={`absolute -end-8 -top-8 h-24 w-24 rounded-full ${value.color} opacity-5 transition-transform duration-300 group-hover:scale-150`}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
