/**
 * @author Zakaria Tejjani
 * @date 2025-12-10
 */
"use client";

import { useTranslations } from "next-intl";
import { IconHome, IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { useRTL } from "@/hooks/useRTL";

interface BreadcrumbItem {
  labelKey: string;
  href?: string;
}

interface ShopBreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function ShopBreadcrumb({ items }: ShopBreadcrumbProps) {
  const t = useTranslations();
  const isRTL = useRTL();

  return (
    <nav className="mb-6">
      <ol className="flex flex-wrap items-center gap-2 text-sm">
        <li>
          <a
            href="/"
            className="flex items-center gap-1 text-neutral-500 transition-colors hover:text-primary"
          >
            <IconHome size={16} />
            <span>{t("nav.home")}</span>
          </a>
        </li>
        {items.map((item, index) => (
          <li key={index} className="flex items-center gap-2">
            {isRTL ? (
              <IconChevronLeft size={14} className="text-neutral-400" />
            ) : (
              <IconChevronRight size={14} className="text-neutral-400" />
            )}
            {item.href ? (
              <a
                href={item.href}
                className="text-neutral-500 transition-colors hover:text-primary"
              >
                {t(item.labelKey)}
              </a>
            ) : (
              <span className="font-medium text-neutral-900">
                {t(item.labelKey)}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
