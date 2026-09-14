"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Download, Truck, Search, CheckCircle, Clock } from "lucide-react";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/orders/csv"); // or direct api
      // Let's fetch orders json
      const resJson = await fetch("/api/admin/orders/list");
      const data = await resJson.json();
      if (data.orders) setOrders(data.orders);
    } catch (e) {
      console.error(e);
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
      await fetch("/api/admin/orders/status", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, orderStatus }),
      });
      await fetchOrders();
    } catch (e) {
      alert("Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-sand-300 pb-5 sm:pb-6">
        <div>
          <span className="text-[10px] sm:text-xs font-bold tracking-widest uppercase text-gold-700">Order Management</span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-brand-950 mt-1">Orders & Courier Fulfillment</h1>
          <p className="text-xs text-brand-600 mt-1">Review orders, update dispatch state, and assign tracking numbers</p>
        </div>

        <a
          href="/api/orders/csv"
          className="w-full sm:w-auto text-center justify-center px-4 py-2.5 bg-brand-900 hover:bg-brand-950 text-sand-50 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-sm transition-colors"
        >
          <Download className="w-3.5 h-3.5 text-gold-400" /> Export Orders CSV
        </a>
      </div>

      <div className="bg-white rounded-2xl border border-sand-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-brand-600">Loading orders database...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-sand-50 text-brand-800 uppercase">
                <tr>
                  <th className="p-3">Order #</th>
                  <th className="p-3">Customer</th>
                  <th className="p-3">Address & City</th>
                  <th className="p-3">Method</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Courier / Tracking</th>
                  <th className="p-3 text-right">Total (PKR)</th>
                  <th className="p-3 text-center">Fulfill Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand-100">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-sand-50/60">
                    <td className="p-3 font-bold text-brand-950">
                      <Link href={`/order-confirmation/${o.orderNumber}`} target="_blank" className="hover:underline">
                        {o.orderNumber}
                      </Link>
                    </td>
                    <td className="p-3">
                      <p className="font-bold text-brand-900">{o.customerName}</p>
                      <p className="text-[11px] text-brand-500">{o.guestPhone}</p>
                    </td>
                    <td className="p-3">
                      <p className="text-brand-900 font-medium">{o.city}, {o.province}</p>
                      <p className="text-[11px] text-brand-500 truncate max-w-xs">{o.address}</p>
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded bg-sand-100 font-semibold text-[10px]">
                        {o.paymentMethod}
                      </span>
                    </td>
                    <td className="p-3">
                      <select
                        value={o.orderStatus}
                        onChange={(e) => handleUpdateStatus(o.id, e.target.value)}
                        disabled={updatingId === o.id}
                        className="bg-sand-50 border border-sand-300 rounded px-2 py-1 text-xs font-bold"
                      >
                        <option value="PENDING">PENDING</option>
                        <option value="CONFIRMED">CONFIRMED</option>
                        <option value="PACKED">PACKED</option>
                        <option value="SHIPPED">SHIPPED</option>
                        <option value="DELIVERED">DELIVERED</option>
                        <option value="CANCELLED">CANCELLED</option>
                      </select>
                    </td>
                    <td className="p-3">
                      <p className="font-medium text-brand-900">{o.courierName || "Not Assigned"}</p>
                      <p className="text-[11px] font-mono text-brand-500">{o.trackingNumber || "—"}</p>
                    </td>
                    <td className="p-3 text-right font-serif font-bold text-brand-950">
                      Rs. {o.total.toLocaleString()}
                    </td>
                    <td className="p-3 text-center">
                      <Link
                        href={`/order-confirmation/${o.orderNumber}`}
                        target="_blank"
                        className="text-gold-700 hover:text-gold-800 font-bold"
                      >
                        Slip
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
