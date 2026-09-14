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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600;700;800&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-ink-black text-sand-100 antialiased selection:bg-gold-500 selection:text-ink-black flex flex-col min-h-screen">
        <CartProvider>
          <Toaster
            position="top-center"
            toastOptions={{
              style: {
                background: "#12110F",
                color: "#FAF8F5",
                border: "1px solid rgba(197, 160, 89, 0.4)",
                fontSize: "12px",
                borderRadius: "12px",
                padding: "12px 16px",
                boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
              },
              iconTheme: {
                primary: "#C5A059",
                secondary: "#12110F",
              },
            }}
          />
          <Header />
          <CartDrawer />
          <WhatsAppFloat />
          <AIStylistModal />
          <main className="flex-1">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
