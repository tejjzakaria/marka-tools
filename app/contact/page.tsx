/**
 * @author Zakaria Tejjani
 * @date 2025-12-10
 */

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ContactHero, ContactForm, ContactInfo, FAQ } from "@/components/contact";

export default function ContactPage() {
  return (
    <>
      <Header />
      <main>
        <ContactHero />

        {/* Contact Form & Info Section */}
        <section id="contact-form" className="bg-neutral-50 py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <div className="grid gap-12 lg:grid-cols-2">
              {/* Contact Form */}
              <ContactForm />

              {/* Contact Info */}
              <ContactInfo />
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <FAQ />
      </main>
      <Footer />
    </>
  );
}
