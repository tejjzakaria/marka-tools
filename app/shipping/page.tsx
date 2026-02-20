/**
 * @author Zakaria Tejjani
 * @date 2025-12-11
 */

import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { IconTruck, IconClock, IconMapPin, IconPackage, IconCash } from "@tabler/icons-react";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations();
  return {
    title: `${t("shipping.title")} - Marka Tools`,
    description: t("shipping.description"),
  };
}

export default async function ShippingPage() {
  const t = await getTranslations();

  const features = [
    {
      icon: IconTruck,
      titleKey: "shipping.features.fast.title",
      descKey: "shipping.features.fast.desc",
    },
    {
      icon: IconCash,
      titleKey: "shipping.features.cod.title",
      descKey: "shipping.features.cod.desc",
    },
    {
      icon: IconPackage,
      titleKey: "shipping.features.tracking.title",
      descKey: "shipping.features.tracking.desc",
    },
  ];

  const zones = [
    {
      titleKey: "shipping.zones.casablanca.title",
      timeKey: "shipping.zones.casablanca.time",
      icon: IconClock,
    },
    {
      titleKey: "shipping.zones.major.title",
      timeKey: "shipping.zones.major.time",
      icon: IconClock,
    },
    {
      titleKey: "shipping.zones.other.title",
      timeKey: "shipping.zones.other.time",
      icon: IconClock,
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
              <IconTruck size={64} className="mx-auto mb-6 text-white" />
              <h1 className="mb-4 text-4xl font-bold lg:text-5xl">
                {t("shipping.title")}
              </h1>
              <p className="text-lg text-white/90">
                {t("shipping.subtitle")}
              </p>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-5xl">
              <div className="grid gap-6 md:grid-cols-3">
                {features.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <div
                      key={index}
                      className="rounded-2xl bg-white p-6 shadow-sm"
                    >
                      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                        <Icon size={24} className="text-primary" />
                      </div>
                      <h3 className="mb-2 text-lg font-bold text-neutral-900">
                        {t(feature.titleKey)}
                      </h3>
                      <p className="text-sm text-neutral-600">
                        {t(feature.descKey)}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Delivery Times */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-4xl">
              <div className="mb-8 text-center">
                <h2 className="mb-4 text-3xl font-bold text-neutral-900">
                  {t("shipping.deliveryTimesTitle")}
                </h2>
                <p className="text-neutral-600">
                  {t("shipping.deliveryTimesDesc")}
                </p>
              </div>

              <div className="space-y-4">
                {zones.map((zone, index) => {
                  const Icon = zone.icon;
                  return (
                    <div
                      key={index}
                      className="flex items-center gap-4 rounded-2xl bg-white p-6 shadow-sm"
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary/10">
                        <Icon size={24} className="text-secondary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-neutral-900">
                          {t(zone.titleKey)}
                        </h3>
                        <p className="text-sm text-neutral-600">
                          {t(zone.timeKey)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-4xl">
              <h2 className="mb-8 text-center text-3xl font-bold text-neutral-900">
                {t("shipping.howItWorksTitle")}
              </h2>

              <div className="space-y-6">
                {[1, 2, 3, 4].map((step) => (
                  <div
                    key={step}
                    className="flex gap-4 rounded-2xl bg-white p-6 shadow-sm"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-lg font-bold text-white">
                      {step}
                    </div>
                    <div>
                      <h3 className="mb-2 font-bold text-neutral-900">
                        {t(`shipping.steps.step${step}.title`)}
                      </h3>
                      <p className="text-sm text-neutral-600">
                        {t(`shipping.steps.step${step}.desc`)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Coverage Map */}
        <section className="bg-white py-12">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-4xl text-center">
              <IconMapPin size={64} className="mx-auto mb-6 text-primary" />
              <h2 className="mb-4 text-3xl font-bold text-neutral-900">
                {t("shipping.coverageTitle")}
              </h2>
              <p className="text-lg text-neutral-600">
                {t("shipping.coverageDesc")}
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
