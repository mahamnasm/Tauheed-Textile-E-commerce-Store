"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { 
  Phone, 
  Mail, 
  MapPin, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  CreditCard, 
  Send 
} from "lucide-react";

export default function Footer() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;

  return (
    <footer className="bg-brand-950 text-sand-300 pt-16 pb-8 border-t border-sand-900">
      {/* Pakistan Trust Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 border-b border-sand-900">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center sm:text-left">
          <div className="flex items-center gap-4 justify-center sm:justify-start">
            <div className="w-12 h-12 rounded-2xl bg-sand-900/60 border border-gold-500/30 flex items-center justify-center shrink-0">
              <Truck className="w-6 h-6 text-gold-400" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-sand-50 text-base">Nationwide Delivery</h4>
              <p className="text-xs text-sand-400">TCS, Trax & Leopards to 250+ cities in Pakistan</p>
            </div>
          </div>

          <div className="flex items-center gap-4 justify-center sm:justify-start">
            <div className="w-12 h-12 rounded-2xl bg-sand-900/60 border border-gold-500/30 flex items-center justify-center shrink-0">
              <CreditCard className="w-6 h-6 text-gold-400" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-sand-50 text-base">Cash On Delivery</h4>
              <p className="text-xs text-sand-400">Pay cash upon parcel receipt or direct Bank Transfer</p>
            </div>
          </div>

          <div className="flex items-center gap-4 justify-center sm:justify-start">
            <div className="w-12 h-12 rounded-2xl bg-sand-900/60 border border-gold-500/30 flex items-center justify-center shrink-0">
              <RotateCcw className="w-6 h-6 text-gold-400" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-sand-50 text-base">7-Day Return Policy</h4>
              <p className="text-xs text-sand-400">Customer-first replacement or exchange policy</p>
            </div>
          </div>

          <div className="flex items-center gap-4 justify-center sm:justify-start">
            <div className="w-12 h-12 rounded-2xl bg-sand-900/60 border border-gold-500/30 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6 text-gold-400" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-sand-50 text-base">100% Authentic Fabric</h4>
              <p className="text-xs text-sand-400">Pure Swiss lawn, genuine chiffon and master tailoring</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3.5">
              <div className="relative h-14 w-10 shrink-0">
                <Image src="/logo-calligraphy.png" alt="Tauheed Calligraphy Logo" fill className="object-contain drop-shadow-[0_2px_8px_rgba(197,160,89,0.35)]" />
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-2xl font-bold tracking-[0.16em] text-sand-50 leading-none">
                  TAUHEED
                </span>
                <span className="text-[9px] font-sans font-semibold tracking-[0.32em] text-gold-400 mt-1 uppercase leading-none">
                  TEXTILE • LUXURY
                </span>
              </div>
            </div>
            <p className="text-xs text-sand-400 leading-relaxed pr-6">
              Tauheed Textile celebrates the enduring heritage of Pakistani luxury fashion. Crafting breath-taking lawn, royal formal chiffons, bespoke bridal wear, and effortless pret with unrivaled attention to fabric purity and needlework artistry.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif text-sand-100 font-bold mb-4 tracking-wider text-xs uppercase text-gold-400">Collections</h4>
            <ul className="space-y-2.5 text-xs text-sand-400">
              <li><Link href="/shop?category=lawn-summer" className="hover:text-gold-400 transition-colors">Luxury Lawn & Summer</Link></li>
              <li><Link href="/shop?category=chiffon-formal" className="hover:text-gold-400 transition-colors">Pure Chiffon & Formals</Link></li>
              <li><Link href="/shop?category=pret-ready-to-wear" className="hover:text-gold-400 transition-colors">Ready to Wear Pret</Link></li>
              <li><Link href="/shop?category=wedding-luxury-pret" className="hover:text-gold-400 transition-colors">Wedding & Bridal Kalidars</Link></li>
              <li><Link href="/shop?category=unstitched" className="hover:text-gold-400 transition-colors">Unstitched 3-Piece Fabrics</Link></li>
              <li><Link href="/shop?category=sale" className="hover:text-rose-400 transition-colors text-rose-400 font-semibold">Festive Archive Sale</Link></li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="font-serif text-sand-100 font-bold mb-4 tracking-wider text-xs uppercase text-gold-400">Customer Care</h4>
            <ul className="space-y-2.5 text-xs text-sand-400">
              <li><Link href="/track-order" className="hover:text-gold-400 transition-colors">Track Your Parcel</Link></li>
              <li><Link href="/policies/shipping" className="hover:text-gold-400 transition-colors">Shipping & Delivery Rates</Link></li>
              <li><Link href="/policies/returns" className="hover:text-gold-400 transition-colors">7-Day Returns & Exchanges</Link></li>
              <li><Link href="/policies/size-guide" className="hover:text-gold-400 transition-colors">Women's Size Chart Guide</Link></li>
              <li><Link href="/policies/fabric-care" className="hover:text-gold-400 transition-colors">Fabric & Zari Care Instructions</Link></li>
              <li><Link href="/account" className="hover:text-gold-400 transition-colors">My Order History & Portal</Link></li>
              <li className="pt-1">
                <Link 
                  href="/admin" 
                  className="text-gold-400 hover:text-gold-300 transition-colors flex items-center gap-1.5 font-medium"
                >
                  <span>🔒 Staff / Admin Portal</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Pakistan Hotline */}
          <div className="space-y-3">
            <h4 className="font-serif text-sand-100 font-bold mb-4 tracking-wider text-xs uppercase text-gold-400">Direct Concierge</h4>
            <div className="flex items-start gap-2.5 text-xs text-sand-400">
              <MapPin className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
              <span>Tauheed Textile Flagship Studio, M.M. Alam Road, Gulberg III, Lahore, Pakistan</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-sand-400">
              <Phone className="w-4 h-4 text-gold-400 shrink-0" />
              <a 
                href="https://wa.me/923400262732" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-gold-400 transition-colors"
              >
                WhatsApp / Call: 0340 0262732
              </a>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-sand-400">
              <Mail className="w-4 h-4 text-gold-400 shrink-0" />
              <span>care@tauheedtextile.com</span>
            </div>

            {/* Newsletter Subscription */}
            <div className="pt-3">
              <p className="text-xs text-sand-300 font-medium mb-1.5">Join the Exclusive Circle</p>
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  alert("Thank you for subscribing to Tauheed Textile announcements!");
                }}
                className="flex gap-1.5"
              >
                <input
                  type="email"
                  placeholder="Your email address"
                  required
                  className="bg-sand-900/90 text-xs px-3 py-2 rounded-xl border border-sand-800 text-sand-100 focus:outline-none focus:border-gold-500 flex-1"
                />
                <button
                  type="submit"
                  className="bg-gold-500 hover:bg-gold-600 text-ink-black px-3 py-2 rounded-xl text-xs font-bold transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Copyright & Payment Badges */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-sand-900 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-sand-500">
        <div className="flex flex-wrap items-center gap-3">
          <span>&copy; {new Date().getFullYear()} Tauheed Textile (Pvt) Ltd. All rights reserved.</span>
          <span className="hidden sm:inline text-sand-700">•</span>
          <Link href="/admin" className="text-gold-400 hover:text-gold-300 font-mono text-[11px] flex items-center gap-1 transition-colors">
            <span>🔒 Admin Login</span>
          </Link>
        </div>
        <div className="flex items-center gap-2.5 text-xs">
          <span className="px-2.5 py-1 bg-sand-900/80 rounded-lg text-sand-300 border border-sand-800">Cash on Delivery</span>
          <span className="px-2.5 py-1 bg-sand-900/80 rounded-lg text-sand-300 border border-sand-800">Meezan / HBL / Faysal</span>
          <span className="px-2.5 py-1 bg-sand-900/80 rounded-lg text-sand-300 border border-sand-800">EasyPaisa / JazzCash</span>
        </div>
      </div>
    </footer>
  );
}
