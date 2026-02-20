/**
 * @author Zakaria Tejjani
 * @date 2025-12-10
 */
"use client";

import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { useEffect, useState } from "react";
import {
  IconX,
  IconTrash,
  IconPlus,
  IconMinus,
  IconShoppingBag,
  IconShoppingCart,
} from "@tabler/icons-react";
import { useCart } from "@/context";
import { formatPriceSimple } from "@/data/config";

export default function CartDrawer() {
  const t = useTranslations();
  const locale = useLocale();
  const isRTL = locale === "ar";

  const {
    items,
    isOpen,
    closeCart,
    removeFromCart,
    updateQuantity,
    totalItems,
    totalPrice,
    totalSavings,
  } = useCart();

  const [mounted, setMounted] = useState(false);
  const [shouldShow, setShouldShow] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Mount component first
      setMounted(true);
      // Then trigger animation after a brief delay
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setShouldShow(true);
        });
      });
    } else {
      // Trigger exit animation
      setShouldShow(false);
      // Unmount after animation completes
      const timeout = setTimeout(() => setMounted(false), 300);
      return () => clearTimeout(timeout);
    }
  }, [isOpen]);

  if (!mounted) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-50 bg-black/50 transition-opacity duration-300 ease-in-out ${
          shouldShow ? "opacity-100" : "opacity-0"
        }`}
        onClick={closeCart}
      />

      {/* Drawer */}
      <div className={`fixed inset-y-0 end-0 z-50 w-full max-w-sm bg-white shadow-2xl transition-transform duration-300 ease-in-out sm:max-w-md ${
          shouldShow
            ? "translate-x-0"
            : isRTL
              ? "-translate-x-full"
              : "translate-x-full"
        }`}>
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-neutral-100 px-4 py-4 sm:px-6">
            <div className="flex items-center gap-2 sm:gap-3">
              <IconShoppingCart size={20} className="text-primary sm:size-6" />
              <h2 className="text-lg font-bold text-neutral-900 sm:text-xl">
                {t("cart.title")}
              </h2>
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-sm font-medium text-primary">
                {totalItems}
              </span>
            </div>
            <button
              onClick={closeCart}
              className="rounded-full p-2 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-700"
            >
              <IconX size={24} />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-6">
            {items.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-center">
                <IconShoppingBag size={64} className="mb-4 text-neutral-200" />
                <h3 className="mb-2 text-lg font-semibold text-neutral-700">
                  {t("cart.empty")}
                </h3>
                <p className="mb-6 text-neutral-500">{t("cart.emptyDesc")}</p>
                <a
                  href="/shop"
                  onClick={closeCart}
                  className="rounded-xl bg-primary px-6 py-3 font-semibold text-white transition-colors hover:bg-primary-dark"
                >
                  {t("cart.continueShopping")}
                </a>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex gap-4 rounded-xl bg-neutral-50 p-4"
                  >
                    {/* Product Image */}
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-neutral-200">
                      {item.product.image ? (
                        <Image
                          src={item.product.image}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <IconShoppingCart size={24} className="text-neutral-400" />
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="flex flex-1 flex-col">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-neutral-900">
                            {item.product.name}
                          </h4>
                          {item.product.originalPrice && (
                            <span className="text-xs text-neutral-400 line-through">
                              {formatPriceSimple(item.product.originalPrice)}
                            </span>
                          )}
                          {item.selectedOffer && (
                            <div className="mt-1 text-xs font-medium text-primary">
                              {item.selectedOffer.text}
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="rounded-full p-1 text-neutral-400 transition-colors hover:bg-neutral-200 hover:text-red-500"
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
                            className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-neutral-600 shadow-sm transition-colors hover:bg-neutral-100"
                          >
                            <IconMinus size={16} />
                          </button>
                          <span className="w-8 text-center font-semibold">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.product.id, item.quantity + 1)
                            }
                            className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-neutral-600 shadow-sm transition-colors hover:bg-neutral-100"
                          >
                            <IconPlus size={16} />
                          </button>
                        </div>

                        {/* Price */}
                        <span className="font-bold text-primary">
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
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="border-t border-neutral-100 p-6">
              {/* Savings */}
              {totalSavings > 0 && (
                <div className="mb-4 flex items-center justify-between rounded-xl bg-secondary/10 px-4 py-3 text-secondary">
                  <span className="font-medium">{t("cart.savings")}</span>
                  <span className="font-bold">
                    -{formatPriceSimple(totalSavings)}
                  </span>
                </div>
              )}

              {/* Total */}
              <div className="mb-4 flex items-center justify-between">
                <span className="text-lg font-semibold text-neutral-700">
                  {t("cart.total")}
                </span>
                <span className="text-2xl font-bold text-primary">
                  {formatPriceSimple(totalPrice)}
                </span>
              </div>

              {/* Checkout Button */}
              <a
                href="/checkout"
                onClick={closeCart}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-4 font-bold text-white transition-colors hover:bg-primary-dark"
              >
                <IconShoppingBag size={20} />
                {t("cart.checkout")}
              </a>

              {/* Continue Shopping */}
              <button
                onClick={closeCart}
                className="mt-3 w-full py-2 text-center text-sm text-neutral-500 transition-colors hover:text-primary"
              >
                {t("cart.continueShopping")}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
