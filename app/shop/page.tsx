/**
 * @author Zakaria Tejjani
 * @date 2025-12-10
 */
import { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ShopContent from "./ShopContent";

export const metadata: Metadata = {
  title: "Shop - Marka Tools",
  description: "Browse our wide selection of products",
};

export default function ShopPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-neutral-50">
        <ShopContent />
      </main>
      <Footer />
    </>
  );
}
