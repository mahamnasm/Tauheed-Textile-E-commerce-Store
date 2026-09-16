"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function CartFloat() {
  const pathname = usePathname();
  const { cartCount, cartTotal, openCart } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || pathname?.startsWith("/admin")) return null;

  return (
    <button
      type="button"
      onClick={openCart}
      aria-label="Open Shopping Cart"
      className="fixed bottom-[78px] sm:bottom-22 right-4 sm:right-6 z-40 bg-[#171717] hover:bg-[#2A2626] text-white p-3 sm:p-3.5 rounded-full shadow-2xl flex items-center gap-2.5 group transition-all duration-300 hover:scale-105 border-2 border-[#C4A882] focus:outline-none"
    >
      <div className="relative flex items-center justify-center">
        <ShoppingBag className="w-6 h-6 text-[#C4A882] transition-transform group-hover:scale-110" />
        {cartCount > 0 && (
          <span className="absolute -top-2.5 -right-2.5 min-w-[20px] h-5 px-1 rounded-full bg-[#9B3D3D] text-white text-[11px] font-extrabold flex items-center justify-center border-2 border-[#171717] shadow animate-pulse">
            {cartCount}
          </span>
        )}
      </div>

      <div className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-500 text-xs font-semibold tracking-wide pr-1 flex items-center gap-1.5">
        <span>Cart</span>
        {cartTotal > 0 && (
          <span className="text-[#C4A882] font-bold">
            • Rs. {cartTotal.toLocaleString()}
          </span>
        )}
      </div>
    </button>
  );
}
