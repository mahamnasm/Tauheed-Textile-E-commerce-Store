"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Search, 
  Truck, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  Package, 
  ExternalLink,
  PhoneCall,
  AlertCircle
} from "lucide-react";

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
      const res = await fetch(
        `/api/orders/track?orderNumber=${encodeURIComponent(orderNumber.trim())}&phone=${encodeURIComponent(phone.trim())}`
      );
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

  const getCourierDirectUrl = (courierName: string = "", trackingNumber: string = "") => {
    const courier = courierName.toLowerCase();
    const cleanNum = trackingNumber.trim();
    if (courier.includes("leopard")) {
      return `https://www.leopardscourier.com/tracking?track_numbers=${cleanNum}`;
    }
    if (courier.includes("trax")) {
      return `https://sonic.trax.pk/tracking?tracking_number=${cleanNum}`;
    }
    // Default TCS
    return `https://www.tcsexpress.com/tracking?consignmentNo=${cleanNum}`;
  };

  const getCourierHelpline = (courierName: string = "") => {
    const courier = courierName.toLowerCase();
    if (courier.includes("leopard")) return "(021) 111-300-786";
    if (courier.includes("trax")) return "(021) 111-118-729";
    return "(021) 111-123-456"; // TCS
  };

  // Stepper milestones
  const getMilestoneIndex = (status: string = "") => {
    const s = status.toUpperCase();
    if (s === "DELIVERED") return 4;
    if (s === "OUT_FOR_DELIVERY" || s === "DISPATCHED") return 3;
    if (s === "IN_TRANSIT" || s === "PROCESSING") return 2;
    if (s === "CONFIRMED" || s === "PENDING") return 1;
    return 1;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
      <div className="text-center max-w-xl mx-auto mb-10">
        <span className="text-xs font-bold tracking-widest uppercase text-[#7A6652]">
          Courier Delivery Portal
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#171717] mt-1">
          Track Your Consignment
        </h1>
        <p className="text-xs text-[#6B6259] mt-2">
          Enter your Order Number (e.g. TT-2026-1001) and registered mobile number to check dispatch status and live courier tracking.
        </p>
      </div>

      {/* Tracking Form */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E7E1D8] shadow-sm mb-10">
        <form onSubmit={handleTrack} className="grid grid-cols-1 sm:grid-cols-12 gap-4">
          <div className="sm:col-span-5">
            <label className="block text-xs font-bold text-[#171717] mb-1">
              Order Number *
            </label>
            <input
              type="text"
              required
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              placeholder="e.g. TT-2026-1001"
              className="w-full text-xs p-3.5 border border-[#E7E1D8] rounded-xl focus:outline-none focus:border-[#7A6652] bg-[#F8F5F0] uppercase"
            />
          </div>

          <div className="sm:col-span-5">
            <label className="block text-xs font-bold text-[#171717] mb-1">
              Registered Mobile Number *
            </label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="03400262732"
              className="w-full text-xs p-3.5 border border-[#E7E1D8] rounded-xl focus:outline-none focus:border-[#7A6652] bg-[#F8F5F0]"
            />
          </div>

          <div className="sm:col-span-2 flex items-end">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-[#171717] hover:bg-black text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-sm flex items-center justify-center gap-1"
            >
              {loading ? "Tracking..." : <><Search className="w-4 h-4" /> Track</>}
            </button>
          </div>
        </form>

        {error && (
          <div className="mt-4 p-3.5 rounded-xl bg-[#FDF2F2] border border-[#F2BDBD] text-[#9B3D3D] text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Order Status Display */}
      {orderData && (
        <div className="bg-white rounded-3xl border border-[#E7E1D8] shadow-sm p-6 sm:p-8 space-y-8 animate-fadeIn">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#E7E1D8] pb-6">
            <div>
              <span className="text-xs text-[#7A6652] uppercase tracking-widest font-semibold">
                Order Verified
              </span>
              <h2 className="font-serif text-2xl font-bold text-[#171717]">
                #{orderData.orderNumber}
              </h2>
              <p className="text-xs text-[#6B6259] mt-0.5">
                Booked on {new Date(orderData.createdAt).toLocaleDateString("en-PK")} for {orderData.customerName}
              </p>
            </div>

            <div className="text-left sm:text-right">
              <span className="inline-block px-3 py-1 bg-[#F0EBE3] text-[#171717] border border-[#E7E1D8] rounded-full text-xs font-bold uppercase">
                Status: {orderData.orderStatus}
              </span>
              <p className="text-xs text-[#6B6259] mt-1">
                Payment: {orderData.paymentMethod} ({orderData.paymentStatus})
              </p>
            </div>
          </div>

          {/* Shipment Milestones Progress */}
          <div className="space-y-4">
            <h4 className="font-serif font-bold text-sm text-[#171717]">Shipment Milestones</h4>
            <div className="grid grid-cols-4 gap-2 sm:gap-4 relative text-center">
              {[
                { label: "Booked", sub: "Order placed" },
                { label: "Packed", sub: "QC passed" },
                { label: "In Transit", sub: "Courier Hub" },
                { label: "Delivered", sub: "Doorstep" },
              ].map((step, idx) => {
                const currentMilestone = getMilestoneIndex(orderData.orderStatus);
                const isCompleted = currentMilestone >= idx + 1;
                const isCurrent = currentMilestone === idx + 1;
                return (
                  <div key={idx} className="space-y-2">
                    <div
                      className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                        isCompleted
                          ? "bg-[#1A6B3C] text-white"
                          : "bg-[#F0EBE3] text-[#6B6259] border border-[#E7E1D8]"
                      }`}
                    >
                      {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                    </div>
                    <p className={`text-xs font-bold ${isCurrent ? "text-[#171717]" : "text-[#6B6259]"}`}>
                      {step.label}
                    </p>
                    <p className="text-[10px] text-[#9B9289] hidden sm:block">{step.sub}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Courier Dispatch Card */}
          {orderData.trackingNumber ? (
            <div className="p-5 rounded-2xl bg-[#F8F5F0] border border-[#E7E1D8] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-[#7A6652] uppercase flex items-center gap-1.5">
                  <Truck className="w-4 h-4" /> Consignment Dispatched
                </span>
                <h4 className="font-serif font-bold text-base text-[#171717] mt-1">
                  Courier: {orderData.courierName || "Courier Express"} — #{orderData.trackingNumber}
                </h4>
                <p className="text-xs text-[#6B6259] mt-0.5">
                  Destination: {orderData.city}, {orderData.province || "Pakistan"}
                </p>
                <div className="flex items-center gap-1.5 text-xs text-[#7A6652] mt-2">
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Courier Helpline: {getCourierHelpline(orderData.courierName)}</span>
                </div>
              </div>

              <a
                href={orderData.courierUrl || getCourierDirectUrl(orderData.courierName, orderData.trackingNumber)}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 bg-[#171717] hover:bg-black text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors inline-flex items-center gap-1.5 shrink-0 shadow-sm"
              >
                <span>Track on Courier Portal</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          ) : (
            <div className="p-5 rounded-2xl bg-[#F8F5F0] border border-[#E7E1D8] text-xs text-[#6B6259] space-y-1">
              <p className="font-bold text-[#171717]">Preparing for Dispatch</p>
              <p>
                Our warehouse team is conducting quality assurance packaging. Your official courier tracking number and live consignment tracking link will be generated once handed over to the rider.
              </p>
            </div>
          )}

          {/* Items Preview */}
          <div>
            <h4 className="font-serif font-bold text-sm text-[#171717] mb-3">Parcel Contents</h4>
            <div className="divide-y divide-[#E7E1D8] border border-[#E7E1D8] rounded-2xl overflow-hidden bg-white">
              {orderData.items?.map((item: any) => (
                <div key={item.id} className="p-4 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-[#171717]">{item.product?.title || "Tauheed Textile Luxury Ensemble"}</p>
                    <p className="text-[11px] text-[#6B6259]">{item.variantDetails} (Qty: {item.quantity})</p>
                  </div>
                  <span className="font-serif font-bold text-[#171717]">
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
