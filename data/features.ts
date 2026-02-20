/**
 * @author Zakaria Tejjani
 * @date 2025-12-10
 */
import {
  IconTruck,
  IconShieldCheck,
  IconHeadset,
  IconRefresh,
  IconCash,
  IconMapPin,
  type Icon,
} from "@tabler/icons-react";

export interface Feature {
  id: string;
  icon: Icon;
  titleKey: string;
  descriptionKey: string;
}

export const heroFeatures: Feature[] = [
  {
    id: "free-shipping",
    icon: IconTruck,
    titleKey: "hero.features.freeShipping",
    descriptionKey: "hero.features.freeShippingDesc",
  },
  {
    id: "secure-payment",
    icon: IconShieldCheck,
    titleKey: "hero.features.securePayment",
    descriptionKey: "hero.features.securePaymentDesc",
  },
  {
    id: "support",
    icon: IconHeadset,
    titleKey: "hero.features.support",
    descriptionKey: "hero.features.supportDesc",
  },
];

export const allFeatures: Feature[] = [
  ...heroFeatures,
  {
    id: "easy-returns",
    icon: IconRefresh,
    titleKey: "features.easyReturns",
    descriptionKey: "features.easyReturnsDesc",
  },
  {
    id: "cod",
    icon: IconCash,
    titleKey: "features.cod",
    descriptionKey: "features.codDesc",
  },
  {
    id: "nationwide",
    icon: IconMapPin,
    titleKey: "features.nationwide",
    descriptionKey: "features.nationwideDesc",
  },
];
