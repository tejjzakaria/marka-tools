/**
 * @author Zakaria Tejjani
 * @date 2025-12-10
 */
"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import Image from "next/image";
import {
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandTwitter,
  IconBrandWhatsapp,
  IconMapPin,
  IconPhone,
  IconMail,
  IconCreditCard,
  IconTruck,
  IconShieldCheck,
} from "@tabler/icons-react";
import { siteConfig, footerNavigation, getFeaturedCategories } from "@/data";
import { useTrackOrder } from "@/context";

export default function Footer() {
  const t = useTranslations();
  const featuredCategories = getFeaturedCategories().slice(0, 6);
  const { openModal } = useTrackOrder();


  const socialLinks = [
    { icon: IconBrandInstagram, href: siteConfig.social.instagram, label: "Instagram" },
    { icon: IconBrandWhatsapp, href: `https://wa.me/${siteConfig.social.whatsapp.replace(/^0/, "212")}`, label: "WhatsApp" },
  ];

  const paymentMethods = ["cod"];

  return (
    <footer className="bg-neutral-900 text-white">
      {/* Trust badges */}
      <div className="border-b border-white/10">
        <div className="container mx-auto px-4 py-6 sm:py-8">
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4 md:gap-6">
            {[
              { icon: IconTruck, titleKey: "footer.trust.shipping", descKey: "footer.trust.shippingDesc" },
              { icon: IconShieldCheck, titleKey: "footer.trust.secure", descKey: "footer.trust.secureDesc" },
              { icon: IconCreditCard, titleKey: "footer.trust.payment", descKey: "footer.trust.paymentDesc" },
              { icon: IconPhone, titleKey: "footer.trust.support", descKey: "footer.trust.supportDesc" },
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-3 sm:gap-4">
                <div className="rounded-xl bg-white/10 p-2 sm:p-3">
                  <item.icon size={20} className="text-primary-light sm:size-6" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white sm:text-base">{t(item.titleKey)}</h4>
                  <p className="text-xs text-neutral-400 sm:text-sm">{t(item.descKey)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main footer content */}
      <div className="container mx-auto px-4 py-12 lg:py-16">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <Image src="/marka-tools%20logo.jpg" alt="Marka Tools Logo" width={280} height={140} className="h-auto w-[220px] lg:w-[280px]" />

            <p className="mb-6 max-w-sm text-neutral-400 mt-6">
              {t("footer.description")}
            </p>

            {/* Contact info */}
            <div className="space-y-3">
              <a
                href={`tel:${siteConfig.contact.phone}`}
                className="flex items-center gap-3 text-neutral-400 transition-colors hover:text-white"
              >
                <IconPhone size={18} />
                <span>{siteConfig.contact.phone}</span>
              </a>
              <a
                href={`mailto:${siteConfig.contact.email}`}
                className="flex items-center gap-3 text-neutral-400 transition-colors hover:text-white"
              >
                <IconMail size={18} />
                <span>{siteConfig.contact.email}</span>
              </a>
              <div className="flex items-center gap-3 text-neutral-400">
                <IconMapPin size={18} />
                <span>
                  {siteConfig.contact.address.city}, {siteConfig.contact.address.country}
                </span>
              </div>
            </div>

            {/* Social links */}
            <div className="mt-6 flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-white/10 p-2.5 text-neutral-400 transition-all hover:bg-primary hover:text-white"
                  aria-label={social.label}
                >
                  <social.icon size={20} />
                </a>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="mb-4 text-base font-semibold text-white sm:text-lg">{t("footer.categories")}</h3>
            <ul className="space-y-2">
              {featuredCategories.map((category) => (
                <li key={category.id}>
                  <Link
                    href={`/shop?category=${category.id}`}
                    className="text-neutral-400 transition-colors hover:text-white"
                  >
                    {t(category.translationKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer service */}
          <div>
            <h3 className="mb-4 text-base font-semibold text-white sm:text-lg">{t("footer.customerService")}</h3>
            <ul className="space-y-2">
              {footerNavigation.support.map((item) => (
                <li key={item.id}>
                  {item.id === "track-order" ? (
                    <button
                      onClick={openModal}
                      className="text-neutral-400 transition-colors hover:text-white"
                    >
                      {t(item.translationKey)}
                    </button>
                  ) : (
                    <Link
                      href={item.href}
                      className="text-neutral-400 transition-colors hover:text-white"
                    >
                      {t(item.translationKey)}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="mb-4 text-base font-semibold text-white sm:text-lg">{t("footer.legal")}</h3>
            <ul className="space-y-2">
              {footerNavigation.legal.map((item) => (
                <li key={item.id}>
                  <Link
                    href={item.href}
                    className="text-neutral-400 transition-colors hover:text-white"
                  >
                    {t(item.translationKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="container mx-auto flex flex-col items-center justify-center gap-4 px-4 py-6 md:flex-row md:justify-between">
          <p className="text-xs text-neutral-500 sm:text-sm">
            © {new Date().getFullYear()} {siteConfig.name}. {t("footer.rights")}
          </p>

          {/* Payment methods */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-neutral-500 me-2 sm:text-sm">{t("footer.paymentMethods")}</span>
            {paymentMethods.map((method) => (
              <div
                key={method}
                className="flex h-6 w-10 items-center justify-center rounded bg-white/10 text-xs font-medium text-neutral-400 sm:h-8 sm:w-12"
              >
                {method.toUpperCase()}
              </div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
