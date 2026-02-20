/**
 * @author Zakaria Tejjani
 * @date 2025-12-10
 */
import {
  IconPrinter,
  IconTool,
  IconDroplet,
  IconTag,
  IconBriefcase,
  type Icon,
} from "@tabler/icons-react";

export interface Category {
  id: string;
  translationKey: string;
  icon: Icon;
  color: string;
  slug: string;
  featured?: boolean;
  image?: string;
}

export const categories: Category[] = [
  {
    id: "printing",
    translationKey: "categories.printing",
    icon: IconPrinter,
    color: "bg-blue-500",
    slug: "printing-marking",
    featured: true,
    image: "/categories/Iprimantes%20%26%20Marquage.jpeg",
  },
  {
    id: "engraving",
    translationKey: "categories.engraving",
    icon: IconTool,
    color: "bg-orange-500",
    slug: "engraving-machines",
    featured: true,
    image: "/categories/Machines%20de%20Gravure.jpeg",
  },
  {
    id: "consumables",
    translationKey: "categories.consumables",
    icon: IconDroplet,
    color: "bg-cyan-500",
    slug: "consumables-inks",
    featured: true,
    image: "/categories/Consommables%20%26%20Encres.jpeg",
  },
  {
    id: "labeling",
    translationKey: "categories.labeling",
    icon: IconTag,
    color: "bg-purple-500",
    slug: "labeling-packaging",
    featured: true,
    image: "/categories/%C3%89tiquetage%20%26%20Packaging.jpeg",
  },
  {
    id: "businessPacks",
    translationKey: "categories.businessPacks",
    icon: IconBriefcase,
    color: "bg-green-500",
    slug: "business-packs",
    featured: true,
  },
];

export const getFeaturedCategories = () =>
  categories.filter((cat) => cat.featured);

export const getCategoryBySlug = (slug: string) =>
  categories.find((cat) => cat.slug === slug);

export const getCategoryById = (id: string) =>
  categories.find((cat) => cat.id === id);
