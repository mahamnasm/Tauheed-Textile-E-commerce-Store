"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
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
      {/* Continuous Automatic Sliding Trust Bar */}
      <div className="w-full bg-[#E7E1D8] border-b border-[#DDD6CB] overflow-hidden py-3 select-none relative">
        <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
          {[0, 1, 2, 3].map((loopIdx) => (
            <div key={loopIdx} className="flex items-center shrink-0">
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#4A4036] px-6 whitespace-nowrap">
                <span className="text-sm shrink-0">🚚</span>
                <span>Free Delivery Over Rs. 10,000</span>
              </div>
              <span className="text-[#C4B8A8] text-xs shrink-0 select-none">•</span>

              <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#4A4036] px-6 whitespace-nowrap">
                <span className="text-sm shrink-0">🏷️</span>
                <span>Flat 5% Off: Bank &amp; EasyPaisa</span>
              </div>
              <span className="text-[#C4B8A8] text-xs shrink-0 select-none">•</span>

              <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#4A4036] px-6 whitespace-nowrap">
                <span className="text-sm shrink-0">🔄</span>
                <span>7-Day Exchange Only</span>
              </div>
              <span className="text-[#C4B8A8] text-xs shrink-0 select-none">•</span>

              <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#4A4036] px-6 whitespace-nowrap">
                <span className="text-sm shrink-0">🇵🇰</span>
                <span>Nationwide 5–7 Working Days</span>
              </div>
              <span className="text-[#C4B8A8] text-xs shrink-0 select-none">•</span>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Unified Logo and Tagline */}
        <div className="mb-10 text-center sm:text-left">
          <Link href="/" className="inline-flex items-center justify-center sm:justify-start gap-3 mb-2 select-none group">
            <div className="relative h-12 w-9 sm:h-14 sm:w-11 shrink-0 transition-transform duration-200 group-hover:scale-105">
              <Image
                src="/logo-calligraphy.png"
                alt="Tauheed Textile Logo"
                fill
                className="object-contain"
              />
            </div>
            <span className="font-serif text-2xl sm:text-3xl font-bold text-[#171717] whitespace-nowrap leading-none select-none">
              𝑻𝒂𝒖𝒉𝒆𝒆𝒅 𝑻𝒆𝒙𝒕𝒊𝒍𝒆
            </span>
          </Link>
          <p className="text-sm font-medium text-[#6B6259]">
            Premium Quality at Best Price
          </p>
        </div>

        {/* 4 Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {/* SHOP */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#171717] mb-4">Shop Collections</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/shop?isNewArrival=true" className="text-[#2D2620] hover:text-[#B28A3E] transition-colors block">
                  New In 2026
                </Link>
              </li>
              <li>
                <Link href="/shop?category=lawn-summer" className="text-[#2D2620] hover:text-[#B28A3E] transition-colors block">
                  Lawn & Summer
                </Link>
              </li>
              <li>
                <Link href="/shop?category=lawn-formals" className="text-[#2D2620] hover:text-[#B28A3E] transition-colors block">
                  Lawn Formals
                </Link>
              </li>
              <li>
                <Link href="/shop?category=chiffon-formal" className="text-[#2D2620] hover:text-[#B28A3E] transition-colors block">
                  Chiffon & Formal
                </Link>
              </li>
              <li>
                <Link href="/shop?category=silk" className="text-[#2D2620] hover:text-[#B28A3E] transition-colors block">
                  Silk Collection
                </Link>
              </li>
              <li>
                <Link href="/shop?category=net-formals" className="text-[#2D2620] hover:text-[#B28A3E] transition-colors block">
                  Net Formals
                </Link>
              </li>
              <li>
                <Link href="/shop?category=organza-formals" className="text-[#2D2620] hover:text-[#B28A3E] transition-colors block">
                  Organza Formals
                </Link>
              </li>
              <li>
                <Link href="/shop?category=bridal-maxies" className="text-[#2D2620] hover:text-[#B28A3E] transition-colors block">
                  Bridal Maxies
                </Link>
              </li>
              <li>
                <Link href="/shop?category=saries" className="text-[#2D2620] hover:text-[#B28A3E] transition-colors block">
                  Saries
                </Link>
              </li>
              <li>
                <Link href="/shop?category=winter-collection" className="text-[#2D2620] hover:text-[#B28A3E] transition-colors block">
                  Winter Collection
                </Link>
              </li>
              <li>
                <Link href="/shop?category=sale" className="text-[#9B3D3D] font-semibold hover:text-[#7A2D2D] transition-colors block">
                  Sale & Clearance
                </Link>
              </li>
            </ul>
          </div>

          {/* HELP */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#171717] mb-4">Customer Care</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/track-order" className="text-[#2D2620] hover:text-[#B28A3E] transition-colors block">
                  Track Order
                </Link>
              </li>
              <li>
                <Link href="/policies/shipping" className="text-[#2D2620] hover:text-[#B28A3E] transition-colors block">
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link href="/policies/returns" className="text-[#2D2620] hover:text-[#B28A3E] transition-colors block">
                  Exchange Policy
                </Link>
              </li>
              <li>
                <Link href="/policies/faq" className="text-[#2D2620] hover:text-[#B28A3E] transition-colors block">
                  FAQs
                </Link>
              </li>
              <li>
                <Link href="/policies/privacy" className="text-[#2D2620] hover:text-[#B28A3E] transition-colors block">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/policies/terms" className="text-[#2D2620] hover:text-[#B28A3E] transition-colors block">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* CONCIERGE & TIMINGS */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#171717] mb-4">Store Hours & Concierge</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <span className="text-[#171717] font-semibold block">Store Hours:</span>
                <span className="text-[#6B6259] block">
                  Mon - Sat: 1:00 PM – 9:00 PM PKT
                </span>
              </li>
              <li>
                <a href={`https://wa.me/${formattedWa}`} target="_blank" rel="noopener noreferrer" className="text-[#2D2620] hover:text-[#B28A3E] transition-colors block">
                  WhatsApp: +92 340 0262732
                </a>
              </li>
              <li>
                <a href={`mailto:${initialSettings?.contactEmail || "care@tauheedtextile.com"}`} className="text-[#2D2620] hover:text-[#B28A3E] transition-colors block">
                  Email: {initialSettings?.contactEmail || "care@tauheedtextile.com"}
                </a>
              </li>
              <li>
                <span className="text-xs text-[#6B6259] block pt-2">
                  Custom stitching available via WhatsApp.
                </span>
              </li>
            </ul>
          </div>

          {/* SOCIAL */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#171717] mb-4">Connect With Us</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href={initialSettings?.socialYouTube || "https://youtube.com/@tauheedtextile"} target="_blank" rel="noopener noreferrer" className="text-[#6B6259] hover:text-[#C4302B] transition-colors flex items-center gap-2">
                  <span>▶️</span> YouTube Channel
                </a>
              </li>
              <li>
                <a href={initialSettings?.socialInstagram || "https://instagram.com/tauheedtextile"} target="_blank" rel="noopener noreferrer" className="text-[#6B6259] hover:text-[#E1306C] transition-colors flex items-center gap-2">
                  <span>📸</span> Instagram
                </a>
              </li>
              <li>
                <a href={initialSettings?.socialFacebook || "https://facebook.com/tauheedtextile"} target="_blank" rel="noopener noreferrer" className="text-[#6B6259] hover:text-[#1877F2] transition-colors flex items-center gap-2">
                  <span>📘</span> Facebook
                </a>
              </li>
              <li>
                <a href={initialSettings?.socialTikTok || "https://tiktok.com/@tauheedtextile"} target="_blank" rel="noopener noreferrer" className="text-[#2D2620] hover:text-[#B28A3E] transition-colors flex items-center gap-2">
                  <span>🎵</span> TikTok
                </a>
              </li>
              <li className="pt-2">
                <a
                  href={initialSettings?.whatsappCommunityLink || "https://chat.whatsapp.com/TauheedVIP"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#128C7E] hover:bg-[#075E54] text-white text-xs font-bold transition-all shadow-xs hover:shadow-sm"
                >
                  <span>💬 Join VIP WhatsApp Group</span>
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
