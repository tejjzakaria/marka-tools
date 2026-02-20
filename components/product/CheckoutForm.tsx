/**
 * @author Zakaria Tejjani
 * @date 2025-12-10
 */
"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  IconUser,
  IconPhone,
  IconMapPin,
  IconLoader2,
  IconShoppingBag,
  IconLock,
  IconCash,
} from "@tabler/icons-react";
import type { Product } from "@/data/products";
import { formatPriceSimple, siteConfig } from "@/data/config";

interface CheckoutFormProps {
  product: Product;
}

export default function CheckoutForm({ product }: CheckoutFormProps) {
  const t = useTranslations();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
  });

  const totalPrice = product.price * quantity;
  const savings = product.originalPrice
    ? (product.originalPrice - product.price) * quantity
    : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    // Reset form or redirect
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="rounded-3xl border-2 border-primary/20 bg-white p-6 shadow-xl lg:p-8">
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
          <IconShoppingBag size={24} className="text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-neutral-900">
            {t("productPage.checkout.title")}
          </h2>
          <p className="text-sm text-neutral-500">
            {t("productPage.checkout.subtitle")}
          </p>
        </div>
      </div>

      {/* Order Summary */}
      <div className="mb-6 rounded-2xl bg-neutral-50 p-4">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-neutral-600">{t("productPage.checkout.product")}</span>
          <span className="font-medium text-neutral-900">{t(product.nameKey)}</span>
        </div>

        {/* Quantity Selector */}
        <div className="mb-3 flex items-center justify-between">
          <span className="text-neutral-600">{t("productPage.checkout.quantity")}</span>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-neutral-700 shadow-sm transition-colors hover:bg-neutral-100"
            >
              -
            </button>
            <span className="w-8 text-center font-semibold">{quantity}</span>
            <button
              type="button"
              onClick={() => setQuantity(quantity + 1)}
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-neutral-700 shadow-sm transition-colors hover:bg-neutral-100"
            >
              +
            </button>
          </div>
        </div>

        <div className="mb-3 flex items-center justify-between">
          <span className="text-neutral-600">{t("productPage.checkout.unitPrice")}</span>
          <span className="font-medium text-neutral-900">
            {formatPriceSimple(product.price)}
          </span>
        </div>

        {savings > 0 && (
          <div className="mb-3 flex items-center justify-between text-secondary">
            <span>{t("productPage.checkout.savings")}</span>
            <span className="font-medium">-{formatPriceSimple(savings)}</span>
          </div>
        )}

        <div className="border-t border-neutral-200 pt-3">
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold text-neutral-900">
              {t("productPage.checkout.total")}
            </span>
            <span className="text-2xl font-bold text-primary">
              {formatPriceSimple(totalPrice)}
            </span>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label
            htmlFor="name"
            className="mb-2 block text-sm font-medium text-neutral-700"
          >
            {t("productPage.checkout.name")} <span className="text-primary">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="h-12 w-full rounded-xl border border-neutral-200 bg-neutral-50 pe-4 ps-12 text-neutral-900 transition-all placeholder:text-neutral-400 focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
              placeholder={t("productPage.checkout.namePlaceholder")}
            />
            <IconUser
              size={20}
              className="absolute start-4 top-1/2 -translate-y-1/2 text-neutral-400"
            />
          </div>
        </div>

        {/* Phone */}
        <div>
          <label
            htmlFor="phone"
            className="mb-2 block text-sm font-medium text-neutral-700"
          >
            {t("productPage.checkout.phone")} <span className="text-primary">*</span>
          </label>
          <div className="relative">
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="h-12 w-full rounded-xl border border-neutral-200 bg-neutral-50 pe-4 ps-12 text-neutral-900 transition-all placeholder:text-neutral-400 focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
              placeholder={t("productPage.checkout.phonePlaceholder")}
            />
            <IconPhone
              size={20}
              className="absolute start-4 top-1/2 -translate-y-1/2 text-neutral-400"
            />
          </div>
        </div>

        {/* Address */}
        <div>
          <label
            htmlFor="address"
            className="mb-2 block text-sm font-medium text-neutral-700"
          >
            {t("productPage.checkout.address")} <span className="text-primary">*</span>
          </label>
          <div className="relative">
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              rows={3}
              className="w-full resize-none rounded-xl border border-neutral-200 bg-neutral-50 p-4 ps-12 text-neutral-900 transition-all placeholder:text-neutral-400 focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
              placeholder={t("productPage.checkout.addressPlaceholder")}
            />
            <IconMapPin
              size={20}
              className="absolute start-4 top-4 text-neutral-400"
            />
          </div>
        </div>

        {/* COD Notice */}
        <div className="flex items-center gap-3 rounded-xl bg-amber-50 p-4">
          <IconCash size={24} className="shrink-0 text-amber-600" />
          <p className="text-sm text-amber-800">
            {t("productPage.checkout.codNotice")}
          </p>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex w-full items-center justify-center gap-3 rounded-xl bg-primary py-4 text-lg font-bold text-white transition-all hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? (
            <>
              <IconLoader2 size={24} className="animate-spin" />
              {t("productPage.checkout.processing")}
            </>
          ) : (
            <>
              <IconShoppingBag size={24} />
              {t("productPage.checkout.placeOrder")}
            </>
          )}
        </button>

        {/* Security Badge */}
        <div className="flex items-center justify-center gap-2 text-sm text-neutral-500">
          <IconLock size={16} />
          <span>{t("productPage.checkout.secure")}</span>
        </div>
      </form>
    </div>
  );
}
