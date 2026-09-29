"use client";

import React, { useEffect } from "react";
import {
  Sparkles,
  ExternalLink,
  MapPin,
  ArrowRight,
  X,
} from "lucide-react";
import {
  InstagramBrandIcon,
  FacebookBrandIcon,
  TikTokBrandIcon,
  YouTubeBrandIcon,
  WhatsAppBrandIcon,
} from "@/components/common/SocialBrandIcons";

interface SocialDiscountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SocialDiscountBanner({ isOpen, onClose }: SocialDiscountModalProps) {
  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const whatsappClaimUrl =
    "https://wa.me/923400262732?text=" +
    encodeURIComponent(
      "Assalam-o-Alaikum Tauheed Textile! 🎉 I followed your official socials. Here is my screenshot to unlock my Flat 5% OFF discount code!"
    );

  const socialChannels = [
    {
      name: "Instagram",
      href: "https://www.instagram.com/tauheedtextile?igsh=MXhmZXYxdHQ4bmRqMw==",
      icon: InstagramBrandIcon,
      hoverBg: "hover:bg-[#E1306C]",
    },
    {
      name: "Facebook",
      href: "https://www.facebook.com/share/1AP8TutLtK/",
      icon: FacebookBrandIcon,
      hoverBg: "hover:bg-[#1877F2]",
    },
    {
      name: "TikTok",
      href: "https://www.tiktok.com/@tauheedtextile?_t=ZS-8zWsIAB7SWP&_r=1",
      icon: TikTokBrandIcon,
      hoverBg: "hover:bg-black",
    },
    {
      name: "YouTube",
      href: "https://youtube.com/@tauheedtextile?si=-Em9yFuBLQcyJEYF",
      icon: YouTubeBrandIcon,
      hoverBg: "hover:bg-[#FF0000]",
    },
    {
      name: "Review",
      href: "https://maps.app.goo.gl/TnVAWrMxufUUpv3h8",
      icon: MapPin,
      hoverBg: "hover:bg-[#34A853]",
    },
  ];

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-sm sm:max-w-md rounded-2xl bg-gradient-to-b from-[#1E1B18] via-[#151412] to-[#0D0C0B] border border-[#B28A3E]/40 text-white p-5 sm:p-6 shadow-2xl animate-scaleUp my-auto select-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Subtle Ambient Gold Glow */}
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-44 h-44 rounded-full bg-[#B28A3E]/15 blur-2xl pointer-events-none" />

        {/* Easy Circular Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3.5 right-3.5 z-20 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 active:bg-white/30 text-white/80 hover:text-white flex items-center justify-center transition-all cursor-pointer"
          aria-label="Close discount popup"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header Badge */}
        <div className="text-center pt-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#B28A3E]/20 border border-[#B28A3E]/40 text-[#E5A93C] text-[11px] font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-[#E5A93C]" />
            <span>VIP Community Offer</span>
          </div>

          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-tight mt-2.5">
            Get Flat <span className="text-[#E5A93C]">5% OFF</span>
          </h2>

          <p className="text-[#C8C2BB] text-xs sm:text-[13px] leading-relaxed mt-1.5 px-2">
            Follow our channels, share a screenshot on WhatsApp, and receive your instant discount voucher!
          </p>
        </div>

        {/* 1-Tap Social Icons Strip */}
        <div className="mt-4 pt-3 border-t border-white/10">
          <span className="block text-[10px] font-bold uppercase tracking-wider text-[#A89F95] text-center mb-2.5">
            Step 1: Follow & Subscribe
          </span>
          <div className="flex items-center justify-center gap-2">
            {socialChannels.map((ch) => {
              const Icon = ch.icon;
              return (
                <a
                  key={ch.name}
                  href={ch.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex flex-col items-center gap-1 p-2 rounded-xl bg-white/5 border border-white/10 ${ch.hoverBg} text-white/90 hover:text-white transition-all hover:scale-105 active:scale-95 text-center min-w-[54px]`}
                  title={`Open ${ch.name}`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-[9px] font-semibold">{ch.name}</span>
                </a>
              );
            })}
          </div>
        </div>

        {/* Primary CTA: Claim on WhatsApp */}
        <div className="mt-4 space-y-2">
          <a
            href={whatsappClaimUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-center gap-2 w-full py-3.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20BA5A] text-[#0A2612] font-black text-xs sm:text-sm shadow-lg transition-all hover:scale-[1.02] active:scale-95 text-center cursor-pointer"
          >
            <WhatsAppBrandIcon className="w-4 h-4 shrink-0" />
            <span>Claim 5% OFF on WhatsApp</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </a>

          {/* Secondary Link: VIP Community */}
          <a
            href="https://chat.whatsapp.com/BUymI7Xr1yo4v71rFczs8S"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 w-full py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-[#C8C2BB] hover:text-white text-xs font-semibold transition-all text-center cursor-pointer"
          >
            <span>Join WhatsApp VIP Community</span>
            <ExternalLink className="w-3 h-3 opacity-70" />
          </a>
        </div>

        {/* Dismiss Link */}
        <div className="text-center mt-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="text-[11px] text-[#8A7E73] hover:text-[#C8C2BB] transition-colors cursor-pointer"
          >
            No thanks, continue shopping →
          </button>
        </div>
      </div>
    </div>
  );
}
