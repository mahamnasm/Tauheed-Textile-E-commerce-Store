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
  Camera,
  ShieldCheck,
  Activity,
  MessageSquare,
  FolderTree,
  Bell,
  Check
} from "lucide-react";
import toast from "react-hot-toast";

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  // Real-time Notifications state
  const [notifications, setNotifications] = useState<{
    pendingOrdersCount: number;
    pendingReviewsCount: number;
    totalNotifications: number;
    recentOrders: any[];
    recentReviews: any[];
  }>({
    pendingOrdersCount: 0,
    pendingReviewsCount: 0,
    totalNotifications: 0,
    recentOrders: [],
    recentReviews: [],
  });
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);

  useEffect(() => {
    const fetchNotifs = async () => {
      try {
        const res = await fetch("/api/admin/notifications");
        if (res.ok) {
          const data = await res.json();
          if (data.success) {
            setNotifications(data);
          }
        }
      } catch {}
    };
    fetchNotifs();
    const interval = setInterval(fetchNotifs, 15000);
    return () => clearInterval(interval);
  }, []);

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
    setShowNotifDropdown(false);
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
    { 
      label: "📦 Customer Orders", 
      href: "/admin/orders", 
      icon: Receipt,
      badge: notifications.pendingOrdersCount > 0 ? `${notifications.pendingOrdersCount} NEW` : null 
    },
    { 
      label: "💬 Customer Reviews", 
      href: "/admin/reviews", 
      icon: MessageSquare,
      badge: notifications.pendingReviewsCount > 0 ? `${notifications.pendingReviewsCount} NEW` : null 
    },
    { label: "🗂️ Categories & Subs", href: "/admin/categories", icon: FolderTree },
    { label: "👗 Dresses & Catalog", href: "/admin/products", icon: ShoppingBag },
    { label: "🎥 Runway Reels & Videos", href: "/admin/reels", icon: Video },
    { label: "🎨 Website Customizer", href: "/admin/layout", icon: LayoutTemplate },
    { label: "📸 Make Cover Photos", href: "/admin/nano-banana", icon: Camera },
    { label: "🔍 Google SEO & Rank", href: "/admin/seo", icon: Globe },
    { label: "⚙️ AI Settings & Prompts", href: "/admin/ai", icon: Sparkles },
    { label: "📊 Warehouse & Stock", href: "/admin/inventory", icon: Boxes },
    { label: "💰 Bank Slips & Profits", href: "/admin/payments", icon: CreditCard },
    { label: "🔄 Returns & Exchanges", href: "/admin/returns", icon: RotateCcw },
    { label: "👥 Customer Phone List", href: "/admin/customers", icon: Users },
    { label: "🚚 Delivery & Couriers", href: "/admin/shipping", icon: Truck },
    { label: "🏷️ Coupons & Discounts", href: "/admin/marketing", icon: Megaphone },
    { label: "🛡️ Security & Lockdown", href: "/admin/security", icon: ShieldCheck },
    { label: "⚡ Health & Optimizer", href: "/admin/health", icon: Activity },
  ];

  const bottomNavItems = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Orders", href: "/admin/orders", icon: Receipt },
    { label: "Reviews", href: "/admin/reviews", icon: MessageSquare },
    { label: "Catalog", href: "/admin/products", icon: ShoppingBag },
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
            <h2 className="font-serif font-bold text-xs text-sand-50 tracking-wider flex items-center gap-1.5 group-hover:text-gold-300 transition-colors select-none">
              Tᗩᑌᕼᗴᗴᗪ
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            </h2>
            <span className="text-[9px] text-gold-400 uppercase tracking-widest font-semibold block">
              Admin Portal
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          {/* Notification Bell Mobile */}
          <button
            onClick={() => setShowNotifDropdown(!showNotifDropdown)}
            className="p-2 rounded-lg bg-sand-900 border border-sand-800 text-sand-200 relative hover:text-gold-400 transition-colors"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {notifications.totalNotifications > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-600 text-white rounded-full text-[9px] font-bold flex items-center justify-center animate-pulse">
                {notifications.totalNotifications}
              </span>
            )}
          </button>

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

      {/* Notification Dropdown Panel */}
      {showNotifDropdown && (
        <div className="fixed top-14 right-4 sm:right-16 z-50 w-80 sm:w-96 bg-brand-950 border border-sand-700 rounded-2xl shadow-2xl p-4 text-xs text-sand-200 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-sand-800 pb-2.5 mb-3">
            <span className="font-serif font-bold text-sm text-sand-50 flex items-center gap-1.5">
              <Bell className="w-4 h-4 text-gold-400" /> Live Store Alerts
            </span>
            <button
              onClick={() => setShowNotifDropdown(false)}
              className="text-sand-400 hover:text-sand-100 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3 max-h-80 overflow-y-auto">
            {/* Orders alert */}
            {notifications.pendingOrdersCount > 0 ? (
              <div className="p-3 rounded-xl bg-sand-900 border border-sand-800 space-y-1.5">
                <div className="flex items-center justify-between text-gold-400 font-bold">
                  <span>📦 {notifications.pendingOrdersCount} New Pending Orders</span>
                  <Link
                    href="/admin/orders"
                    className="text-[10px] text-emerald-400 underline"
                  >
                    View All
                  </Link>
                </div>
                {notifications.recentOrders.map((ord: any) => (
                  <div key={ord.id} className="text-[11px] text-sand-300 flex justify-between">
                    <span>{ord.orderNumber} ({ord.customerName})</span>
                    <span className="font-bold text-sand-100">Rs. {ord.total?.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-[11px] text-sand-400 py-1 flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-400" /> All orders processed
              </div>
            )}

            {/* Reviews alert */}
            {notifications.pendingReviewsCount > 0 ? (
              <div className="p-3 rounded-xl bg-sand-900 border border-sand-800 space-y-1.5">
                <div className="flex items-center justify-between text-amber-400 font-bold">
                  <span>💬 {notifications.pendingReviewsCount} Reviews Awaiting Moderation</span>
                  <Link
                    href="/admin/reviews"
                    className="text-[10px] text-emerald-400 underline"
                  >
                    Moderate
                  </Link>
                </div>
                {notifications.recentReviews.map((rev: any) => (
                  <div key={rev.id} className="text-[11px] text-sand-300">
                    <span className="font-semibold text-sand-100">{rev.customerName}:</span> "{rev.title}" ({rev.rating}★)
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-[11px] text-sand-400 py-1 flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-400" /> No pending customer reviews
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2. MOBILE SLIDEOUT DRAWER (Screens < lg) */}
      {mobileDrawerOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileDrawerOpen(false)}
          />

          {/* Drawer Menu */}
          <div className="relative w-72 max-w-[80vw] bg-brand-950 text-sand-200 h-full flex flex-col justify-between border-r border-sand-800 z-10 shadow-2xl">
            <div>
              {/* Drawer Brand Header */}
              <div className="p-5 border-b border-sand-800 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2.5">
                  <div className="relative h-10 w-8">
                    <Image
                      src="/logo-calligraphy.png"
                      alt="Tauheed Logo"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <div>
                    <h2 className="font-serif font-bold text-sm text-sand-50 tracking-wider select-none">
                      Tᗩᑌᕼᗴᗴᗪ
                    </h2>
                    <span className="text-[9px] text-gold-400 uppercase tracking-widest font-semibold block">
                      Admin Portal
                    </span>
                  </div>
                </Link>

                <button
                  onClick={() => setMobileDrawerOpen(false)}
                  className="p-1.5 rounded-lg text-sand-400 hover:text-sand-100 hover:bg-sand-900"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Links */}
              <nav className="p-3 space-y-1 max-h-[calc(100vh-180px)] overflow-y-auto text-xs">
                {navItems.map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center justify-between px-3 py-2.5 rounded-xl font-medium transition-all ${
                        isActive
                          ? "bg-gold-500 text-brand-950 font-bold shadow-md"
                          : "text-sand-300 hover:bg-sand-900 hover:text-sand-50"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={`w-4 h-4 ${isActive ? "text-brand-950" : "text-gold-400"}`} />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-rose-600 text-white">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Drawer Sign Out */}
            <div className="p-4 border-t border-sand-800 space-y-2 text-xs">
              <button
                onClick={handleLogout}
                disabled={loggingOut}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl bg-rose-950/40 text-rose-300 border border-rose-800/40 hover:bg-rose-900/60 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <LogOut className="w-4 h-4 text-rose-400" />
                  <span>Sign Out</span>
                </span>
                <span className="text-[9px] font-mono text-rose-400">LOGOUT</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. DESKTOP PERMANENT SIDEBAR (Screens >= lg) */}
      <aside className="hidden lg:flex w-64 bg-brand-950 text-sand-200 min-h-screen flex-col justify-between border-r border-sand-800 shrink-0 sticky top-0 h-screen overflow-y-auto">
        <div>
          {/* Brand Header */}
          <div className="p-5 border-b border-sand-800/80 flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-3 group cursor-pointer hover:opacity-95 transition-all"
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
                  <h2 className="font-serif font-bold text-sm text-sand-50 tracking-wider group-hover:text-gold-300 transition-colors select-none">
                    Tᗩᑌᕼᗴᗴᗪ
                  </h2>
                </div>
                <span className="text-[9px] text-gold-400 font-sans uppercase tracking-widest font-semibold block">
                  Admin Portal
                </span>
              </div>
            </Link>

            {/* Notification Bell Desktop */}
            <button
              onClick={() => setShowNotifDropdown(!showNotifDropdown)}
              className="p-2 rounded-lg bg-sand-900 border border-sand-800 text-sand-200 relative hover:text-gold-400 transition-colors"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {notifications.totalNotifications > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-600 text-white rounded-full text-[9px] font-bold flex items-center justify-center animate-pulse">
                  {notifications.totalNotifications}
                </span>
              )}
            </button>
          </div>

          {/* Staff Identity */}
          <div className="px-6 py-2.5 bg-brand-900/60 border-b border-sand-800/60 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <div>
                <span className="font-semibold text-sand-100 block text-xs">Operations Command</span>
                <span className="text-[9px] text-gold-400 block font-mono">Live System Online</span>
              </div>
            </div>
            <span className="text-[9px] bg-sand-800 text-gold-300 px-1.5 py-0.5 rounded font-mono font-bold">
              ADMIN
            </span>
          </div>

          {/* Nav Links */}
          <nav className="p-3 space-y-1 text-xs">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl font-medium transition-all ${
                    isActive
                      ? "bg-gold-500 text-brand-950 font-bold shadow-md"
                      : "text-sand-300 hover:bg-sand-900/80 hover:text-sand-50"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? "text-brand-950" : "text-gold-400"}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-rose-600 text-white">
                      {item.badge}
                    </span>
                  )}
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
