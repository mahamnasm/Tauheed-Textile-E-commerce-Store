"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Cookie, X, Check, ShieldCheck } from "lucide-react";

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem("tauheed_cookie_consent");
      if (!consent) {
        // Small delay for smooth entry animation
        const timer = setTimeout(() => setIsVisible(true), 1200);
        return () => clearTimeout(timer);
      }
    } catch {
      // LocalStorage unavailable (e.g. privacy mode)
    }
  }, []);

  const handleAccept = () => {
    try {
      localStorage.setItem("tauheed_cookie_consent", "accepted");
    } catch {}
    setIsVisible(false);
  };

  const handleDecline = () => {
    try {
      localStorage.setItem("tauheed_cookie_consent", "declined");
    } catch {}
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <aside
      aria-label="Cookie consent banner"
      className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 bg-[#171717] text-white p-5 rounded-2xl border border-[#B28A3E]/40 shadow-2xl animate-fadeIn backdrop-blur-md"
    >
      <div className="flex items-start gap-3.5">
        <div className="w-9 h-9 rounded-full bg-[#B28A3E]/20 border border-[#B28A3E]/40 flex items-center justify-center shrink-0 text-[#D4AF37]">
          <Cookie className="w-5 h-5" />
        </div>
        <div className="flex-1 space-y-1.5">
          <div className="flex items-center justify-between">
            <h4 className="font-serif font-bold text-sm text-white flex items-center gap-1.5">
              <span>Your Privacy Matters</span>
            </h4>
            <button
              onClick={handleDecline}
              className="text-[#9E9589] hover:text-white transition-colors p-1"
              aria-label="Dismiss cookie notice"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs text-[#D4CFC9] leading-relaxed">
            We use essential cookies to maintain your shopping bag, secure checkout, and deliver a tailored couture experience. Learn more in our{" "}
            <Link href="/policies/privacy" className="text-[#C4A882] underline hover:text-white font-medium">
              Privacy Policy
            </Link>.
          </p>
          <div className="flex items-center gap-2 pt-2">
            <button
              type="button"
              onClick={handleAccept}
              className="flex-1 py-2 px-3.5 rounded-xl bg-white text-[#171717] hover:bg-[#F8F5F0] text-xs font-bold transition-all shadow-sm hover:scale-[1.02] flex items-center justify-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span>Accept All</span>
            </button>
            <button
              type="button"
              onClick={handleDecline}
              className="py-2 px-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-[#D4CFC9] hover:text-white text-xs font-medium transition-all"
            >
              Essential Only
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
