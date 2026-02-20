/**
 * @author Zakaria Tejjani
 * @date 2025-12-10
 */
"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { IconChevronDown, IconQuestionMark } from "@tabler/icons-react";

const faqItems = [
  { questionKey: "contact.faq.items.shipping.question", answerKey: "contact.faq.items.shipping.answer" },
  { questionKey: "contact.faq.items.payment.question", answerKey: "contact.faq.items.payment.answer" },
  { questionKey: "contact.faq.items.guarantee.question", answerKey: "contact.faq.items.guarantee.answer" },
  { questionKey: "contact.faq.items.tracking.question", answerKey: "contact.faq.items.tracking.answer" },
  { questionKey: "contact.faq.items.delivery.question", answerKey: "contact.faq.items.delivery.answer" },
  { questionKey: "contact.faq.items.cod.question", answerKey: "contact.faq.items.cod.answer" },
];

export default function FAQ() {
  const t = useTranslations();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="bg-neutral-50 py-16 lg:py-24">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <div className="animate-fade-in-up mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2">
            <IconQuestionMark size={18} className="text-primary" />
            <span className="text-sm font-medium text-primary">
              {t("contact.faq.badge")}
            </span>
          </div>
          <h2 className="animate-fade-in-up animation-delay-200 mb-4 text-3xl font-bold text-neutral-900 md:text-4xl">
            {t("contact.faq.title")}
          </h2>
          <p className="animate-fade-in-up animation-delay-400 text-lg text-neutral-600">
            {t("contact.faq.subtitle")}
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="mx-auto max-w-3xl">
          <div className="space-y-4">
            {faqItems.map((item, index) => (
              <div
                key={index}
                className="animate-fade-in-up overflow-hidden rounded-2xl bg-white shadow-sm transition-shadow hover:shadow-md"
                style={{ animationDelay: `${600 + index * 100}ms` }}
              >
                <button
                  onClick={() => toggleItem(index)}
                  className="flex w-full items-center justify-between gap-4 p-6 text-start"
                >
                  <span className="text-lg font-semibold text-neutral-900">
                    {t(item.questionKey)}
                  </span>
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 transition-transform duration-300 ${
                      openIndex === index ? "rotate-180" : ""
                    }`}
                  >
                    <IconChevronDown size={20} className="text-primary" />
                  </div>
                </button>
                <div
                  className={`grid transition-all duration-300 ${
                    openIndex === index
                      ? "grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="px-6 pb-6 text-neutral-600 leading-relaxed">
                      {t(item.answerKey)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Still have questions CTA */}
        <div className="animate-fade-in-up animation-delay-1000 mx-auto mt-12 max-w-2xl text-center">
          <p className="mb-4 text-neutral-600">
            {t("contact.faq.stillHaveQuestions")}
          </p>
          <a
            href="#contact-form"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-semibold text-white transition-colors hover:bg-primary-dark"
          >
            {t("contact.faq.contactUs")}
          </a>
        </div>
      </div>
    </section>
  );
}
