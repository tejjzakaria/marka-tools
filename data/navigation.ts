/**
 * @author Zakaria Tejjani
 * @date 2025-12-10
 */

export interface NavItem {
  id: string;
  translationKey: string;
  href: string;
  children?: NavItem[];
}

export const mainNavigation: NavItem[] = [
  {
    id: "home",
    translationKey: "nav.home",
    href: "/",
  },
  {
    id: "shop",
    translationKey: "nav.shop",
    href: "/shop",
  },
  {
    id: "about",
    translationKey: "nav.about",
    href: "/about",
  },
  {
    id: "contact",
    translationKey: "nav.contact",
    href: "/contact",
  },
];

export const footerNavigation = {
  company: [
    { id: "about", translationKey: "footer.about", href: "/about" },
    { id: "careers", translationKey: "footer.careers", href: "/careers" },
    { id: "press", translationKey: "footer.press", href: "/press" },
  ],
  support: [
    { id: "help", translationKey: "footer.help", href: "/help" },
    { id: "shipping", translationKey: "footer.shipping", href: "/shipping" },
    { id: "track-order", translationKey: "footer.trackOrder", href: "/track" },
  ],
  legal: [
    { id: "privacy", translationKey: "footer.privacy", href: "/privacy" },
    { id: "terms", translationKey: "footer.terms", href: "/terms" },
    { id: "cookies", translationKey: "footer.cookies", href: "/cookies" },
  ],
};
