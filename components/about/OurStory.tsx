/**
 * @author Zakaria Tejjani
 * @date 2025-12-10
 */
"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import { IconTargetArrow, IconEye } from "@tabler/icons-react";

export default function OurStory() {
  const t = useTranslations();

  return (
    <section className="py-16 lg:py-24">
      <div className="container mx-auto px-4">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Image */}
          <div className="animate-fade-in-up relative">
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-xl">
              <Image
                src="/about-image.png"
                alt={t("about.story.title")}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            {/* Decorative elements */}
            <div className="animate-float absolute -bottom-6 -start-6 h-24 w-24 rounded-2xl bg-primary/10" />
            <div className="animate-float animation-delay-1000 absolute -end-6 -top-6 h-32 w-32 rounded-full border-4 border-dashed border-secondary/20" />
          </div>

          {/* Content */}
          <div>
            <h2 className="animate-fade-in-up animation-delay-200 mb-6 text-3xl font-bold text-neutral-900 lg:text-4xl">
              {t("about.story.title")}
            </h2>
            <p className="animate-fade-in-up animation-delay-400 mb-6 text-lg leading-relaxed text-neutral-600">
              {t("about.story.paragraph1")}
            </p>
            <p className="animate-fade-in-up animation-delay-600 mb-8 text-lg leading-relaxed text-neutral-600">
              {t("about.story.paragraph2")}
            </p>

            {/* Mission & Vision */}
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="animate-fade-in-up animation-delay-800 rounded-2xl bg-primary/5 p-6">
                <div className="mb-4 inline-flex rounded-xl bg-primary/10 p-3">
                  <IconTargetArrow size={24} className="text-primary" />
                </div>
                <h3 className="mb-2 font-semibold text-neutral-900">
                  {t("about.story.mission.title")}
                </h3>
                <p className="text-sm text-neutral-600">
                  {t("about.story.mission.description")}
                </p>
              </div>

              <div className="animate-fade-in-up animation-delay-1000 rounded-2xl bg-secondary/5 p-6">
                <div className="mb-4 inline-flex rounded-xl bg-secondary/10 p-3">
                  <IconEye size={24} className="text-secondary" />
                </div>
                <h3 className="mb-2 font-semibold text-neutral-900">
                  {t("about.story.vision.title")}
                </h3>
                <p className="text-sm text-neutral-600">
                  {t("about.story.vision.description")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
