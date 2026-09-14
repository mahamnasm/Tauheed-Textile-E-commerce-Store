"use client";

import React, { useState } from "react";
import Link from "next/link";
import { User, Package, RotateCcw, Heart, Shield, Phone, Mail, ArrowRight } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function AccountPage() {
  const { wishlist } = useCart();
  const [activeTab, setActiveTab] = useState<"orders" | "return" | "wishlist">("orders");

  // Sample return request form state
  const [returnOrderNumber, setReturnOrderNumber] = useState("");
  const [returnCustomerName, setReturnCustomerName] = useState("");
  const [returnPhone, setReturnPhone] = useState("");
  const [returnReason, setReturnReason] = useState("Fabric sizing exchange");
  const [returnSubmitted, setReturnSubmitted] = useState(false);

  const handleReturnSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setReturnSubmitted(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-sand-200 pb-6 mb-8">
        <div>
          <span className="text-xs font-bold tracking-widest uppercase text-gold-700">Client Portal</span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-brand-950 mt-1">
            My Account & Orders
          </h1>
          <p className="text-xs text-brand-600 mt-1">
            View orders, initiate 7-day exchanges, and manage saved wishlist ensembles
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 p-1 bg-sand-200/80 rounded-xl">
          <button
            onClick={() => setActiveTab("orders")}
            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
              activeTab === "orders" ? "bg-brand-900 text-sand-50 shadow" : "text-brand-800 hover:text-brand-950"
            }`}
          >
            Order History
          </button>
          <button
            onClick={() => setActiveTab("return")}
            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
              activeTab === "return" ? "bg-brand-900 text-sand-50 shadow" : "text-brand-800 hover:text-brand-950"
            }`}
          >
            7-Day Returns
          </button>
          <button
            onClick={() => setActiveTab("wishlist")}
            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
              activeTab === "wishlist" ? "bg-brand-900 text-sand-50 shadow" : "text-brand-800 hover:text-brand-950"
            }`}
          >
            Wishlist ({wishlist.length})
          </button>
        </div>
      </div>

      {/* Tab 1: Orders */}
      {activeTab === "orders" && (
        <div className="space-y-6">
          <div className="p-6 bg-white rounded-2xl border border-sand-200 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-sand-100 flex items-center justify-center text-gold-700">
                <User className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-base text-brand-950">Sara Khan (VIP Client)</h3>
                <p className="text-xs text-brand-600">0321-9876543 • Lahore, Punjab</p>
              </div>
            </div>
            <Link
              href="/track-order"
              className="px-4 py-2 bg-sand-100 hover:bg-sand-200 text-brand-900 rounded-lg text-xs font-bold uppercase transition-colors"
            >
              Track by Courier #
            </Link>
          </div>

          <div className="bg-white rounded-2xl border border-sand-200 shadow-sm overflow-hidden">
            <div className="p-4 bg-sand-50 border-b border-sand-200">
              <h4 className="font-serif font-bold text-sm text-brand-950">Recent Past Orders</h4>
            </div>

            <div className="divide-y divide-sand-200 text-xs">
              <div className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-brand-950 text-sm">#TT-2026-1001</span>
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-semibold text-[10px]">
                      CONFIRMED (Trax Courier)
                    </span>
                  </div>
                  <p className="text-brand-600 mt-1">1x Gul-e-Noor Luxury Lawn 3-Piece (Stitched - Small)</p>
                  <p className="text-brand-500 text-[11px] mt-0.5">Tracking: TRX-94820194 • Cash on Delivery</p>
                </div>
                <div className="text-left sm:text-right">
                  <p className="font-serif font-bold text-sm text-brand-950">Rs. 11,950</p>
                  <Link
                    href="/order-confirmation/TT-2026-1001"
                    className="text-gold-700 hover:text-gold-800 font-bold inline-block mt-1"
                  >
                    View Receipt &rarr;
                  </Link>
                </div>
              </div>

              <div className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-brand-950 text-sm">#TT-2026-1002</span>
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded font-semibold text-[10px]">
                      PACKED (TCS Courier)
                    </span>
                  </div>
                  <p className="text-brand-600 mt-1">1x Meher Ivory Raw Silk Co-ord Set (Stitched - Medium)</p>
                  <p className="text-brand-500 text-[11px] mt-0.5">Meezan Bank Transfer (Verified)</p>
                </div>
                <div className="text-left sm:text-right">
                  <p className="font-serif font-bold text-sm text-brand-950">Rs. 7,490</p>
                  <Link
                    href="/order-confirmation/TT-2026-1002"
                    className="text-gold-700 hover:text-gold-800 font-bold inline-block mt-1"
                  >
                    View Receipt &rarr;
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: 7-Day Returns & Exchanges */}
      {activeTab === "return" && (
        <div className="max-w-2xl mx-auto bg-white p-6 sm:p-8 rounded-2xl border border-sand-200 shadow-sm space-y-6">
          <div>
            <h3 className="font-serif font-bold text-xl text-brand-950">Initiate Return or Size Exchange</h3>
            <p className="text-xs text-brand-600 mt-1">
              Tauheed Textile offers a seamless 7-day hassle-free replacement policy for defective fabrics, wrong stitching, or size exchanges.
            </p>
          </div>

          {returnSubmitted ? (
            <div className="p-5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs space-y-2">
              <p className="font-bold text-sm">Return Request Received!</p>
              <p>
                Our customer service team has logged your request for Order #{returnOrderNumber}. A rider will be scheduled for reverse pick-up or exchange inspection within 48 hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleReturnSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-brand-900 mb-1">Order Number *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. TT-2026-1001"
                  value={returnOrderNumber}
                  onChange={(e) => setReturnOrderNumber(e.target.value)}
                  className="w-full text-xs p-3 border border-sand-300 rounded-xl bg-sand-50"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-900 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="Your Name"
                  value={returnCustomerName}
                  onChange={(e) => setReturnCustomerName(e.target.value)}
                  className="w-full text-xs p-3 border border-sand-300 rounded-xl bg-sand-50"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-900 mb-1">Mobile Number *</label>
                <input
                  type="tel"
                  required
                  placeholder="03400262732"
                  value={returnPhone}
                  onChange={(e) => setReturnPhone(e.target.value)}
                  className="w-full text-xs p-3 border border-sand-300 rounded-xl bg-sand-50"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-900 mb-1">Reason for Return / Exchange</label>
                <select
                  value={returnReason}
                  onChange={(e) => setReturnReason(e.target.value)}
                  className="w-full text-xs p-3 border border-sand-300 rounded-xl bg-sand-50 font-medium"
                >
                  <option value="Fabric sizing exchange">Size too small / large (Exchange requested)</option>
                  <option value="Defective embroidery or weave">Fabric flaw or embroidery defect</option>
                  <option value="Wrong article dispatched">Incorrect color or article received</option>
                  <option value="Change of mind">Other / Store credit</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-brand-900 hover:bg-brand-950 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow"
              >
                Submit Return Request
              </button>
            </form>
          )}
        </div>
      )}

      {/* Tab 3: Wishlist */}
      {activeTab === "wishlist" && (
        <div>
          {wishlist.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-sand-200 p-6 space-y-3">
              <Heart className="w-10 h-10 text-sand-400 mx-auto" />
              <h3 className="font-serif font-bold text-lg text-brand-950">Your Wishlist is Empty</h3>
              <p className="text-xs text-brand-600">Save articles you adore by clicking the heart icon on any product.</p>
              <Link
                href="/shop"
                className="inline-block mt-2 px-6 py-2.5 bg-brand-900 text-white rounded-lg text-xs font-bold uppercase"
              >
                Browse Shop
              </Link>
            </div>
          ) : (
            <div className="bg-white p-6 rounded-2xl border border-sand-200">
              <p className="text-xs text-brand-600 mb-4">You have {wishlist.length} item(s) saved to your wishlist.</p>
              <Link href="/shop" className="text-xs font-bold text-gold-700 hover:text-gold-800 uppercase">
                Browse More in Store &rarr;
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
