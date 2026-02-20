/**
 * @author Zakaria Tejjani
 * @date 2025-12-11
 */

import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { IconCookie, IconSettings, IconChartBar, IconUserCheck } from "@tabler/icons-react";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations();
  return {
    title: `${t("cookies.title")} - Marka Tools`,
    description: t("cookies.description"),
  };
}

export default async function CookiesPage() {
  const t = await getTranslations();

  const sections = [
    {
      icon: IconCookie,
      titleKey: "cookies.sections.what.title",
      contentKey: "cookies.sections.what.content",
    },
    {
      icon: IconChartBar,
      titleKey: "cookies.sections.types.title",
      contentKey: "cookies.sections.types.content",
    },
    {
      icon: IconUserCheck,
      titleKey: "cookies.sections.purpose.title",
      contentKey: "cookies.sections.purpose.content",
    },
    {
      icon: IconSettings,
      titleKey: "cookies.sections.manage.title",
      contentKey: "cookies.sections.manage.content",
    },
  ];

  return (
    <>
      <Header />
      <main className="min-h-screen bg-neutral-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary via-primary to-primary-dark py-16 text-white lg:py-20">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center">
              <IconCookie size={64} className="mx-auto mb-6 text-white" />
              <h1 className="mb-4 text-4xl font-bold lg:text-5xl">
                {t("cookies.title")}
              </h1>
              <p className="text-lg text-white/90">
                {t("cookies.subtitle")}
              </p>
              <p className="mt-4 text-sm text-white/70">
                {t("cookies.lastUpdated")}: {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-12 lg:py-16">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-4xl">
              {/* Introduction */}
              <div className="mb-12 rounded-2xl bg-white p-8 shadow-sm">
                <p className="text-lg leading-relaxed text-neutral-700">
                  {t("cookies.introduction")}
                </p>
              </div>

              {/* Sections */}
              <div className="space-y-8">
                {sections.map((section, index) => {
                  const Icon = section.icon;
                  return (
                    <div
                      key={index}
                      className="rounded-2xl bg-white p-8 shadow-sm"
                    >
                      <div className="mb-4 flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                          <Icon size={24} className="text-primary" />
                        </div>
                        <h2 className="text-2xl font-bold text-neutral-900">
                          {t(section.titleKey)}
                        </h2>
                      </div>
                      <div className="prose prose-neutral max-w-none">
                        <p className="text-neutral-700 leading-relaxed whitespace-pre-line">
                          {t(section.contentKey)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Contact */}
              <div className="mt-12 rounded-2xl bg-secondary/10 p-8 text-center">
                <h3 className="mb-2 text-xl font-bold text-neutral-900">
                  {t("cookies.contactTitle")}
                </h3>
                <p className="text-neutral-700">
                  {t("cookies.contactText")}
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
