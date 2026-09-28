"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  User, 
  Package, 
  RotateCcw, 
  Heart, 
  Shield, 
  Phone, 
  Mail, 
  ArrowRight, 
  Search, 
  CheckCircle2, 
  Clock, 
  Truck,
  ExternalLink,
  AlertCircle
} from "lucide-react";
import { useCart } from "@/context/CartContext";

interface OrderDetail {
  orderNumber: string;
  customerName: string;
  phone: string;
  email?: string | null;
  shippingAddress: string;
  city: string;
  province?: string | null;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  subtotal: number;
  shippingFee: number;
  discount: number;
  total: number;
  createdAt: string;
  courierName?: string | null;
  trackingNumber?: string | null;
  courierUrl?: string | null;
  items: Array<{
    productId: string;
    productTitle: string;
    productSlug?: string;
    variantDetails: string;
    price: number;
    quantity: number;
    total: number;
  }>;
}

export default function AccountPage() {
  const { wishlist } = useCart();
  const [activeTab, setActiveTab] = useState<"orders" | "return" | "wishlist">("orders");

  // Dynamic Customer Order Lookup State
  const [phoneInput, setPhoneInput] = useState("");
  const [orderNumberInput, setOrderNumberInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [lookupError, setLookupError] = useState("");
  const [customerOrders, setCustomerOrders] = useState<OrderDetail[]>([]);
  const [searchedCustomer, setSearchedCustomer] = useState<{ name: string; phone: string; city: string } | null>(null);

  // Return request form state
  const [returnOrderNumber, setReturnOrderNumber] = useState("");
  const [returnCustomerName, setReturnCustomerName] = useState("");
  const [returnPhone, setReturnPhone] = useState("");
  const [returnReason, setReturnReason] = useState("Fabric sizing exchange");
  const [returnNotes, setReturnNotes] = useState("");
  const [returnSubmitted, setReturnSubmitted] = useState(false);

  // Check if customer previously checked out in this browser
  useEffect(() => {
    try {
      const savedPhone = localStorage.getItem("tauheed_customer_phone");
      const savedOrder = localStorage.getItem("tauheed_last_order_number");
      if (savedPhone) {
        setPhoneInput(savedPhone);
        setReturnPhone(savedPhone);
      }
      if (savedOrder) {
        setOrderNumberInput(savedOrder);
        setReturnOrderNumber(savedOrder);
        // Auto lookup if credentials present
        if (savedPhone) {
          lookupCustomerOrders(savedOrder, savedPhone);
        }
      }
    } catch {
      // ignore
    }
  }, []);

  const lookupCustomerOrders = async (orderNum: string, phone: string) => {
    if (!orderNum.trim() || !phone.trim()) {
      setLookupError("Please provide both your Order Number and registered mobile number.");
      return;
    }

    setIsLoading(true);
    setLookupError("");

    try {
      const res = await fetch(`/api/orders/track?orderNumber=${encodeURIComponent(orderNum.trim())}&phone=${encodeURIComponent(phone.trim())}`);
      const data = await res.json();

      if (!res.ok || !data.order) {
        setLookupError(data.error || "No order found matching those details. Please double-check your order number.");
        setCustomerOrders([]);
        setSearchedCustomer(null);
      } else {
        const ord: OrderDetail = data.order;
        setCustomerOrders([ord]);
        setSearchedCustomer({
          name: ord.customerName,
          phone: ord.phone,
          city: ord.city,
        });
        try {
          localStorage.setItem("tauheed_customer_phone", phone.trim());
          localStorage.setItem("tauheed_last_order_number", orderNum.trim());
        } catch {
          // ignore
        }
      }
    } catch (err: any) {
      setLookupError("Failed to connect to order server. Please check your network connection.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    lookupCustomerOrders(orderNumberInput, phoneInput);
  };

  const handleReturnSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setReturnSubmitted(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status.toUpperCase()) {
      case "DELIVERED":
        return "bg-emerald-100 text-emerald-800 border-emerald-300";
      case "DISPATCHED":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "CONFIRMED":
        return "bg-amber-100 text-amber-800 border-amber-300";
      case "CANCELLED":
        return "bg-rose-100 text-rose-800 border-rose-300";
      default:
        return "bg-sand-100 text-brand-800 border-sand-300";
    }
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
            Track real-time orders, initiate 7-day exchanges, and manage saved wishlist ensembles
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 p-1 bg-sand-200/80 rounded-xl">
          <button
            onClick={() => setActiveTab("orders")}
            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === "orders" ? "bg-brand-900 text-sand-50 shadow" : "text-brand-800 hover:text-brand-950"
            }`}
          >
            Order History
          </button>
          <button
            onClick={() => setActiveTab("return")}
            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === "return" ? "bg-brand-900 text-sand-50 shadow" : "text-brand-800 hover:text-brand-950"
            }`}
          >
            7-Day Returns
          </button>
          <button
            onClick={() => setActiveTab("wishlist")}
            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === "wishlist" ? "bg-brand-900 text-sand-50 shadow" : "text-brand-800 hover:text-brand-950"
            }`}
          >
            Wishlist ({wishlist.length})
          </button>
        </div>
      </div>

      {/* Tab 1: Dynamic Orders Lookup */}
      {activeTab === "orders" && (
        <div className="space-y-6">
          {/* Customer Profile Card if searched */}
          {searchedCustomer && (
            <div className="p-6 bg-white rounded-2xl border border-sand-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-sand-100 flex items-center justify-center text-gold-700 font-bold text-lg">
                  {searchedCustomer.name ? searchedCustomer.name.charAt(0).toUpperCase() : <User className="w-6 h-6" />}
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-brand-950">
                    {searchedCustomer.name} (Verified Client)
                  </h3>
                  <p className="text-xs text-brand-600">
                    {searchedCustomer.phone} • {searchedCustomer.city}
                  </p>
                </div>
              </div>
              <Link
                href="/track-order"
                className="px-4 py-2 bg-sand-100 hover:bg-sand-200 text-brand-900 rounded-lg text-xs font-bold uppercase transition-colors"
              >
                Track by Courier #
              </Link>
            </div>
          )}

          {/* Interactive Lookup Search Form */}
          <div className="bg-white rounded-2xl border border-sand-200 p-6 shadow-sm">
            <h3 className="font-serif font-bold text-base text-brand-950 mb-2">
              Find Your Order History
            </h3>
            <p className="text-xs text-brand-600 mb-4">
              Enter your Order Number and registered mobile number to view live order status and courier dispatches:
            </p>

            <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-brand-900 uppercase mb-1">
                  Order Number
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. TT-2026-123456"
                  value={orderNumberInput}
                  onChange={(e) => setOrderNumberInput(e.target.value)}
                  className="w-full text-xs p-3 border border-sand-300 rounded-xl bg-sand-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-gold-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-brand-900 uppercase mb-1">
                  Registered Mobile Number
                </label>
                <input
                  type="tel"
                  required
                  placeholder="03400262732"
                  value={phoneInput}
                  onChange={(e) => setPhoneInput(e.target.value)}
                  className="w-full text-xs p-3 border border-sand-300 rounded-xl bg-sand-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-gold-500"
                />
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-4 bg-brand-900 hover:bg-brand-950 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  <Search className="w-4 h-4" />
                  <span>{isLoading ? "Searching..." : "Lookup Orders"}</span>
                </button>
              </div>
            </form>

            {lookupError && (
              <div className="mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{lookupError}</span>
              </div>
            )}
          </div>

          {/* Dynamic Recent Orders View */}
          {customerOrders.length > 0 ? (
            <div className="bg-white rounded-2xl border border-sand-200 shadow-sm overflow-hidden">
              <div className="p-4 bg-sand-50 border-b border-sand-200 flex items-center justify-between">
                <h4 className="font-serif font-bold text-sm text-brand-950">Matching Order Records</h4>
                <span className="text-[11px] text-brand-600 font-semibold">{customerOrders.length} Order Found</span>
              </div>

              <div className="divide-y divide-sand-200 text-xs">
                {customerOrders.map((ord) => (
                  <div key={ord.orderNumber} className="p-6 space-y-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-brand-950 text-sm">#{ord.orderNumber}</span>
                          <span className={`px-2.5 py-0.5 rounded font-black text-[10px] uppercase border ${getStatusBadge(ord.orderStatus)}`}>
                            {ord.orderStatus}
                          </span>
                          {ord.courierName && (
                            <span className="text-[10px] text-brand-600 bg-sand-100 px-2 py-0.5 rounded font-medium">
                              via {ord.courierName}
                            </span>
                          )}
                        </div>
                        <p className="text-brand-600 text-xs mt-1">
                          Payment: <strong>{ord.paymentMethod}</strong> ({ord.paymentStatus}) • Placed on {new Date(ord.createdAt).toLocaleDateString("en-PK", { dateStyle: "medium" })}
                        </p>
                      </div>

                      <div className="text-left sm:text-right">
                        <p className="font-serif font-bold text-base text-brand-950">Rs. {ord.total.toLocaleString()}</p>
                        <Link
                          href={`/order-confirmation/${ord.orderNumber}`}
                          className="text-gold-700 hover:text-gold-800 font-bold inline-flex items-center gap-1 mt-1 text-xs"
                        >
                          <span>View Official Invoice</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>

                    {/* Order Items List */}
                    <div className="bg-sand-50/80 rounded-xl p-3 border border-sand-200 space-y-2">
                      <p className="font-bold text-[11px] text-brand-900 uppercase tracking-wider">Ordered Articles:</p>
                      {ord.items.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between text-xs">
                          <div>
                            <span className="font-semibold text-brand-950">{item.quantity}x {item.productTitle}</span>
                            <span className="text-[11px] text-brand-600 ml-2">({item.variantDetails})</span>
                          </div>
                          <span className="font-medium text-brand-900">Rs. {item.total.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>

                    {/* Courier Tracking Dispatch Information */}
                    {ord.trackingNumber && (
                      <div className="flex items-center justify-between p-3 rounded-xl bg-blue-50/70 border border-blue-200 text-xs text-blue-900">
                        <div className="flex items-center gap-2">
                          <Truck className="w-4 h-4 text-blue-700" />
                          <span>Consignment Tracking: <strong>{ord.trackingNumber}</strong></span>
                        </div>
                        {ord.courierUrl && (
                          <a
                            href={ord.courierUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-bold underline text-blue-800 hover:text-blue-950 flex items-center gap-1"
                          >
                            <span>Live Tracking</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-2xl border border-sand-200 p-6 space-y-3">
              <Package className="w-10 h-10 text-sand-400 mx-auto" />
              <h4 className="font-serif font-bold text-base text-brand-950">No Past Orders Loaded Yet</h4>
              <p className="text-xs text-brand-600 max-w-md mx-auto">
                Use the search box above with your registered order number to view your real-time status, tracking numbers, and digital invoices.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: 7-Day Returns & Exchanges */}
      {activeTab === "return" && (
        <div className="max-w-2xl mx-auto bg-white p-6 sm:p-8 rounded-2xl border border-sand-200 shadow-sm space-y-6">
          <div>
            <h3 className="font-serif font-bold text-xl text-brand-950">Initiate Return or Size Exchange</h3>
            <p className="text-xs text-brand-600 mt-1">
              Tauheed Textile offers a seamless 7-day replacement policy for fabric defects, stitching adjustments, or size exchanges.
            </p>
          </div>

          {returnSubmitted ? (
            <div className="p-5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <p className="font-bold text-sm">Return Request Received Successfully!</p>
              </div>
              <p>
                Our studio concierge has received your request for Order #{returnOrderNumber}. A customer care executive will contact you on WhatsApp ({returnPhone}) to arrange reverse courier pickup within 48 hours.
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setReturnSubmitted(false)}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold uppercase transition-colors"
                >
                  Submit Another Request
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleReturnSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-brand-900 mb-1">Order Number *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. TT-2026-123456"
                  value={returnOrderNumber}
                  onChange={(e) => setReturnOrderNumber(e.target.value)}
                  className="w-full text-xs p-3 border border-sand-300 rounded-xl bg-sand-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-gold-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-900 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="Your Full Name"
                  value={returnCustomerName}
                  onChange={(e) => setReturnCustomerName(e.target.value)}
                  className="w-full text-xs p-3 border border-sand-300 rounded-xl bg-sand-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-gold-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-900 mb-1">Mobile / WhatsApp Number *</label>
                <input
                  type="tel"
                  required
                  placeholder="03400262732"
                  value={returnPhone}
                  onChange={(e) => setReturnPhone(e.target.value)}
                  className="w-full text-xs p-3 border border-sand-300 rounded-xl bg-sand-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-gold-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-900 mb-1">Reason for Return / Exchange</label>
                <select
                  value={returnReason}
                  onChange={(e) => setReturnReason(e.target.value)}
                  className="w-full text-xs p-3 border border-sand-300 rounded-xl bg-sand-50 font-medium focus:bg-white focus:outline-none"
                >
                  <option value="Fabric sizing exchange">Size too small / large (Exchange requested)</option>
                  <option value="Defective embroidery or weave">Fabric flaw or embroidery defect</option>
                  <option value="Wrong article dispatched">Incorrect color or article received</option>
                  <option value="Change of mind">Other / Store credit exchange</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-900 mb-1">Additional Notes</label>
                <textarea
                  rows={3}
                  placeholder="Please describe the issue or required size exchange..."
                  value={returnNotes}
                  onChange={(e) => setReturnNotes(e.target.value)}
                  className="w-full text-xs p-3 border border-sand-300 rounded-xl bg-sand-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-gold-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-brand-900 hover:bg-brand-950 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow cursor-pointer"
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
                className="inline-block mt-2 px-6 py-2.5 bg-brand-900 text-white rounded-lg text-xs font-bold uppercase transition-colors"
              >
                Browse Shop
              </Link>
            </div>
          ) : (
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-sand-200 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif font-bold text-lg text-brand-950">Saved Wishlist Ensembles</h3>
                  <p className="text-xs text-brand-600">You have {wishlist.length} item(s) saved in this session.</p>
                </div>
                <Link 
                  href="/shop" 
                  className="text-xs font-bold px-4 py-2 bg-sand-100 hover:bg-sand-200 text-brand-950 rounded-lg uppercase transition-colors"
                >
                  Explore Collections &rarr;
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
