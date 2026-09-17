"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Check, X } from 'lucide-react';

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setIsVisible(false);
  };

  const declineCookies = () => {
    localStorage.setItem('cookie-consent', 'declined');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 pb-20 md:pb-6 pointer-events-none flex justify-center">
      <div className="bg-white border border-[#E7E1D8] shadow-2xl rounded-2xl p-5 md:p-6 max-w-4xl w-full pointer-events-auto flex flex-col md:flex-row items-center justify-between gap-6 relative">
        <button
          onClick={declineCookies}
          className="absolute top-3 right-3 p-1 rounded-full text-[#8E857B] hover:bg-[#F8F5F0] hover:text-[#171717] transition-colors md:hidden"
        >
          <X className="w-5 h-5" />
        </button>
        <div className="flex-1 space-y-2 text-center md:text-left pr-6 md:pr-0">
          <h3 className="font-serif font-bold text-lg text-[#171717]">We Value Your Privacy</h3>
          <p className="text-sm text-[#6B6259] leading-relaxed">
            We use cookies to enhance your browsing experience, serve personalized ads or content, and analyze our traffic. By clicking "Accept All", you consent to our use of cookies. Read our <Link href="/policies/privacy" className="text-[#7A6652] underline hover:text-[#171717] transition-colors">Privacy Policy</Link> for more information.
          </p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto shrink-0">
          <button
            onClick={declineCookies}
            className="flex-1 md:flex-none px-6 py-2.5 rounded-xl border border-[#E7E1D8] text-[#171717] text-sm font-bold hover:bg-[#F8F5F0] transition-colors"
          >
            Decline
          </button>
          <button
            onClick={acceptCookies}
            className="flex-1 md:flex-none px-6 py-2.5 rounded-xl bg-[#171717] text-white text-sm font-bold hover:bg-[#2D2620] transition-colors flex items-center justify-center gap-2"
          >
            <Check className="w-4 h-4" /> Accept All
          </button>
        </div>
      </div>
    </div>
  );
}
