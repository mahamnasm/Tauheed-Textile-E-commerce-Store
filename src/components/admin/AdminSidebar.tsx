"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Boxes, 
  Receipt, 
  CreditCard, 
  Users, 
  Megaphone, 
  RotateCcw, 
  Truck, 
  LayoutTemplate,
  ExternalLink,
  Menu,
  X,
  ChevronRight,
  LogOut,
  Globe,
  Video,
  Sparkles,
  Bot,
  Camera,
  ShieldCheck
} from "lucide-react";
import toast from "react-hot-toast";

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      toast.success("Signed out of executive session.", { icon: "🔒" });
      router.push("/admin/login");
      router.refresh();
    } catch {
      window.location.href = "/admin/login";
    } finally {
      setLoggingOut(false);
    }
  };

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileDrawerOpen(false);
  }, [pathname]);

  // Prevent background scroll when drawer is open
  useEffect(() => {
    if (mobileDrawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileDrawerOpen]);

  const navItems = [
    { label: "🏠 Main Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "🛡️ Security & Lockdown", href: "/admin/security", icon: ShieldCheck },
    { label: "🎥 Runway Reels & Videos", href: "/admin/reels", icon: Video },
    { label: "📸 Make Cover Photos", href: "/admin/nano-banana", icon: Camera },
    { label: "🔍 Google SEO & Rank", href: "/admin/seo", icon: Globe },
    { label: "⚙️ AI Settings & Prompts", href: "/admin/ai", icon: Sparkles },
    { label: "👗 Dresses & Catalog", href: "/admin/products", icon: ShoppingBag },
    { label: "📦 Customer Orders", href: "/admin/orders", icon: Receipt },
    { label: "📊 Warehouse & Stock", href: "/admin/inventory", icon: Boxes },
    { label: "🎨 Banners & Home Look", href: "/admin/layout", icon: LayoutTemplate },
    { label: "💰 Bank Slips & Profits", href: "/admin/payments", icon: CreditCard },
    { label: "🔄 Returns & Refunds", href: "/admin/returns", icon: RotateCcw },
    { label: "👥 Customer Phone List", href: "/admin/customers", icon: Users },
    { label: "🚚 Delivery & Couriers", href: "/admin/shipping", icon: Truck },
    { label: "🏷️ Coupons & Discounts", href: "/admin/marketing", icon: Megaphone },
  ];

  const bottomNavItems = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Products", href: "/admin/products", icon: ShoppingBag },
    { label: "Orders", href: "/admin/orders", icon: Receipt },
    { label: "Inventory", href: "/admin/inventory", icon: Boxes },
  ];

  return (
    <>
      {/* 1. MOBILE TOP HEADER (Screens < lg) */}
      <header className="lg:hidden sticky top-0 z-40 w-full bg-brand-950/95 backdrop-blur-md border-b border-sand-800 px-4 py-3 flex items-center justify-between shrink-0 shadow-md">
        <Link 
          href="/" 
          className="flex items-center gap-2.5 group cursor-pointer hover:opacity-95 transition-all"
          title="Return to Original Website"
        >
          <div className="relative h-9 w-7 shrink-0 transition-transform group-hover:scale-105">
            <Image
              src="/logo-calligraphy.png"
              alt="Tauheed Logo"
              fill
              className="object-contain drop-shadow-[0_2px_4px_rgba(197,160,89,0.35)]"
            />
          </div>
          <div>
            <h2 className="font-serif font-bold text-xs text-sand-50 tracking-wider flex items-center gap-1.5 group-hover:text-gold-300 transition-colors">
              TAUHEED
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            </h2>
            <span className="text-[9px] text-gold-400 uppercase tracking-widest font-semibold block">
              Admin Portal
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href="/"
            target="_blank"
            className="p-2 rounded-lg bg-sand-900 border border-sand-800 text-sand-200 hover:text-gold-400 transition-colors"
            title="View Live Storefront"
          >
            <ExternalLink className="w-4 h-4 text-gold-400" />
          </Link>

          <button
            onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
            className="p-2 rounded-lg bg-gold-600/10 border border-gold-500/40 text-gold-400 hover:bg-gold-500 hover:text-brand-950 transition-all"
            aria-label="Toggle Navigation Menu"
          >
            {mobileDrawerOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* 2. MOBILE SLIDEOUT DRAWER (Screens < lg) */}
      {mobileDrawerOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileDrawerOpen(false)}
          />

          {/* Drawer Panel */}
          <div className="relative w-72 max-w-[85vw] bg-brand-950 text-sand-200 h-full flex flex-col justify-between border-r border-sand-800 z-10 shadow-2xl p-4 overflow-y-auto">
            <div>
              {/* Drawer Header */}
              <div className="p-3 border-b border-sand-800/80 flex items-center justify-between mb-3">
                <Link 
                  href="/"
                  className="flex items-center gap-3 group cursor-pointer hover:opacity-95 transition-all"
                  title="Return to Original Website"
                  onClick={() => setMobileDrawerOpen(false)}
                >
                  <div className="relative h-10 w-8 shrink-0 transition-transform group-hover:scale-105">
                    <Image
                      src="/logo-calligraphy.png"
                      alt="Tauheed Logo"
                      fill
                      className="object-contain drop-shadow-[0_2px_4px_rgba(197,160,89,0.35)]"
                    />
                  </div>
                  <div>
                    <h2 className="font-serif font-bold text-sm text-sand-50 tracking-wider group-hover:text-gold-300 transition-colors">TAUHEED</h2>
                    <span className="text-[9px] text-gold-400 font-sans uppercase tracking-widest font-semibold block">
                      Admin Portal
                    </span>
                  </div>
                </Link>
                <button
                  onClick={() => setMobileDrawerOpen(false)}
                  className="p-1.5 rounded-lg bg-sand-900 text-sand-400 hover:text-sand-100"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Staff Status */}
              <div className="px-3 py-2.5 rounded-xl bg-brand-900/80 border border-sand-800/70 flex items-center justify-between text-xs mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <div>
                    <span className="font-semibold text-sand-100 block text-xs">Usama Naseem</span>
                    <span className="text-[9px] text-gold-400 font-mono block">usamanaseem101</span>
                  </div>
                </div>
                <span className="text-[9px] bg-sand-800 text-gold-300 px-1.5 py-0.5 rounded font-mono font-bold">
                  SUPER ADMIN
                </span>
              </div>

              {/* Navigation Links */}
              <nav className="space-y-1 text-xs">
                {navItems.map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileDrawerOpen(false)}
                      className={`flex items-center justify-between px-3 py-3 rounded-xl font-medium transition-all ${
                        isActive
                          ? "bg-gold-500 text-brand-950 font-bold shadow-md"
                          : "text-sand-300 hover:bg-sand-900/80 hover:text-sand-50 active:bg-sand-800"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`w-4 h-4 ${isActive ? "text-brand-950" : "text-gold-400"}`} />
                        <span>{item.label}</span>
                      </div>
                      <ChevronRight className={`w-3.5 h-3.5 ${isActive ? "text-brand-950" : "text-sand-600"}`} />
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Drawer Footer */}
            <div className="pt-4 border-t border-sand-800/80 space-y-2 text-xs mt-4">
              <Link
                href="/"
                target="_blank"
                className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-sand-900 hover:bg-sand-850 text-sand-200 transition-colors"
              >
                <span>View Live Storefront</span>
                <ExternalLink className="w-3.5 h-3.5 text-gold-400" />
              </Link>

              <button
                onClick={handleLogout}
                disabled={loggingOut}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800/40 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <LogOut className="w-4 h-4 text-rose-400" />
                  <span>Sign Out</span>
                </span>
                <span className="text-[10px] text-rose-400 font-mono">END SESSION</span>
              </button>

              <div className="text-[10px] text-sand-500 text-center pt-1">
                Tauheed Textile v2.0 • Lahore, PK
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. DESKTOP PERMANENT SIDEBAR (Screens >= lg) */}
      <aside className="hidden lg:flex w-64 bg-brand-950 text-sand-200 min-h-screen flex-col justify-between border-r border-sand-800 shrink-0 sticky top-0 h-screen overflow-y-auto">
        <div>
          {/* Brand Header */}
          <Link
            href="/"
            className="p-6 border-b border-sand-800/80 flex items-center gap-3 group cursor-pointer hover:bg-sand-900/40 transition-all"
            title="Return to Original Website"
          >
            <div className="relative h-11 w-8 shrink-0 transition-transform group-hover:scale-105">
              <Image
                src="/logo-calligraphy.png"
                alt="Tauheed Logo"
                fill
                className="object-contain drop-shadow-[0_2px_6px_rgba(197,160,89,0.35)]"
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="font-serif font-bold text-sm text-sand-50 tracking-wider group-hover:text-gold-300 transition-colors">
                  TAUHEED
                </h2>
                <ExternalLink className="w-3 h-3 text-gold-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <span className="text-[9px] text-gold-400 font-sans uppercase tracking-widest font-semibold block">
                Admin Portal
              </span>
            </div>
          </Link>

          {/* Staff Identity */}
          <div className="px-6 py-3 bg-brand-900/60 border-b border-sand-800/60 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <div>
                <span className="font-semibold text-sand-100 block text-xs">Usama Naseem</span>
                <span className="text-[9px] text-gold-400 block font-mono">usamanaseem101</span>
              </div>
            </div>
            <span className="text-[9px] bg-sand-800 text-gold-300 px-1.5 py-0.5 rounded font-mono font-bold">
              SUPER ADMIN
            </span>
          </div>

          {/* Nav Links */}
          <nav className="p-4 space-y-1 text-xs">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all ${
                    isActive
                      ? "bg-gold-500 text-brand-950 font-bold shadow-md"
                      : "text-sand-300 hover:bg-sand-900/80 hover:text-sand-50"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-brand-950" : "text-gold-400"}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer / Storefront Link & Sign Out */}
        <div className="p-4 border-t border-sand-800/80 space-y-2 text-xs">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3 py-2 rounded-lg bg-sand-900 hover:bg-sand-850 text-sand-200 transition-colors"
          >
            <span>View Live Storefront</span>
            <ExternalLink className="w-3.5 h-3.5 text-gold-400" />
          </Link>

          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800/40 transition-colors cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <LogOut className="w-3.5 h-3.5 text-rose-400" />
              <span>Sign Out</span>
            </span>
            <span className="text-[9px] text-rose-400 font-mono">END SESSION</span>
          </button>

          <div className="text-[10px] text-sand-500 text-center pt-2">
            Tauheed Textile v2.0 • Lahore, PK
          </div>
        </div>
      </aside>

      {/* 4. MOBILE BOTTOM QUICK NAVIGATION BAR (Screens < lg) */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-brand-950/95 backdrop-blur-md border-t border-sand-800 px-2 py-1.5 flex items-center justify-around shadow-[0_-4px_20px_rgba(0,0,0,0.5)]">
        {bottomNavItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-lg text-[10px] font-medium transition-all ${
                isActive ? "text-gold-400 font-bold" : "text-sand-400 hover:text-sand-200"
              }`}
            >
              <Icon className={`w-4 h-4 mb-0.5 ${isActive ? "text-gold-400" : "text-sand-400"}`} />
              <span>{item.label}</span>
            </Link>
          );
        })}
        <button
          onClick={() => setMobileDrawerOpen(true)}
          className="flex flex-col items-center justify-center py-1 px-3 rounded-lg text-[10px] font-medium text-sand-400 hover:text-gold-400 transition-all"
        >
          <Menu className="w-4 h-4 mb-0.5 text-gold-400" />
          <span>More</span>
        </button>
      </nav>
    </>
  );
}
