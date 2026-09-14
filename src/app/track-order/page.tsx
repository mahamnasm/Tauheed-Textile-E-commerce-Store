"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, Truck, MapPin, Clock, ShieldCheck, Phone } from "lucide-react";

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [orderData, setOrderData] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setOrderData(null);
    setLoading(true);

    try {
      const res = await fetch(`/api/orders/track?orderNumber=${encodeURIComponent(orderNumber.trim())}&phone=${encodeURIComponent(phone.trim())}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Order not found. Please verify your order number and mobile number.");
      }

      setOrderData(data.order);
    } catch (err: any) {
      setError(err.message || "Failed to find order.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
      <div className="text-center max-w-xl mx-auto mb-10">
        <span className="text-xs font-bold tracking-widest uppercase text-gold-700">TCS • Trax • Leopards</span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-brand-950 mt-1">
          Track Your Order
        </h1>
        <p className="text-xs text-brand-600 mt-2">
          Enter your Order Number (e.g. TT-2026-1001) and registered mobile number to track parcel dispatch and live courier status.
        </p>
      </div>

      {/* Tracking Form */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-sand-200 shadow-xl mb-10">
        <form onSubmit={handleTrack} className="grid grid-cols-1 sm:grid-cols-12 gap-4">
          <div className="sm:col-span-5">
            <label className="block text-xs font-bold text-brand-900 mb-1">
              Order Number *
            </label>
            <input
              type="text"
              required
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              placeholder="e.g. TT-2026-1001"
              className="w-full text-xs p-3.5 border border-sand-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-gold-500 bg-sand-50/50 uppercase"
            />
          </div>

          <div className="sm:col-span-5">
            <label className="block text-xs font-bold text-brand-900 mb-1">
              Registered Mobile Number *
            </label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="03219876543"
              className="w-full text-xs p-3.5 border border-sand-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-gold-500 bg-sand-50/50"
            />
          </div>

          <div className="sm:col-span-2 flex items-end">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-brand-900 hover:bg-brand-950 text-sand-50 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-1"
            >
              {loading ? "Tracking..." : <><Search className="w-4 h-4" /> Track</>}
            </button>
          </div>
        </form>

        {error && (
          <div className="mt-4 p-3.5 rounded-xl bg-maroon-50 border border-maroon-200 text-maroon-800 text-xs">
            {error}
          </div>
        )}
      </div>

      {/* Order Status Display */}
      {orderData && (
        <div className="bg-white rounded-3xl border border-sand-200 shadow-xl p-6 sm:p-8 space-y-8 animate-fadeIn">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-sand-200 pb-6">
            <div>
              <span className="text-xs text-brand-500 uppercase tracking-widest font-semibold">Order Found</span>
              <h2 className="font-serif text-2xl font-bold text-brand-950">
                #{orderData.orderNumber}
              </h2>
              <p className="text-xs text-brand-600 mt-0.5">Placed on {new Date(orderData.createdAt).toLocaleDateString("en-PK")}</p>
            </div>

            <div className="text-left sm:text-right">
              <span className="inline-block px-3 py-1 bg-gold-100 text-gold-900 border border-gold-300 rounded-full text-xs font-bold uppercase">
                Status: {orderData.orderStatus}
              </span>
              <p className="text-xs text-brand-600 mt-1">Payment: {orderData.paymentMethod} ({orderData.paymentStatus})</p>
            </div>
          </div>

          {/* Courier Dispatch Card */}
          {orderData.trackingNumber ? (
            <div className="p-5 rounded-2xl bg-sand-100 border border-sand-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-gold-800 uppercase">Courier Dispatch Active</span>
                <h4 className="font-serif font-bold text-base text-brand-950 mt-0.5">
                  {orderData.courierName || "TCS / Trax"} Tracking: {orderData.trackingNumber}
                </h4>
                <p className="text-xs text-brand-600 mt-1">
                  Estimated Delivery: 2-3 Business Days
                </p>
              </div>

              {orderData.courierUrl && (
                <a
                  href={orderData.courierUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 bg-brand-900 hover:bg-brand-950 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shrink-0"
                >
                  Live Courier Portal
                </a>
              )}
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-sand-100 text-xs text-brand-700">
              <p className="font-bold text-brand-950">Preparing for Courier Handover</p>
              <p className="text-[11px] text-brand-600 mt-0.5">
                Our warehouse team is conducting final quality inspections. Tracking number will be generated upon dispatch.
              </p>
            </div>
          )}

          {/* Items Preview */}
          <div>
            <h4 className="font-serif font-bold text-sm text-brand-950 mb-3">Parcel Items</h4>
            <div className="divide-y divide-sand-200 border border-sand-200 rounded-xl overflow-hidden">
              {orderData.items?.map((item: any) => (
                <div key={item.id} className="p-3.5 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-brand-950">{item.product?.title || "Luxury Piece"}</p>
                    <p className="text-[11px] text-brand-500">{item.variantDetails} (Qty: {item.quantity})</p>
                  </div>
                  <span className="font-serif font-bold text-brand-900">
                    Rs. {item.total.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
