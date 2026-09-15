"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ShoppingBag, Search, User, Menu, X, ChevronDown } from "lucide-react";
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
  const [womenDropdownOpen, setWomenDropdownOpen] = useState(false);

  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) return null;

  const rawPhone = initialSettings?.contactWhatsApp || "03400262732";
  const cleanPhone = rawPhone.replace(/\D/g, "");
  const formattedPhone = cleanPhone.startsWith("0") 
    ? `92${cleanPhone.slice(1)}` 
    : cleanPhone.startsWith("92") 
      ? cleanPhone 
      : `92${cleanPhone}`;

  const navLinks = [
    { name: "NEW IN", href: "/shop?isNewArrival=true" },
    { 
      name: "WOMEN", 
      href: "/shop", 
      isDropdown: true,
      children: [
        { name: "Daily Wear", href: "/shop?category=pret-ready-to-wear" },
        { name: "Formal Lawn", href: "/shop?category=lawn-summer" },
        { name: "Pret", href: "/shop?category=pret-ready-to-wear" },
        { name: "Unstitched", href: "/shop?category=unstitched" }
      ]
    },
    { name: "2 PIECE", href: "/shop?category=unstitched" },
    { name: "3 PIECE", href: "/shop?pieces=3" },
    { name: "READY TO WEAR", href: "/shop?category=pret-ready-to-wear" },
    { name: "SALE", href: "/shop?category=sale", isSale: true },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#171717] text-white border-b border-[#2A2626]">
      {/* Announcement Bar */}
      {(initialSettings?.announcementEnabled !== false) && (
        <div className="bg-[#0F0F0F] text-[#C8C2BB] text-xs py-2 px-4 text-center flex items-center justify-center gap-2">
          <span>{initialSettings?.announcementText || "Festive Luxury Collection 2026"}</span>
          <span>|</span>
          <span>Cash On Delivery</span>
        </div>
      )}

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Mobile: Hamburger (Left) */}
          <div className="flex items-center flex-1 lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 -ml-2 text-[#C8C2BB] hover:text-white focus:outline-none"
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>

          {/* Logo (Centered on mobile, left/auto on desktop) */}
          <div className="flex items-center justify-center flex-1 lg:flex-none">
            <Link href="/" className="flex items-center gap-3 group py-1" title="Tauheed Textile">
              <div className="relative h-10 w-8 sm:h-12 sm:w-9 transition-transform duration-300 group-hover:scale-105 shrink-0">
                <Image
                  src="/logo-calligraphy.png"
                  alt="Tauheed Calligraphy Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-xl sm:text-2xl font-bold tracking-[0.18em] text-white leading-none">
                  TAUHEED
                </span>
                <span className="text-[9px] font-sans font-semibold tracking-[0.35em] text-[#D4CFC9] mt-1 uppercase leading-none">
                  TEXTILE
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center justify-center flex-1 space-x-8">
            {navLinks.map((link) => {
              if (link.isDropdown) {
                return (
                  <div 
                    key={link.name} 
                    className="relative group py-6"
                    onMouseEnter={() => setWomenDropdownOpen(true)}
                    onMouseLeave={() => setWomenDropdownOpen(false)}
                  >
                    <button className="flex items-center gap-1 text-xs uppercase tracking-wider font-semibold text-[#D4CFC9] hover:text-white transition-colors">
                      {link.name}
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                    {womenDropdownOpen && (
                      <div className="absolute top-full left-1/2 -translate-x-1/2 bg-[#171717] border border-[#2A2626] shadow-xl py-2 min-w-[200px]">
                        {link.children?.map(child => (
                          <Link 
                            key={child.name} 
                            href={child.href}
                            className="block px-4 py-2 text-sm text-[#D4CFC9] hover:text-white hover:bg-[#2A2626] transition-colors"
                          >
                            {child.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              const isActive = pathname === link.href || (link.href !== "#" && pathname.startsWith(link.href) && link.href !== "/");
              
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-xs uppercase tracking-wider font-semibold transition-colors duration-150 ${
                    link.isSale 
                      ? "text-[#E87070] hover:text-[#F08080]" 
                      : isActive
                        ? "text-white font-bold"
                        : "text-[#D4CFC9] hover:text-white"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center justify-end flex-1 lg:flex-none space-x-4">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 text-[#C8C2BB] hover:text-white transition-colors"
              aria-label="Search items"
            >
              <Search className="w-5 h-5" />
            </button>
            <Link
              href="/account"
              className="hidden sm:block p-2 text-[#C8C2BB] hover:text-white transition-colors"
              aria-label="My Account"
            >
              <User className="w-5 h-5" />
            </Link>
            <button
              onClick={openCart}
              className="relative p-2 text-[#C8C2BB] hover:text-white transition-colors flex items-center"
              aria-label="Open Shopping Bag"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 rounded-full bg-[#7A6652] text-white text-[10px] font-bold flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Expanded Search Bar */}
      {searchOpen && (
        <div className="border-t border-[#2A2626] bg-[#141414] py-4 px-4 shadow-2xl transition-all">
          <div className="max-w-3xl mx-auto flex items-center gap-3">
            <Search className="w-5 h-5 text-[#C8C2BB] shrink-0" />
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
                className="w-full bg-[#171717] border border-[#2A2626] rounded-md px-4 py-2 text-sm text-white focus:outline-none focus:border-[#7A6652]"
                autoFocus
              />
              <button
                type="submit"
                className="px-6 py-2 bg-[#7A6652] text-white text-sm font-semibold rounded-md hover:bg-[#685542] tracking-wider"
              >
                SEARCH
              </button>
            </form>
            <button
              onClick={() => setSearchOpen(false)}
              className="p-2 text-[#C8C2BB] hover:text-white"
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
            className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 max-w-[280px] w-full bg-[#141414] shadow-2xl flex flex-col z-10">
            <div className="flex items-center justify-between p-5 border-b border-[#2A2626]">
              <span className="font-serif font-bold text-lg text-white tracking-wider">TAUHEED</span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 -mr-2 text-[#C8C2BB] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-6 space-y-8">
              {/* SHOP SECTION */}
              <div>
                <h3 className="text-[#7A6652] uppercase tracking-wider text-xs font-bold mb-4">SHOP</h3>
                <div className="flex flex-col space-y-4">
                  {navLinks.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`text-sm uppercase font-semibold ${
                        link.isSale ? "text-[#E87070] hover:text-[#F08080]" : "text-[#E8E3DC] hover:text-white"
                      }`}
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>
              </div>

              {/* HELP SECTION */}
              <div>
                <h3 className="text-[#7A6652] uppercase tracking-wider text-xs font-bold mb-4">HELP</h3>
                <div className="flex flex-col space-y-4 text-sm">
                  <Link href="/track-order" onClick={() => setMobileMenuOpen(false)} className="text-[#E8E3DC] hover:text-white font-medium">
                    Track Order
                  </Link>
                  <a 
                    href={`https://wa.me/${formattedPhone}`}
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-[#E8E3DC] hover:text-white font-medium"
                  >
                    WhatsApp
                  </a>
                  <Link href="/shipping" onClick={() => setMobileMenuOpen(false)} className="text-[#E8E3DC] hover:text-white font-medium">
                    Shipping
                  </Link>
                  <Link href="/returns" onClick={() => setMobileMenuOpen(false)} className="text-[#E8E3DC] hover:text-white font-medium">
                    Returns
                  </Link>
                </div>
              </div>
            </div>
            
            <div className="p-5 border-t border-[#2A2626] flex items-center justify-between">
              <Link
                href="/account"
                onClick={() => setMobileMenuOpen(false)}
                className="text-[#E8E3DC] hover:text-white text-sm flex items-center gap-2 font-medium"
              >
                <User className="w-4 h-4" />
                Account
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
