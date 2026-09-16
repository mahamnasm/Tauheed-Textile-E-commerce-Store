"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  ShoppingBag, 
  X, 
  Sparkles, 
  ArrowRight, 
  Clock, 
  Check, 
  MessageCircle, 
  Truck, 
  Bell, 
  Copy,
  Flame
} from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function AbandonedCartRetention() {
  const { cart, cartSubtotal, cartCount, openCart } = useCart();
  const [showExitModal, setShowExitModal] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [notificationGranted, setNotificationGranted] = useState(false);
  const [cartSessionId, setCartSessionId] = useState<string | null>(null);

  const originalTitleRef = useRef<string>("");
  const titleIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const hasTriggeredModalRef = useRef(false);

  // Store original page title
  useEffect(() => {
    if (typeof document !== "undefined") {
      originalTitleRef.current = document.title;
    }
  }, []);

  // 1. TAB SWITCHING / INACTIVITY ANIMATION (Flashing Title Notification)
  useEffect(() => {
    if (typeof document === "undefined") return;

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden" && cart.length > 0) {
        let toggle = false;
        const messages = [
          `(${cartCount}) 🛍️ You left items in your bag!`,
          `⚡ Flat 5% Off Reserved — Tᗩᑌᕼᗴᗴᗪ Tᗴ᙭TIᒪᗴ`,
          `🔥 Your luxury dress is selling fast!`,
        ];
        let msgIndex = 0;

        titleIntervalRef.current = setInterval(() => {
          document.title = messages[msgIndex % messages.length];
          msgIndex++;
        }, 1800);

        // Optional Web Push Notification if permission was granted
        if (typeof Notification !== "undefined" && Notification.permission === "granted") {
          try {
            new Notification("Tᗩᑌᕼᗴᗴᗪ Tᗴ᙭TIᒪᗴ — Don't Miss Out!", {
              body: `You have ${cartCount} unstitched article(s) in your bag (Rs. ${cartSubtotal.toLocaleString()}). Complete your order with free delivery above Rs. 10k.`,
              icon: "/logo-calligraphy.png",
              badge: "/logo-calligraphy.png",
              tag: "tauheed-cart-reminder",
            });
          } catch {}
        }
      } else {
        // Tab is active again -> restore original title
        if (titleIntervalRef.current) {
          clearInterval(titleIntervalRef.current);
          titleIntervalRef.current = null;
        }
        document.title = originalTitleRef.current || "Tᗩᑌᕼᗴᗴᗪ Tᗴ᙭TIᒪᗴ | Luxury Pakistani Fashion";
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (titleIntervalRef.current) clearInterval(titleIntervalRef.current);
    };
  }, [cart, cartCount, cartSubtotal]);

  // 2. EXIT INTENT DETECTION (Cursor leaves top) & INACTIVITY TRIGGER
  useEffect(() => {
    if (cart.length === 0) return;

    const handleMouseLeave = (e: MouseEvent) => {
      // User moves mouse to tab bar or close button
      if (e.clientY <= 15 && !hasTriggeredModalRef.current) {
        const lastDismissed = sessionStorage.getItem("tauheed_retention_dismissed");
        if (!lastDismissed) {
          setShowExitModal(true);
          hasTriggeredModalRef.current = true;
        }
      }
    };

    // Mobile / Inactivity fallback: if user stays idle for 60s with items in cart
    const inactivityTimer = setTimeout(() => {
      const lastDismissed = sessionStorage.getItem("tauheed_retention_dismissed");
      if (!lastDismissed && !hasTriggeredModalRef.current && cart.length > 0) {
        setShowExitModal(true);
        hasTriggeredModalRef.current = true;
      }
    }, 60000);

    document.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      document.removeEventListener("mouseleave", handleMouseLeave);
      clearTimeout(inactivityTimer);
    };
  }, [cart]);

  // 3. AUTO-SYNC ABANDONED CART TO BACKEND (Debounced)
  useEffect(() => {
    if (cart.length === 0) return;

    const syncTimer = setTimeout(async () => {
      try {
        const res = await fetch("/api/cart/abandoned", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            cartId: cartSessionId,
            cart,
            subtotal: cartSubtotal,
          }),
        });
        const data = await res.json();
        if (data.success && data.cartId) {
          setCartSessionId(data.cartId);
        }
      } catch {}
    }, 2500);

    return () => clearTimeout(syncTimer);
  }, [cart, cartSubtotal, cartSessionId]);

  // Request browser notifications
  const handleRequestNotification = async () => {
    if (typeof Notification === "undefined") return;
    try {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        setNotificationGranted(true);
      }
    } catch {}
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText("SAVE5");
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const handleDismissModal = () => {
    setShowExitModal(false);
    sessionStorage.setItem("tauheed_retention_dismissed", "true");
  };

  // Pre-filled WhatsApp cart backup message
  const getWhatsAppCartUrl = () => {
    const itemsList = cart.map((i) => `• ${i.productTitle} (${i.size || "Unstitched"}, Qty: ${i.quantity}) - Rs. ${(i.price * i.quantity).toLocaleString()}`).join("\n");
    const message = `Salam Tauheed Textile, I have saved these items in my cart on your website:\n\n${itemsList}\n\n*Total:* Rs. ${cartSubtotal.toLocaleString()}\n\nPlease reserve these pieces for me. How can I confirm my order?`;
    return `https://wa.me/923400262732?text=${encodeURIComponent(message)}`;
  };

  return (
    <>
      {/* Exit Intent & Abandoned Cart Recovery Modal */}
      {showExitModal && cart.length > 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
            onClick={handleDismissModal}
          />

          <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl z-10 border border-[#E7E1D8] space-y-5 text-[#171717]">
            {/* Close button */}
            <button
              onClick={handleDismissModal}
              className="absolute top-4 right-4 p-2 rounded-full text-[#6B6259] hover:bg-[#F0EBE3] hover:text-[#171717] transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Top Badge */}
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-[#FEF2F2] text-[#9B3D3D] text-xs font-bold flex items-center gap-1.5 border border-[#F2BDBD]">
                <Flame className="w-3.5 h-3.5 fill-current" /> High Demand — Reserved for 15 Minutes
              </span>
            </div>

            {/* Heading */}
            <div>
              <h3 className="font-serif font-bold text-2xl text-[#171717]">
                Don't Leave Your Luxury Dress Behind!
              </h3>
              <p className="text-xs text-[#6B6259] mt-1 leading-relaxed">
                Your selected unstitched articles are currently held in your bag. Complete your order now or save your bag to WhatsApp before stock runs out.
              </p>
            </div>

            {/* Cart Preview Thumbnail Strip */}
            <div className="p-3.5 rounded-2xl bg-[#F8F5F0] border border-[#E7E1D8] space-y-2.5">
              <div className="flex items-center justify-between text-xs font-bold text-[#171717]">
                <span>Items in your bag ({cartCount})</span>
                <span>Rs. {cartSubtotal.toLocaleString()}</span>
              </div>
              <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-thin">
                {cart.slice(0, 4).map((item) => (
                  <div
                    key={item.variantId}
                    className="flex items-center gap-2.5 bg-white p-2 rounded-xl border border-[#E7E1D8] shrink-0 max-w-[200px]"
                  >
                    <div className="relative w-10 h-12 rounded-lg overflow-hidden bg-[#F0EBE3] shrink-0">
                      <Image src={item.image} alt={item.productTitle} fill className="object-cover" />
                    </div>
                    <div className="min-w-0 text-left">
                      <p className="font-bold text-xs text-[#171717] truncate">{item.productTitle}</p>
                      <p className="text-[11px] text-[#7A6652] font-semibold">
                        Rs. {item.price.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Special Retention Promo Box */}
            <div className="p-4 rounded-2xl bg-[#FFF8E7] border border-[#F5D87E] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#7A5C00] flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#D4AF37]" /> Exclusive Retention Perk:
                </span>
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="px-2.5 py-1 rounded-lg bg-white border border-[#F5D87E] text-[11px] font-mono font-bold text-[#7A5C00] flex items-center gap-1 hover:bg-[#FEF3CD]"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5 text-[#1A6B3C]" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode ? "COPIED" : "SAVE5"}</span>
                </button>
              </div>
              <p className="text-xs text-[#7A5C00] leading-relaxed">
                Get an instant <strong className="font-bold">Flat 5% OFF</strong> on advance payments via Bank Transfer, JazzCash, or EasyPaisa! Free delivery on orders over Rs. 10,000.
              </p>
            </div>

            {/* Dual CTAs: Checkout & WhatsApp Save */}
            <div className="space-y-2.5 pt-1">
              <Link
                href="/checkout"
                onClick={handleDismissModal}
                className="w-full py-3.5 rounded-xl bg-[#171717] hover:bg-black text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all"
              >
                <span>Complete Checkout (Save 5%)</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <a
                href={getWhatsAppCartUrl()}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleDismissModal}
                className="w-full py-3 rounded-xl bg-[#128C7E] hover:bg-[#075E54] text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-sm"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Save Bag & Order via WhatsApp</span>
              </a>
            </div>

            {/* Notification Permission Opt-in */}
            <div className="pt-2 border-t border-[#E7E1D8] flex items-center justify-between text-[11px] text-[#6B6259]">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#7A6652]" /> Stock automatically releases in 15 mins
              </span>
              {!notificationGranted && (
                <button
                  type="button"
                  onClick={handleRequestNotification}
                  className="text-[#7A6652] font-semibold hover:underline flex items-center gap-1"
                >
                  <Bell className="w-3 h-3" /> Enable Cart Alerts
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
