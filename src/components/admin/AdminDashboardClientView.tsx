"use client";

import React from "react";
import Link from "next/link";
import { 
  TrendingUp, 
  ShoppingBag, 
  Receipt, 
  AlertTriangle, 
  Video, 
  Camera, 
  ShieldCheck, 
  ArrowRight,
  ChevronRight,
  Clock,
  Eye,
  Activity,
  Zap,
  Sliders
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
  totalRevenue = 0,
  totalOrders = 0,
  codOrdersCount = 0,
  prepaidOrdersCount = 0,
  lowStockCount = 0,
  pendingBankProofsCount = 0,
  recentOrders = [],
}: AdminDashboardClientViewProps) {
  return (
    <div className="space-y-8 text-sand-950 pb-12">
      {/* 1. Header with Clean Greeting */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-sand-300 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider font-mono">
              Tauheed Admin Active
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-brand-950 tracking-tight">
            Welcome back, Usama Naseem
          </h1>
          <p className="text-xs text-brand-600 mt-0.5">
            Tauheed Textile Boutique • Everything you need to manage your store is right here.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/admin/layout"
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-gold-100 hover:bg-gold-200 text-gold-950 border border-gold-300 rounded-full text-xs font-bold transition-all shadow-sm font-serif"
          >
            <Sliders className="w-3.5 h-3.5 text-gold-700" />
            <span>🎨 Customize Website →</span>
          </Link>

          <Link
            href="/admin/health"
            className="flex items-center gap-2 px-3 py-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 border border-emerald-300 rounded-full text-xs font-bold font-mono transition-all shadow-sm"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Health: 99% (Optimal)</span>
            <span className="text-[10px] text-emerald-700 underline font-sans">Speed Boost →</span>
          </Link>

          <Link
            href="/"
            target="_blank"
            className="px-4 py-2 bg-brand-950 hover:bg-black text-sand-100 rounded-xl text-xs font-bold uppercase tracking-wider shadow-sm transition-all flex items-center gap-1.5"
          >
            <span>View Website</span>
            <ArrowRight className="w-3.5 h-3.5 text-gold-400" />
          </Link>
        </div>
      </div>

      {/* 2. Four Essential Summary Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Sales */}
        <div className="bg-white p-5 rounded-3xl border border-sand-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-brand-500">Total Sales</span>
            <div className="p-2 bg-emerald-100 text-emerald-800 rounded-xl">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-bold font-serif text-brand-950">
            PKR {totalRevenue.toLocaleString()}
          </div>
          <p className="text-[11px] text-emerald-700 font-medium">All completed orders</p>
        </div>

        {/* Orders */}
        <div className="bg-white p-5 rounded-3xl border border-sand-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-brand-500">Total Orders</span>
            <div className="p-2 bg-blue-100 text-blue-800 rounded-xl">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-bold font-serif text-brand-950">
            {totalOrders}
          </div>
          <p className="text-[11px] text-blue-700 font-medium">{codOrdersCount} Cash on Delivery</p>
        </div>

        {/* Bank Slips to Verify */}
        <div className="bg-white p-5 rounded-3xl border border-sand-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-brand-500">Bank Slips</span>
            <div className="p-2 bg-amber-100 text-amber-800 rounded-xl">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-bold font-serif text-amber-900">
            {pendingBankProofsCount} Pending
          </div>
          <Link href="/admin/payments" className="text-[11px] text-amber-700 font-bold hover:underline block">
            Review Receipts →
          </Link>
        </div>

        {/* Low Stock Warning */}
        <div className="bg-white p-5 rounded-3xl border border-sand-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-brand-500">Stock Alerts</span>
            <div className="p-2 bg-rose-100 text-rose-800 rounded-xl">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-bold font-serif text-rose-900">
            {lowStockCount} Low Suits
          </div>
          <Link href="/admin/inventory" className="text-[11px] text-rose-700 font-bold hover:underline block">
            Restock Suits →
          </Link>
        </div>
      </div>

      {/* 3. Quick Shortcuts (Short, Simple & Clean) */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-brand-700">
            Quick Shortcuts
          </h2>
          <span className="text-[11px] text-brand-400">
            All tools also in left menu
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {/* 1: Runway Reels */}
          <Link
            href="/admin/reels"
            className="p-3 rounded-2xl bg-white hover:bg-sand-50 border border-sand-200 hover:border-gold-400 shadow-2xs transition-all flex items-center gap-2.5 group"
          >
            <div className="w-8 h-8 rounded-xl bg-brand-950 text-gold-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Video className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="font-serif font-bold text-xs text-brand-950 truncate group-hover:text-gold-700">
                Runway Reels
              </p>
              <p className="text-[10px] text-brand-500 truncate">Videos</p>
            </div>
          </Link>

          {/* 2: Dresses & Catalog */}
          <Link
            href="/admin/products"
            className="p-3 rounded-2xl bg-white hover:bg-sand-50 border border-sand-200 hover:border-gold-400 shadow-2xs transition-all flex items-center gap-2.5 group"
          >
            <div className="w-8 h-8 rounded-xl bg-brand-950 text-gold-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="font-serif font-bold text-xs text-brand-950 truncate group-hover:text-gold-700">
                Dresses
              </p>
              <p className="text-[10px] text-brand-500 truncate">Suits & Catalog</p>
            </div>
          </Link>

          {/* 3: Customer Orders */}
          <Link
            href="/admin/orders"
            className="p-3 rounded-2xl bg-white hover:bg-sand-50 border border-sand-200 hover:border-gold-400 shadow-2xs transition-all flex items-center gap-2.5 group"
          >
            <div className="w-8 h-8 rounded-xl bg-brand-950 text-gold-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Receipt className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="font-serif font-bold text-xs text-brand-950 truncate group-hover:text-gold-700">
                Orders
              </p>
              <p className="text-[10px] text-brand-500 truncate">Dispatch & COD</p>
            </div>
          </Link>

          {/* 4: Cover Photos */}
          <Link
            href="/admin/nano-banana"
            className="p-3 rounded-2xl bg-white hover:bg-sand-50 border border-sand-200 hover:border-gold-400 shadow-2xs transition-all flex items-center gap-2.5 group"
          >
            <div className="w-8 h-8 rounded-xl bg-brand-950 text-amber-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Camera className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="font-serif font-bold text-xs text-brand-950 truncate group-hover:text-gold-700">
                Cover Studio
              </p>
              <p className="text-[10px] text-brand-500 truncate">Dress Photos</p>
            </div>
          </Link>

          {/* 5: Website Customizer */}
          <Link
            href="/admin/layout"
            className="p-3 rounded-2xl bg-white hover:bg-sand-50 border border-sand-200 hover:border-gold-400 shadow-2xs transition-all flex items-center gap-2.5 group"
          >
            <div className="w-8 h-8 rounded-xl bg-brand-950 text-gold-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Sliders className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="font-serif font-bold text-xs text-brand-950 truncate group-hover:text-gold-700">
                Website
              </p>
              <p className="text-[10px] text-brand-500 truncate">Banners & Hero</p>
            </div>
          </Link>

          {/* 6: Bank Slips & Profits */}
          <Link
            href="/admin/payments"
            className="p-3 rounded-2xl bg-white hover:bg-sand-50 border border-sand-200 hover:border-gold-400 shadow-2xs transition-all flex items-center gap-2.5 group"
          >
            <div className="w-8 h-8 rounded-xl bg-brand-950 text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Clock className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="font-serif font-bold text-xs text-brand-950 truncate group-hover:text-gold-700">
                Bank Slips
              </p>
              <p className="text-[10px] text-brand-500 truncate">Verify Receipts</p>
            </div>
          </Link>
        </div>
      </div>

      {/* 4. Recent Customer Orders (Clean Table) */}
      <div className="bg-white rounded-3xl border border-sand-200 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-sand-100 pb-3">
          <div>
            <h3 className="font-serif font-bold text-base text-brand-950">
              Latest Customer Orders
            </h3>
            <p className="text-xs text-brand-500">
              Most recent orders placed on your boutique
            </p>
          </div>
          <Link
            href="/admin/orders"
            className="text-xs font-bold text-brand-900 hover:text-gold-700 flex items-center gap-1"
          >
            <span>View All ({totalOrders})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="py-8 text-center text-sand-400 text-xs">
            No orders placed yet. New customer orders will show up here immediately.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-sand-100 text-[11px] uppercase tracking-wider text-sand-500">
                  <th className="py-2.5 px-3">Order #</th>
                  <th className="py-2.5 px-3">Customer</th>
                  <th className="py-2.5 px-3">City</th>
                  <th className="py-2.5 px-3">Amount</th>
                  <th className="py-2.5 px-3">Payment</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand-100">
                {recentOrders.slice(0, 5).map((order) => (
                  <tr key={order.id} className="hover:bg-sand-50/70 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-brand-950">
                      #{order.orderNumber}
                    </td>
                    <td className="py-3 px-3 font-medium text-brand-900">
                      {order.customerName}
                    </td>
                    <td className="py-3 px-3 text-brand-600">
                      {order.city}
                    </td>
                    <td className="py-3 px-3 font-bold font-serif text-brand-950">
                      PKR {order.total?.toLocaleString()}
                    </td>
                    <td className="py-3 px-3 font-mono text-[11px]">
                      <span className={`px-2 py-0.5 rounded-full ${order.paymentMethod === 'COD' ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800'}`}>
                        {order.paymentMethod}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                        order.orderStatus === 'DELIVERED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : order.orderStatus === 'CANCELLED'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {order.orderStatus}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <Link
                        href={`/admin/orders?order=${order.orderNumber}`}
                        className="inline-flex items-center gap-1 text-[11px] text-gold-700 hover:text-gold-900 font-bold"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
