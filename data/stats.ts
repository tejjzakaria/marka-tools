/**
 * @author Zakaria Tejjani
 * @date 2025-12-10
 */

export interface Stat {
  id: string;
  value: string;
  translationKey: string;
}

export const heroStats: Stat[] = [
  {
    id: "products",
    value: "30+",
    translationKey: "hero.stats.products",
  },
  {
    id: "customers",
    value: "10,000+",
    translationKey: "hero.stats.customers",
  },
  {
    id: "cities",
    value: "40+",
    translationKey: "hero.stats.cities",
  },
];
