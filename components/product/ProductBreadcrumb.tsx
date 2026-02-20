/**
 * @author Zakaria Tejjani
 * @date 2025-12-10
 */
"use client";

import { useTranslations } from "next-intl";
import type { Product } from "@/data/products";

interface ProductBreadcrumbProps {
  product: Product;
}

export default function ProductBreadcrumb({ product }: ProductBreadcrumbProps) {
  const t = useTranslations();

  return (
    <div className="border-b border-neutral-100 bg-white">
      <div className="container mx-auto px-4 py-4">
        <nav className="text-sm text-neutral-500">
          <a href="/" className="hover:text-primary">
            {t("nav.home")}
          </a>
          <span className="mx-2">/</span>
          <a href="/shop" className="hover:text-primary">
            {t("nav.shop")}
          </a>
          <span className="mx-2">/</span>
          <span className="text-neutral-900">{t(product.nameKey)}</span>
        </nav>
      </div>
    </div>
  );
}
