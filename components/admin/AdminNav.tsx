/**
 * @author Zakaria Tejjani
 * @date 2025-12-10
 */
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  IconPackage,
  IconShoppingCart,
  IconHome,
  IconPlus,
  IconList,
  IconLogout,
  IconBrandWhatsapp,
  IconMail,
  IconSettings,
  IconShieldCheck,
} from "@tabler/icons-react";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useAdminAuth } from "@/context/AdminAuthContext";

export default function AdminNav() {
  const t = useTranslations("admin");
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAdminAuth();

  const navItems = [
    {
      href: "/admin/add-product",
      label: t("nav.addProduct"),
      icon: IconPlus,
    },
    {
      href: "/admin/orders",
      label: t("nav.orders"),
      icon: IconShoppingCart,
    },
    {
      href: "/admin/products",
      label: t("nav.products"),
      icon: IconList,
    },
    {
      href: "/admin/whatsapp-subscribers",
      label: t("nav.whatsappSubscribers"),
      icon: IconBrandWhatsapp,
    },
    {
      href: "/admin/contacts",
      label: t("nav.contacts"),
      icon: IconMail,
    },
    {
      href: "/admin/settings",
      label: t("nav.settings"),
      icon: IconSettings,
    },
    {
      href: "/admin/whitelist",
      label: t("nav.whitelist"),
      icon: IconShieldCheck,
    },
  ];

  return (
    <nav className="mb-8 rounded-2xl bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Logo / Title */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <IconPackage size={24} className="text-primary" />
          </div>
          <div>
            <h1 className="font-bold text-neutral-900">{t("nav.title")}</h1>
            <p className="text-xs text-neutral-500">{t("nav.subtitle")}</p>
          </div>
        </div>

        {/* Nav Links */}
        <div className="flex flex-wrap items-center gap-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                  isActive
                    ? "bg-primary text-white"
                    : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                }`}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}

          {/* Back to Store */}
          <Link
            href="/"
            className="flex items-center gap-2 rounded-xl bg-neutral-100 px-4 py-2 text-sm font-medium text-neutral-600 transition-all hover:bg-neutral-200"
          >
            <IconHome size={18} />
            {t("nav.backToStore")}
          </Link>

          {/* Language Switcher */}
          <LanguageSwitcher />

          {/* Logout Button */}
          <button
            onClick={() => {
              logout();
              router.push("/");
            }}
            className="flex items-center gap-2 rounded-xl bg-error/10 px-4 py-2 text-sm font-medium text-error transition-all hover:bg-error/20"
          >
            <IconLogout size={18} />
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
