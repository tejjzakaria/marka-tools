/**
 * @author Zakaria Tejjani
 * @date 2025-12-10
 */
"use client";
import { useRTL } from "@/hooks/useRTL";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { IconBrandWhatsapp, IconArrowLeft, IconArrowRight, IconGift, IconCheck, IconAlertCircle } from "@tabler/icons-react";

export default function Newsletter() {
  const t = useTranslations();
  const isRTL = useRTL();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!phoneNumber.trim()) {
      setStatus({
        type: "error",
        message: t("newsletter.errorEmpty"),
      });
      return;
    }

    setIsSubmitting(true);
    setStatus({ type: null, message: "" });

    try {
      const response = await fetch("/api/whatsapp-subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phoneNumber }),
      });

      const data = await response.json();

      if (data.success) {
        setStatus({
          type: "success",
          message: t("newsletter.success"),
        });
        setPhoneNumber("");
      } else {
        setStatus({
          type: "error",
          message: data.message || t("newsletter.error"),
        });
      }
    } catch (error) {
      console.error("Subscription error:", error);
      setStatus({
        type: "error",
        message: t("newsletter.error"),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-16 lg:py-24">
      <div className="container mx-auto px-4">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-secondary via-secondary to-[#2a8e86] p-8 lg:p-16">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div
              className="h-full w-full"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }}
            />
          </div>

          {/* Decorative circles */}
          <div className="absolute -end-32 -top-32 h-64 w-64 rounded-full bg-white/10" />
          <div className="absolute -bottom-20 -start-20 h-48 w-48 rounded-full bg-white/5" />

          <div className="relative mx-auto max-w-3xl text-center">
            {/* Icon */}
            <div className="mb-6 inline-flex items-center justify-center rounded-2xl bg-white/20 p-4 backdrop-blur-sm">
              <IconBrandWhatsapp size={32} className="text-white" />
            </div>

            {/* Title */}
            <h2 className="mb-4 text-3xl font-bold text-white lg:text-4xl">
              {t("newsletter.title")}
            </h2>

            {/* Subtitle */}
            <p className="mb-8 text-lg text-white/90">
              {t("newsletter.subtitle")}
            </p>

            {/* Status Message */}
            {status.type && (
              <div
                className={`mb-6 flex items-center justify-center gap-2 rounded-xl p-4 ${
                  status.type === "success"
                    ? "bg-white/20 text-white"
                    : "bg-red-500/20 text-white"
                }`}
              >
                {status.type === "success" ? (
                  <IconCheck size={20} />
                ) : (
                  <IconAlertCircle size={20} />
                )}
                <span>{status.message}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="mx-auto flex max-w-lg flex-col gap-4 sm:flex-row">
              <div className="relative flex-1">
                <IconBrandWhatsapp
                  size={20}
                  className="absolute start-4 top-1/2 -translate-y-1/2 text-neutral-400"
                />
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder={t("newsletter.placeholder")}
                  disabled={isSubmitting}
                  className="h-14 w-full rounded-full border-2 border-white/20 bg-white/10 pe-4 ps-12 text-white placeholder:text-white/50 backdrop-blur-sm transition-all focus:border-white/40 focus:bg-white/20 focus:outline-none disabled:opacity-50"
                  style={{
                    direction: phoneNumber ? "ltr" : "inherit",
                    textAlign: phoneNumber ? "left" : "inherit",
                  }}
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex h-14 items-center justify-center gap-2 rounded-full bg-white px-8 font-semibold text-secondary transition-all hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50 disabled:hover:translate-y-0"
              >
                {isSubmitting ? (
                  <>
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-secondary border-t-transparent" />
                    {t("newsletter.submitting")}
                  </>
                ) : (
                  <>
                    {t("newsletter.button")}
                    {isRTL ? <IconArrowLeft size={18} /> : <IconArrowRight size={18} />}
                  </>
                )}
              </button>
            </form>

            {/* Privacy note */}
            <p className="mt-4 text-sm text-white/70">
              {t("newsletter.privacy")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
