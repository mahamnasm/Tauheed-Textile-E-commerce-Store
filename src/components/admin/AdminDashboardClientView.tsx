"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { 
  TrendingUp, 
  ShoppingBag, 
  Receipt, 
  AlertTriangle, 
  DollarSign, 
  Truck, 
  ArrowUpRight,
  Download,
  CheckCircle2,
  Video,
  Sparkles,
  Globe,
  Search,
  LayoutTemplate,
  Boxes,
  CreditCard,
  RotateCcw,
  Users,
  Megaphone,
  ExternalLink,
  ChevronRight,
  Sliders,
  Zap,
  Film,
  Key,
  Flame,
  Bot,
  Camera,
  ShieldCheck
} from "lucide-react";

interface AdminDashboardClientViewProps {
  totalRevenue: number;
  totalOrders: number;
  codOrdersCount: number;
  prepaidOrdersCount: number;
  lowStockCount: number;
  pendingBankProofsCount: number;
  recentOrders: any[];
}

export default function AdminDashboardClientView({
  totalRevenue,
  totalOrders,
  codOrdersCount,
  prepaidOrdersCount,
  lowStockCount,
  pendingBankProofsCount,
  recentOrders,
}: AdminDashboardClientViewProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const quickLinks = [
    {
      title: "🎥 Make Dress Videos",
      category: "Videos & Photos",
      desc: "Create beautiful Pakistani model catwalk videos for any dress and show them on your website",
      href: "/admin/veo",
      icon: Video,
      color: "from-purple-600/20 to-amber-500/20",
      borderColor: "border-purple-500/40",
      badge: "MODEL VIDEOS",
      badgeColor: "bg-purple-500/20 text-purple-300 border-purple-500/30",
      keywords: "video model runway catwalk reel dress clothes make video",
    },
    {
      title: "📸 Make Front Cover Photos",
      category: "Videos & Photos",
      desc: "Make high-click front cover photos for every outfit so customers click and buy immediately",
      href: "/admin/nano-banana",
      icon: Camera,
      color: "from-yellow-600/20 to-amber-500/20",
      borderColor: "border-yellow-500/40",
      badge: "COVER PHOTOS",
      badgeColor: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
      keywords: "photo picture front cover image outfit dress camera nano banana",
    },
    {
      title: "🤖 Auto Video Bot",
      category: "Videos & Photos",
      desc: "Automatically checks dresses without videos and creates runway videos on auto-pilot",
      href: "/admin/bot",
      icon: Bot,
      color: "from-emerald-600/20 to-teal-500/20",
      borderColor: "border-emerald-500/40",
      badge: "AUTO BOT",
      badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
      keywords: "bot auto automated video automatic run schedule",
    },
    {
      title: "🔍 Google Search & SEO",
      category: "Google & Traffic",
      desc: "Put your website on top of Google search so Pakistani ladies searching for lawn & chiffon find you",
      href: "/admin/seo",
      icon: Globe,
      color: "from-blue-600/20 to-emerald-500/20",
      borderColor: "border-blue-500/40",
      badge: "GOOGLE SEARCH",
      badgeColor: "bg-blue-500/20 text-blue-300 border-blue-500/30",
      keywords: "google seo search ranking traffic visitors find website",
    },
    {
      title: "⚙️ AI Settings & Tone",
      category: "Settings & AI",
      desc: "Change AI writing style, brand voice, and settings easily without changing any code",
      href: "/admin/ai",
      icon: Sparkles,
      color: "from-amber-600/20 to-yellow-500/20",
      borderColor: "border-[#C5A059]/40",
      badge: "AI SETTINGS",
      badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/30",
      keywords: "ai settings voice tone prompt keys api config update",
    },
    {
      title: "🛡️ Security & Lockdown",
      category: "Security & Protection",
      desc: "Emergency lockdown switch, 2FA Master PIN, live security logs, and unblock locked devices",
      href: "/admin/security",
      icon: ShieldCheck,
      color: "from-emerald-900/40 to-teal-800/30",
      borderColor: "border-emerald-500/40",
      badge: "FORTRESS 2FA",
      badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
      keywords: "security lockdown protect password pin 2fa hack safe shield block unblock master",
    },
    {
      title: "👗 Dresses & Catalog",
      category: "Shop & Products",
      desc: "Add new dresses, change prices, edit fabrics, embroidery details, and upload pictures",
      href: "/admin/products",
      icon: ShoppingBag,
      color: "from-stone-800/40 to-stone-900/40",
      borderColor: "border-white/15",
      badge: "DRESSES",
      badgeColor: "bg-white/10 text-neutral-300 border-white/20",
      keywords: "dresses clothes suits lawn chiffon silk price add new product items",
    },
    {
      title: "📦 Customer Orders",
      category: "Sales & Delivery",
      desc: "See all customer orders, print receipts, confirm Cash on Delivery, and dispatch parcels",
      href: "/admin/orders",
      icon: Receipt,
      color: "from-stone-800/40 to-stone-900/40",
      borderColor: "border-white/15",
      badge: "ORDERS",
      badgeColor: "bg-white/10 text-neutral-300 border-white/20",
      keywords: "orders sales dispatch cod courier receipt invoice parcel new orders",
    },
    {
      title: "📊 Warehouse & Stock",
      category: "Shop & Products",
      desc: "Check how many suits are left in stock and get warnings when stock is running low",
      href: "/admin/inventory",
      icon: Boxes,
      color: "from-stone-800/40 to-stone-900/40",
      borderColor: "border-white/15",
      badge: "STOCK",
      badgeColor: "bg-white/10 text-neutral-300 border-white/20",
      keywords: "stock inventory quantity pieces warehouse low stock alerts",
    },
    {
      title: "🎨 Banners & Home Look",
      category: "Shop & Products",
      desc: "Change homepage top banner pictures, sale announcement text, and video reels order",
      href: "/admin/layout",
      icon: LayoutTemplate,
      color: "from-stone-800/40 to-stone-900/40",
      borderColor: "border-white/15",
      badge: "HOME LOOK",
      badgeColor: "bg-white/10 text-neutral-300 border-white/20",
      keywords: "layout banners homepage look design announcements pictures",
    },
    {
      title: "💰 Bank Slips & Profits",
      category: "Money & Accounts",
      desc: "Check customer Meezan & Nayapay transfer screenshots and see total sales & net profit",
      href: "/admin/payments",
      icon: CreditCard,
      color: "from-stone-800/40 to-stone-900/40",
      borderColor: "border-white/15",
      badge: "MONEY",
      badgeColor: "bg-white/10 text-neutral-300 border-white/20",
      keywords: "bank slip payment meezan nayapay transfer profit money proofs",
    },
    {
      title: "🔄 Returns & Refunds",
      category: "Customer Service",
      desc: "Check customer requests for size exchange or return within 7 days",
      href: "/admin/returns",
      icon: RotateCcw,
      color: "from-stone-800/40 to-stone-900/40",
      borderColor: "border-white/15",
      badge: "RETURNS",
      badgeColor: "bg-white/10 text-neutral-300 border-white/20",
      keywords: "returns exchange refund claims size problem replace send back",
    },
    {
      title: "👥 Customer Phone List",
      category: "Customer Service",
      desc: "See customer names, mobile numbers, delivery addresses, and repeat VIP buyers",
      href: "/admin/customers",
      icon: Users,
      color: "from-stone-800/40 to-stone-900/40",
      borderColor: "border-white/15",
      badge: "CUSTOMERS",
      badgeColor: "bg-white/10 text-neutral-300 border-white/20",
      keywords: "customers phone numbers mobile address buyers list whatsapp",
    },
    {
      title: "🚚 Delivery & Couriers",
      category: "Sales & Delivery",
      desc: "Set city delivery charges (TCS, Leopards, Trax) and free delivery over Rs. 10,000",
      href: "/admin/shipping",
      icon: Truck,
      color: "from-stone-800/40 to-stone-900/40",
      borderColor: "border-white/15",
      badge: "DELIVERY",
      badgeColor: "bg-white/10 text-neutral-300 border-white/20",
      keywords: "delivery charges shipping courier tcs leopard trax fee rates city",
    },
    {
      title: "🏷️ Discount Coupons",
      category: "Marketing & Sales",
      desc: "Make promo codes (like EID20, SALE10) so customers get discounts during checkout",
      href: "/admin/marketing",
      icon: Megaphone,
      color: "from-stone-800/40 to-stone-900/40",
      borderColor: "border-white/15",
      badge: "DISCOUNTS",
      badgeColor: "bg-white/10 text-neutral-300 border-white/20",
      keywords: "coupon promo discount sale code offer voucher percentage",
    },
  ];

  const filteredLinks = useMemo(() => {
    if (!searchQuery.trim()) return quickLinks;
    const q = searchQuery.toLowerCase();
    return quickLinks.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.desc.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.keywords.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  return (
    <div className="space-y-8 pb-16">
      {/* Top Header with Search & Quick Actions */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-sand-300/80 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-gold-700">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Tauheed Store Control Center
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-brand-950 mt-1">
            Store Management & Tools
          </h1>
          <p className="text-xs text-brand-600 mt-1">
            Easy 1-click access to your dresses, model videos, customer orders, and shop settings
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          <Link
            href="/admin/veo"
            className="flex-1 sm:flex-none justify-center px-4 py-2.5 bg-gradient-to-r from-[#0B0A09] to-[#1F1B14] border border-[#C5A059]/40 text-[#C5A059] hover:text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-sm transition"
          >
            <Video className="w-4 h-4 text-[#C5A059]" />
            Make Videos
          </Link>
          <Link
            href="/admin/nano-banana"
            className="flex-1 sm:flex-none justify-center px-4 py-2.5 bg-[#C5A059] hover:bg-[#B38F46] text-black rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-sm transition"
          >
            <Camera className="w-4 h-4" />
            Make Photos
          </Link>
          <Link
            href="/admin/orders"
            className="flex-1 sm:flex-none justify-center px-4 py-2.5 bg-brand-900 hover:bg-brand-950 text-sand-50 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-sm transition"
          >
            <Receipt className="w-4 h-4 text-gold-400" />
            Orders ({totalOrders})
          </Link>
          <a
            href="/"
            target="_blank"
            className="flex-1 sm:flex-none justify-center px-3 py-2.5 bg-white hover:bg-sand-50 border border-sand-300 text-brand-900 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm transition"
            title="Open Live Website"
          >
            <ExternalLink className="w-4 h-4 text-brand-600" />
            View Website
          </a>
        </div>
      </div>

      {/* Interactive Quick Launch Search Bar */}
      <div className="relative">
        <div className="relative flex items-center">
          <Search className="w-5 h-5 absolute left-4 text-neutral-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search anything here (e.g. 'Videos', 'Orders', 'Dresses', 'Stock', 'Google SEO', 'Profits', 'Delivery')..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-28 py-3.5 bg-white border-2 border-sand-300 focus:border-[#C5A059] rounded-2xl text-sm font-medium text-brand-950 placeholder:text-neutral-400 shadow-sm focus:outline-none transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-4 text-xs font-bold text-neutral-500 hover:text-brand-950 px-2.5 py-1 bg-sand-100 rounded-lg"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Featured Quick Tools (Top 3 Highlights) */}
      <div>
        <div className="flex items-center justify-between mb-3.5">
          <h2 className="text-xs font-bold uppercase tracking-widest text-brand-700 flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-[#C5A059]" />
            Quick AI Video & Photo Creators
          </h2>
          <span className="text-[11px] text-brand-500 font-medium">1-Click generation</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Veo 3 Video Studio */}
          <Link
            href="/admin/veo"
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0B0A09] via-[#161410] to-[#241F16] border border-[#C5A059]/40 p-5 text-white transition-all hover:scale-[1.01] hover:shadow-xl hover:shadow-[#C5A059]/10"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-[#C5A059]/20 border border-[#C5A059]/40 flex items-center justify-center text-[#C5A059]">
                <Video className="w-5 h-5" />
              </div>
              <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-[#C5A059]/20 text-[#C5A059] border border-[#C5A059]/40">
                MODEL VIDEOS
              </span>
            </div>
            <h3 className="font-serif font-bold text-base text-[#FCFBF7] group-hover:text-[#C5A059] transition-colors flex items-center gap-1.5">
              Make Model Runway Videos
              <ChevronRight className="w-4 h-4 text-[#C5A059] group-hover:translate-x-1 transition-transform" />
            </h3>
            <p className="text-xs text-neutral-400 mt-1.5 leading-relaxed">
              Create video walks of Pakistani models wearing your dresses and put them directly on your website reels.
            </p>
          </Link>

          {/* Nano Banana Photo Studio */}
          <Link
            href="/admin/nano-banana"
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0B0A09] via-[#14120E] to-[#1E1B15] border border-amber-500/40 p-5 text-white transition-all hover:scale-[1.01] hover:shadow-xl hover:shadow-amber-500/10"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                <Camera className="w-5 h-5" />
              </div>
              <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                COVER PHOTOS
              </span>
            </div>
            <h3 className="font-serif font-bold text-base text-[#FCFBF7] group-hover:text-amber-400 transition-colors flex items-center gap-1.5">
              Make Front Cover Photos
              <ChevronRight className="w-4 h-4 text-amber-400 group-hover:translate-x-1 transition-transform" />
            </h3>
            <p className="text-xs text-neutral-400 mt-1.5 leading-relaxed">
              Make gorgeous front pictures of every outfit with 1 click so customers click and buy right away.
            </p>
          </Link>

          {/* Google Search & SEO */}
          <Link
            href="/admin/seo"
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0B0A09] via-[#0E151B] to-[#141E26] border border-blue-500/40 p-5 text-white transition-all hover:scale-[1.01] hover:shadow-xl hover:shadow-blue-500/10"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
                <Globe className="w-5 h-5" />
              </div>
              <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/40">
                GOOGLE SEARCH
              </span>
            </div>
            <h3 className="font-serif font-bold text-base text-[#FCFBF7] group-hover:text-blue-400 transition-colors flex items-center gap-1.5">
              Get on Top of Google
              <ChevronRight className="w-4 h-4 text-blue-400 group-hover:translate-x-1 transition-transform" />
            </h3>
            <p className="text-xs text-neutral-400 mt-1.5 leading-relaxed">
              1-Click tool to help your dresses appear at the top when people search on Google in Pakistan.
            </p>
          </Link>
        </div>
      </div>

      {/* All Easy Action Options Grid */}
      <div>
        <div className="flex items-center justify-between mb-3.5">
          <h2 className="text-xs font-bold uppercase tracking-widest text-brand-700">
            {searchQuery ? `Search Results (${filteredLinks.length})` : "All Store Options (Click Any to Open)"}
          </h2>
          {searchQuery && (
            <span className="text-xs text-brand-500">Matching &quot;{searchQuery}&quot;</span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
          {filteredLinks.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="group bg-white hover:bg-sand-50/70 border border-sand-200 hover:border-[#C5A059] rounded-xl p-4 transition-all duration-200 shadow-sm hover:shadow flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-8 h-8 rounded-lg bg-sand-100 group-hover:bg-[#C5A059]/15 flex items-center justify-center text-brand-900 group-hover:text-gold-700 transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className={`px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded border ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  </div>
                  <h3 className="font-serif font-bold text-sm text-brand-950 group-hover:text-gold-700 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-[11px] text-brand-600 mt-1 line-clamp-2 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
                <div className="flex items-center justify-between pt-3 mt-2 border-t border-sand-100 text-[10px] font-bold uppercase tracking-wider text-brand-500 group-hover:text-gold-700">
                  <span>{item.category}</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* KPI Cards Grid (Simple everyday language) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-sand-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-brand-600">
            <span>Total Sales Money</span>
            <div className="p-2 rounded-lg bg-sand-100 text-gold-700">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <h3 className="font-serif font-bold text-2xl text-brand-950">
            Rs. {totalRevenue.toLocaleString()}
          </h3>
          <p className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
            <ArrowUpRight className="w-3 h-3" /> Total money from all orders
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-sand-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-brand-600">
            <span>Total Orders Placed</span>
            <div className="p-2 rounded-lg bg-sand-100 text-gold-700">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <h3 className="font-serif font-bold text-2xl text-brand-950">
            {totalOrders} Orders
          </h3>
          <p className="text-[11px] text-brand-600">
            Cash on Delivery: {codOrdersCount} | Online Paid: {prepaidOrdersCount}
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-sand-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-brand-600">
            <span>Low Stock Warning</span>
            <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <h3 className="font-serif font-bold text-2xl text-amber-700">
            {lowStockCount} Dresses
          </h3>
          <p className="text-[11px] text-brand-600">
            Dresses with 5 or fewer pieces remaining
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-sand-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-brand-600">
            <span>Customer Bank Slips</span>
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <h3 className="font-serif font-bold text-2xl text-brand-950">
            {pendingBankProofsCount} New Slips
          </h3>
          <p className="text-[11px] text-brand-600">
            Waiting for your approval
          </p>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-2xl border border-sand-200 shadow-sm overflow-hidden space-y-4 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-sand-100 pb-4">
          <div>
            <h3 className="font-serif font-bold text-base sm:text-lg text-brand-950">Recent Customer Orders</h3>
            <p className="text-xs text-brand-600">Customer orders waiting to be packed and delivered</p>
          </div>
          <Link
            href="/admin/orders"
            className="text-xs font-bold text-gold-700 hover:text-gold-800 uppercase tracking-wider flex items-center gap-1"
          >
            View All Orders <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-sand-50 text-brand-800 uppercase">
              <tr>
                <th className="p-3">Order #</th>
                <th className="p-3">Customer</th>
                <th className="p-3">City</th>
                <th className="p-3">Payment Type</th>
                <th className="p-3">Order Status</th>
                <th className="p-3">Paid Status</th>
                <th className="p-3 text-right">Total Price</th>
                <th className="p-3 text-center">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sand-100">
              {recentOrders.map((o) => (
                <tr key={o.id} className="hover:bg-sand-50/60">
                  <td className="p-3 font-bold text-brand-950">{o.orderNumber}</td>
                  <td className="p-3">
                    <p className="font-bold text-brand-900">{o.customerName}</p>
                    <p className="text-[11px] text-brand-500">{o.guestPhone}</p>
                  </td>
                  <td className="p-3 text-brand-700">{o.city}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded bg-sand-100 font-semibold text-[10px]">
                      {o.paymentMethod === "COD" ? "Cash on Delivery" : o.paymentMethod}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                      o.orderStatus === "CONFIRMED"
                        ? "bg-emerald-100 text-emerald-800"
                        : o.orderStatus === "PACKED"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-amber-100 text-amber-800"
                    }`}>
                      {o.orderStatus}
                    </span>
                  </td>
                  <td className="p-3 text-brand-700">{o.paymentStatus}</td>
                  <td className="p-3 text-right font-serif font-bold text-brand-950">
                    Rs. {o.total.toLocaleString()}
                  </td>
                  <td className="p-3 text-center">
                    <Link
                      href={`/order-confirmation/${o.orderNumber}`}
                      target="_blank"
                      className="text-gold-700 hover:text-gold-800 font-bold"
                    >
                      Print Slip
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
