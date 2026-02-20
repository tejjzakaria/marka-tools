/**
 * @author Zakaria Tejjani
 * @date 2025-12-10
 */
"use client";

import { useTranslations } from "next-intl";
import { IconStarFilled, IconQuote } from "@tabler/icons-react";
import { testimonials } from "@/data";

export default function Testimonials() {
  const t = useTranslations();

  const renderStars = (rating: number) => {
    return Array.from({ length: rating }, (_, i) => (
      <IconStarFilled key={i} size={16} className="text-accent" />
    ));
  };

  return (
    <section className="bg-neutral-50 py-16 lg:py-24">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-neutral-900 lg:text-4xl">
            {t("sections.testimonials.title")}
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-neutral-600">
            {t("sections.testimonials.subtitle")}
          </p>
        </div>

        {/* Testimonials grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className="group relative overflow-hidden rounded-3xl bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Quote icon */}
              <div className="absolute -end-4 -top-4 text-primary/5 transition-colors group-hover:text-primary/10">
                <IconQuote size={80} />
              </div>

              {/* Rating */}
              <div className="relative mb-4 flex gap-1">
                {renderStars(testimonial.rating)}
              </div>

              {/* Review text */}
              <p className="relative mb-6 text-neutral-600 leading-relaxed">
                "{t(testimonial.reviewKey)}"
              </p>

              {/* Customer info */}
              <div className="relative flex items-center gap-4">
                {/* Avatar placeholder */}
                <div className="h-12 w-12 overflow-hidden rounded-full bg-gradient-to-br from-primary/20 to-secondary/20">
                  <div className="flex h-full w-full items-center justify-center text-xs text-neutral-400">
                    [A]
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-neutral-900">
                    {t(testimonial.nameKey)}
                  </h4>
                  <p className="text-sm text-neutral-500">
                    {t(testimonial.locationKey)}
                  </p>
                </div>
              </div>

              {/* Decorative gradient */}
              <div className="absolute bottom-0 start-0 h-1 w-0 bg-gradient-to-l from-primary to-secondary transition-all duration-300 group-hover:w-full" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
