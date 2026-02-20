/**
 * @author Zakaria Tejjani
 * @date 2025-12-10
 */
"use client";

import { useTranslations } from "next-intl";
import {
  IconStar,
  IconStarFilled,
  IconCheck,
  IconShieldCheck,
  IconTruck,
  IconRefresh,
  IconShoppingCart,
} from "@tabler/icons-react";
import type { Product } from "@/data/products";
import { formatPriceSimple } from "@/data/config";
import { useCart } from "@/context";

interface ProductInfoProps {
  product: Product;
}

export default function ProductInfo({ product }: ProductInfoProps) {
  const t = useTranslations();
  const { addToCart } = useCart();

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <IconStarFilled key={i} size={18} className="text-amber-400" />
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <IconStarFilled key={i} size={18} className="text-amber-400" />
        );
      } else {
        stars.push(<IconStar key={i} size={18} className="text-neutral-300" />);
      }
    }
    return stars;
  };

  return (
    <div className="space-y-6">
      {/* Category & Badge */}
      <div className="flex flex-wrap items-center gap-3">
        <span className="rounded-full bg-neutral-100 px-3 py-1 text-sm text-neutral-600">
          {t(`categories.${product.categoryId}`)}
        </span>
        {product.badge && (
          <span
            className={`rounded-full px-3 py-1 text-sm font-medium text-white ${
              product.badge === "sale"
                ? "bg-primary"
                : product.badge === "new"
                ? "bg-secondary"
                : "bg-accent"
            }`}
          >
            {t(`badges.${product.badge}`)}
          </span>
        )}
      </div>

      {/* Product Name */}
      <h1 className="text-3xl font-bold text-neutral-900 lg:text-4xl">
        {t(product.nameKey)}
      </h1>

      {/* Rating & Reviews */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1">{renderStars(product.rating)}</div>
        <span className="font-semibold text-neutral-900">{product.rating}</span>
        <span className="text-neutral-500">
          ({product.reviewCount} {t("productPage.reviewsCount")})
        </span>
        {product.soldCount && (
          <span className="text-neutral-500">
            • {product.soldCount.toLocaleString()} {t("productPage.sold")}
          </span>
        )}
      </div>

      {/* Short Description */}
      {product.shortDescriptionKey && (
        <p className="text-lg text-neutral-600">
          {t(product.shortDescriptionKey)}
        </p>
      )}

      {/* Price */}
      <div className="flex items-end gap-4">
        <span className="text-4xl font-bold text-primary">
          {formatPriceSimple(product.price)}
        </span>
        {product.originalPrice && (
          <>
            <span className="text-xl text-neutral-400 line-through">
              {formatPriceSimple(product.originalPrice)}
            </span>
            <span className="rounded-lg bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
              -{discount}%
            </span>
          </>
        )}
      </div>

      {/* Add to Cart Button */}
      <button
        onClick={() => addToCart({
          id: product.id,
          slug: product.slug,
          name: t(product.nameKey),
          price: product.price,
          originalPrice: product.originalPrice,
          image: product.image,
        })}
        className="flex w-full items-center justify-center gap-3 rounded-xl bg-secondary py-4 text-lg font-bold text-white transition-all hover:bg-secondary/90 hover:shadow-lg active:scale-[0.98]"
      >
        <IconShoppingCart size={24} />
        {t("productPage.addToCart")}
      </button>

      {/* Highlights */}
      {product.highlightsKeys && product.highlightsKeys.length > 0 && (
        <div className="rounded-2xl bg-neutral-50 p-6">
          <h3 className="mb-4 font-semibold text-neutral-900">
            {t("productPage.highlightsTitle")}
          </h3>
          <ul className="grid gap-3 sm:grid-cols-2">
            {product.highlightsKeys.map((highlightKey, index) => (
              <li key={index} className="flex items-center gap-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-secondary/20">
                  <IconCheck size={14} className="text-secondary" />
                </div>
                <span className="text-neutral-700">{t(highlightKey)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Trust Badges */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="flex items-center gap-3 rounded-xl bg-neutral-50 p-4">
          <IconTruck size={24} className="text-secondary" />
          <div>
            <p className="text-sm font-semibold text-neutral-900">
              {t("productPage.trust.freeShipping")}
            </p>
            <p className="text-xs text-neutral-500">
              {t("productPage.trust.freeShippingDesc")}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl bg-neutral-50 p-4">
          <IconRefresh size={24} className="text-secondary" />
          <div>
            <p className="text-sm font-semibold text-neutral-900">
              {t("productPage.trust.easyReturns")}
            </p>
            <p className="text-xs text-neutral-500">
              {product.guaranteeDays || 14} {t("productPage.trust.days")}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl bg-neutral-50 p-4">
          <IconShieldCheck size={24} className="text-secondary" />
          <div>
            <p className="text-sm font-semibold text-neutral-900">
              {t("productPage.trust.securePayment")}
            </p>
            <p className="text-xs text-neutral-500">
              {t("productPage.trust.securePaymentDesc")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
