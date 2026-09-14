"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { MessageCircle } from "lucide-react";

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

  return (
    <a
      href={`https://wa.me/${formattedPhone}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contact on WhatsApp"
      className="fixed bottom-6 right-6 z-40 bg-emerald-600 hover:bg-emerald-700 text-white p-3.5 rounded-full shadow-2xl flex items-center gap-2 group transition-all duration-300 hover:scale-105 border-2 border-white"
    >
      <MessageCircle className="w-6 h-6 fill-current" />
      <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-500 text-xs font-semibold tracking-wide pr-1">
        Chat with Us
      </span>
    </a>
  );
}
