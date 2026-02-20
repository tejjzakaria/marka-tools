/**
 * @author Zakaria Tejjani
 * @date 2025-12-10
 */
"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import {
  IconStar,
  IconStarFilled,
  IconShoppingCartPlus,
  IconEye,
  IconCheck,
} from "@tabler/icons-react";
import { formatPriceSimple } from "@/data";
import { DBProduct } from "@/types/product";
import { useCart } from "@/context";
import { trackAddToCart } from "@/lib/facebook-pixel";

interface ProductCardProps {
  product: DBProduct;
  view?: "grid" | "list";
}

export default function ProductCard({ product, view = "grid" }: ProductCardProps) {
  const t = useTranslations();
  const { addToCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const handleAddToCart = () => {
    if (!product.inStock || isAdding) return;

    setIsAdding(true);
    addToCart({
      id: product._id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.image,
      offers: product.offers,
    });

    // Track AddToCart event
    trackAddToCart({
      content_ids: [product._id],
      content_name: product.name,
      value: product.price,
    });

    setJustAdded(true);
    setTimeout(() => {
      setIsAdding(false);
      setTimeout(() => setJustAdded(false), 2000);
    }, 300);
  };

  const getBadgeStyle = (badge?: string) => {
    switch (badge) {
      case "sale":
        return "bg-primary text-white";
      case "new":
        return "bg-secondary text-white";
      case "bestseller":
        return "bg-accent text-white";
      default:
        return "";
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => {
      const filled = i < Math.floor(rating);
      return filled ? (
        <IconStarFilled key={i} size={14} className="text-accent" />
      ) : (
        <IconStar key={i} size={14} className="text-neutral-300" />
      );
    });
  };

  const discountPercentage = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  if (view === "list") {
    return (
      <Link href={`/product/${product.slug}`} className="group flex gap-6 overflow-hidden rounded-2xl bg-white p-4 shadow-sm transition-all duration-300 hover:shadow-lg">
        {/* Image */}
        <div className="relative h-48 w-48 flex-shrink-0 overflow-hidden rounded-xl bg-neutral-100">
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
              sizes="192px"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-neutral-100 to-neutral-200">
              <span className="text-xs text-neutral-400">[Image]</span>
            </div>
          )}
          {product.badge && (
            <span
              className={`absolute start-2 top-2 rounded-full px-2 py-1 text-xs font-semibold ${getBadgeStyle(product.badge)}`}
            >
              {t(`badges.${product.badge}`)}
            </span>
          )}
          {!product.inStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <span className="rounded-full bg-white px-3 py-1 text-sm font-medium text-neutral-900">
                {t("shop.outOfStock")}
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col justify-between">
          <div>
            {/* Rating */}
            <div className="mb-2 flex items-center gap-2">
              <div className="flex">{renderStars(product.rating)}</div>
              <span className="text-sm text-neutral-500">
                ({product.reviewCount} {t("shop.reviews")})
              </span>
            </div>

            {/* Name */}
            <h3 className="mb-2 text-lg font-semibold text-neutral-900 transition-colors group-hover:text-primary">
              {product.name}
            </h3>

            {/* Price */}
            <div className="flex items-center gap-3">
              <span className="text-xl font-bold text-primary">
                {formatPriceSimple(product.price)}
              </span>
              {product.originalPrice && (
                <>
                  <span className="text-neutral-400 line-through">
                    {formatPriceSimple(product.originalPrice)}
                  </span>
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-sm font-semibold text-primary">
                    -{discountPercentage}%
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="mt-4 flex items-center gap-2">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleAddToCart();
              }}
              disabled={!product.inStock || isAdding}
              className={`flex flex-1 items-center justify-center gap-2 rounded-full px-6 py-3 font-semibold text-white transition-all disabled:cursor-not-allowed disabled:opacity-50 ${
                justAdded ? "bg-success" : "bg-primary hover:bg-primary-dark"
              }`}
            >
              {justAdded ? (
                <>
                  <IconCheck size={20} />
                  {t("common.added")}
                </>
              ) : (
                <>
                  <IconShoppingCartPlus size={20} />
                  {t("common.addToCart")}
                </>
              )}
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              className="rounded-full border border-neutral-200 p-3 text-neutral-600 transition-all hover:border-primary hover:text-primary"
            >
              <IconEye size={20} />
            </button>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/product/${product.slug}`} className="group relative overflow-hidden rounded-2xl bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      {/* Image container */}
      <div className="relative aspect-square overflow-hidden bg-neutral-100">
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-neutral-100 to-neutral-200">
            <span className="text-xs text-neutral-400">[Product Image]</span>
          </div>
        )}

        {/* Badge */}
        {product.badge && (
          <span
            className={`absolute start-3 top-3 rounded-full px-3 py-1 text-xs font-semibold ${getBadgeStyle(product.badge)}`}
          >
            {t(`badges.${product.badge}`)}
          </span>
        )}

        {/* Discount percentage */}
        {discountPercentage > 0 && (
          <span className="absolute end-3 top-3 rounded-full bg-primary px-2 py-1 text-xs font-bold text-white">
            -{discountPercentage}%
          </span>
        )}

        {/* Out of stock overlay */}
        {!product.inStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <span className="rounded-full bg-white px-4 py-2 text-sm font-medium text-neutral-900">
              {t("shop.outOfStock")}
            </span>
          </div>
        )}

        {/* Quick actions */}
        <div className="absolute end-3 top-14 flex flex-col gap-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            className="rounded-full bg-white p-2 shadow-md transition-colors hover:bg-primary hover:text-white"
          >
            <IconEye size={18} />
          </button>
        </div>

        {/* Add to cart overlay */}
        <div className="absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-black/60 to-transparent p-4 transition-transform duration-300 group-hover:translate-y-0">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleAddToCart();
            }}
            disabled={!product.inStock || isAdding}
            className={`flex w-full items-center justify-center gap-2 rounded-full py-2.5 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
              justAdded
                ? "bg-success text-white"
                : "bg-white text-neutral-900 hover:bg-primary hover:text-white"
            }`}
          >
            {justAdded ? (
              <>
                <IconCheck size={18} />
                {t("common.added")}
              </>
            ) : (
              <>
                <IconShoppingCartPlus size={18} />
                {t("common.addToCart")}
              </>
            )}
          </button>
        </div>
      </div>

      {/* Product info */}
      <div className="p-4">
        {/* Rating */}
        <div className="mb-2 flex items-center gap-1">
          <div className="flex">{renderStars(product.rating)}</div>
          <span className="text-xs text-neutral-500">({product.reviewCount})</span>
        </div>

        {/* Name */}
        <h3 className="mb-2 line-clamp-2 font-semibold text-neutral-800 transition-colors group-hover:text-primary">
          {product.name}
        </h3>

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-primary">
            {formatPriceSimple(product.price)}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-neutral-400 line-through">
              {formatPriceSimple(product.originalPrice)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
