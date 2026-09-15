"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SiteLayoutSettings } from "@/lib/settings";

interface FooterProps {
  initialSettings?: SiteLayoutSettings;
}

export default function Footer({ initialSettings }: FooterProps) {
  const pathname = usePathname();

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  // Format WhatsApp number
  const waNumber = initialSettings?.contactWhatsApp || "+923000000000";
  const formattedWa = waNumber.replace(/[^0-9]/g, "");

  return (
    <footer className="w-full bg-[#F0EBE3] border-t border-[#E7E1D8]">
      {/* Trust Bar */}
      <div className="bg-[#E7E1D8] py-3">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap justify-center sm:justify-between items-center text-xs text-[#6B6259] gap-4">
          <div className="flex items-center gap-2">
            <span>🚚</span> Cash on Delivery
          </div>
          <div className="flex items-center gap-2">
            <span>🇵🇰</span> Nationwide Delivery
          </div>
          <div className="flex items-center gap-2">
            <span>🔄</span> Easy Exchange
          </div>
          <div className="flex items-center gap-2">
            <span>★</span> Quality Fabric
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Logo and Tagline */}
        <div className="mb-10 text-center sm:text-left">
          <h2 className="text-2xl md:text-3xl font-serif tracking-wide text-[#171717] mb-2" style={{ fontFamily: '"Playfair Display", serif' }}>
            TAUHEED TEXTILE
          </h2>
          <p className="text-sm text-[#6B6259]">
            Crafting elegance and tradition for the modern era.
          </p>
        </div>

        {/* 4 Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {/* SHOP */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#171717] mb-4">Shop</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/shop?isNewArrival=true" className="text-sm text-[#6B6259] hover:text-[#171717] transition-colors block">
                  New In
                </Link>
              </li>
              <li>
                <Link href="/shop" className="text-sm text-[#6B6259] hover:text-[#171717] transition-colors block">
                  Women
                </Link>
              </li>
              <li>
                <Link href="/shop?category=unstitched" className="text-sm text-[#6B6259] hover:text-[#171717] transition-colors block">
                  2 Piece
                </Link>
              </li>
              <li>
                <Link href="/shop?category=lawn-summer" className="text-sm text-[#6B6259] hover:text-[#171717] transition-colors block">
                  3 Piece
                </Link>
              </li>
              <li>
                <Link href="/shop?category=pret-ready-to-wear" className="text-sm text-[#6B6259] hover:text-[#171717] transition-colors block">
                  Ready to Wear
                </Link>
              </li>
              <li>
                <Link href="/shop?category=wedding-luxury-pret" className="text-sm text-[#6B6259] hover:text-[#171717] transition-colors block">
                  Wedding & Luxury
                </Link>
              </li>
              <li>
                <Link href="/shop?category=sale" className="text-sm text-[#9B3D3D] hover:text-[#171717] transition-colors block">
                  Sale
                </Link>
              </li>
            </ul>
          </div>

          {/* HELP */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#171717] mb-4">Help</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/track-order" className="text-sm text-[#6B6259] hover:text-[#171717] transition-colors block">
                  Track Order
                </Link>
              </li>
              <li>
                <Link href="/policies/shipping" className="text-sm text-[#6B6259] hover:text-[#171717] transition-colors block">
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link href="/policies/returns" className="text-sm text-[#6B6259] hover:text-[#171717] transition-colors block">
                  Returns & Exchange
                </Link>
              </li>
              <li>
                <Link href="/policies/size-guide" className="text-sm text-[#6B6259] hover:text-[#171717] transition-colors block">
                  Size Guide
                </Link>
              </li>
              <li>
                <Link href="/policies/faq" className="text-sm text-[#6B6259] hover:text-[#171717] transition-colors block">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* CUSTOMER CARE */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#171717] mb-4">Customer Care</h3>
            <ul className="space-y-2">
              <li>
                <a href={`https://wa.me/${formattedWa}`} target="_blank" rel="noopener noreferrer" className="text-sm text-[#6B6259] hover:text-[#171717] transition-colors block">
                  WhatsApp
                </a>
              </li>
              <li>
                <a href={`mailto:${initialSettings?.contactEmail || "care@tauheedtextile.com"}`} className="text-sm text-[#6B6259] hover:text-[#171717] transition-colors block">
                  Email
                </a>
              </li>
              <li>
                <span className="text-sm text-[#6B6259] block">
                  Store Hours (Mon-Sat 10am-8pm)
                </span>
              </li>
            </ul>
          </div>

          {/* SOCIAL */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#171717] mb-4">Social</h3>
            <ul className="space-y-2">
              <li>
                <a href={initialSettings?.socialInstagram || "#"} target="_blank" rel="noopener noreferrer" className="text-sm text-[#6B6259] hover:text-[#171717] transition-colors block">
                  Instagram
                </a>
              </li>
              <li>
                <a href={initialSettings?.socialFacebook || "#"} target="_blank" rel="noopener noreferrer" className="text-sm text-[#6B6259] hover:text-[#171717] transition-colors block">
                  Facebook
                </a>
              </li>
              <li>
                <a href={initialSettings?.socialTikTok || "#"} target="_blank" rel="noopener noreferrer" className="text-sm text-[#6B6259] hover:text-[#171717] transition-colors block">
                  TikTok
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright Strip & Discreet Admin Access */}
      <div className="bg-[#E7E1D8] py-4 border-t border-[#DDD6CC]">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#6B6259]">
          <p>
            © 2026 Tauheed Textile. All rights reserved. Made with ❤️ in Pakistan.
          </p>
          <div className="flex items-center gap-4 text-[11px]">
            <Link
              href="/admin"
              className="text-[#8E857B] hover:text-[#171717] transition-colors flex items-center gap-1 opacity-70 hover:opacity-100"
              title="Staff Portal (Shortcut: Ctrl+Shift+A)"
            >
              <span>🔒 Staff Portal</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
