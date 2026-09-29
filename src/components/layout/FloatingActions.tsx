"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { 
  MessageCircle, 
  Users, 
  ShoppingBag, 
  X, 
  Copy, 
  Check, 
  MapPin, 
  Sparkles, 
  ExternalLink,
  PhoneCall,
  Gift
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { SiteLayoutSettings } from "@/lib/settings";
import {
  InstagramBrandIcon,
  FacebookBrandIcon,
  TikTokBrandIcon,
  YouTubeBrandIcon,
  WhatsAppBrandIcon,
} from "@/components/common/SocialBrandIcons";
import SocialDiscountBanner from "@/components/home/SocialDiscountBanner";

interface FloatingActionsProps {
  initialSettings?: SiteLayoutSettings;
}

export default function FloatingActions({ initialSettings }: FloatingActionsProps) {
  const pathname = usePathname();
  const { cartCount, cartTotal, openCart, isCartOpen } = useCart();
  const [mounted, setMounted] = useState(false);
  const [showVipModal, setShowVipModal] = useState(false);
  const [showDiscountModal, setShowDiscountModal] = useState(false);
  const [showPromoPills, setShowPromoPills] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Auto-dismiss promo pills after 30 seconds on site
    const promoTimer = setTimeout(() => {
      setShowPromoPills(false);
    }, 30000);

    // Initial discount popup check
    try {
      const seen = sessionStorage.getItem("tauheed_discount_popup_seen");
      if (!seen) {
        const timer = setTimeout(() => {
          setShowDiscountModal(true);
          sessionStorage.setItem("tauheed_discount_popup_seen", "true");
        }, 4000);
        return () => {
          clearTimeout(timer);
          clearTimeout(promoTimer);
        };
      }
    } catch {
      // ignore
    }

    return () => clearTimeout(promoTimer);
  }, []);

  const isHiddenInCart =
    isCartOpen ||
    pathname === "/cart" ||
    pathname === "/checkout" ||
    pathname?.startsWith("/order-confirmation");

  if (!mounted || pathname?.startsWith("/admin")) return null;

  const rawPhone = initialSettings?.contactWhatsApp || "03400262732";
  const cleanPhone = rawPhone.replace(/\D/g, "");
  const formattedPhone = cleanPhone.startsWith("0") 
    ? `92${cleanPhone.slice(1)}` 
    : cleanPhone.startsWith("92") 
      ? cleanPhone 
      : `92${cleanPhone}`;

  const defaultDirectMessage = encodeURIComponent(
    initialSettings?.whatsappMessage || "Assalam-o-Alaikum Tauheed Textile, I would like assistance with my order."
  );

  const vipCommunityUrl = (
    initialSettings?.whatsappCommunityLink || "https://chat.whatsapp.com/BUymI7Xr1yo4v71rFczs8S"
  ).replace(/\?mode=.*$/, "");

  const vipJoinMessage = encodeURIComponent(
    "Asalamualikum 🌸 Tauheed Textile, please save my contact for the Ladies Clothing WhatsApp Community & daily status updates!\n\nName: \nCity: "
  );

  const handleCopyLink = () => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(vipCommunityUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleOpenCommunity = () => {
    window.open(vipCommunityUrl, "_blank", "noopener,noreferrer");
  };

  const showCommunity = initialSettings?.showWhatsappCommunity !== false;

  return (
    <>
      {/* Floating Action Buttons Dock - Hidden in Cart/Checkout */}
      {!isHiddenInCart && (
        <aside 
          aria-label="Floating Storefront Actions" 
          className="fixed bottom-4 sm:bottom-6 right-3 sm:right-6 z-[40] flex flex-col items-end gap-2.5 select-none"
        >
          {/* Promotional Pills (Auto-disappear after 30 seconds on site) */}
          {showPromoPills && (
            <div className="flex flex-col items-end gap-2 transition-all duration-700 ease-out animate-fadeIn">
              {/* Flat 5% OFF Pill */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowDiscountModal(true)}
                  aria-label="Unlock Flat 5% OFF Discount"
                  className="group flex items-center gap-2 bg-[#171717]/95 hover:bg-[#221F1C] text-white px-3.5 py-2 rounded-full border border-[#B28A3E]/60 hover:border-[#E5A93C] text-xs font-semibold shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer backdrop-blur-md"
                >
                  <Gift className="w-3.5 h-3.5 text-[#E5A93C]" />
                  <span>Flat 5% OFF</span>
                  <span className="text-[9px] bg-gradient-to-r from-[#B28A3E] via-[#E5A93C] to-[#B28A3E] text-[#171717] px-1.5 py-0.5 rounded font-black tracking-wider uppercase shadow-xs">
                    CLAIM
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowPromoPills(false)}
                  className="absolute -top-1.5 -left-1.5 w-4 h-4 rounded-full bg-[#171717] text-[#A89F95] hover:text-white border border-[#B28A3E]/40 flex items-center justify-center text-[9px] transition-colors cursor-pointer"
                  title="Dismiss promo pill"
                >
                  ✕
                </button>
              </div>

              {/* VIP Community Pill */}
              {showCommunity && (
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowVipModal(true)}
                    aria-label="Join VIP WhatsApp Community"
                    className="group flex items-center gap-2 bg-[#171717]/95 hover:bg-[#221F1C] text-white px-3.5 py-2 rounded-full border border-[#B28A3E]/60 hover:border-[#E5A93C] text-xs font-semibold shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer backdrop-blur-md"
                  >
                    <Users className="w-3.5 h-3.5 text-[#E5A93C]" />
                    <span>VIP Community</span>
                    <span className="text-[9px] bg-gradient-to-r from-[#B28A3E] via-[#E5A93C] to-[#B28A3E] text-[#171717] px-1.5 py-0.5 rounded font-black tracking-wider uppercase shadow-xs">
                      JOIN
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowPromoPills(false)}
                    className="absolute -top-1.5 -left-1.5 w-4 h-4 rounded-full bg-[#171717] text-[#A89F95] hover:text-white border border-[#B28A3E]/40 flex items-center justify-center text-[9px] transition-colors cursor-pointer"
                    title="Dismiss promo pill"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Core Floating Actions (Cart if items exist + Official WhatsApp) */}
          <div className="flex flex-col items-end gap-2.5">
            {/* Quick Cart Floating Button (Only visible when items are added!) */}
            {cartCount > 0 && (
              <button
                type="button"
                onClick={openCart}
                aria-label="Open Shopping Bag"
                className="group relative flex items-center justify-center w-12 h-12 sm:w-13 sm:h-13 rounded-full bg-[#171717] hover:bg-[#24211D] text-white shadow-xl border border-[#B28A3E]/80 transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer"
              >
                <ShoppingBag className="w-5 h-5 text-[#E5A93C] transition-transform duration-300 group-hover:scale-110" strokeWidth={2.2} />
                <span className="absolute -top-1 -right-1 min-w-[20px] h-[20px] px-1 rounded-full bg-[#9B3D3D] text-white text-[10px] font-black flex items-center justify-center border border-white/60 shadow-md">
                  {cartCount}
                </span>
              </button>
            )}

            {/* Official WhatsApp Floating Contact Button */}
            <a
              href={`https://wa.me/${formattedPhone}?text=${defaultDirectMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Contact on WhatsApp"
              className="group relative flex items-center justify-center w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-[#25D366] hover:bg-[#20BA5A] shadow-[0_8px_25px_rgba(37,211,102,0.45)] border-2 border-white/80 ring-2 ring-[#B28A3E]/40 transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer"
              title="Chat with Tauheed Textile on WhatsApp"
            >
              <WhatsAppBrandIcon className="w-7 h-7 sm:w-8 sm:h-8" />
            </a>
          </div>
        </aside>
      )}

      {/* VIP Community Interactive Modal */}
      {showVipModal && (
        <div 
          className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-sm animate-fadeIn"
          onClick={() => setShowVipModal(false)}
        >
          <div 
            className="w-full sm:max-w-lg bg-[#191817] text-white rounded-t-3xl sm:rounded-2xl border border-[#C4A882]/40 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-slideUp sm:animate-zoomIn"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="relative bg-gradient-to-r from-[#24211D] via-[#1F1C18] to-[#151412] px-6 py-5 border-b border-[#C4A882]/20 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#B28A3E]/20 border border-[#B28A3E]/40 flex items-center justify-center shrink-0">
                  <Users className="w-5 h-5 text-[#E5A93C]" />
                </div>
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#B28A3E]/20 text-[#E5A93C] text-[10px] font-black uppercase tracking-widest mb-0.5">
                    <Sparkles className="w-3 h-3" />
                    <span>Exclusive VIP Club</span>
                  </div>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-white tracking-tight">
                    Tauheed Textile Community
                  </h3>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowVipModal(false)}
                className="p-1.5 rounded-full text-[#A89F95] hover:text-white hover:bg-white/10 transition-colors focus:outline-none"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 overflow-y-auto">
              {/* Store Location Badge */}
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-[#E8DEC8]">
                <MapPin className="w-4 h-4 text-[#E5A93C] shrink-0 mt-0.5" />
                <span className="leading-relaxed">
                  <strong>Karachi Outlet:</strong> Shop G10, New Qurtaba Market, Opposite Qurtaba Masjid, Bahadurabad, Karachi.
                </span>
              </div>

              {/* Greeting Card */}
              <div className="space-y-2 text-sm leading-relaxed text-[#D4CFC9]">
                <p className="font-semibold text-white text-base">
                  Asalamualikum 🌸 Welcome to Tauheed Textile 👗✨
                </p>
                <p className="text-xs text-[#A89F95]">
                  Get instant access to limited edition lawn drops, seasonal secret discounts, runway videos, and exclusive daily WhatsApp Status catalogues.
                </p>
              </div>

              {/* Action 1: Direct WhatsApp Community Join */}
              <div className="space-y-2">
                <a
                  href={vipCommunityUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-shimmer animate-glow-emerald w-full flex items-center justify-center gap-2.5 py-3.5 px-5 rounded-xl bg-[#25D366] hover:bg-[#20BA5A] text-[#0A2612] font-black text-sm tracking-wide shadow-lg transition-all hover:scale-[1.02] active:scale-95 text-center"
                >
                  <WhatsAppBrandIcon className="w-5 h-5 shrink-0" />
                  <span>👉 Join WhatsApp Community Directly</span>
                  <ExternalLink className="w-4 h-4 opacity-80" />
                </a>

                {/* Secondary copy invite link button */}
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs text-[#A89F95] hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors border border-white/5"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#25D366]" />
                      <span className="text-[#25D366] font-semibold">Community Link Copied to Clipboard!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Direct Invite Link</span>
                    </>
                  )}
                </button>
              </div>

              {/* Action 2: Save Number & Reply with Name & City */}
              <div className="p-4 rounded-xl bg-[#221F1B] border border-[#C4A882]/30 space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-[#C4A882] text-[#171717] font-black text-xs flex items-center justify-center shrink-0">
                    2
                  </div>
                  <h4 className="font-semibold text-white text-xs uppercase tracking-wider">
                    To View Our Daily WhatsApp Statuses:
                  </h4>
                </div>
                
                <p className="text-xs text-[#C8C2BB] leading-relaxed">
                  👉 Save our number (<strong className="text-white font-mono">0340-0262732</strong>) in your phone, then send your <strong>Name & City</strong> so we can save your contact!
                </p>

                <a
                  href={`https://wa.me/${formattedPhone}?text=${vipJoinMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-lg bg-[#171717] hover:bg-[#2A2624] text-[#E5A93C] border border-[#C4A882]/50 font-bold text-xs transition-all hover:scale-[1.01] active:scale-[0.99] text-center"
                >
                  <MessageCircle className="w-4 h-4 text-[#25D366]" />
                  <span>Reply with Name & City on WhatsApp 🌹</span>
                </a>
              </div>

              {/* Social Channels Row */}
              <div className="space-y-2 pt-2">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[#A89F95] text-center">
                  👉 Follow Us on Official Social Channels:
                </p>
                <div className="grid grid-cols-4 gap-2">
                  <a
                    href="https://www.instagram.com/tauheedtextile?igsh=MXhmZXYxdHQ4bmRqMw=="
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-1.5 p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-center group"
                  >
                    <InstagramBrandIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] text-[#C8C2BB]">Instagram</span>
                  </a>

                  <a
                    href="https://www.facebook.com/share/1AP8TutLtK/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-1.5 p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-center group"
                  >
                    <FacebookBrandIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] text-[#C8C2BB]">Facebook</span>
                  </a>

                  <a
                    href="https://www.tiktok.com/@tauheedtextile?_t=ZS-8zWsIAB7SWP&_r=1"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-1.5 p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-center group"
                  >
                    <TikTokBrandIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] text-[#C8C2BB]">TikTok</span>
                  </a>

                  <a
                    href="https://youtube.com/@tauheedtextile?si=-Em9yFuBLQcyJEYF"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-1.5 p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-center group"
                  >
                    <YouTubeBrandIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] text-[#C8C2BB]">YouTube</span>
                  </a>
                </div>
              </div>

              {/* Thank you footer */}
              <p className="text-center text-xs text-[#A89F95] italic pt-1">
                JazakAllah for staying connected ❤️
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 5% OFF Viral Community Popup Window Modal */}
      <SocialDiscountBanner
        isOpen={showDiscountModal}
        onClose={() => setShowDiscountModal(false)}
      />
    </>
  );
}
