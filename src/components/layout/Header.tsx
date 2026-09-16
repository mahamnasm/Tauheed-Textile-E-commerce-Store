"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { 
  ShoppingBag, 
  Search, 
  User, 
  Menu, 
  X, 
  ChevronDown, 
  Truck, 
  RotateCcw, 
  Phone,
  Sparkles
} from "lucide-react";
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
  const [drawerSearch, setDrawerSearch] = useState("");
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileExpandedCat, setMobileExpandedCat] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close mobile drawer on route navigation
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile drawer is open to prevent page scrolling underneath
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  // ── Hide-on-scroll-down / show-on-scroll-up ──────────────────────────
  const [navVisible, setNavVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      if (currentY < 60) {
        setNavVisible(true);
      } else if (currentY > lastScrollY.current) {
        setNavVisible(false);
        setSearchOpen(false);
      } else {
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

  const isAdmin = pathname?.startsWith("/admin");
  if (isAdmin) return null;

  const rawPhone = initialSettings?.contactWhatsApp || "03400262732";
  const cleanPhone = rawPhone.replace(/\D/g, "");
  const formattedPhone = cleanPhone.startsWith("0")
    ? `92${cleanPhone.slice(1)}`
    : cleanPhone.startsWith("92")
      ? cleanPhone
      : `92${cleanPhone}`;

  // ── Marquee items ──────────────────────────────────────────────────
  const marqueeItems = [
    {
      icon: <Truck className="w-3.5 h-3.5 shrink-0 text-white" />,
      text: initialSettings?.announcementText && !initialSettings.announcementText.includes("4,999")
        ? initialSettings.announcementText
        : "Free Delivery Above Rs. 9,999",
    },
    {
      icon: <span className="text-xs shrink-0">🏷️</span>,
      text: "Flat 5% Off: Bank & EasyPaisa",
    },
    {
      icon: <RotateCcw className="w-3.5 h-3.5 shrink-0 text-white" />,
      text: "7-Day Easy Exchange",
    },
    {
      icon: <Phone className="w-3.5 h-3.5 shrink-0 text-white" />,
      text: `WhatsApp Orders: ${initialSettings?.contactWhatsApp || "0340 0262732"}`,
    },
    {
      icon: <span className="text-xs shrink-0">✨</span>,
      text: "New Festive Collection 2026 — Live Now",
    },
  ];

  const allItems = [...marqueeItems, ...marqueeItems];

  // ── All 10 Individual Collections with Subcategories (For Mobile Sidebar & Storefront) ──
  const allStoreCollections = [
    {
      name: "LAWN & SUMMER",
      href: "/shop?category=lawn-summer",
      badge: "Pure Cotton",
      children: [
        { name: "All Lawn & Summer", href: "/shop?category=lawn-summer" },
        { name: "3 Piece Suits", href: "/shop?category=lawn-summer&subcategory=lawn-3-piece" },
        { name: "2 Piece Suits", href: "/shop?category=lawn-summer&subcategory=lawn-2-piece" },
        { name: "Embroidered Lawn", href: "/shop?category=lawn-summer&subcategory=lawn-embroidered" },
        { name: "Printed Daily", href: "/shop?category=lawn-summer&subcategory=lawn-printed" },
      ],
    },
    {
      name: "LAWN FORMALS",
      href: "/shop?category=lawn-formals",
      badge: "Festive",
      children: [
        { name: "All Lawn Formals", href: "/shop?category=lawn-formals" },
        { name: "Heavy Embroidered", href: "/shop?category=lawn-formals&subcategory=lawn-formals-heavy-emb" },
        { name: "Schiffli & Adda", href: "/shop?category=lawn-formals&subcategory=lawn-formals-schiffli" },
        { name: "Jacquard Formals", href: "/shop?category=lawn-formals&subcategory=lawn-formals-jacquard" },
        { name: "Organza Dupatta", href: "/shop?category=lawn-formals&subcategory=lawn-formals-organza" },
      ],
    },
    {
      name: "CHIFFON & FORMAL",
      href: "/shop?category=chiffon-formal",
      badge: "Handwork",
      children: [
        { name: "All Chiffon Formals", href: "/shop?category=chiffon-formal" },
        { name: "Festive 3-Piece", href: "/shop?category=chiffon-formal&subcategory=chiffon-festive-3pc" },
        { name: "Adda & Handwork", href: "/shop?category=chiffon-formal&subcategory=chiffon-adda-handwork" },
        { name: "Chiffon Maxies", href: "/shop?category=chiffon-formal&subcategory=chiffon-maxies" },
        { name: "Party Wear", href: "/shop?category=chiffon-formal&subcategory=chiffon-party-wear" },
      ],
    },
    {
      name: "SILK",
      href: "/shop?category=silk",
      badge: "Pure Silk",
      children: [
        { name: "All Silk Collection", href: "/shop?category=silk" },
        { name: "Raw Silk Suits", href: "/shop?category=silk&subcategory=silk-raw-silk" },
        { name: "Printed Satin Silk", href: "/shop?category=silk&subcategory=silk-printed-satin" },
        { name: "Embroidered Silk 3pc", href: "/shop?category=silk&subcategory=silk-embroidered-3pc" },
        { name: "Tunics & Co-ords", href: "/shop?category=silk&subcategory=silk-tunics-coords" },
      ],
    },
    {
      name: "NET FORMALS",
      href: "/shop?category=net-formals",
      badge: "Couture",
      children: [
        { name: "All Net Formals", href: "/shop?category=net-formals" },
        { name: "Embroidered Net", href: "/shop?category=net-formals&subcategory=net-embroidered-suits" },
        { name: "Net Maxies & Gowns", href: "/shop?category=net-formals&subcategory=net-maxies-gowns" },
        { name: "Zari & Mirror Net", href: "/shop?category=net-formals&subcategory=net-zari-mirror" },
        { name: "Net Dupattas", href: "/shop?category=net-formals&subcategory=net-bridal-dupattas" },
      ],
    },
    {
      name: "ORGANZA FORMALS",
      href: "/shop?category=organza-formals",
      badge: "Embellished",
      children: [
        { name: "All Organza Formals", href: "/shop?category=organza-formals" },
        { name: "Laser Cut Organza", href: "/shop?category=organza-formals&subcategory=organza-laser-cut" },
        { name: "Embroidered Organza", href: "/shop?category=organza-formals&subcategory=organza-embroidered" },
        { name: "Organza Suits 3pc", href: "/shop?category=organza-formals&subcategory=organza-suits-3pc" },
        { name: "Festive Organza Edit", href: "/shop?category=organza-formals&subcategory=organza-festive-edit" },
      ],
    },
    {
      name: "BRIDAL MAXIES",
      href: "/shop?category=bridal-maxies",
      badge: "Bridal",
      children: [
        { name: "All Bridal Maxies", href: "/shop?category=bridal-maxies" },
        { name: "Royal Barat Maxies", href: "/shop?category=bridal-maxies&subcategory=bridal-royal-barat" },
        { name: "Pastel Walima Gowns", href: "/shop?category=bridal-maxies&subcategory=bridal-pastel-walima" },
        { name: "Mehndi & Mayun Edit", href: "/shop?category=bridal-maxies&subcategory=bridal-mehndi-mayun" },
        { name: "Heavy Tilla & Dabka", href: "/shop?category=bridal-maxies&subcategory=bridal-tilla-dabka" },
      ],
    },
    {
      name: "SARIES",
      href: "/shop?category=saries",
      badge: "Drapes",
      children: [
        { name: "All Saries", href: "/shop?category=saries" },
        { name: "Chiffon Saries", href: "/shop?category=saries&subcategory=saries-chiffon" },
        { name: "Silk Saries", href: "/shop?category=saries&subcategory=saries-silk" },
        { name: "Organza Saries", href: "/shop?category=saries&subcategory=saries-organza" },
        { name: "Banarsi Saries", href: "/shop?category=saries&subcategory=saries-banarsi" },
      ],
    },
    {
      name: "WINTER COLLECTION",
      href: "/shop?category=winter-collection",
      badge: "Warm",
      children: [
        { name: "All Winter Collection", href: "/shop?category=winter-collection" },
        { name: "Velvet Ensembles", href: "/shop?category=winter-collection&subcategory=winter-velvet-ensembles" },
        { name: "Marina & Karandi", href: "/shop?category=winter-collection&subcategory=winter-marina-karandi" },
        { name: "Pashmina Shawl Suits", href: "/shop?category=winter-collection&subcategory=winter-pashmina-shawls" },
        { name: "Linen Printed", href: "/shop?category=winter-collection&subcategory=winter-linen-printed" },
      ],
    },
    {
      name: "SALE & CLEARANCE",
      href: "/shop?category=sale",
      isSale: true,
      badge: "Up to 50% Off",
      children: [
        { name: "All Sale Items", href: "/shop?category=sale" },
        { name: "Flat 20% Off", href: "/shop?category=sale&subcategory=sale-flat-20" },
        { name: "Flat 30% Off", href: "/shop?category=sale&subcategory=sale-flat-30" },
        { name: "Flat 50% Off", href: "/shop?category=sale&subcategory=sale-flat-50" },
        { name: "Under Rs. 2,999", href: "/shop?category=sale&subcategory=sale-under-2999" },
      ],
    },
  ];

  // ── Desktop Navigation Bar Structure ──────────────────────────────
  const desktopNavItems = [
    {
      name: "LAWN & SUMMER",
      href: "/shop?category=lawn-summer",
      children: allStoreCollections[0].children,
    },
    {
      name: "LAWN FORMALS",
      href: "/shop?category=lawn-formals",
      children: allStoreCollections[1].children,
    },
    {
      name: "CHIFFON & FORMAL",
      href: "/shop?category=chiffon-formal",
      children: allStoreCollections[2].children,
    },
    {
      name: "SILK",
      href: "/shop?category=silk",
      children: allStoreCollections[3].children,
    },
    {
      name: "LUXURY FORMALS",
      href: "/shop",
      children: [
        { name: "Net Formals", href: "/shop?category=net-formals" },
        { name: "Organza Formals", href: "/shop?category=organza-formals" },
        { name: "Bridal Maxies", href: "/shop?category=bridal-maxies" },
        { name: "Saries Collection", href: "/shop?category=saries" },
      ],
    },
    {
      name: "WINTER",
      href: "/shop?category=winter-collection",
      children: allStoreCollections[8].children,
    },
    {
      name: "SALE",
      href: "/shop?category=sale",
      isSale: true,
      children: allStoreCollections[9].children,
    },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 w-full transition-transform duration-300 ${
          navVisible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        {/* ── SCROLLING MARQUEE ANNOUNCEMENT BAR (FROSTED GLASS) ── */}
        {initialSettings?.announcementEnabled !== false && (
          <div className="bg-black/75 backdrop-blur-md text-[#C8C2BB] text-[11px] py-1.5 overflow-hidden relative border-b border-white/5">
            <div className="flex animate-marquee whitespace-nowrap">
              {allItems.map((item, i) => (
                <div
                  key={i}
                  className="inline-flex items-center gap-1.5 mx-8 shrink-0"
                >
                  {item.icon}
                  <span className="font-medium tracking-wide">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── MAIN NAVIGATION BAR (LUXURY FROSTED GLASS BAR) ── */}
        <div className="bg-black/60 backdrop-blur-xl border-b border-white/10 shadow-lg transition-all">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16 lg:h-20">

              {/* Mobile: Hamburger Button (Left) */}
              <div className="flex items-center shrink-0 lg:hidden w-10">
                <button
                  onClick={() => setMobileMenuOpen(true)}
                  className="p-2 -ml-2 text-[#C8C2BB] hover:text-white focus:outline-none transition-colors shrink-0"
                  aria-label="Open sidebar menu"
                >
                  <Menu className="w-6 h-6" />
                </button>
              </div>

              {/* Logo (Left/Center, responsive, guaranteed single-line without overflowing) */}
              <div className="flex items-center justify-center flex-1 min-w-0 px-1 sm:px-2 lg:flex-none">
                <Link
                  href="/"
                  onDoubleClick={(e) => {
                    e.preventDefault();
                    window.location.href = "/admin";
                  }}
                  className="flex items-center gap-2 sm:gap-3 group py-1 select-none max-w-full"
                  title="Tauheed Textile (Double-click for Staff Portal)"
                >
                  <div className="relative h-9 w-7 min-[380px]:h-10 min-[380px]:w-8 sm:h-13 sm:w-10 lg:h-14 lg:w-11 transition-transform duration-300 group-hover:scale-105 shrink-0 drop-shadow-sm">
                    <Image
                      src="/logo-calligraphy.png"
                      alt="Tauheed Textile Calligraphy Logo"
                      fill
                      className="object-contain"
                      priority
                    />
                  </div>
                  <span className="font-serif text-base min-[380px]:text-lg sm:text-2xl lg:text-3xl font-bold text-white whitespace-nowrap select-none leading-none tracking-normal">
                    𝑻𝒂𝒖𝒉𝒆𝒆𝒅 𝑻𝒆𝒙𝒕𝒊𝒍𝒆
                  </span>
                </Link>
              </div>

              {/* Desktop Nav Links (Clean, Uncluttered, Spaced Luxury Bar) */}
              <nav className="hidden lg:flex items-center justify-center flex-1 space-x-6 xl:space-x-8">
                <button
                  onClick={() => setMobileMenuOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs uppercase tracking-wider font-semibold border border-white/15 transition-all shadow-xs"
                >
                  <Menu className="w-3.5 h-3.5" />
                  <span>All Collections</span>
                </button>

                <Link
                  href="/shop?isNewArrival=true"
                  className="text-xs uppercase tracking-wider font-semibold text-[#D4CFC9] hover:text-white transition-colors"
                >
                  New In '26
                </Link>

                <Link
                  href="/shop?isBestSeller=true"
                  className="text-xs uppercase tracking-wider font-semibold text-[#D4CFC9] hover:text-white transition-colors"
                >
                  Best Sellers
                </Link>

                <Link
                  href="/shop?category=pret-ready-to-wear"
                  className="text-xs uppercase tracking-wider font-semibold text-[#D4CFC9] hover:text-white transition-colors"
                >
                  Ready to Wear
                </Link>

                <Link
                  href="/shop?category=unstitched"
                  className="text-xs uppercase tracking-wider font-semibold text-[#D4CFC9] hover:text-white transition-colors"
                >
                  Unstitched
                </Link>

                <Link
                  href="/shop?category=sale"
                  className="text-xs uppercase tracking-wider font-bold text-[#E87070] hover:text-[#F08080] transition-colors"
                >
                  Sale %
                </Link>
              </nav>

              {/* Right Action Icons (Guaranteed shrink-0 so cart is ALWAYS visible and unhidable) */}
              <div className="flex items-center justify-end shrink-0 space-x-1 sm:space-x-3">
                <button
                  onClick={() => setSearchOpen(!searchOpen)}
                  className="p-2 text-[#C8C2BB] hover:text-white transition-colors shrink-0"
                  aria-label="Search"
                >
                  <Search className="w-5 h-5" />
                </button>
                <Link
                  href="/account"
                  className="hidden sm:block p-2 text-[#C8C2BB] hover:text-white transition-colors shrink-0"
                  aria-label="My Account"
                >
                  <User className="w-5 h-5" />
                </Link>
                <button
                  onClick={openCart}
                  className="relative p-2 text-[#C8C2BB] hover:text-white transition-colors shrink-0 focus:outline-none"
                  aria-label="Open Shopping Bag"
                >
                  <ShoppingBag className="w-5 h-5 text-white" />
                  {mounted && cartCount > 0 && (
                    <span className="absolute top-0.5 right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-[#7A6652] text-white text-[10px] font-bold flex items-center justify-center border-2 border-[#171717] shadow">
                      {cartCount}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Desktop Search Bar Dropdown */}
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
      </header>

      {/* ── FULL-SCREEN MOBILE DRAWER SIDEBAR (Rendered OUTSIDE <header> to avoid transform clipping!) ── */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          {/* Dark Backdrop Overlay */}
          <div
            className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Solid Slide-In Drawer Panel */}
          <aside className="fixed inset-y-0 left-0 w-[310px] sm:w-[350px] max-w-[85vw] h-full bg-[#141414] shadow-2xl flex flex-col z-[101] border-r border-[#2A2626] animate-fadeIn">
            {/* Drawer Top Header */}
            <div className="flex items-center justify-between p-4 sm:p-5 border-b border-[#2A2626] bg-[#0E0E0E] shrink-0">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2.5 select-none"
              >
                <div className="relative h-9 w-7 shrink-0">
                  <Image
                    src="/logo-calligraphy.png"
                    alt="Tauheed Textile Logo"
                    fill
                    className="object-contain"
                  />
                </div>
                <span className="font-serif font-bold text-lg sm:text-xl text-white whitespace-nowrap select-none">
                  𝑻𝒂𝒖𝒉𝒆𝒆𝒅 𝑻𝒆𝒙𝒕𝒊𝒍𝒆
                </span>
              </Link>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 -mr-2 text-[#C8C2BB] hover:text-white rounded-lg hover:bg-[#2A2626] transition-colors"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* In-Drawer Quick Search Form */}
            <div className="p-3 border-b border-[#2A2626] bg-[#171717] shrink-0">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (drawerSearch.trim()) {
                    setMobileMenuOpen(false);
                    window.location.href = `/shop?search=${encodeURIComponent(drawerSearch.trim())}`;
                  }
                }}
                className="flex items-center gap-2 bg-[#0F0F0F] border border-[#2A2626] rounded-lg px-3 py-2"
              >
                <Search className="w-4 h-4 text-[#6B6259] shrink-0" />
                <input
                  type="text"
                  value={drawerSearch}
                  onChange={(e) => setDrawerSearch(e.target.value)}
                  placeholder="Search unstitched suits, lawn, silk..."
                  className="bg-transparent text-xs text-white placeholder-[#6B6259] focus:outline-none w-full"
                />
                {drawerSearch && (
                  <button
                    type="button"
                    onClick={() => setDrawerSearch("")}
                    className="text-[#6B6259] hover:text-white p-0.5"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </form>
            </div>

            {/* Scrollable Drawer Content */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6 overscroll-contain">
              {/* ALL COLLECTIONS WITH ACCORDION SUBCATEGORIES */}
              <div>
                <div className="flex items-center justify-between mb-2 px-1">
                  <span className="text-[#7A6652] uppercase tracking-wider text-[11px] font-bold">
                    ALL COLLECTIONS ({allStoreCollections.length})
                  </span>
                  <span className="text-[10px] text-[#9B8C7E]">tap to expand</span>
                </div>

                <div className="space-y-1.5">
                  {/* NEW ARRIVALS 2026 */}
                  <Link
                    href="/shop?isNewArrival=true"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between p-2.5 rounded-lg bg-gradient-to-r from-gold-900/30 to-brand-900 text-white font-bold text-xs uppercase tracking-wider transition-all border border-gold-600/30 hover:border-gold-500"
                  >
                    <span className="flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-gold-400" />
                      <span>NEW ARRIVALS</span>
                    </span>
                    <span className="text-[10px] bg-gold-600 text-brand-950 font-extrabold px-1.5 py-0.5 rounded">
                      2026
                    </span>
                  </Link>

                  {/* 10 COLLECTIONS */}
                  {allStoreCollections.map((cat) => {
                    const isExpanded = mobileExpandedCat === cat.name;
                    return (
                      <div
                        key={cat.name}
                        className="border border-[#2A2626]/70 rounded-lg overflow-hidden bg-[#1A1A1A]"
                      >
                        <div className="flex items-center justify-between p-2.5">
                          <Link
                            href={cat.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className={`text-xs uppercase font-semibold tracking-wide flex-1 ${
                              cat.isSale ? "text-[#E87070] font-bold" : "text-[#E8E3DC] hover:text-white"
                            }`}
                          >
                            {cat.name}
                          </Link>

                          {cat.badge && (
                            <span className={`text-[9px] px-1.5 py-0.5 rounded mr-1 font-semibold ${
                              cat.isSale 
                                ? "bg-rose-950 text-rose-300 border border-rose-800" 
                                : "bg-black/40 text-gold-400 border border-gold-800/40"
                            }`}>
                              {cat.badge}
                            </span>
                          )}

                          {cat.children && cat.children.length > 0 && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setMobileExpandedCat(isExpanded ? null : cat.name);
                              }}
                              className="p-1 text-[#9B8C7E] hover:text-white rounded hover:bg-white/5 transition-colors"
                              aria-label={`Toggle ${cat.name} subcategories`}
                            >
                              <ChevronDown
                                className={`w-4 h-4 transition-transform duration-200 ${
                                  isExpanded ? "rotate-180 text-gold-400" : ""
                                }`}
                              />
                            </button>
                          )}
                        </div>

                        {/* Expandable Subcategories */}
                        {isExpanded && cat.children && (
                          <div className="border-t border-[#2A2626] bg-[#111111] px-3 py-2 space-y-1">
                            {cat.children.map((sub) => (
                              <Link
                                key={sub.name}
                                href={sub.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className="block text-[11px] uppercase tracking-wide text-[#C8C2BB] hover:text-white py-1.5 transition-colors pl-2.5 border-l-2 border-[#2E2E2E] hover:border-gold-500 hover:pl-3"
                              >
                                {sub.name}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* CUSTOMER CARE & HELPLINE */}
              <div>
                <span className="text-[#7A6652] uppercase tracking-wider text-[11px] font-bold block mb-2 px-1">
                  CUSTOMER CARE & HELPLINE
                </span>
                <div className="flex flex-col space-y-2 bg-[#1A1A1A] p-3 rounded-lg border border-[#2A2626]/70 text-xs">
                  <Link
                    href="/track-order"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-[#E8E3DC] hover:text-white flex items-center justify-between py-1 border-b border-[#2A2626]/50"
                  >
                    <span className="flex items-center gap-2 font-medium">
                      <Truck className="w-3.5 h-3.5 text-gold-400" />
                      Track Order
                    </span>
                  </Link>

                  <a
                    href={`https://wa.me/${formattedPhone}?text=${encodeURIComponent("Salam Tauheed Textile, I need assistance with an unstitched dress order.")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#E8E3DC] hover:text-[#25D366] flex items-center justify-between py-1 border-b border-[#2A2626]/50 transition-colors"
                  >
                    <span className="flex items-center gap-2 font-medium">
                      <Phone className="w-3.5 h-3.5 text-[#25D366]" />
                      WhatsApp Concierge
                    </span>
                    <span className="text-[10px] text-[#25D366] bg-emerald-950/70 border border-emerald-800 px-1.5 py-0.5 rounded font-bold">
                      Online
                    </span>
                  </a>

                  <Link
                    href="/policies/returns"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-[#E8E3DC] hover:text-white flex items-center justify-between py-1 border-b border-[#2A2626]/50"
                  >
                    <span className="flex items-center gap-2 font-medium">
                      <RotateCcw className="w-3.5 h-3.5 text-gold-400" />
                      Exchange Policy
                    </span>
                  </Link>

                  <Link
                    href="/policies/shipping"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-[#E8E3DC] hover:text-white py-1 border-b border-[#2A2626]/50 block font-medium"
                  >
                    Shipping Info
                  </Link>

                  <div className="text-[11px] text-[#9B8C7E] pt-1">
                    <span className="text-white font-medium">Store Hours:</span> Mon - Sat 1:00 PM – 9:00 PM PKT
                  </div>
                </div>
              </div>

              {/* SOCIAL MEDIA CHANNELS */}
              <div>
                <span className="text-[#7A6652] uppercase tracking-wider text-[11px] font-bold block mb-2 px-1">
                  FOLLOW US
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <a
                    href={initialSettings?.socialYouTube || "https://youtube.com/@tauheedtextile"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-2 rounded-lg bg-[#1A1A1A] border border-[#2A2626] text-[#E8E3DC] hover:text-[#C4302B] transition-colors"
                  >
                    <span>▶️</span> YouTube
                  </a>
                  <a
                    href={initialSettings?.socialInstagram || "https://instagram.com/tauheedtextile"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-2 rounded-lg bg-[#1A1A1A] border border-[#2A2626] text-[#E8E3DC] hover:text-[#E1306C] transition-colors"
                  >
                    <span>📸</span> Instagram
                  </a>
                  <a
                    href={initialSettings?.socialFacebook || "https://facebook.com/tauheedtextile"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-2 rounded-lg bg-[#1A1A1A] border border-[#2A2626] text-[#E8E3DC] hover:text-[#1877F2] transition-colors"
                  >
                    <span>📘</span> Facebook
                  </a>
                  <a
                    href={initialSettings?.socialTikTok || "https://tiktok.com/@tauheedtextile"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-2 rounded-lg bg-[#1A1A1A] border border-[#2A2626] text-[#E8E3DC] hover:text-white transition-colors"
                  >
                    <span>🎵</span> TikTok
                  </a>
                </div>
              </div>
            </div>

            {/* Bottom Account Strip */}
            <div className="p-4 border-t border-[#2A2626] bg-[#0E0E0E] flex items-center justify-between shrink-0">
              <Link
                href="/account"
                onClick={() => setMobileMenuOpen(false)}
                className="text-[#E8E3DC] hover:text-white text-xs flex items-center gap-2 font-semibold"
              >
                <User className="w-4 h-4 text-gold-400" />
                <span>My Account / Orders</span>
              </Link>
              <span className="text-xs text-[#6B6259]">𝑻𝒂𝒖𝒉𝒆𝒆𝒅 𝑻𝒆𝒙𝒕𝒊𝒍𝒆</span>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
