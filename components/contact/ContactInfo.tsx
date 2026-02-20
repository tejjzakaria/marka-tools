/**
 * @author Zakaria Tejjani
 * @date 2025-12-10
 */
"use client";

import { useTranslations } from "next-intl";
import {
  IconPhone,
  IconMail,
  IconMapPin,
  IconClock,
  IconBrandWhatsapp,
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandX,
} from "@tabler/icons-react";
import { siteConfig } from "@/data/config";

const contactMethods = [
  {
    icon: IconPhone,
    labelKey: "contact.info.phone",
    value: siteConfig.contact.phone,
    href: `tel:${siteConfig.contact.phone}`,
  },
  {
    icon: IconMail,
    labelKey: "contact.info.email",
    value: siteConfig.contact.email,
    href: `mailto:${siteConfig.contact.email}`,
  },
  {
    icon: IconMapPin,
    labelKey: "contact.info.address",
    value: `${siteConfig.contact.address.city}, ${siteConfig.contact.address.country}`,
    href: null,
  },
  {
    icon: IconClock,
    labelKey: "contact.info.hours",
    value: null,
    href: null,
  },
];

const socialLinks = [
  {
    icon: IconBrandWhatsapp,
    name: "WhatsApp",
    href: `https://wa.me/${siteConfig.social.whatsapp.replace(/^0/, "212")}`,
    color: "hover:bg-green-500",
  },
  {
    icon: IconBrandInstagram,
    name: "Instagram",
    href: siteConfig.social.instagram,
    color: "hover:bg-pink-500",
  }
];

export default function ContactInfo() {
  const t = useTranslations();

  return (
    <div className="space-y-8">
      {/* Contact Card */}
      <div className="animate-fade-in-up rounded-3xl bg-white p-8 shadow-xl lg:p-10">
        <h2 className="mb-2 text-2xl font-bold text-neutral-900">
          {t("contact.info.title")}
        </h2>
        <p className="mb-8 text-neutral-600">{t("contact.info.subtitle")}</p>

        <div className="space-y-6">
          {contactMethods.map((method, index) => (
            <div key={index} className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                <method.icon size={24} className="text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-neutral-900">
                  {t(method.labelKey)}
                </h3>
                {method.value ? (
                  method.href ? (
                    <a
                      href={method.href}
                      className="text-neutral-600 transition-colors hover:text-primary"
                    >
                      {method.value}
                    </a>
                  ) : (
                    <p className="text-neutral-600">{method.value}</p>
                  )
                ) : (
                  <p className="text-neutral-600">
                    {t("contact.info.hoursValue")}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Social Links Card */}
      <div className="animate-fade-in-up animation-delay-200 rounded-3xl bg-white p-8 shadow-xl">
        <h3 className="mb-6 text-xl font-bold text-neutral-900">
          {t("contact.info.followUs")}
        </h3>
        <div className="flex flex-wrap gap-3">
          {socialLinks.map((social, index) => (
            <a
              key={index}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex h-12 w-12 items-center justify-center rounded-xl bg-neutral-100 text-neutral-600 transition-all hover:text-white ${social.color}`}
              aria-label={social.name}
            >
              <social.icon size={24} />
            </a>
          ))}
        </div>
      </div>

      
    </div>
  );
}
