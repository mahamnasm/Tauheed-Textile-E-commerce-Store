import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppFloat from "@/components/layout/WhatsAppFloat";
import CartDrawer from "@/components/cart/CartDrawer";
import AIStylistModal from "@/components/ai/AIStylistModal";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "Tauheed Textile | Luxury Pakistani Lawn, Chiffon & Pret Fashion",
  description: "Experience exquisite Pakistani women's clothing by Tauheed Textile. Shop luxury lawn, embroidered chiffon, ready-to-wear pret, unstitched 3-piece suits and bridal wedding collections with nationwide Cash on Delivery.",
  keywords: "Tauheed Textile, Pakistani Lawn 2026, Luxury Chiffon, Pakistani Pret, Unstitched Suits, Wedding Kalidar, Cash On Delivery Pakistan",
  icons: {
    icon: "/logo-calligraphy.png",
    shortcut: "/logo-calligraphy.png",
    apple: "/logo-calligraphy.png",
  },
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
          <WhatsAppFloat initialSettings={settings} />
          <main className="flex-1 pt-[88px] lg:pt-[108px]">{children}</main>
          <Footer initialSettings={settings} />
        </CartProvider>
      </body>
    </html>
  );
}
