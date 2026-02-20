/**
 * @author Zakaria Tejjani
 * @date 2025-12-10
 */
"use client";

import { useTranslations } from "next-intl";
import { IconStarFilled, IconThumbUp, IconCheck } from "@tabler/icons-react";
import type { Product } from "@/data/products";

interface CustomerReviewsProps {
  product: Product;
}

// Sample reviews data
const sampleReviews = [
  {
    id: 1,
    nameKey: "productPage.reviews.reviewer1.name",
    rating: 5,
    dateKey: "productPage.reviews.reviewer1.date",
    commentKey: "productPage.reviews.reviewer1.comment",
    verified: true,
    helpful: 24,
  },
  {
    id: 2,
    nameKey: "productPage.reviews.reviewer2.name",
    rating: 5,
    dateKey: "productPage.reviews.reviewer2.date",
    commentKey: "productPage.reviews.reviewer2.comment",
    verified: true,
    helpful: 18,
  },
  {
    id: 3,
    nameKey: "productPage.reviews.reviewer3.name",
    rating: 4,
    dateKey: "productPage.reviews.reviewer3.date",
    commentKey: "productPage.reviews.reviewer3.comment",
    verified: true,
    helpful: 12,
  },
];

export default function CustomerReviews({ product }: CustomerReviewsProps) {
  const t = useTranslations();

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <IconStarFilled
        key={i}
        size={16}
        className={i < rating ? "text-amber-400" : "text-neutral-200"}
      />
    ));
  };

  // Calculate rating distribution (simulated)
  const ratingDistribution = [
    { stars: 5, percentage: 72 },
    { stars: 4, percentage: 18 },
    { stars: 3, percentage: 6 },
    { stars: 2, percentage: 3 },
    { stars: 1, percentage: 1 },
  ];

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="mb-8 text-2xl font-bold text-neutral-900">
          {t("productPage.reviews.title")}
        </h2>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Rating Overview */}
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="mb-6 text-center">
              <div className="text-5xl font-bold text-neutral-900">
                {product.rating}
              </div>
              <div className="my-2 flex justify-center gap-1">
                {renderStars(Math.round(product.rating))}
              </div>
              <p className="text-neutral-500">
                {t("productPage.reviews.basedOn", { count: product.reviewCount })}
              </p>
            </div>

            {/* Rating Distribution */}
            <div className="space-y-2">
              {ratingDistribution.map((item) => (
                <div key={item.stars} className="flex items-center gap-3">
                  <span className="w-8 text-sm text-neutral-600">
                    {item.stars} <IconStarFilled size={12} className="inline text-amber-400" />
                  </span>
                  <div className="flex-1 h-2 rounded-full bg-neutral-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-amber-400"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                  <span className="w-10 text-end text-sm text-neutral-500">
                    {item.percentage}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Reviews List */}
          <div className="lg:col-span-2 space-y-4">
            {sampleReviews.map((review) => (
              <div
                key={review.id}
                className="rounded-2xl bg-white p-6 shadow-sm"
              >
                <div className="mb-4 flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-neutral-900">
                        {t(review.nameKey)}
                      </span>
                      {review.verified && (
                        <span className="flex items-center gap-1 rounded-full bg-secondary/10 px-2 py-0.5 text-xs text-secondary">
                          <IconCheck size={12} />
                          {t("productPage.reviews.verified")}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-neutral-500">{t(review.dateKey)}</p>
                  </div>
                  <div className="flex gap-0.5">{renderStars(review.rating)}</div>
                </div>

                <p className="mb-4 text-neutral-700 leading-relaxed">
                  {t(review.commentKey)}
                </p>

                <button className="flex items-center gap-2 text-sm text-neutral-500 transition-colors hover:text-primary">
                  <IconThumbUp size={16} />
                  <span>{t("productPage.reviews.helpful")} ({review.helpful})</span>
                </button>
              </div>
            ))}

            {/* Load More */}
            <button className="w-full rounded-xl border-2 border-dashed border-neutral-200 py-4 text-neutral-600 transition-colors hover:border-primary hover:text-primary">
              {t("productPage.reviews.loadMore")}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
