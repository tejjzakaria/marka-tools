/**
 * @author Zakaria Tejjani
 * @date 2025-12-10
 */
"use client";
import { useRTL } from "@/hooks/useRTL";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import {
  IconStar,
  IconStarFilled,
  IconShoppingCartPlus,
  IconArrowLeft,
  IconArrowRight,
  IconLoader2,
} from "@tabler/icons-react";
import { formatPriceSimple } from "@/data";
import { DBProduct } from "@/types/product";

export default function FeaturedProducts() {
  const t = useTranslations();
  const isRTL = useRTL();
  const [products, setProducts] = useState<DBProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products?limit=8&sort=bestseller");
        const data = await response.json();
        if (data.success) {
          setProducts(data.products);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

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

  if (loading) {
    return (
      <section className="bg-neutral-50 py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center py-20">
            <IconLoader2 size={40} className="animate-spin text-primary" />
          </div>
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="bg-neutral-50 py-16 lg:py-24">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="mb-12 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div>
            <h2 className="text-3xl font-bold text-neutral-900 lg:text-4xl">
              {t("sections.featuredProducts.title")}
            </h2>
            <p className="mt-2 text-neutral-600">
              {t("sections.featuredProducts.subtitle")}
            </p>
          </div>
          <Link
            href="/shop"
            className="group flex items-center gap-2 font-medium text-primary transition-colors hover:text-primary-dark"
          >
            {t("common.viewAll")}
            {isRTL ? (
              <IconArrowLeft
                size={18}
                className="transition-transform group-hover:-translate-x-1"
              />
            ) : (
              <IconArrowRight
                size={18}
                className="transition-transform group-hover:translate-x-1"
              />
            )}
          </Link>
        </div>

        {/* Products grid */}
        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {products.map((product, index) => (
            <Link
              key={product._id}
              href={`/product/${product.slug}`}
              className="group relative overflow-hidden rounded-2xl bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              style={{ animationDelay: `${index * 100}ms` }}
            >
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
                    <span className="text-xs text-neutral-400">
                      [Product Image]
                    </span>
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

                {/* Add to cart overlay */}
                <div className="absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-black/60 to-transparent p-4 transition-transform duration-300 group-hover:translate-y-0">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      // Add to cart logic here
                    }}
                    className="flex w-full items-center justify-center gap-2 rounded-full bg-white py-2.5 text-sm font-semibold text-neutral-900 transition-colors hover:bg-primary hover:text-white"
                  >
                    <IconShoppingCartPlus size={18} />
                    {t("common.addToCart")}
                  </button>
                </div>
              </div>

              {/* Product info */}
              <div className="p-4">
                {/* Rating */}
                <div className="mb-2 flex items-center gap-1">
                  <div className="flex">{renderStars(product.rating)}</div>
                  <span className="text-xs text-neutral-500">
                    ({product.reviewCount})
                  </span>
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
          ))}
        </div>
      </div>
    </section>
  );
}
