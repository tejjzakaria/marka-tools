/**
 * @author Zakaria Tejjani
 * @date 2025-12-11
 */

import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { IconFileText, IconShoppingCart, IconTruck, IconCash, IconAlertCircle } from "@tabler/icons-react";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations();
  return {
    title: `${t("terms.title")} - Marka Tools`,
    description: t("terms.description"),
  };
}

export default async function TermsPage() {
  const t = await getTranslations();

  const sections = [
    {
      icon: IconShoppingCart,
      titleKey: "terms.sections.orders.title",
      contentKey: "terms.sections.orders.content",
    },
    {
      icon: IconCash,
      titleKey: "terms.sections.payment.title",
      contentKey: "terms.sections.payment.content",
    },
    {
      icon: IconTruck,
      titleKey: "terms.sections.delivery.title",
      contentKey: "terms.sections.delivery.content",
    },
    {
      icon: IconAlertCircle,
      titleKey: "terms.sections.liability.title",
      contentKey: "terms.sections.liability.content",
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
              <IconFileText size={64} className="mx-auto mb-6 text-white" />
              <h1 className="mb-4 text-4xl font-bold lg:text-5xl">
                {t("terms.title")}
              </h1>
              <p className="text-lg text-white/90">
                {t("terms.subtitle")}
              </p>
              <p className="mt-4 text-sm text-white/70">
                {t("terms.lastUpdated")}: {new Date().toLocaleDateString()}
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
                  {t("terms.introduction")}
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
                  {t("terms.contactTitle")}
                </h3>
                <p className="text-neutral-700">
                  {t("terms.contactText")}
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
