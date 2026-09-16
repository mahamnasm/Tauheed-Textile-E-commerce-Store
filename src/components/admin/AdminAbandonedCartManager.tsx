"use client";

import React, { useState } from "react";
import Image from "next/image";
import { 
  ShoppingBag, 
  MessageCircle, 
  CheckCircle2, 
  Clock, 
  Phone, 
  Mail, 
  DollarSign, 
  TrendingUp, 
  ExternalLink,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Sparkles
} from "lucide-react";

interface CartItem {
  id: string;
  title: string;
  price: number;
  image?: string;
  quantity?: number;
  variant?: {
    size?: string;
    stitchedType?: string;
  };
}

export interface AbandonedCartRecord {
  id: string;
  customerName: string | null;
  phone: string | null;
  email: string | null;
  cartData: string;
  subtotal: number;
  itemCount: number;
  recovered: boolean;
  lastActiveAt: string | Date;
  createdAt: string | Date;
}

interface AdminAbandonedCartManagerProps {
  initialCarts: AbandonedCartRecord[];
}

export default function AdminAbandonedCartManager({ initialCarts }: AdminAbandonedCartManagerProps) {
  const [carts, setCarts] = useState<AbandonedCartRecord[]>(initialCarts);
  const [filter, setFilter] = useState<"ALL" | "UNRECOVERED" | "RECOVERED">("UNRECOVERED");
  const [expandedCartId, setExpandedCartId] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  // Statistics
  const totalCarts = carts.length;
  const unrecoveredCarts = carts.filter((c) => !c.recovered);
  const recoveredCarts = carts.filter((c) => c.recovered);
  const potentialValue = unrecoveredCarts.reduce((sum, c) => sum + (c.subtotal || 0), 0);
  const recoveredValue = recoveredCarts.reduce((sum, c) => sum + (c.subtotal || 0), 0);
  const recoveryRate = totalCarts > 0 ? Math.round((recoveredCarts.length / totalCarts) * 100) : 0;

  // Filtered view
  const filteredCarts = carts.filter((c) => {
    if (filter === "UNRECOVERED") return !c.recovered;
    if (filter === "RECOVERED") return c.recovered;
    return true;
  });

  const handleToggleRecovered = async (cartId: string, currentStatus: boolean) => {
    setIsUpdating(cartId);
    try {
      const res = await fetch("/api/cart/abandoned", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cartId, recovered: !currentStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setCarts((prev) =>
          prev.map((c) => (c.id === cartId ? { ...c, recovered: !currentStatus } : c))
        );
      }
    } catch (err) {
      console.error("Failed to update cart status", err);
    } finally {
      setIsUpdating(null);
    }
  };

  const parseItems = (cartData: string): CartItem[] => {
    try {
      return JSON.parse(cartData);
    } catch {
      return [];
    }
  };

  const generateWhatsAppUrl = (cart: AbandonedCartRecord) => {
    const items = parseItems(cart.cartData);
    const itemNames = items.map((i) => `${i.title} (${i.quantity || 1}x)`).join(", ");
    const name = cart.customerName || "Customer";
    
    let targetPhone = cart.phone ? cart.phone.replace(/[^0-9]/g, "") : "";
    if (targetPhone.startsWith("0")) {
      targetPhone = "92" + targetPhone.substring(1);
    }

    const message = `Salam ${name}! We noticed you reserved the following unstitched suit(s) at Tᗩᑌᕼᗴᗴᗪ Tᗴ᙭TIᒪᗴ:\n\n` +
      `🛍️ *Items:* ${itemNames}\n` +
      `💰 *Total:* Rs. ${cart.subtotal.toLocaleString()}\n\n` +
      `Would you like us to confirm this order for you with *Flat 5% Off* (Code: SAVE5) and Free Nationwide Delivery on orders over Rs. 10,000? Let us know your delivery address!`;

    if (targetPhone) {
      return `https://wa.me/${targetPhone}?text=${encodeURIComponent(message)}`;
    }
    return `https://wa.me/?text=${encodeURIComponent(message)}`;
  };

  return (
    <div className="space-y-6">
      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-sand-200 shadow-sm">
          <div className="flex items-center justify-between text-xs text-brand-600 font-semibold mb-1">
            <span>Abandoned Sessions</span>
            <ShoppingBag className="w-4 h-4 text-gold-600" />
          </div>
          <div className="text-2xl font-serif font-bold text-brand-950">{totalCarts}</div>
          <span className="text-[11px] text-amber-700 font-medium">
            {unrecoveredCarts.length} unrecovered
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-sand-200 shadow-sm">
          <div className="flex items-center justify-between text-xs text-brand-600 font-semibold mb-1">
            <span>Recoverable Revenue</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-serif font-bold text-brand-950">
            Rs. {potentialValue.toLocaleString()}
          </div>
          <span className="text-[11px] text-brand-500">Uncompleted checkout total</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-sand-200 shadow-sm">
          <div className="flex items-center justify-between text-xs text-brand-600 font-semibold mb-1">
            <span>Recovered Carts</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-serif font-bold text-brand-950">{recoveredCarts.length}</div>
          <span className="text-[11px] text-emerald-700 font-medium">
            Rs. {recoveredValue.toLocaleString()} recovered
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-sand-200 shadow-sm">
          <div className="flex items-center justify-between text-xs text-brand-600 font-semibold mb-1">
            <span>Recovery Rate</span>
            <TrendingUp className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-serif font-bold text-brand-950">{recoveryRate}%</div>
          <span className="text-[11px] text-brand-500">Industry avg: 8-12%</span>
        </div>
      </div>

      {/* Retention Controls & Filter Bar */}
      <div className="bg-white rounded-2xl border border-sand-200 shadow-sm p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-sand-100 pb-4">
          <div>
            <h3 className="font-serif font-bold text-base text-brand-950 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-gold-600" />
              Automated Cart Retention & WhatsApp Recovery
            </h3>
            <p className="text-xs text-brand-600 mt-0.5">
              Live sessions abandoned by customers. Contact directly via WhatsApp with auto-generated order summaries and incentives.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilter("UNRECOVERED")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filter === "UNRECOVERED"
                  ? "bg-brand-950 text-white shadow-sm"
                  : "bg-sand-100 text-brand-700 hover:bg-sand-200"
              }`}
            >
              Unrecovered ({unrecoveredCarts.length})
            </button>
            <button
              onClick={() => setFilter("RECOVERED")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filter === "RECOVERED"
                  ? "bg-brand-950 text-white shadow-sm"
                  : "bg-sand-100 text-brand-700 hover:bg-sand-200"
              }`}
            >
              Recovered ({recoveredCarts.length})
            </button>
            <button
              onClick={() => setFilter("ALL")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filter === "ALL"
                  ? "bg-brand-950 text-white shadow-sm"
                  : "bg-sand-100 text-brand-700 hover:bg-sand-200"
              }`}
            >
              All ({totalCarts})
            </button>
          </div>
        </div>

        {/* Carts Table */}
        {filteredCarts.length === 0 ? (
          <div className="text-center py-12 text-brand-500 text-xs">
            No {filter.toLowerCase()} abandoned carts found. Customers who leave items in their bag will appear here automatically!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-sand-50 text-brand-800 uppercase">
                <tr>
                  <th className="p-3">Customer / Session</th>
                  <th className="p-3">Cart Summary</th>
                  <th className="p-3">Subtotal</th>
                  <th className="p-3">Last Active</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand-100">
                {filteredCarts.map((c) => {
                  const items = parseItems(c.cartData);
                  const isExpanded = expandedCartId === c.id;

                  return (
                    <React.Fragment key={c.id}>
                      <tr className="hover:bg-sand-50/60 transition-colors">
                        <td className="p-3">
                          <div className="font-bold text-brand-950">
                            {c.customerName || "Anonymous Shopper"}
                          </div>
                          <div className="flex items-center gap-2 mt-0.5 text-[11px] text-brand-600">
                            {c.phone ? (
                              <span className="flex items-center gap-1 font-mono">
                                <Phone className="w-3 h-3 text-emerald-600" />
                                {c.phone}
                              </span>
                            ) : null}
                            {c.email ? (
                              <span className="flex items-center gap-1">
                                <Mail className="w-3 h-3 text-blue-600" />
                                {c.email}
                              </span>
                            ) : null}
                            {!c.phone && !c.email && (
                              <span className="italic text-sand-500">No contact captured yet</span>
                            )}
                          </div>
                        </td>

                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-brand-900">
                              {c.itemCount} {c.itemCount === 1 ? "suit" : "suits"}
                            </span>
                            <button
                              onClick={() => setExpandedCartId(isExpanded ? null : c.id)}
                              className="text-[11px] text-gold-700 hover:text-gold-900 underline flex items-center gap-0.5"
                            >
                              {isExpanded ? "Hide items" : "View items"}
                              {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                            </button>
                          </div>
                          <div className="text-[11px] text-brand-500 truncate max-w-xs">
                            {items.map((i) => i.title).join(", ")}
                          </div>
                        </td>

                        <td className="p-3 font-serif font-bold text-brand-950 text-sm">
                          Rs. {c.subtotal.toLocaleString()}
                        </td>

                        <td className="p-3 text-brand-600 text-[11px]">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-sand-500" />
                            {new Date(c.lastActiveAt).toLocaleString("en-PK", {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                        </td>

                        <td className="p-3">
                          {c.recovered ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold text-[10px] bg-emerald-100 text-emerald-800">
                              <CheckCircle2 className="w-3 h-3" />
                              RECOVERED
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold text-[10px] bg-amber-100 text-amber-800">
                              PENDING
                            </span>
                          )}
                        </td>

                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {/* WhatsApp Direct Recovery Button */}
                            <a
                              href={generateWhatsAppUrl(c)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-xs transition-all shadow-sm"
                              title="Send WhatsApp Cart Recovery Reminder"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                              <span>WhatsApp</span>
                            </a>

                            {/* Mark Recovered Toggle */}
                            <button
                              onClick={() => handleToggleRecovered(c.id, c.recovered)}
                              disabled={isUpdating === c.id}
                              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                                c.recovered
                                  ? "border-sand-300 text-brand-700 hover:bg-sand-100"
                                  : "border-emerald-300 text-emerald-800 bg-emerald-50 hover:bg-emerald-100"
                              }`}
                            >
                              {c.recovered ? "Mark Pending" : "Mark Recovered"}
                            </button>
                          </div>
                        </td>
                      </tr>

                      {/* Expandable item details row */}
                      {isExpanded && (
                        <tr className="bg-sand-50/80">
                          <td colSpan={6} className="p-4">
                            <div className="bg-white rounded-xl border border-sand-200 p-3 space-y-2">
                              <span className="text-[11px] font-bold text-brand-800 uppercase tracking-wider block mb-2">
                                Abandoned Items Breakdown ({items.length} items)
                              </span>
                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                {items.map((item, idx) => (
                                  <div
                                    key={idx}
                                    className="flex items-center gap-3 p-2 rounded-lg border border-sand-100 bg-sand-50/50"
                                  >
                                    {item.image && (
                                      <div className="relative w-12 h-14 rounded-md overflow-hidden bg-sand-200 flex-shrink-0">
                                        <Image
                                          src={item.image}
                                          alt={item.title}
                                          fill
                                          className="object-cover"
                                        />
                                      </div>
                                    )}
                                    <div className="min-w-0 flex-1">
                                      <p className="font-semibold text-brand-950 text-xs truncate">
                                        {item.title}
                                      </p>
                                      <p className="text-[11px] text-brand-600">
                                        Qty: {item.quantity || 1} &bull; Rs. {item.price.toLocaleString()}
                                      </p>
                                      {item.variant && (
                                        <p className="text-[10px] text-gold-700">
                                          {item.variant.size || ""} {item.variant.stitchedType || "Unstitched"}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
