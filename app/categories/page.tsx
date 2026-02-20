/**
 * @author Zakaria Tejjani
 * @date 2025-12-11
 */

import { Metadata } from "next";
import CategoriesContent from "./CategoriesContent";

export const metadata: Metadata = {
  title: "Categories - Marka Tools",
  description: "Browse all product categories",
};

export default function CategoriesPage() {
  return <CategoriesContent />;
}
