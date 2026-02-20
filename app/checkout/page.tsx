/**
 * @author Zakaria Tejjani
 * @date 2025-12-10
 */
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CheckoutContent from "@/components/checkout/CheckoutContent";

export default function CheckoutPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-neutral-50">
        <CheckoutContent />
      </main>
      <Footer />
    </>
  );
}
