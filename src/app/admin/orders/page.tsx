"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Download,
  Truck,
  Search,
  CheckCircle,
  Clock,
  MessageSquare,
  Mail,
  Settings,
  Send,
  ExternalLink,
  RefreshCw,
} from "lucide-react";
import toast from "react-hot-toast";
import AdminOrderNotificationConfigModal from "@/components/admin/AdminOrderNotificationConfigModal";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchOrders = async () => {
    try {
      const resJson = await fetch("/api/admin/orders/list");
      const data = await resJson.json();
      if (data.orders) setOrders(data.orders);
    } catch (e) {
      console.error("Failed to fetch orders:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (orderId: string, orderStatus: string) => {
    setUpdatingId(orderId);
    try {
      const res = await fetch("/api/admin/orders/status", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, orderStatus }),
      });
      if (!res.ok) throw new Error("Status update failed");
      toast.success(`Order status updated to ${orderStatus}`);
      await fetchOrders();
    } catch (e: any) {
      toast.error(e.message || "Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  // 1-Click WhatsApp Order Confirmation Trigger
  const handleSendWhatsAppConfirmation = (order: any) => {
    let cleanPhone = (order.guestPhone || "").replace(/[^0-9]/g, "");
    if (cleanPhone.startsWith("0")) {
      cleanPhone = `92${cleanPhone.slice(1)}`;
    } else if (!cleanPhone.startsWith("92")) {
      cleanPhone = `92${cleanPhone}`;
    }

    const appUrl = typeof window !== "undefined" ? window.location.origin : "https://tauheedtextile.com";
    const trackingLink = `${appUrl}/order-confirmation/${order.orderNumber}`;

    const message = `Assalam-o-Alaikum ${order.customerName || "Valued Customer"}! 🌸

Shukriya! Aapka order #${order.orderNumber} Tauheed Textile pe confirm ho chuka hai.

💰 Total Amount: Rs. ${order.total.toLocaleString()}
🚚 Payment Method: ${order.paymentMethod}
📍 Destination: ${order.city || "Pakistan"}

Parcel 3-5 working days mein dispatch ho jayega.
Live Tracking: ${trackingLink}

JazakAllah Khair!
— Tauheed Textile`;

    const directUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
    window.open(directUrl, "_blank");
    toast.success(`WhatsApp confirmation opened for ${order.customerName}`);
  };

  const filteredOrders = orders.filter((o) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      o.orderNumber?.toLowerCase().includes(q) ||
      o.customerName?.toLowerCase().includes(q) ||
      o.guestPhone?.includes(q) ||
      o.city?.toLowerCase().includes(q) ||
      o.trackingNumber?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-sand-300 pb-5 sm:pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] sm:text-xs font-bold tracking-widest uppercase text-gold-700 bg-gold-50 border border-gold-200 px-2.5 py-0.5 rounded-md flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5 text-gold-600" />
              Order Management &amp; Fulfillment
            </span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-brand-950 mt-1">
            Orders &amp; Automatic Confirmation
          </h1>
          <p className="text-xs text-brand-600 mt-1">
            Review customer orders, dispatch status, assign tracking numbers, and send instant WhatsApp &amp; Business Email confirmations.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
          {/* Automated Confirmation Settings Modal Button */}
          <button
            type="button"
            onClick={() => setIsConfigModalOpen(true)}
            className="px-4 py-2.5 bg-sand-100 hover:bg-gold-50 hover:border-gold-400 border border-sand-300 text-brand-950 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-xs transition-all cursor-pointer"
          >
            <Settings className="w-4 h-4 text-gold-700" />
            <span>Confirmation API Settings</span>
          </button>

          <a
            href="/api/orders/csv"
            className="px-4 py-2.5 bg-brand-900 hover:bg-brand-950 text-sand-50 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-sm transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-gold-400" />
            <span>Export CSV</span>
          </a>
        </div>
      </div>

      {/* Search Toolbar */}
      <div className="bg-white rounded-2xl border border-sand-200 p-4 shadow-sm flex items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-brand-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Order # (e.g. TT-2026), Customer name, phone, city, or tracking..."
            className="w-full pl-10 pr-4 py-2 bg-sand-50 border border-sand-300 rounded-xl text-xs text-brand-950 placeholder-brand-400 focus:outline-none focus:border-gold-600"
          />
        </div>
        <span className="text-xs text-brand-500 font-mono">
          {filteredOrders.length} Orders
        </span>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-sand-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-brand-600">Loading orders database...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead className="bg-sand-50 text-brand-800 uppercase text-[11px]">
                <tr>
                  <th className="p-3 font-semibold">Order #</th>
                  <th className="p-3 font-semibold">Customer</th>
                  <th className="p-3 font-semibold">Address &amp; City</th>
                  <th className="p-3 font-semibold">Method</th>
                  <th className="p-3 font-semibold">Status</th>
                  <th className="p-3 font-semibold">Courier / Tracking</th>
                  <th className="p-3 text-right font-semibold">Total (PKR)</th>
                  <th className="p-3 text-center font-semibold">WhatsApp Confirm</th>
                  <th className="p-3 text-center font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand-100 font-sans">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="p-8 text-center text-sand-400 text-xs">
                      No orders found matching your search.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((o) => (
                    <tr key={o.id} className="hover:bg-sand-50/60 transition-colors">
                      {/* Order Number */}
                      <td className="p-3 font-bold font-mono text-brand-950">
                        <Link
                          href={`/order-confirmation/${o.orderNumber}`}
                          target="_blank"
                          className="hover:underline flex items-center gap-1"
                        >
                          <span>{o.orderNumber}</span>
                          <ExternalLink className="w-3 h-3 text-gold-700" />
                        </Link>
                      </td>

                      {/* Customer */}
                      <td className="p-3">
                        <p className="font-bold text-brand-900">{o.customerName}</p>
                        <p className="text-[11px] text-brand-500 font-mono">{o.guestPhone}</p>
                      </td>

                      {/* Address */}
                      <td className="p-3">
                        <p className="text-brand-900 font-medium">
                          {o.city}, {o.province}
                        </p>
                        <p className="text-[11px] text-brand-500 truncate max-w-xs">{o.address}</p>
                      </td>

                      {/* Payment Method */}
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded bg-sand-100 font-semibold text-[10px]">
                          {o.paymentMethod}
                        </span>
                      </td>

                      {/* Order Status Select */}
                      <td className="p-3">
                        <select
                          value={o.orderStatus}
                          onChange={(e) => handleUpdateStatus(o.id, e.target.value)}
                          disabled={updatingId === o.id}
                          className="bg-sand-50 border border-sand-300 rounded-lg px-2 py-1 text-xs font-bold text-brand-950 focus:outline-none"
                        >
                          <option value="PENDING">PENDING</option>
                          <option value="CONFIRMED">CONFIRMED</option>
                          <option value="PACKED">PACKED</option>
                          <option value="SHIPPED">SHIPPED</option>
                          <option value="DELIVERED">DELIVERED</option>
                          <option value="CANCELLED">CANCELLED</option>
                        </select>
                      </td>

                      {/* Courier & Tracking */}
                      <td className="p-3">
                        <p className="font-medium text-brand-900">
                          {o.courierName || "Not Assigned"}
                        </p>
                        <p className="text-[11px] font-mono text-brand-500">
                          {o.trackingNumber || "—"}
                        </p>
                      </td>

                      {/* Total */}
                      <td className="p-3 text-right font-serif font-bold text-brand-950 whitespace-nowrap">
                        Rs. {o.total.toLocaleString()}
                      </td>

                      {/* 1-Click WhatsApp Order Confirmation Button */}
                      <td className="p-3 text-center">
                        <button
                          type="button"
                          onClick={() => handleSendWhatsAppConfirmation(o)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#128C7E] hover:bg-[#075E54] text-white text-[11px] font-bold shadow-xs transition-colors cursor-pointer"
                          title="Send instant WhatsApp confirmation message to customer"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>WA Confirm</span>
                        </button>
                      </td>

                      {/* Actions (Slip) */}
                      <td className="p-3 text-center">
                        <Link
                          href={`/order-confirmation/${o.orderNumber}`}
                          target="_blank"
                          className="text-gold-700 hover:text-gold-900 font-bold underline text-xs"
                        >
                          View Slip
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Confirmation Settings Modal */}
      <AdminOrderNotificationConfigModal
        isOpen={isConfigModalOpen}
        onClose={() => setIsConfigModalOpen(false)}
      />
    </div>
  );
}
