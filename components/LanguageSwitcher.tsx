/**
 * @author Zakaria Tejjani
 * @date 2025-12-10
 */
"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { IconChevronDown } from "@tabler/icons-react";

const languages = [
  { code: "ar", name: "العربية", flag: "🇲🇦" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "en", name: "English", flag: "🇬🇧" },
] as const;

function handleLanguageChange(langCode: string) {
  document.cookie = `locale=${langCode};path=/;max-age=31536000`;
  window.location.reload();
}

export default function LanguageSwitcher() {
  const locale = useLocale();
  const [isOpen, setIsOpen] = useState(false);

  const currentLanguage = languages.find((lang) => lang.code === locale) || languages[0];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        onBlur={() => setTimeout(() => setIsOpen(false), 200)}
        className="flex items-center gap-2 rounded-full border border-neutral-200 px-3 py-2 text-sm font-medium text-neutral-700 transition-all hover:border-primary hover:text-primary"
      >
        <span className="text-base">{currentLanguage.flag}</span>
        <span className="hidden sm:inline">{currentLanguage.name}</span>
        <IconChevronDown
          size={16}
          className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute end-0 top-full z-50 mt-2 min-w-40 rounded-xl border border-neutral-100 bg-white p-2 shadow-xl">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                handleLanguageChange(lang.code);
                setIsOpen(false);
              }}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-start text-sm transition-colors ${
                locale === lang.code
                  ? "bg-primary/10 text-primary"
                  : "text-neutral-700 hover:bg-neutral-50"
              }`}
            >
              <span className="text-base">{lang.flag}</span>
              <span className="font-medium">{lang.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function MobileLanguageSwitcher() {
  const locale = useLocale();

  return (
    <div className="flex flex-col gap-2">
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => handleLanguageChange(lang.code)}
          className={`flex w-full items-center justify-center gap-3 rounded-full px-4 py-3 font-medium transition-colors ${
            locale === lang.code
              ? "bg-primary text-white"
              : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
          }`}
        >
          <span className="text-lg">{lang.flag}</span>
          <span>{lang.name}</span>
        </button>
      ))}
    </div>
  );
}
