"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { 
  ShoppingBag, 
  Search, 
  Heart, 
  User, 
  Menu, 
  X, 
  Phone, 
  Truck, 
  RotateCcw,
  ShieldCheck
} from "lucide-react";
import { useCart } from "@/context/CartContext";

import { SiteLayoutSettings } from "@/lib/settings";

interface HeaderProps {
  initialSettings?: SiteLayoutSettings;
}

export default function Header({ initialSettings }: HeaderProps) {
  const pathname = usePathname();
  const { cartCount, openCart, wishlist } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) return null;

  const rawPhone = initialSettings?.contactWhatsApp || "03400262732";
  const cleanPhone = rawPhone.replace(/\D/g, "");
  const formattedPhone = cleanPhone.startsWith("0") 
    ? `92${cleanPhone.slice(1)}` 
    : cleanPhone.startsWith("92") 
      ? cleanPhone 
      : `92${cleanPhone}`;

  const themeClasses = {
    midnight: "bg-brand-950 text-sand-300 border-sand-900/50",
    gold: "bg-gold-950 text-gold-200 border-gold-800/40",
    emerald: "bg-emerald-950 text-emerald-200 border-emerald-800/40",
    maroon: "bg-rose-950 text-rose-200 border-rose-800/40",
  }[initialSettings?.announcementTheme || "midnight"] || "bg-brand-950 text-sand-300 border-sand-900/50";

  const categories = [
    { name: "Lawn & Summer", href: "/shop?category=lawn-summer", badge: "Hot" },
    { name: "Chiffon & Formal", href: "/shop?category=chiffon-formal" },
    { name: "Pret / Ready to Wear", href: "/shop?category=pret-ready-to-wear" },
    { name: "Wedding & Luxury", href: "/shop?category=wedding-luxury-pret", highlight: true },
    { name: "Unstitched", href: "/shop?category=unstitched" },
    { name: "Sale", href: "/shop?category=sale", sale: true },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-ink-black/95 backdrop-blur-md transition-all duration-200 border-b border-sand-900/80">
      {/* Top Announcement Ribbon (Admin Controlled) */}
      {(initialSettings?.announcementEnabled !== false) && (
        <div className={`text-xs py-2 px-4 font-sans tracking-wide border-b ${themeClasses}`}>
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-1 text-center md:text-left">
            <div className="flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-gold-400 animate-pulse"></span>
              {initialSettings?.announcementLink ? (
                <Link href={initialSettings.announcementLink} className="hover:underline flex items-center gap-1.5">
                  <span className="font-semibold text-gold-400">
                    {initialSettings?.announcementText || "Festive Luxury Collection 2026"}
                  </span>
                  <span className="hidden sm:inline text-sand-400">
                    | {initialSettings?.announcementSubtext || `Free nationwide courier delivery on orders above Rs. ${(initialSettings?.freeShippingThreshold || 4999).toLocaleString()}`}
                  </span>
                </Link>
              ) : (
                <>
                  <span className="font-semibold text-gold-400">
                    {initialSettings?.announcementText || "Festive Luxury Collection 2026"}
                  </span>
                  <span className="hidden sm:inline text-sand-400">
                    | {initialSettings?.announcementSubtext || `Free nationwide courier delivery on orders above Rs. ${(initialSettings?.freeShippingThreshold || 4999).toLocaleString()}`}
                  </span>
                </>
              )}
            </div>

            <div className="flex items-center gap-5 text-xs text-sand-300">
              <span className="flex items-center gap-1.5 text-sand-300">
                <Truck className="w-3.5 h-3.5 text-gold-400" />
                Cash On Delivery
              </span>
              <span className="hidden sm:flex items-center gap-1.5 text-sand-300">
                <RotateCcw className="w-3.5 h-3.5 text-gold-400" />
                7-Day Returns
              </span>
              <a 
                href={`https://wa.me/${formattedPhone}?text=Salam%20Tauheed%20Textile%2C%20I%20have%20an%20inquiry`}
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center gap-1 text-gold-400 hover:text-gold-300 transition-colors font-medium"
              >
                <Phone className="w-3 h-3" />
                {initialSettings?.contactWhatsApp || "0340 0262732"}
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Mobile Menu Button */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 text-sand-100 hover:text-gold-400 focus:outline-none"
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6" />
            </button>
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 text-sand-100 hover:text-gold-400 ml-1"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>

          {/* Brand Logo - Calligraphic Tauheed */}
          <div className="flex items-center justify-center flex-1 lg:flex-initial">
            <Link href="/" className="flex items-center gap-3 group py-1" title="Tauheed Textile - Haute Couture">
              <div className="relative h-12 w-9 sm:h-14 sm:w-10 transition-transform duration-300 group-hover:scale-105 shrink-0">
                <Image
                  src="/logo-calligraphy.png"
                  alt="Tauheed Calligraphy Logo"
                  fill
                  className="object-contain drop-shadow-[0_2px_8px_rgba(197,160,89,0.35)]"
                  priority
                />
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-xl sm:text-2xl font-bold tracking-[0.18em] text-sand-50 group-hover:text-gold-300 transition-colors leading-none">
                  TAUHEED
                </span>
                <span className="text-[9px] font-sans font-semibold tracking-[0.35em] text-gold-400 mt-1 uppercase leading-none">
                  TEXTILE • LUXURY
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center space-x-7">
            {categories.map((cat) => (
              <Link
                key={cat.name}
                href={cat.href}
                className={`text-xs uppercase tracking-wider font-semibold transition-colors duration-150 relative py-1 ${
                  pathname === cat.href 
                    ? "text-gold-400 font-bold" 
                    : cat.sale 
                      ? "text-rose-400 hover:text-rose-300" 
                      : cat.highlight 
                        ? "text-gold-300 hover:text-gold-400"
                        : "text-sand-300 hover:text-gold-400"
                }`}
              >
                {cat.name}
                {cat.badge && (
                  <span className="absolute -top-2.5 -right-6 px-1.5 py-0.5 text-[8px] font-bold uppercase rounded-full bg-gold-500 text-ink-black leading-none">
                    {cat.badge}
                  </span>
                )}
                {cat.sale && (
                  <span className="absolute -top-2.5 -right-5 px-1 py-0.5 text-[8px] font-bold uppercase rounded bg-rose-600 text-white leading-none animate-pulse">
                    %
                  </span>
                )}
              </Link>
            ))}
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            {/* Desktop Search */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="hidden lg:flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs text-sand-300 bg-sand-900/50 hover:bg-sand-900 border border-sand-800 transition-colors"
              aria-label="Search items"
            >
              <Search className="w-3.5 h-3.5 text-gold-400" />
              <span>Search collections...</span>
            </button>

            {/* Wishlist Link */}
            <Link
              href="/account#wishlist"
              className="relative p-2 text-sand-300 hover:text-gold-400 transition-colors"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-gold-500 text-ink-black text-[10px] font-bold flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Account Link */}
            <Link
              href="/account"
              className="p-2 text-sand-300 hover:text-gold-400 transition-colors"
              aria-label="My Account"
            >
              <User className="w-5 h-5" />
            </Link>

            {/* Cart Drawer Trigger */}
            <button
              onClick={openCart}
              className="relative p-2 text-sand-300 hover:text-gold-400 transition-colors flex items-center gap-1"
              aria-label="Open Shopping Bag"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-gold-500 text-ink-black text-[10px] font-bold flex items-center justify-center shadow">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Expanded Search Bar */}
      {searchOpen && (
        <div className="border-t border-sand-800 bg-brand-950 py-3.5 px-4 shadow-2xl transition-all">
          <div className="max-w-3xl mx-auto flex items-center gap-3">
            <Search className="w-5 h-5 text-gold-400 shrink-0" />
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                if (searchQuery.trim()) {
                  window.location.href = `/shop?search=${encodeURIComponent(searchQuery.trim())}`;
                }
              }}
              className="flex-1 flex gap-2"
            >
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by fabric, collection, color, or article number..."
                className="w-full bg-sand-900/90 border border-sand-800 rounded-xl px-4 py-2 text-xs text-sand-100 focus:outline-none focus:border-gold-500"
                autoFocus
              />
              <button
                type="submit"
                className="px-5 py-2 bg-gold-500 text-ink-black text-xs font-bold rounded-xl hover:bg-gold-600 uppercase tracking-wider font-serif"
              >
                Search
              </button>
            </form>
            <button
              onClick={() => setSearchOpen(false)}
              className="p-2 text-sand-400 hover:text-sand-100"
              aria-label="Close search"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-ink-black border-r border-sand-800 shadow-2xl p-6 flex flex-col justify-between overflow-y-auto z-10">
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-sand-800">
                <div className="flex items-center gap-2.5">
                  <div className="relative h-10 w-8 shrink-0">
                    <Image src="/logo-calligraphy.png" alt="Tauheed Calligraphy" fill className="object-contain drop-shadow-[0_2px_6px_rgba(197,160,89,0.35)]" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-serif font-bold text-lg text-sand-50 tracking-wider">TAUHEED</span>
                    <span className="text-[8px] font-sans font-semibold tracking-[0.25em] text-gold-400 uppercase">TEXTILE • LUXURY</span>
                  </div>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 rounded-full text-sand-400 hover:bg-sand-900"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="mt-6 flex flex-col space-y-4 text-xs uppercase tracking-wider">
                <Link
                  href="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="font-bold text-sand-50 hover:text-gold-400 py-1"
                >
                  Home
                </Link>
                {categories.map((cat) => (
                  <Link
                    key={cat.name}
                    href={cat.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between font-semibold text-sand-300 hover:text-gold-400 py-1"
                  >
                    <span>{cat.name}</span>
                    {cat.badge && (
                      <span className="text-[9px] font-bold uppercase bg-gold-500 text-ink-black px-2 py-0.5 rounded-full">
                        {cat.badge}
                      </span>
                    )}
                    {cat.sale && (
                      <span className="text-[9px] font-bold uppercase bg-rose-600 text-white px-2 py-0.5 rounded">
                        SALE
                      </span>
                    )}
                  </Link>
                ))}
                <div className="pt-4 border-t border-sand-800 flex flex-col space-y-3 normal-case tracking-normal">
                  <Link
                    href="/track-order"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-xs font-medium text-sand-300 hover:text-gold-400 flex items-center gap-2"
                  >
                    <Truck className="w-4 h-4 text-gold-400" />
                    Track Order (TCS / Trax / Leopards)
                  </Link>
                  <Link
                    href="/account"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-xs font-medium text-sand-300 hover:text-gold-400 flex items-center gap-2"
                  >
                    <User className="w-4 h-4 text-gold-400" />
                    My Account & Past Orders
                  </Link>
                  <Link
                    href="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-xs font-semibold text-gold-400 hover:text-gold-300 flex items-center gap-2 pt-1 border-t border-sand-850"
                  >
                    <ShieldCheck className="w-4 h-4 text-gold-400" />
                    Staff / Admin Portal
                  </Link>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-sand-800 text-xs text-sand-400 space-y-1.5">
              <p className="font-semibold text-sand-100">Tauheed Textile Care Desk</p>
              <p>WhatsApp: +92 340 0262732</p>
              <p>Email: care@tauheedtextile.com</p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
