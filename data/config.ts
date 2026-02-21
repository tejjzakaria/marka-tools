/**
 * @author Zakaria Tejjani
 * @date 2025-12-10
 */

export const siteConfig = {
  name: "Marka Tools",
  domain: "markatools.shop",
  defaultLocale: "ar" as const,
  locales: ["ar", "fr", "en"] as const,
  currency: {
    code: "MAD",
    symbol: "DH",
    locale: "fr-MA",
  },
  contact: {
    phone: "0636751797",
    email: "contact@markatools.shop",
    address: {
      street: "",
      city: "Agadir",
      country: "Morocco",
    },
  },
  social: {
    facebook: "https://facebook.com/markatools.shop",
    instagram: "https://instagram.com/markatools.shop",
    twitter: "https://twitter.com/markatools.shop",
    whatsapp: "0636751797",
  },
  shipping: {
    freeShippingThreshold: 200, // MAD
    estimatedDeliveryDays: {
      casablanca: "1-2",
      otherCities: "2-5",
    },
  },
};

export type Locale = (typeof siteConfig.locales)[number];

export const formatPrice = (amount: number): string => {
  return new Intl.NumberFormat(siteConfig.currency.locale, {
    style: "currency",
    currency: siteConfig.currency.code,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const formatPriceSimple = (amount: number): string => {
  return `${amount} ${siteConfig.currency.symbol}`;
};
