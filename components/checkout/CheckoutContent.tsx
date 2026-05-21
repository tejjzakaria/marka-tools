/**
 * @author Zakaria Tejjani
 * @date 2025-12-10
 */
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import {
  IconUser,
  IconPhone,
  IconMapPin,
  IconLoader2,
  IconShoppingBag,
  IconLock,
  IconCash,
  IconTrash,
  IconPlus,
  IconMinus,
  IconArrowLeft,
  IconArrowRight,
  IconCheck,
  IconShoppingCart,
} from "@tabler/icons-react";
import { useCart } from "@/context";
import { useRTL } from "@/hooks/useRTL";
import { formatPriceSimple } from "@/data/config";
import { trackInitiateCheckout, trackPurchase } from "@/lib/facebook-pixel";

export default function CheckoutContent() {
  const t = useTranslations();
  const isRTL = useRTL();
  const {
    items,
    totalPrice,
    totalSavings,
    totalItems,
    removeFromCart,
    updateQuantity,
    updateSelectedOffer,
    clearCart,
  } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
  });

  // Track InitiateCheckout event when user reaches checkout page
  useEffect(() => {
    if (items.length > 0) {
      const contentIds = items.map((item) => item.product.id);
      trackInitiateCheckout({
        content_ids: contentIds,
        num_items: totalItems,
        value: totalPrice,
      });
    }
  }, []); // Only run once on mount

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.phone || !formData.address) {
      setSubmitError(t("checkout.form.error"));
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");

    try {
      const orderItems = items.map((item) => ({
        productId: item.product.id,
        productSlug: item.product.slug,
        productName: item.product.name,
        productImage: item.product.image,
        price: item.selectedOffer ? item.selectedOffer.price : item.product.price,
        originalPrice: item.product.originalPrice,
        quantity: item.quantity,
        selectedOffer: item.selectedOffer,
      }));

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerName: formData.name,
          customerPhone: formData.phone,
          customerAddress: formData.address,
          items: orderItems,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setOrderNumber(data.order.orderNumber);
        setOrderPlaced(true);

        // Track Purchase event in Facebook Pixel
        const contentIds = items.map((item) => item.product.id);
        trackPurchase({
          value: totalPrice,
          content_ids: contentIds,
          num_items: totalItems,
          content_name: `Order ${data.order.orderNumber}`,
        });

        clearCart();
      } else if (data.message === 'order_limit_reached') {
        setSubmitError(
          t("checkout.form.rateLimitError", { productName: data.productName })
        );
      } else {
        setSubmitError(data.message || t("checkout.form.error"));
      }
    } catch (error) {
      console.error("Order submission error:", error);
      setSubmitError(t("checkout.form.error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Order success state
  if (orderPlaced) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-lg text-center">
          <div className="animate-fade-in-up mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-secondary/10">
            <IconCheck size={48} className="text-secondary" />
          </div>
          <h1 className="animate-fade-in-up animation-delay-200 mb-4 text-3xl font-bold text-neutral-900">
            {t("checkout.success.title")}
          </h1>
          {orderNumber && (
            <div className="animate-fade-in-up animation-delay-400 mb-4 rounded-xl bg-neutral-50 p-4">
              <p className="text-sm text-neutral-600">{t("checkout.success.orderNumber")}</p>
              <p className="text-2xl font-bold text-primary">{orderNumber}</p>
            </div>
          )}
          <p className="animate-fade-in-up animation-delay-600 mb-8 text-lg text-neutral-600">
            {t("checkout.success.message")}
          </p>
          <a
            href="/shop"
            className="animate-fade-in-up animation-delay-800 inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-4 font-bold text-white transition-colors hover:bg-primary-dark"
          >
            <IconShoppingBag size={20} />
            {t("checkout.success.continueShopping")}
          </a>
        </div>
      </div>
    );
  }

  // Empty cart state
  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-lg text-center">
          <div className="animate-fade-in-up mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-neutral-100">
            <IconShoppingBag size={48} className="text-neutral-400" />
          </div>
          <h1 className="animate-fade-in-up animation-delay-200 mb-4 text-2xl font-bold text-neutral-900">
            {t("cart.empty")}
          </h1>
          <p className="animate-fade-in-up animation-delay-400 mb-8 text-neutral-600">{t("cart.emptyDesc")}</p>
          <a
            href="/shop"
            className="animate-fade-in-up animation-delay-600 inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-4 font-bold text-white transition-colors hover:bg-primary-dark"
          >
            {isRTL ? <IconArrowLeft size={20} /> : <IconArrowRight size={20} />}
            {t("cart.continueShopping")}
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 lg:py-12">
      {/* Page Header */}
      <div className="animate-fade-in-up mb-8">
        <a
          href="/shop"
          className="mb-4 inline-flex items-center gap-2 text-primary transition-colors hover:text-primary-dark"
        >
          {isRTL ? <IconArrowLeft size={20} /> : <IconArrowRight size={20} />}
          {t("cart.continueShopping")}
        </a>
        <h1 className="text-3xl font-bold text-neutral-900 lg:text-4xl">
          {t("checkout.title")}
        </h1>
        <p className="mt-2 text-neutral-600">
          {t("checkout.itemCount", { count: totalItems })}
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="animate-fade-in-up animation-delay-200 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-6 text-xl font-bold text-neutral-900">
              {t("checkout.orderSummary")}
            </h2>

            <div className="space-y-4">
              {items.map((item, index) => (
                <div
                  key={item.product.id}
                  className="animate-fade-in-up flex gap-4 rounded-xl bg-neutral-50 p-4"
                  style={{ animationDelay: `${400 + index * 100}ms` }}
                >
                  {/* Product Image */}
                  <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-neutral-200">
                    {item.product.image ? (
                      <Image
                        src={item.product.image}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                        sizes="96px"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <IconShoppingCart size={32} className="text-neutral-400" />
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="flex flex-1 flex-col">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-neutral-900">
                          {item.product.name}
                        </h3>
                        {item.product.originalPrice && (
                          <span className="text-sm text-neutral-400 line-through">
                            {formatPriceSimple(item.product.originalPrice)}
                          </span>
                        )}
                        <p className="text-lg font-bold text-primary">
                          {formatPriceSimple(
                            item.selectedOffer ? item.selectedOffer.price : item.product.price
                          )}
                        </p>

                        {/* Offer Selection */}
                        {item.product.offers && item.product.offers.length > 0 && (
                          <div className="mt-3 space-y-2">
                            <label className="flex cursor-pointer items-center gap-2 text-sm">
                              <input
                                type="radio"
                                name={`offer-${item.product.id}`}
                                checked={!item.selectedOffer}
                                onChange={() => updateSelectedOffer(item.product.id, null)}
                                className="h-3 w-3 text-primary"
                              />
                              <span className="text-neutral-600">
                                {t("productPage.checkout.regularPrice")} (
                                {formatPriceSimple(item.product.price)})
                              </span>
                            </label>
                            {item.product.offers.map((offer, offerIndex) => (
                              <label
                                key={offerIndex}
                                className="flex cursor-pointer items-center gap-2 text-sm"
                              >
                                <input
                                  type="radio"
                                  name={`offer-${item.product.id}`}
                                  checked={
                                    item.selectedOffer?.text === offer.text &&
                                    item.selectedOffer?.price === offer.price
                                  }
                                  onChange={() => updateSelectedOffer(item.product.id, offer)}
                                  className="h-3 w-3 text-primary"
                                />
                                <span className="text-primary font-medium">
                                  {offer.text} ({formatPriceSimple(offer.price)})
                                </span>
                              </label>
                            ))}
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="rounded-full p-2 text-neutral-400 transition-colors hover:bg-neutral-200 hover:text-red-500"
                      >
                        <IconTrash size={18} />
                      </button>
                    </div>

                    <div className="mt-auto flex items-center justify-between">
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity - 1)
                          }
                          className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-neutral-600 shadow-sm transition-colors hover:bg-neutral-100"
                        >
                          <IconMinus size={16} />
                        </button>
                        <span className="w-10 text-center font-semibold">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity + 1)
                          }
                          className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-neutral-600 shadow-sm transition-colors hover:bg-neutral-100"
                        >
                          <IconPlus size={16} />
                        </button>
                      </div>

                      {/* Subtotal */}
                      <span className="text-lg font-bold text-neutral-900">
                        {formatPriceSimple(
                          (item.selectedOffer ? item.selectedOffer.price : item.product.price) *
                            item.quantity
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Checkout Form */}
        <div className="lg:col-span-1">
          <div className="animate-fade-in-up animation-delay-400 sticky top-32 rounded-2xl border-2 border-primary/20 bg-white p-6 shadow-xl">
            {/* Header */}
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <IconShoppingBag size={24} className="text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-neutral-900">
                  {t("checkout.paymentTitle")}
                </h2>
                <p className="text-sm text-neutral-500">
                  {t("productPage.checkout.subtitle")}
                </p>
              </div>
            </div>

            {/* Order Total */}
            <div className="mb-6 rounded-2xl bg-neutral-50 p-4">
              {totalSavings > 0 && (
                <div className="mb-3 flex items-center justify-between text-secondary">
                  <span>{t("cart.savings")}</span>
                  <span className="font-medium">
                    -{formatPriceSimple(totalSavings)}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold text-neutral-900">
                  {t("cart.total")}
                </span>
                <span className="text-2xl font-bold text-primary">
                  {formatPriceSimple(totalPrice)}
                </span>
              </div>
            </div>

            {/* Payment Method Notice */}
            <div className="mb-4 rounded-xl bg-secondary/10 p-4">
              <div className="flex items-start gap-3">
                <IconCash size={24} className="text-secondary shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-neutral-900">
                    {t("checkout.paymentMethod")}
                  </p>
                  <p className="text-sm text-neutral-700 font-medium">
                    {t("checkout.codOnly")}
                  </p>
                  <p className="text-sm text-neutral-600 mt-1">
                    {t("checkout.codDescription")}
                  </p>
                </div>
              </div>
            </div>

            {/* Error Message */}
            {submitError && (
              <div className="mb-4 rounded-xl bg-error/10 p-4 text-sm text-error">
                {submitError}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-medium text-neutral-700"
                >
                  {t("productPage.checkout.name")}{" "}
                  <span className="text-primary">*</span>
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
                  {t("productPage.checkout.phone")}{" "}
                  <span className="text-primary">*</span>
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="h-12 w-full rounded-xl border border-neutral-200 bg-neutral-50 pe-4 ps-12 text-neutral-900 transition-all placeholder:text-neutral-400 focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 [&:not(:placeholder-shown)]:direction-ltr [&:not(:placeholder-shown)]:text-left"
                    placeholder={t("productPage.checkout.phonePlaceholder")}
                    style={{
                      direction: formData.phone ? "ltr" : "inherit",
                      textAlign: formData.phone ? "left" : "inherit",
                    }}
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
                  {t("productPage.checkout.address")}{" "}
                  <span className="text-primary">*</span>
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
        </div>
      </div>
    </div>
  );
}
