/**
 * @author Zakaria Tejjani
 * @date 2025-12-10
 */
"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { IconSend, IconLoader2 } from "@tabler/icons-react";
import { trackLead } from "@/lib/facebook-pixel";

const subjectOptions = [
  { id: "general", labelKey: "contact.form.subjects.general" },
  { id: "order", labelKey: "contact.form.subjects.order" },
  { id: "product", labelKey: "contact.form.subjects.product" },
  { id: "shipping", labelKey: "contact.form.subjects.shipping" },
  { id: "guarantee", labelKey: "contact.form.subjects.guarantee" },
  { id: "other", labelKey: "contact.form.subjects.other" },
];

export default function ContactForm() {
  const t = useTranslations();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"success" | "error" | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setSubmitStatus("success");

        // Track Lead event in Facebook Pixel
        trackLead({
          content_name: `Contact Form - ${formData.subject}`,
          content_category: "contact",
        });

        // Reset form
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        });
        // Hide success message after 5 seconds
        setTimeout(() => setSubmitStatus(null), 5000);
      } else {
        setSubmitStatus("error");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="animate-fade-in-up rounded-3xl bg-white p-8 shadow-xl lg:p-10">
      <h2 className="mb-2 text-2xl font-bold text-neutral-900">
        {t("contact.form.title")}
      </h2>
      <p className="mb-8 text-neutral-600">{t("contact.form.subtitle")}</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Success Message */}
        {submitStatus === "success" && (
          <div className="rounded-xl bg-success/10 p-4 text-success">
            <p className="font-medium">{t("contact.form.successMessage")}</p>
          </div>
        )}

        {/* Error Message */}
        {submitStatus === "error" && (
          <div className="rounded-xl bg-error/10 p-4 text-error">
            <p className="font-medium">{t("contact.form.errorMessage")}</p>
          </div>
        )}

        {/* Name & Email row */}
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-medium text-neutral-700"
            >
              {t("contact.form.name")} <span className="text-primary">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="h-12 w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 text-neutral-900 transition-all placeholder:text-neutral-400 focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
              placeholder={t("contact.form.namePlaceholder")}
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-neutral-700"
            >
              {t("contact.form.email")} <span className="text-primary">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="h-12 w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 text-neutral-900 transition-all placeholder:text-neutral-400 focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 [&:not(:placeholder-shown)]:direction-ltr [&:not(:placeholder-shown)]:text-left"
              placeholder={t("contact.form.emailPlaceholder")}
              style={{
                direction: formData.email ? "ltr" : "inherit",
                textAlign: formData.email ? "left" : "inherit",
              }}
            />
          </div>
        </div>

        {/* Phone & Subject row */}
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label
              htmlFor="phone"
              className="mb-2 block text-sm font-medium text-neutral-700"
            >
              {t("contact.form.phone")}
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="h-12 w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 text-neutral-900 transition-all placeholder:text-neutral-400 focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 [&:not(:placeholder-shown)]:direction-ltr [&:not(:placeholder-shown)]:text-left"
              placeholder={t("contact.form.phonePlaceholder")}
              style={{
                direction: formData.phone ? "ltr" : "inherit",
                textAlign: formData.phone ? "left" : "inherit",
              }}
            />
          </div>
          <div>
            <label
              htmlFor="subject"
              className="mb-2 block text-sm font-medium text-neutral-700"
            >
              {t("contact.form.subject")} <span className="text-primary">*</span>
            </label>
            <div className="relative">
              <select
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                className="h-12 w-full appearance-none rounded-xl border border-neutral-200 bg-neutral-50 px-4 pe-10 text-neutral-900 transition-all focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="">{t("contact.form.subjectPlaceholder")}</option>
                {subjectOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {t(option.labelKey)}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute end-4 top-1/2 -translate-y-1/2">
                <svg
                  className="h-4 w-4 text-neutral-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Message */}
        <div>
          <label
            htmlFor="message"
            className="mb-2 block text-sm font-medium text-neutral-700"
          >
            {t("contact.form.message")} <span className="text-primary">*</span>
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            rows={5}
            className="w-full resize-none rounded-xl border border-neutral-200 bg-neutral-50 p-4 text-neutral-900 transition-all placeholder:text-neutral-400 focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
            placeholder={t("contact.form.messagePlaceholder")}
          />
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-4 font-semibold text-white transition-all hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? (
            <>
              <IconLoader2 size={20} className="animate-spin" />
              {t("contact.form.sending")}
            </>
          ) : (
            <>
              <IconSend size={20} />
              {t("contact.form.submit")}
            </>
          )}
        </button>
      </form>
    </div>
  );
}
