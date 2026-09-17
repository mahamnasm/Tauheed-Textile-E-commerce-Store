import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppFloat from "@/components/layout/WhatsAppFloat";
import CartFloat from "@/components/layout/CartFloat";
import CartDrawer from "@/components/cart/CartDrawer";
import AbandonedCartRetention from "@/components/cart/AbandonedCartRetention";
import AIStylistModal from "@/components/ai/AIStylistModal";
import CookieConsent from "@/components/common/CookieConsent";
import { Toaster } from "react-hot-toast";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://tauheedtextile.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Tauheed Textile | Luxury Pakistani Lawn, Chiffon & Pret Fashion",
    template: "%s | Tauheed Textile",
  },
  description: "Experience exquisite Pakistani women's clothing by Tauheed Textile. Shop luxury lawn, embroidered chiffon, ready-to-wear pret, unstitched 3-piece suits and bridal wedding collections with nationwide Cash on Delivery.",
  keywords: "Tauheed Textile, Pakistani Lawn 2026, Luxury Chiffon, Pakistani Pret, Unstitched Suits, Wedding Kalidar, Cash On Delivery Pakistan",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Tauheed Textile | Luxury Pakistani Haute Couture",
    description: "Shop authentic luxury Pakistani lawn, embroidered chiffon, raw silk, and unstitched collections with nationwide Cash on Delivery.",
    url: siteUrl,
    siteName: "Tauheed Textile",
    images: [
      {
        url: "/logo-calligraphy.png",
        width: 600,
        height: 800,
        alt: "Tauheed Textile Logo Calligraphy",
      },
    ],
    locale: "en_PK",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tauheed Textile | Luxury Pakistani Fashion",
    description: "Shop authentic luxury Pakistani lawn, embroidered chiffon, and unstitched collections.",
    images: ["/logo-calligraphy.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
      { url: "/logo-calligraphy.png", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/site.webmanifest",
};

import { getSiteSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSiteSettings();

  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600;700;800&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#F8F5F0] text-[#171717] antialiased selection:bg-[#7A6652] selection:text-white flex flex-col min-h-screen">
        <CartProvider>
          <Toaster
            position="top-center"
            toastOptions={{
              style: {
                background: "#FFFFFF",
                color: "#171717",
                border: "1px solid #E7E1D8",
                fontSize: "13px",
                borderRadius: "12px",
                padding: "12px 16px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
              },
              iconTheme: {
                primary: "#7A6652",
                secondary: "#FFFFFF",
              },
            }}
          />
          <Header initialSettings={settings} />
          <CartDrawer />
          <AbandonedCartRetention />
          <WhatsAppFloat initialSettings={settings} />
          <CartFloat />
          <main className="flex-1 pt-[88px] lg:pt-[108px]">{children}</main>
          <Footer initialSettings={settings} />
          <CookieConsent />
        </CartProvider>

        {/* Analytics Hook (Google Analytics 4) */}
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', {
                  page_path: window.location.pathname,
                });
              `}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
