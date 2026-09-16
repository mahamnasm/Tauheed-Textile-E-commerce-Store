"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ShoppingBag, Search, User, Menu, X, ChevronDown, Truck, RotateCcw, Phone } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { SiteLayoutSettings } from "@/lib/settings";

interface HeaderProps {
  initialSettings?: SiteLayoutSettings;
}

export default function Header({ initialSettings }: HeaderProps) {
  const pathname = usePathname();
  const { cartCount, openCart } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [womenDropdownOpen, setWomenDropdownOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileExpandedCat, setMobileExpandedCat] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // ── Hide-on-scroll-down / show-on-scroll-up ──────────────────────────
  const [navVisible, setNavVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      if (currentY < 60) {
        // Always show near top
        setNavVisible(true);
      } else if (currentY > lastScrollY.current) {
        // Scrolling DOWN → hide
        setNavVisible(false);
        setSearchOpen(false);
        setWomenDropdownOpen(false);
      } else {
        // Scrolling UP → show
        setNavVisible(true);
      }
      lastScrollY.current = currentY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ── Secret Admin Shortcut (Ctrl+Shift+A or Alt+A) ───────────────────
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "a") ||
        (e.altKey && e.key.toLowerCase() === "a")
      ) {
        e.preventDefault();
        window.location.href = "/admin";
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const isAdmin = pathname.startsWith("/admin");
  if (isAdmin) return null;

  const rawPhone = initialSettings?.contactWhatsApp || "03400262732";
  const cleanPhone = rawPhone.replace(/\D/g, "");
  const formattedPhone = cleanPhone.startsWith("0")
    ? `92${cleanPhone.slice(1)}`
    : cleanPhone.startsWith("92")
      ? cleanPhone
      : `92${cleanPhone}`;

  // ── Marquee items (3 minimum) ─────────────────────────────────────────
  const marqueeItems = [
    {
      icon: <Truck className="w-3.5 h-3.5 shrink-0 text-white" />,
      text: initialSettings?.announcementText && !initialSettings.announcementText.includes("4,999")
        ? initialSettings.announcementText
        : "Free Delivery Above Rs. 9,999",
    },
    {
      icon: <span className="text-xs shrink-0">🏷️</span>,
      text: "Flat 5% Off on Advance Payment Orders",
    },
    {
      icon: <RotateCcw className="w-3.5 h-3.5 shrink-0 text-white" />,
      text: "7-Day Easy Exchange Policy",
    },
    {
      icon: <Phone className="w-3.5 h-3.5 shrink-0 text-white" />,
      text: `WhatsApp Us: ${initialSettings?.contactWhatsApp || "0340 0262732"}`,
    },
    {
      icon: <span className="text-xs shrink-0">✨</span>,
      text: initialSettings?.announcementSubtext && !initialSettings.announcementSubtext.includes("4,999")
        ? initialSettings.announcementSubtext
        : "New Festive Collection 2026 — Live Now",
    },
  ];

  // Duplicate for seamless loop
  const allItems = [...marqueeItems, ...marqueeItems];

  const navCategories = [
    {
      name: "LAWN & SUMMER",
      href: "/shop?category=lawn-summer",
      children: [
        { name: "All Lawn & Summer", href: "/shop?category=lawn-summer" },
        { name: "2 Piece Suits", href: "/shop?category=lawn-summer&subcategory=2-piece" },
        { name: "3 Piece Suits", href: "/shop?category=lawn-summer&subcategory=3-piece" },
        { name: "Printed Lawn", href: "/shop?category=lawn-summer&subcategory=printed" },
        { name: "Embroidered Lawn", href: "/shop?category=lawn-summer&subcategory=embroidered" },
      ],
    },
    {
      name: "LAWN FORMALS",
      href: "/shop?category=lawn-formals",
      children: [
        { name: "All Lawn Formals", href: "/shop?category=lawn-formals" },
        { name: "2 Piece Formals", href: "/shop?category=lawn-formals&subcategory=2-piece" },
        { name: "3 Piece Formals", href: "/shop?category=lawn-formals&subcategory=3-piece" },
        { name: "Heavy Embroidered", href: "/shop?category=lawn-formals&subcategory=heavy-embroidered" },
      ],
    },
    {
      name: "CHIFFON & FORMAL",
      href: "/shop?category=chiffon-formal",
      children: [
        { name: "All Chiffon Formals", href: "/shop?category=chiffon-formal" },
        { name: "Chiffon Suits", href: "/shop?category=chiffon-formal&subcategory=suit" },
        { name: "Chiffon Maxies", href: "/shop?category=chiffon-formal&subcategory=maxi" },
        { name: "Chiffon Saries", href: "/shop?category=chiffon-formal&subcategory=sari" },
      ],
    },
    {
      name: "SILK",
      href: "/shop?category=silk",
      children: [
        { name: "All Silk Collection", href: "/shop?category=silk" },
        { name: "Silk Suits", href: "/shop?category=silk&subcategory=suit" },
        { name: "Silk Saries", href: "/shop?category=silk&subcategory=sari" },
        { name: "Silk Tunics & Co-ords", href: "/shop?category=silk&subcategory=tunic" },
      ],
    },
    {
      name: "LUXURY FORMALS",
      href: "/shop",
      children: [
        { name: "Net Formals", href: "/shop?category=net-formals" },
        { name: "Organza Formals", href: "/shop?category=organza-formals" },
        { name: "Bridal Maxies", href: "/shop?category=bridal-maxies" },
        { name: "Saries", href: "/shop?category=saries" },
      ],
    },
    {
      name: "WINTER",
      href: "/shop?category=winter-collection",
      children: [
        { name: "All Winter Collection", href: "/shop?category=winter-collection" },
        { name: "Velvet Ensembles", href: "/shop?category=winter-collection&subcategory=velvet" },
        { name: "Marina & Karandi", href: "/shop?category=winter-collection&subcategory=marina" },
        { name: "Pashmina Shawl Suits", href: "/shop?category=winter-collection&subcategory=shawl-suits" },
      ],
    },
    {
      name: "SALE",
      href: "/shop?category=sale",
      isSale: true,
      children: [
        { name: "All Sale Items", href: "/shop?category=sale" },
        { name: "Flat 20% Off", href: "/shop?category=sale&subcategory=flat-20" },
        { name: "Flat 30% Off", href: "/shop?category=sale&subcategory=flat-30" },
        { name: "Flat 50% Off", href: "/shop?category=sale&subcategory=flat-50" },
      ],
    },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 w-full transition-transform duration-300 ${
        navVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      {/* ── SCROLLING MARQUEE ANNOUNCEMENT BAR ── */}
      {initialSettings?.announcementEnabled !== false && (
        <div className="bg-[#0F0F0F] text-[#C8C2BB] text-[11px] py-2 overflow-hidden relative">
          <div className="flex animate-marquee whitespace-nowrap">
            {allItems.map((item, i) => (
              <div
                key={i}
                className="inline-flex items-center gap-1.5 mx-8 shrink-0"
              >
                <span className="text-white flex items-center">{item.icon}</span>
                <span>{item.text}</span>
                <span className="ml-8 text-[#3A3530]">•</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── MAIN NAVIGATION BAR ── */}
      <div className="bg-[#171717] border-b border-[#2A2626]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">

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

            {/* Logo (Double-click secretly accesses admin portal) */}
            <div className="flex items-center justify-center flex-1 lg:flex-none">
              <Link
                href="/"
                onDoubleClick={(e) => {
                  e.preventDefault();
                  window.location.href = "/admin";
                }}
                className="flex items-center gap-3.5 group py-1 select-none"
                title="Tauheed Textile (Double-click for Admin)"
              >
                {/* Big Calligraphy Emblem */}
                <div className="relative h-12 w-10 sm:h-14 sm:w-11 lg:h-16 lg:w-13 transition-transform duration-300 group-hover:scale-105 shrink-0 drop-shadow-sm">
                  <Image
                    src="/logo-calligraphy.png"
                    alt="Tauheed Textile Calligraphy Logo"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
                {/* Unified Brand Typography: Same Text Color & Alignment */}
                <div className="flex flex-col justify-center text-left">
                  <span className="font-serif text-2xl sm:text-3xl font-bold tracking-[0.16em] text-white leading-none">
                    TAUHEED
                  </span>
                  <span className="font-serif text-[11px] sm:text-xs tracking-[0.38em] text-white font-semibold mt-1 uppercase leading-none">
                    TEXTILE
                  </span>
                </div>
              </Link>
            </div>

            {/* Desktop Nav Links */}
            <nav className="hidden lg:flex items-center justify-center flex-1 space-x-5 xl:space-x-7">
              <Link
                href="/shop?isNewArrival=true"
                className="text-xs uppercase tracking-wider font-semibold text-[#D4CFC9] hover:text-white transition-colors"
              >
                NEW IN
              </Link>
              {navCategories.map((cat) => {
                const isOpen = activeDropdown === cat.name;
                return (
                  <div
                    key={cat.name}
                    className="relative group py-6"
                    onMouseEnter={() => setActiveDropdown(cat.name)}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    <Link
                      href={cat.href}
                      className={`flex items-center gap-1 text-xs uppercase tracking-wider font-semibold transition-colors ${
                        cat.isSale
                          ? "text-[#E87070] hover:text-[#F08080]"
                          : "text-[#D4CFC9] hover:text-white"
                      }`}
                    >
                      {cat.name}
                      {cat.children && (
                        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
                      )}
                    </Link>
                    {cat.children && isOpen && (
                      <div className="absolute top-full left-1/2 -translate-x-1/2 bg-[#171717] border border-[#2A2626] shadow-2xl py-2 min-w-[210px] rounded-b-lg z-50">
                        {cat.children.map((child) => (
                          <Link
                            key={child.name}
                            href={child.href}
                            className="block px-5 py-2.5 text-xs uppercase tracking-wide text-[#D4CFC9] hover:text-white hover:bg-[#2A2626] transition-colors"
                          >
                            {child.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>

            {/* Right Action Icons */}
            <div className="flex items-center justify-end flex-1 lg:flex-none space-x-3">
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 text-[#C8C2BB] hover:text-white transition-colors"
                aria-label="Search"
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
                className="relative p-2 text-[#C8C2BB] hover:text-white transition-colors"
                aria-label="Open Shopping Bag"
              >
                <ShoppingBag className="w-5 h-5" />
                {mounted && cartCount > 0 && (
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
          <div className="border-t border-[#2A2626] bg-[#141414] py-4 px-4">
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
                  placeholder="Search by fabric, collection, color..."
                  className="w-full bg-[#171717] border border-[#2A2626] rounded-md px-4 py-2 text-sm text-white focus:outline-none focus:border-[#7A6652] placeholder-[#6B6259]"
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
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 max-w-[280px] w-full bg-[#141414] shadow-2xl flex flex-col z-10">
            <div className="flex items-center justify-between p-5 border-b border-[#2A2626]">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 select-none"
              >
                <div className="relative h-10 w-8 shrink-0">
                  <Image
                    src="/logo-calligraphy.png"
                    alt="Tauheed Textile Logo"
                    fill
                    className="object-contain"
                  />
                </div>
                <div className="flex flex-col justify-center text-left">
                  <span className="font-serif font-bold text-lg text-white tracking-[0.16em] leading-none">
                    TAUHEED
                  </span>
                  <span className="font-serif text-[9px] text-white font-medium tracking-[0.35em] uppercase leading-none mt-1">
                    TEXTILE
                  </span>
                </div>
              </Link>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 -mr-2 text-[#C8C2BB] hover:text-white"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-6 space-y-6">
              {/* ALL COLLECTIONS & CATEGORIES */}
              <div>
                <h3 className="text-[#7A6652] uppercase tracking-wider text-xs font-bold mb-3 flex items-center justify-between">
                  <span>COLLECTIONS</span>
                  <span className="text-[10px] text-[#9B8C7E] lowercase">tap to expand</span>
                </h3>
                <div className="flex flex-col space-y-2">
                  <Link
                    href="/shop?isNewArrival=true"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-xs uppercase font-semibold text-white py-1.5 border-b border-[#2A2626]/50 flex items-center justify-between"
                  >
                    <span>✨ NEW ARRIVALS</span>
                    <span className="text-[10px] bg-gold-600/30 text-gold-300 px-1.5 py-0.5 rounded">2026</span>
                  </Link>

                  {navCategories.map((cat) => {
                    const isExpanded = mobileExpandedCat === cat.name;
                    return (
                      <div key={cat.name} className="border-b border-[#2A2626]/40 pb-1">
                        <div className="flex items-center justify-between py-1.5">
                          <Link
                            href={cat.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className={`text-xs uppercase font-semibold tracking-wide flex-1 ${
                              cat.isSale ? "text-[#E87070] font-bold" : "text-[#E8E3DC] hover:text-white"
                            }`}
                          >
                            {cat.name}
                          </Link>
                          {cat.children && cat.children.length > 0 && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setMobileExpandedCat(isExpanded ? null : cat.name);
                              }}
                              className="p-1 text-[#9B8C7E] hover:text-white"
                            >
                              <ChevronDown
                                className={`w-4 h-4 transition-transform duration-200 ${
                                  isExpanded ? "rotate-180 text-white" : ""
                                }`}
                              />
                            </button>
                          )}
                        </div>

                        {/* Subcategories */}
                        {isExpanded && cat.children && (
                          <div className="pl-3 py-1 space-y-1.5 bg-[#1a1a1a] rounded-lg my-1">
                            {cat.children.map((sub) => (
                              <Link
                                key={sub.name}
                                href={sub.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className="block text-[11px] uppercase tracking-wide text-[#C8C2BB] hover:text-white py-1 transition-colors"
                              >
                                • {sub.name}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* HELP & POLICIES SECTION */}
              <div>
                <h3 className="text-[#7A6652] uppercase tracking-wider text-xs font-bold mb-3">CUSTOMER CARE</h3>
                <div className="flex flex-col space-y-2.5 text-xs">
                  <Link
                    href="/track-order"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-[#E8E3DC] hover:text-white flex items-center justify-between"
                  >
                    <span>Track Order (TCS • Leopards • Trax)</span>
                    <Truck className="w-3.5 h-3.5 text-[#9B8C7E]" />
                  </Link>
                  <a
                    href={`https://wa.me/${formattedPhone}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#E8E3DC] hover:text-white flex items-center justify-between"
                  >
                    <span>WhatsApp Concierge</span>
                    <Phone className="w-3.5 h-3.5 text-[#25D366]" />
                  </a>
                  <Link
                    href="/policies/shipping"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-[#E8E3DC] hover:text-white"
                  >
                    Shipping Info (Karachi 1-2d • Major 4-5d)
                  </Link>
                  <Link
                    href="/policies/returns"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-[#E8E3DC] hover:text-white"
                  >
                    7-Day Exchange Policy (No Returns)
                  </Link>
                </div>
              </div>
            </div>

            <div className="p-5 border-t border-[#2A2626]">
              <Link
                href="/account"
                onClick={() => setMobileMenuOpen(false)}
                className="text-[#E8E3DC] hover:text-white text-sm flex items-center gap-2 font-medium"
              >
                <User className="w-4 h-4" />
                My Account
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
