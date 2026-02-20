/**
 * @author Zakaria Tejjani
 * @date 2025-12-11
 */

import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FAQ from "@/components/contact/FAQ";
import { IconHelp, IconMail, IconPhone, IconBrandWhatsapp, IconArrowRight } from "@tabler/icons-react";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations();
  return {
    title: `${t("help.title")} - Marka Tools`,
    description: t("help.description"),
  };
}

export default async function HelpPage() {
  const t = await getTranslations();

  const quickLinks = [
    {
      icon: IconPhone,
      titleKey: "help.links.orderStatus",
      descKey: "help.links.orderStatusDesc",
      href: "/contact",
    },
    {
      icon: IconMail,
      titleKey: "help.links.contact",
      descKey: "help.links.contactDesc",
      href: "/contact",
    },
    {
      icon: IconBrandWhatsapp,
      titleKey: "help.links.whatsapp",
      descKey: "help.links.whatsappDesc",
      href: "https://wa.me/212612345678",
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
              <IconHelp size={64} className="animate-fade-in-up mx-auto mb-6 text-white" />
              <h1 className="animate-fade-in-up animation-delay-200 mb-4 text-4xl font-bold lg:text-5xl">
                {t("help.title")}
              </h1>
              <p className="animate-fade-in-up animation-delay-400 text-lg text-white/90">
                {t("help.subtitle")}
              </p>
            </div>
          </div>
        </section>

        {/* Quick Links */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-5xl">
              <h2 className="animate-fade-in-up mb-8 text-center text-2xl font-bold text-neutral-900">
                {t("help.quickLinksTitle")}
              </h2>
              <div className="grid gap-6 md:grid-cols-3">
                {quickLinks.map((link, index) => {
                  const Icon = link.icon;
                  const isExternal = link.href.startsWith("http");
                  const LinkComponent = isExternal ? "a" : Link;
                  const linkProps = isExternal
                    ? { href: link.href, target: "_blank", rel: "noopener noreferrer" }
                    : { href: link.href };

                  return (
                    <LinkComponent
                      key={index}
                      {...linkProps}
                      className="group animate-fade-in-up rounded-2xl bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
                      style={{ animationDelay: `${200 + index * 100}ms` }}
                    >
                      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                        <Icon size={24} className="text-primary" />
                      </div>
                      <h3 className="mb-2 text-lg font-bold text-neutral-900">
                        {t(link.titleKey)}
                      </h3>
                      <p className="mb-4 text-sm text-neutral-600">
                        {t(link.descKey)}
                      </p>
                      <div className="flex items-center gap-2 text-sm font-medium text-primary">
                        {isExternal ? t("help.openLink") : t("help.goTo")}
                        <IconArrowRight
                          size={16}
                          className="transition-transform group-hover:translate-x-1"
                        />
                      </div>
                    </LinkComponent>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-4xl">
              <FAQ />
            </div>
          </div>
        </section>

        {/* Still Need Help */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl">
              <div className="animate-fade-in-up rounded-2xl bg-gradient-to-br from-secondary via-secondary to-secondary-dark p-8 text-center text-white lg:p-12">
                <h2 className="mb-4 text-3xl font-bold">
                  {t("help.stillNeedHelp")}
                </h2>
                <p className="mb-6 text-lg text-white/90">
                  {t("help.stillNeedHelpDesc")}
                </p>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 font-semibold text-secondary transition-all hover:-translate-y-0.5 hover:shadow-lg"
                >
                  {t("help.contactUs")}
                  <IconArrowRight size={20} />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
