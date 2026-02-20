/**
 * @author Zakaria Tejjani
 * @date 2025-12-10
 */

import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductPageContent from "./ProductPageContent";
import connectToDatabase from "@/lib/mongodb";
import Product from "@/lib/models/Product";

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

async function getProduct(slug: string) {
  try {
    await connectToDatabase();
    const product = await Product.findOne({ slug }).lean();
    if (!product) return null;

    // Convert MongoDB document to plain object
    return JSON.parse(JSON.stringify(product));
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}

export async function generateStaticParams() {
  // For dynamic rendering, return empty array
  // Products will be fetched on-demand
  return [];
}

export const dynamic = "force-dynamic";

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="overflow-x-hidden">
      <Header />
      <main className="bg-neutral-50">
        <ProductPageContent product={product} />
      </main>
      <Footer />
    </div>
  );
}
