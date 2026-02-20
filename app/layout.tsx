/**
 * @author Zakaria Tejjani
 * @date 2025-12-10
 */
import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { Analytics } from "@vercel/analytics/react";
import { CartProvider, TrackOrderProvider } from "@/context";
import { AdminAuthProvider } from "@/context/AdminAuthContext";
import TrackOrderModal from "@/components/TrackOrderModal";
import TrackingScripts from "@/components/TrackingScripts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Marka Tools",
  description: "أفضل منصة للتسوق في المغرب",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();
  const isRTL = locale === "ar";

  return (
    <html lang={locale} dir={isRTL ? "rtl" : "ltr"}>
      <body className="antialiased">
        <TrackingScripts />
        <NextIntlClientProvider messages={messages}>
          <AdminAuthProvider>
            <CartProvider>
              <TrackOrderProvider>
                {children}
                <TrackOrderModal />
              </TrackOrderProvider>
            </CartProvider>
          </AdminAuthProvider>
        </NextIntlClientProvider>
        <Analytics />
      </body>
    </html>
  );
}
