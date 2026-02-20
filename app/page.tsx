/**
 * @author Zakaria Tejjani
 * @date 2025-12-10
 */
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import FeaturedProducts from "@/components/FeaturedProducts";
import CategoryShowcase from "@/components/CategoryShowcase";
import PromoBanner from "@/components/PromoBanner";
import Testimonials from "@/components/Testimonials";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <FeaturedProducts />
        {/*
        <PromoBanner />
        <CategoryShowcase />
        <Testimonials />
        <Newsletter /> */}
      </main>
      <Footer />
    </>
  );
}
