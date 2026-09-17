"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { MessageCircle, Users } from "lucide-react";

import { SiteLayoutSettings } from "@/lib/settings";

interface WhatsAppFloatProps {
  initialSettings?: SiteLayoutSettings;
}

export default function WhatsAppFloat({ initialSettings }: WhatsAppFloatProps) {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;

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
    <div className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-40 flex flex-col items-end gap-2.5 select-none">
      {/* 1. VIP WhatsApp Community Button */}
      {showCommunity && (
        <a
          href={communityLink}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Join VIP WhatsApp Community"
          className="group flex items-center gap-2 bg-[#128C7E] hover:bg-[#075E54] text-white px-3.5 py-2 rounded-full shadow-xl border-2 border-white/90 text-xs font-bold transition-all duration-300 hover:scale-105 hover:shadow-2xl"
        >
          <div className="relative">
            <Users className="w-4 h-4 text-emerald-200" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          </div>
          <span className="text-[11px] sm:text-xs font-semibold tracking-wide flex items-center gap-1">
            <span>VIP Community</span>
            <span className="text-[9px] bg-amber-400 text-black px-1.5 py-0.5 rounded font-black tracking-widest uppercase">
              JOIN
            </span>
          </span>
        </a>
      )}

      {/* 2. Direct 1-on-1 WhatsApp Concierge */}
      <a
        href={`https://wa.me/${formattedPhone}?text=${message}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contact on WhatsApp"
        className="bg-emerald-600 hover:bg-emerald-700 text-white p-3 sm:p-3.5 rounded-full shadow-2xl flex items-center gap-2 group transition-all duration-300 hover:scale-105 border-2 border-white"
      >
        <MessageCircle className="w-6 h-6 fill-current" />
        <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-500 text-xs font-semibold tracking-wide pr-1">
          Chat with Us
        </span>
      </a>
    </div>
  );
}
