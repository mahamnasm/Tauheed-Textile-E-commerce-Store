import React from "react";
import Link from "next/link";
import { ArrowLeft, ShoppingBag, Sparkles, Search, Truck } from "lucide-react";

export const metadata = {
  title: "404 — Page Not Found | Tauheed Textile",
  description: "The page or ensemble you are looking for is currently unavailable.",
};

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-16 sm:py-24 bg-[#F8F5F0]">
      <div className="max-w-xl w-full text-center space-y-8">
        {/* Subtle Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E7E1D8] text-[#7A6652] text-xs font-bold uppercase tracking-widest border border-[#D5CCC0]">
          <Sparkles className="w-3.5 h-3.5 text-[#B28A3E]" />
          <span>Haute Couture Archive</span>
        </div>

        {/* 404 Heading */}
        <div className="space-y-3">
          <h1 className="font-serif text-6xl sm:text-8xl font-bold text-[#171717] tracking-tight">
            404
          </h1>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#171717]">
            Ensemble Not Found
          </h2>
          <p className="text-sm text-[#6B6259] max-w-md mx-auto leading-relaxed">
            The page, collection, or article you are searching for may have been moved, sold out, or is temporarily unavailable.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-[#171717] text-white hover:bg-black text-xs font-bold uppercase tracking-wider transition-all shadow-md hover:scale-105"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Homepage</span>
          </Link>

          <Link
            href="/shop"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-white text-[#171717] border border-[#E7E1D8] hover:border-[#7A6652] text-xs font-bold uppercase tracking-wider transition-all shadow-xs hover:shadow-md hover:scale-105"
          >
            <ShoppingBag className="w-4 h-4 text-[#7A6652]" />
            <span>Browse All Dresses</span>
          </Link>
        </div>

        {/* Quick Collection Shortcuts */}
        <div className="pt-6 border-t border-[#E7E1D8]">
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#7A6652] block mb-3">
            Popular Luxury Collections:
          </span>
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
            <Link
              href="/shop?category=lawn-summer"
              className="px-3.5 py-1.5 rounded-full bg-white border border-[#E7E1D8] text-[#171717] hover:border-[#B28A3E] transition-colors"
            >
              Summer Lawn
            </Link>
            <Link
              href="/shop?category=chiffon-formal"
              className="px-3.5 py-1.5 rounded-full bg-white border border-[#E7E1D8] text-[#171717] hover:border-[#B28A3E] transition-colors"
            >
              Chiffon &amp; Formals
            </Link>
            <Link
              href="/shop?category=pret-ready-to-wear"
              className="px-3.5 py-1.5 rounded-full bg-white border border-[#E7E1D8] text-[#171717] hover:border-[#B28A3E] transition-colors"
            >
              Ready to Wear Pret
            </Link>
            <Link
              href="/shop?category=sale"
              className="px-3.5 py-1.5 rounded-full bg-[#FEF2F2] border border-[#FCA5A5] text-[#9B3D3D] font-bold hover:bg-[#FEE2E2] transition-colors"
            >
              Sale &amp; Clearance
            </Link>
            <Link
              href="/track-order"
              className="px-3.5 py-1.5 rounded-full bg-white border border-[#E7E1D8] text-[#171717] hover:border-[#B28A3E] transition-colors flex items-center gap-1"
            >
              <Truck className="w-3.5 h-3.5 text-[#7A6652]" />
              <span>Track Order</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
