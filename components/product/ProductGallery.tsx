/**
 * @author Zakaria Tejjani
 * @date 2025-12-10
 */
"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { IconChevronRight, IconChevronLeft, IconZoomIn } from "@tabler/icons-react";
import { useRTL } from "@/hooks/useRTL";
import type { Product } from "@/data/products";

interface ProductGalleryProps {
  product: Product;
}

export default function ProductGallery({ product }: ProductGalleryProps) {
  const t = useTranslations();
  const isRTL = useRTL();
  const images = product.images || [product.image];
  const [activeIndex, setActiveIndex] = useState(0);

  const nextImage = () => {
    setActiveIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setActiveIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="group relative aspect-square overflow-hidden rounded-3xl bg-neutral-100">
        {/* Badge */}
        {product.badge && (
          <div
            className={`absolute start-4 top-4 z-10 rounded-full px-4 py-1.5 text-sm font-semibold text-white ${
              product.badge === "sale"
                ? "bg-primary"
                : product.badge === "new"
                ? "bg-secondary"
                : "bg-accent"
            }`}
          >
            {product.badge === "sale" && product.originalPrice && (
              <span>
                -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
              </span>
            )}
            {product.badge !== "sale" && t(`badges.${product.badge}`)}
          </div>
        )}

        {/* Image placeholder */}
        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-neutral-100 to-neutral-200">
          <IconZoomIn size={64} className="text-neutral-300" />
        </div>

        {/* Navigation arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute start-4 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-neutral-700 opacity-0 shadow-lg transition-all hover:bg-white group-hover:opacity-100"
            >
              {isRTL ? <IconChevronRight size={20} /> : <IconChevronLeft size={20} />}
            </button>
            <button
              onClick={nextImage}
              className="absolute end-4 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-neutral-700 opacity-0 shadow-lg transition-all hover:bg-white group-hover:opacity-100"
            >
              {isRTL ? <IconChevronLeft size={20} /> : <IconChevronRight size={20} />}
            </button>
          </>
        )}

        {/* Image counter */}
        {images.length > 1 && (
          <div className="absolute bottom-4 start-1/2 z-10 -translate-x-1/2 rounded-full bg-black/50 px-3 py-1 text-sm text-white">
            {activeIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-3">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`relative h-20 w-20 overflow-hidden rounded-xl bg-neutral-100 transition-all ${
                index === activeIndex
                  ? "ring-2 ring-primary ring-offset-2"
                  : "opacity-60 hover:opacity-100"
              }`}
            >
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-neutral-100 to-neutral-200">
                <IconZoomIn size={24} className="text-neutral-300" />
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
