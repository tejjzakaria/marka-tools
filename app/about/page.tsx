/**
 * @author Zakaria Tejjani
 * @date 2025-12-10
 */
import { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  AboutHero,
  OurStory,
  OurValues,
  Team,
  WhyChooseUs,
  AboutCTA,
} from "@/components/about";

export const metadata: Metadata = {
  title: "About Us - Marka Tools",
  description: "Learn more about Marka Tools, Morocco's premier online shopping destination",
};

export default function AboutPage() {
  return (
    <>
      <Header />
      <main>
        <AboutHero />
        <OurStory />
        <OurValues />
        <WhyChooseUs />
        {/* Team Section 
        <Team />*/}
        <AboutCTA />
      </main>
      <Footer />
    </>
  );
}
