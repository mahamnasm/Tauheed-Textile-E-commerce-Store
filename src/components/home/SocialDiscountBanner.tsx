"use client";

import React from "react";
import Link from "next/link";
import {
  Sparkles,
  CheckCircle2,
  ExternalLink,
  MessageCircle,
  MapPin,
  Flame,
  ArrowRight,
} from "lucide-react";
import {
  InstagramBrandIcon,
  FacebookBrandIcon,
  TikTokBrandIcon,
  YouTubeBrandIcon,
  WhatsAppBrandIcon,
} from "@/components/common/SocialBrandIcons";

export default function SocialDiscountBanner() {
  const whatsappClaimUrl =
    "https://wa.me/923400262732?text=" +
    encodeURIComponent(
      "Assalam-o-Alaikum Tauheed Textile! 🎉 I have followed on Instagram, Facebook, TikTok, subscribed on YouTube and left a Google review. Here is my screenshot to unlock my Flat 5% OFF discount code!"
    );

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1F1D1B] via-[#171717] to-[#0D0D0D] border-2 border-[#C4A882]/40 text-white p-6 sm:p-10 shadow-2xl">
        {/* Glow ambient background elements */}
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-80 h-80 rounded-full bg-[#B28A3E]/15 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-72 h-72 rounded-full bg-[#9B3D3D]/15 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
          {/* Left Column: Heading & Hook */}
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#B28A3E]/20 border border-[#B28A3E]/40 text-[#E8DEC8] text-xs font-bold tracking-wider uppercase">
              <Flame className="w-3.5 h-3.5 text-[#E5A93C] animate-pulse" />
              <span>Viral Community Offer</span>
            </div>

            <h2 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight">
              Get Flat <span className="text-[#E5A93C] underline decoration-[#B28A3E]/50">5% OFF</span> – It’s Super Easy! 🎉
            </h2>

            <p className="text-[#C8C2BB] text-sm sm:text-base leading-relaxed">
              Want an instant discount on your next luxury outfit? 💃✨ Complete 4 simple steps, share your screenshot on WhatsApp, and unlock your exclusive savings!
            </p>

            {/* Shop Address Badge */}
            <div className="inline-flex items-center gap-2 text-xs text-[#E8DEC8] bg-white/5 border border-white/10 rounded-xl px-3.5 py-2">
              <MapPin className="w-4 h-4 text-[#E5A93C] shrink-0" />
              <span>
                <strong>Karachi Studio:</strong> Shop G10, New Qurtaba Market, Opposite Qurtaba Masjid, Bahadurabad, Karachi.
              </span>
            </div>
          </div>

          {/* Right Column: CTA WhatsApp Button (Animated Shimmer & Emerald Glow) */}
          <div className="shrink-0 flex flex-col sm:flex-row lg:flex-col gap-3">
            <a
              href={whatsappClaimUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-shimmer animate-glow-emerald group inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-xl bg-[#25D366] hover:bg-[#20BA5A] text-[#0A2612] font-black text-sm shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 text-center cursor-pointer"
            >
              <WhatsAppBrandIcon className="w-5 h-5 shrink-0" />
              <span>Claim 5% OFF on WhatsApp</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </a>

            <a
              href="https://chat.whatsapp.com/BUymI7Xr1yo4v71rFczs8S"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-[#F0EBE3] text-xs font-bold transition-all hover:scale-105 active:scale-95 text-center cursor-pointer"
            >
              <span>Join WhatsApp VIP Community</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-80 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>
        </div>

        {/* 4 Interactive Steps Grid */}
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8 pt-8 border-t border-white/10">
          {/* Step 1: Follow Socials */}
          <div className="bg-white/5 backdrop-blur-xs border border-white/10 rounded-xl p-4 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black tracking-widest uppercase text-[#E5A93C]">Step 1</span>
                <CheckCircle2 className="w-4 h-4 text-[#B28A3E]" />
              </div>
              <h3 className="font-semibold text-sm text-white mt-1">Follow on Social Media</h3>
              <p className="text-[11px] text-[#A89F95] mt-1">Follow our official channels for daily reel updates:</p>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <a
                href="https://www.instagram.com/tauheedtextile?igsh=MXhmZXYxdHQ4bmRqMw=="
                target="_blank"
                rel="noopener noreferrer"
                title="Follow Instagram"
                className="p-2 rounded-lg bg-white/10 hover:bg-[#E1306C] text-white transition-colors"
              >
                <InstagramBrandIcon className="w-4 h-4" />
              </a>
              <a
                href="https://www.facebook.com/share/1AP8TutLtK/"
                target="_blank"
                rel="noopener noreferrer"
                title="Follow Facebook Profile"
                className="p-2 rounded-lg bg-white/10 hover:bg-[#1877F2] text-white transition-colors"
              >
                <FacebookBrandIcon className="w-4 h-4" />
              </a>
              <a
                href="https://www.tiktok.com/@tauheedtextile?_t=ZS-8zWsIAB7SWP&_r=1"
                target="_blank"
                rel="noopener noreferrer"
                title="Follow TikTok"
                className="p-2 rounded-lg bg-white/10 hover:bg-black text-white transition-colors"
              >
                <TikTokBrandIcon className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Step 2: Subscribe YouTube */}
          <div className="bg-white/5 backdrop-blur-xs border border-white/10 rounded-xl p-4 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black tracking-widest uppercase text-[#E5A93C]">Step 2</span>
                <CheckCircle2 className="w-4 h-4 text-[#B28A3E]" />
              </div>
              <h3 className="font-semibold text-sm text-white mt-1">Subscribe on YouTube</h3>
              <p className="text-[11px] text-[#A89F95] mt-1">Watch 4K runway showcases & fabric close-ups:</p>
            </div>
            <div className="pt-2">
              <a
                href="https://youtube.com/@tauheedtextile?si=-Em9yFuBLQcyJEYF"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-[#C4302B] hover:bg-[#A82622] text-white text-xs font-semibold transition-all w-full justify-center"
              >
                <YouTubeBrandIcon className="w-4 h-4" />
                <span>Subscribe Channel</span>
              </a>
            </div>
          </div>

          {/* Step 3: Google Maps & Facebook Review */}
          <div className="bg-white/5 backdrop-blur-xs border border-white/10 rounded-xl p-4 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black tracking-widest uppercase text-[#E5A93C]">Step 3</span>
                <CheckCircle2 className="w-4 h-4 text-[#B28A3E]" />
              </div>
              <h3 className="font-semibold text-sm text-white mt-1">Leave Us a Review</h3>
              <p className="text-[11px] text-[#A89F95] mt-1">Share your 5-star love on Google Maps:</p>
            </div>
            <div className="pt-2">
              <a
                href="https://maps.app.goo.gl/TnVAWrMxufUUpv3h8"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-[#F0EBE3] border border-white/20 text-xs font-semibold transition-all w-full justify-center"
              >
                <MapPin className="w-4 h-4 text-[#34A853]" />
                <span>Review on Google Maps</span>
              </a>
            </div>
          </div>

          {/* Step 4: WhatsApp Screenshot */}
          <div className="bg-[#B28A3E]/10 border border-[#B28A3E]/40 rounded-xl p-4 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black tracking-widest uppercase text-[#E5A93C]">Step 4</span>
                <Sparkles className="w-4 h-4 text-[#E5A93C]" />
              </div>
              <h3 className="font-semibold text-sm text-white mt-1">Send Screenshot</h3>
              <p className="text-[11px] text-[#C8C2BB] mt-1">Share proof to WhatsApp: <strong>0340-0262732</strong></p>
            </div>
            <div className="pt-2">
              <a
                href={whatsappClaimUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-[#128C7E] hover:bg-[#0E7064] text-white text-xs font-bold transition-all w-full justify-center"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Send on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
