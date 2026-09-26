"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { MessageCircle, Users, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { SiteLayoutSettings } from "@/lib/settings";

interface FloatingActionsProps {
  initialSettings?: SiteLayoutSettings;
}

export default function FloatingActions({ initialSettings }: FloatingActionsProps) {
  const pathname = usePathname();
  const { cartCount, cartTotal, openCart } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || pathname?.startsWith("/admin")) return null;

  const rawPhone = initialSettings?.contactWhatsApp || "03400262732";
  const cleanPhone = rawPhone.replace(/\D/g, "");
  const formattedPhone = cleanPhone.startsWith("0") 
    ? `92${cleanPhone.slice(1)}` 
    : cleanPhone.startsWith("92") 
      ? cleanPhone 
      : `92${cleanPhone}`;

  const message = encodeURIComponent(
    initialSettings?.whatsappMessage || "Assalam-o-Alaikum Tauheed Textile, I would like assistance with my order."
  );

  const showCommunity = initialSettings?.showWhatsappCommunity !== false && !!initialSettings?.whatsappCommunityLink;
  const communityLink = initialSettings?.whatsappCommunityLink || "https://chat.whatsapp.com/TauheedVIP";

  return (
    <aside 
      aria-label="Floating Storefront Actions" 
      className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-40 flex flex-col items-end gap-3 select-none pointer-events-none"
    >
      {/* 1. VIP WhatsApp Community Button */}
      {showCommunity && (
        <a
          href={communityLink}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Join VIP WhatsApp Community"
          className="pointer-events-auto group flex items-center gap-2 bg-[#171717] hover:bg-[#252321] text-white px-3.5 py-2.5 rounded-full shadow-2xl border-2 border-[#C4A882] text-xs font-bold transition-all duration-300 hover:scale-105 active:scale-95"
        >
          <div className="relative flex items-center justify-center shrink-0">
            <Users className="w-4 h-4 text-[#C4A882]" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#B28A3E] animate-pulse" />
          </div>
          <span className="text-xs font-semibold tracking-wide flex items-center gap-1.5 whitespace-nowrap">
            <span>VIP Community</span>
            <span className="text-[9px] bg-[#C4A882] text-[#171717] px-1.5 py-0.5 rounded font-black tracking-widest uppercase">
              JOIN
            </span>
          </span>
        </a>
      )}

      {/* 2. Floating Quick Cart Button */}
      <button
        type="button"
        onClick={openCart}
        aria-label="Open Shopping Cart"
        className="pointer-events-auto group flex items-center bg-[#171717] hover:bg-[#252321] text-white p-3 sm:p-3.5 rounded-full shadow-2xl border-2 border-[#C4A882] transition-all duration-300 hover:scale-105 active:scale-95 focus:outline-none"
      >
        <div className="relative flex items-center justify-center shrink-0">
          <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6 text-[#C4A882] transition-transform group-hover:scale-110" />
          {cartCount > 0 && (
            <span className="absolute -top-2.5 -right-2.5 min-w-[20px] h-5 px-1 rounded-full bg-[#9B3D3D] text-white text-[11px] font-extrabold flex items-center justify-center border-2 border-[#171717] shadow animate-pulse">
              {cartCount}
            </span>
          )}
        </div>

        {/* Clean expandable label: exactly 0 width & 0 opacity when idle to prevent character bleed */}
        <div className="max-w-0 opacity-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs group-hover:opacity-100 group-hover:ml-2.5 transition-all duration-300 ease-out text-xs font-semibold tracking-wide flex items-center gap-1.5 pointer-events-none group-hover:pointer-events-auto">
          <span>Cart</span>
          {cartTotal > 0 && (
            <span className="text-[#C4A882] font-bold">
              • Rs. {cartTotal.toLocaleString()}
            </span>
          )}
        </div>
      </button>

      {/* 3. Direct 1-on-1 WhatsApp Concierge */}
      <a
        href={`https://wa.me/${formattedPhone}?text=${message}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contact on WhatsApp"
        className="pointer-events-auto group flex items-center bg-[#171717] hover:bg-[#252321] text-white p-3 sm:p-3.5 rounded-full shadow-2xl border-2 border-[#C4A882] transition-all duration-300 hover:scale-105 active:scale-95"
      >
        <div className="relative flex items-center justify-center shrink-0">
          <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-[#25D366] transition-transform group-hover:scale-110 fill-current" />
        </div>

        {/* Clean expandable label: exactly 0 width & 0 opacity when idle to prevent character bleed */}
        <div className="max-w-0 opacity-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs group-hover:opacity-100 group-hover:ml-2.5 transition-all duration-300 ease-out text-xs font-semibold tracking-wide pointer-events-none group-hover:pointer-events-auto pr-0.5">
          Chat with Us
        </div>
      </a>
    </aside>
  );
}
