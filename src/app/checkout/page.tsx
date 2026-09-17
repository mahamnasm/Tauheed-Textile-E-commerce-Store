"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { 
  ShieldCheck, 
  Truck, 
  Building2, 
  Smartphone, 
  Lock, 
  CheckCircle2,
  Package,
  Clock,
  Sparkles,
  Info,
  UploadCloud,
  FileCheck,
  AlertCircle,
  Eye,
  Trash2,
  Copy,
  Check,
  Camera
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { PAKISTAN_CITIES } from "@/lib/pakistan-data";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, cartSubtotal, clearCart } = useCart();

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [nearestLandmark, setNearestLandmark] = useState("");
  const [city, setCity] = useState("Karachi");
  const [province, setProvince] = useState("Sindh");
  const [postalCode, setPostalCode] = useState("");
  const [notes, setNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "BANK_TRANSFER" | "JAZZCASH" | "EASYPAISA">("COD");

  // Advance Payment Proof state
  const [bankName, setBankName] = useState("Meezan Bank Ltd");
  const [transactionRef, setTransactionRef] = useState("");
  const [receiptUrl, setReceiptUrl] = useState("");
  const [receiptFileName, setReceiptFileName] = useState("");
  const [isUploadingReceipt, setIsUploadingReceipt] = useState(false);
  const [receiptError, setReceiptError] = useState("");
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Coupon code
  const [couponCode, setCouponCode] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponMessage, setCouponMessage] = useState("");
  const [isVerifyingCoupon, setIsVerifyingCoupon] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Total weight calculation (default 1.0kg per suit)
  const totalWeight = cart.reduce((acc, item: any) => {
    const itemWeight = typeof item.weight === "number" && item.weight > 0 ? item.weight : 1.0;
    return acc + itemWeight * (item.quantity || 1);
  }, 0);

  const FREE_SHIPPING_THRESHOLD = 10000;
  const isFreeShipping = cartSubtotal >= FREE_SHIPPING_THRESHOLD;

  // Weight-based shipping rules:
  // If order >= 10k: Free delivery (0)
  // If order < 10k: Gross delivery depends on weight, minus maximum Rs. 200 delivery subsidy discount!
  let grossShippingFee = 0;
  let deliveryDiscount = 0;
  let shippingFee = 0;

  if (isFreeShipping) {
    grossShippingFee = 0;
    deliveryDiscount = 0;
    shippingFee = 0;
  } else {
    if (city.toLowerCase() === "karachi") {
      grossShippingFee = 350;
    } else {
      if (totalWeight <= 1.0) {
        grossShippingFee = 350;
      } else if (totalWeight <= 3.0) {
        grossShippingFee = 450;
      } else if (totalWeight <= 5.0) {
        grossShippingFee = 550;
      } else {
        grossShippingFee = 550 + Math.ceil(totalWeight - 5.0) * 100;
      }
    }
    // Maximum Rs. 200 discount on delivery (subsidized for customers)
    deliveryDiscount = Math.min(200, grossShippingFee);
    shippingFee = Math.max(0, grossShippingFee - deliveryDiscount);
  }

  // Payment method calculations:
  // COD: 4% service tax applied
  // Advance payment: 4% tax waived + Flat 5% Off applied
  const isAdvancePayment = paymentMethod === "BANK_TRANSFER" || paymentMethod === "JAZZCASH" || paymentMethod === "EASYPAISA";
  const codTax = paymentMethod === "COD" ? Math.round(cartSubtotal * 0.04) : 0;
  const advanceDiscount = isAdvancePayment ? Math.round(cartSubtotal * 0.05) : 0;
  const totalDiscount = discountAmount + advanceDiscount;
  const grandTotal = Math.max(0, cartSubtotal + shippingFee + codTax - totalDiscount);

  // Delivery timelines
  const getTimeline = () => {
    if (city.toLowerCase() === "karachi") {
      return "Same-Day to 1-2 Working Days";
    }
    if (["lahore", "islamabad", "rawalpindi", "faisalabad", "multan", "peshawar", "sialkot", "gujranwala"].includes(city.toLowerCase())) {
      return "4-5 Working Days";
    }
    return "5-7 Working Days";
  };

  // Handle City Change and auto-set Province
  const handleCityChange = (cityName: string) => {
    setCity(cityName);
    const found = PAKISTAN_CITIES.find((c) => c.name.toLowerCase() === cityName.toLowerCase());
    if (found) {
      setProvince(found.province);
    }
  };

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    setIsVerifyingCoupon(true);
    setCouponMessage("");
    try {
      const res = await fetch("/api/coupons/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponCode, subtotal: cartSubtotal }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setDiscountAmount(0);
        setCouponApplied(false);
        alert(data.error || "Invalid discount code.");
        return;
      }
      setDiscountAmount(data.discountAmount);
      setCouponApplied(true);
      setCouponMessage(data.message || "Coupon applied successfully!");
    } catch {
      alert("Failed to verify discount code. Please check your connection.");
    } finally {
      setIsVerifyingCoupon(false);
    }
  };

  const handleReceiptUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 12 * 1024 * 1024) {
      setReceiptError("Screenshot is larger than 12MB. Please choose a smaller photo.");
      return;
    }

    setIsUploadingReceipt(true);
    setReceiptError("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/orders/upload-receipt", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to upload receipt screenshot");
      }

      setReceiptUrl(data.url);
      setReceiptFileName(file.name);
      setErrorMessage("");
    } catch (err: any) {
      console.error("Receipt upload error:", err);
      setReceiptError(err.message || "Failed to upload receipt screenshot.");
    } finally {
      setIsUploadingReceipt(false);
    }
  };

  const copyToClipboard = (text: string, field: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    }
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    // Validate phone number (Pakistani 03XX format)
    const cleanPhone = customerPhone.replace(/\D/g, "");
    if (!cleanPhone.startsWith("03") || cleanPhone.length !== 11) {
      setErrorMessage("Please enter a valid 11-digit Pakistani mobile number starting with 03 (e.g., 03400262732)");
      return;
    }

    if (!shippingAddress.trim()) {
      setErrorMessage("Please enter complete street address");
      return;
    }

    // MANDATORY VALIDATION: For Advance Payment, receipt/screenshot MUST be provided
    const isAdvancePayment = ["BANK_TRANSFER", "JAZZCASH", "EASYPAISA"].includes(paymentMethod);
    if (isAdvancePayment && !receiptUrl) {
      setErrorMessage("Please attach or upload your payment receipt / transfer screenshot before confirming your order.");
      const el = document.getElementById("receipt-upload-section");
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        customerName,
        customerPhone: cleanPhone,
        customerEmail,
        shippingAddress,
        city,
        province,
        postalCode,
        nearestLandmark,
        paymentMethod,
        subtotal: cartSubtotal,
        shippingFee: shippingFee + codTax,
        discount: totalDiscount,
        total: grandTotal,
        couponCode: couponApplied ? couponCode.trim().toUpperCase() : undefined,
        notes: `${notes || ""}${codTax > 0 ? ` [Includes 4% COD Tax: Rs. ${codTax}]` : ""} [Parcel Weight: ${totalWeight.toFixed(1)}kg]`.trim(),
        items: cart,
        ...(isAdvancePayment
          ? {
              bankTransferDetails: {
                bankName: paymentMethod === "BANK_TRANSFER" ? bankName : `${paymentMethod} Mobile Wallet`,
                transactionRef: transactionRef.trim() || "RECEIPT_ATTACHED",
                proofImage: receiptUrl,
              },
            }
          : {}),
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Order placement failed");
      }

      clearCart();
      router.push(`/order-confirmation/${data.orderNumber}`);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to place order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-serif text-2xl font-bold text-[#171717]">Your bag is empty</h2>
        <p className="text-xs text-[#6B6259]">Please add items to your cart before proceeding to checkout.</p>
        <Link href="/shop" className="inline-block px-6 py-2.5 bg-[#171717] text-white rounded-xl text-xs font-bold uppercase">
          Go to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      <div className="text-center max-w-xl mx-auto mb-10">
        <span className="text-xs font-bold tracking-widest uppercase text-[#7A6652]">100% Encrypted & Safe Checkout</span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#171717] mt-1">
          Complete Your Order
        </h1>
        <p className="text-xs text-[#6B6259] mt-1">
          Fast nationwide dispatch • Free delivery on Rs. 10,000+ • Flat 5% off on Advance Payments
        </p>
      </div>

      {errorMessage && (
        <div className="max-w-4xl mx-auto mb-6 p-4 rounded-xl bg-[#FDF2F2] border border-[#F2BDBD] text-[#9B3D3D] text-xs font-medium">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Form: Customer & Shipping Details */}
        <div className="lg:col-span-7 space-y-8">
          {/* Contact Section */}
          <div className="bg-white p-6 rounded-2xl border border-[#E7E1D8] shadow-sm space-y-4">
            <h2 className="font-serif font-bold text-lg text-[#171717] border-b border-[#E7E1D8] pb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#171717] text-white text-xs flex items-center justify-center font-sans">
                1
              </span>
              Contact Information
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#171717] mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Ayesha Malik"
                  className="w-full text-xs p-3 border border-[#E7E1D8] rounded-xl focus:outline-none focus:border-[#7A6652] bg-[#F8F5F0]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#171717] mb-1">
                  Mobile Number (For Courier SMS & Rider Call) *
                </label>
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="03400262732"
                  className="w-full text-xs p-3 border border-[#E7E1D8] rounded-xl focus:outline-none focus:border-[#7A6652] bg-[#F8F5F0]"
                />
                <span className="text-[10px] text-[#6B6259]">11 digits starting with 03</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#171717] mb-1">
                Email Address (Optional — for order confirmation receipt)
              </label>
              <input
                type="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                placeholder="ayesha@example.com"
                className="w-full text-xs p-3 border border-[#E7E1D8] rounded-xl focus:outline-none focus:border-[#7A6652] bg-[#F8F5F0]"
              />
            </div>
          </div>

          {/* Shipping Address Section */}
          <div className="bg-white p-6 rounded-2xl border border-[#E7E1D8] shadow-sm space-y-4">
            <h2 className="font-serif font-bold text-lg text-[#171717] border-b border-[#E7E1D8] pb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#171717] text-white text-xs flex items-center justify-center font-sans">
                2
              </span>
              Shipping Destination (Pakistan)
            </h2>

            <div>
              <label className="block text-xs font-bold text-[#171717] mb-1">
                Street Address, House / Flat #, Mohallah *
              </label>
              <textarea
                required
                rows={2}
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                placeholder="House # 12, Street 4, Sector F-7/2..."
                className="w-full text-xs p-3 border border-[#E7E1D8] rounded-xl focus:outline-none focus:border-[#7A6652] bg-[#F8F5F0]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#171717] mb-1">
                  Nearest Landmark (Crucial for Rider)
                </label>
                <input
                  type="text"
                  value={nearestLandmark}
                  onChange={(e) => setNearestLandmark(e.target.value)}
                  placeholder="e.g. Near Water Tank, Opp. Jamia Masjid"
                  className="w-full text-xs p-3 border border-[#E7E1D8] rounded-xl focus:outline-none focus:border-[#7A6652] bg-[#F8F5F0]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#171717] mb-1">
                  City *
                </label>
                <select
                  value={city}
                  onChange={(e) => handleCityChange(e.target.value)}
                  className="w-full text-xs p-3 border border-[#E7E1D8] rounded-xl focus:outline-none focus:border-[#7A6652] bg-[#F8F5F0] font-medium"
                >
                  <option value="Karachi">Karachi (Sindh) — Flat Rs. 350</option>
                  {PAKISTAN_CITIES.filter(c => c.name.toLowerCase() !== "karachi").map((c) => (
                    <option key={c.name} value={c.name}>
                      {c.name} ({c.province})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#171717] mb-1">
                  Province
                </label>
                <input
                  type="text"
                  readOnly
                  value={province}
                  className="w-full text-xs p-3 border border-[#E7E1D8] rounded-xl bg-[#F0EBE3] text-[#171717] font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#171717] mb-1">
                  Estimated Delivery Timeline
                </label>
                <div className="p-3 rounded-xl bg-[#F8F5F0] border border-[#E7E1D8] text-xs font-semibold text-[#171717] flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#7A6652]" />
                  <span>{getTimeline()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Method Section */}
          <div className="bg-white p-6 rounded-2xl border border-[#E7E1D8] shadow-sm space-y-4">
            <h2 className="font-serif font-bold text-lg text-[#171717] border-b border-[#E7E1D8] pb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#171717] text-white text-xs flex items-center justify-center font-sans">
                3
              </span>
              Payment Method
            </h2>

            <div className="space-y-3">
              {/* Option 1: Cash on Delivery (4% Tax) */}
              <label className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                paymentMethod === "COD"
                  ? "border-[#7A6652] bg-[#F8F5F0] ring-1 ring-[#7A6652]"
                  : "border-[#E7E1D8] hover:border-[#C4A882]"
              }`}>
                <input
                  type="radio"
                  name="payment"
                  value="COD"
                  checked={paymentMethod === "COD"}
                  onChange={() => setPaymentMethod("COD")}
                  className="mt-1 text-[#7A6652] focus:ring-[#7A6652]"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <span className="text-xs font-bold text-[#171717] flex items-center gap-2">
                      <Truck className="w-4 h-4 text-[#7A6652]" />
                      Cash on Delivery (COD)
                    </span>
                    <span className="text-[11px] font-semibold text-[#9B3D3D] bg-[#FEF2F2] border border-[#F2BDBD] px-2 py-0.5 rounded">
                      +4% COD Surcharge (Rs. {Math.round(cartSubtotal * 0.04).toLocaleString()})
                    </span>
                  </div>
                  <p className="text-[11px] text-[#6B6259] mt-1">
                    Pay in cash to courier rider upon delivery. Standard 4% courier handling fee applies to COD parcels.
                  </p>
                  <p className="text-[10px] text-[#1A6B3C] font-semibold mt-1">
                    💡 Tip: Switch to Bank Transfer or JazzCash/EasyPaisa to WAIVE the 4% fee and get Flat 5% OFF!
                  </p>
                </div>
              </label>

              {/* Option 2: Bank Transfer (Flat 5% OFF, No 4% Tax) */}
              <label className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                paymentMethod === "BANK_TRANSFER"
                  ? "border-[#7A6652] bg-[#F8F5F0] ring-1 ring-[#7A6652]"
                  : "border-[#E7E1D8] hover:border-[#C4A882]"
              }`}>
                <input
                  type="radio"
                  name="payment"
                  value="BANK_TRANSFER"
                  checked={paymentMethod === "BANK_TRANSFER"}
                  onChange={() => setPaymentMethod("BANK_TRANSFER")}
                  className="mt-1 text-[#7A6652] focus:ring-[#7A6652]"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <span className="text-xs font-bold text-[#171717] flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-[#1A6B3C]" />
                      Direct Bank Transfer (Meezan / HBL / Faysal)
                    </span>
                    <span className="text-[11px] font-bold text-[#1A6B3C] bg-[#E8F5E9] border border-[#A5D6A7] px-2 py-0.5 rounded">
                      FLAT 5% OFF + 0% COD TAX
                    </span>
                  </div>
                  <p className="text-[11px] text-[#6B6259] mt-1">
                    Transfer directly to our official corporate account. 4% COD tax is waived, plus you get <strong className="text-[#1A6B3C]">Flat 5% OFF</strong> instantly applied!
                  </p>

                  {paymentMethod === "BANK_TRANSFER" && (
                    <div id="receipt-upload-section" className="mt-3 p-4 bg-white rounded-xl border border-[#E7E1D8] text-xs space-y-3 shadow-xs">
                      <div className="flex items-center justify-between border-b border-[#E7E1D8] pb-2">
                        <span className="text-[11px] font-bold text-[#171717] uppercase tracking-wider">
                          Official Corporate Bank Details
                        </span>
                        <span className="text-[10px] text-[#1A6B3C] font-semibold bg-[#E8F5E9] px-2 py-0.5 rounded">
                          Pay: Rs. {grandTotal.toLocaleString()}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-[11px] text-[#6B6259]">
                        <div className="p-2 bg-[#F8F5F0] rounded-lg border border-[#E7E1D8]">
                          <p className="text-[10px] uppercase text-[#7A6652] font-semibold">Bank Name</p>
                          <p className="font-bold text-[#171717] text-xs mt-0.5">Meezan Bank Ltd</p>
                        </div>
                        <div className="p-2 bg-[#F8F5F0] rounded-lg border border-[#E7E1D8]">
                          <p className="text-[10px] uppercase text-[#7A6652] font-semibold">Account Title</p>
                          <p className="font-bold text-[#171717] text-xs mt-0.5">Tauheed Textile</p>
                        </div>
                        <div className="p-2 bg-[#F8F5F0] rounded-lg border border-[#E7E1D8] flex items-center justify-between">
                          <div>
                            <p className="text-[10px] uppercase text-[#7A6652] font-semibold">Account Number</p>
                            <p className="font-mono font-bold text-[#171717] text-xs mt-0.5">02020108920192</p>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              copyToClipboard("02020108920192", "bank_acc");
                            }}
                            className="p-1.5 rounded bg-white hover:bg-sand-200 border border-sand-300 text-brand-900 transition-colors"
                            title="Copy Account Number"
                          >
                            {copiedField === "bank_acc" ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                        <div className="p-2 bg-[#F8F5F0] rounded-lg border border-[#E7E1D8] flex items-center justify-between">
                          <div>
                            <p className="text-[10px] uppercase text-[#7A6652] font-semibold">IBAN Number</p>
                            <p className="font-mono font-bold text-[#171717] text-[10px] mt-0.5">PK45MEZN0002020108920192</p>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              copyToClipboard("PK45MEZN0002020108920192", "bank_iban");
                            }}
                            className="p-1.5 rounded bg-white hover:bg-sand-200 border border-sand-300 text-brand-900 transition-colors"
                            title="Copy IBAN"
                          >
                            {copiedField === "bank_iban" ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>

                      {/* Mandatory Receipt Upload Box */}
                      <div className="pt-2 border-t border-[#E7E1D8] space-y-2">
                        <label className="block text-[11px] font-bold text-[#171717]">
                          Attach Payment Receipt or Transfer Screenshot <span className="text-[#9B3D3D] font-bold">* (Required)</span>
                        </label>
                        <p className="text-[10px] text-[#6B6259]">
                          Please provide a screenshot from your banking app or ATM slip showing the successful transfer before checkout confirmation.
                        </p>

                        {receiptUrl ? (
                          <div className="p-3 bg-[#E8F5E9] border border-[#A5D6A7] rounded-xl flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-[#A5D6A7] bg-white shrink-0">
                                <Image src={receiptUrl} alt="Payment Receipt" fill className="object-cover" />
                              </div>
                              <div className="min-w-0">
                                <p className="text-xs font-bold text-[#1A6B3C] flex items-center gap-1">
                                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                                  Receipt Uploaded Successfully
                                </p>
                                <p className="text-[10px] text-[#2E7D32] truncate font-mono mt-0.5">
                                  {receiptFileName || "payment-receipt.jpg"}
                                </p>
                              </div>
                            </div>
                            <label className="shrink-0 text-[11px] font-bold text-brand-900 bg-white hover:bg-sand-100 border border-sand-300 px-3 py-1.5 rounded-lg cursor-pointer transition-colors shadow-2xs">
                              Change
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleReceiptUpload}
                                className="hidden"
                              />
                            </label>
                          </div>
                        ) : (
                          <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-[#C4A882] rounded-xl bg-[#F8F5F0] hover:bg-[#F0EBE3] cursor-pointer transition-all">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleReceiptUpload}
                              className="hidden"
                              disabled={isUploadingReceipt}
                            />
                            {isUploadingReceipt ? (
                              <div className="flex items-center gap-2 text-xs font-bold text-[#7A6652]">
                                <span className="w-4 h-4 border-2 border-[#7A6652] border-t-transparent rounded-full animate-spin" />
                                Uploading payment receipt...
                              </div>
                            ) : (
                              <div className="text-center space-y-1">
                                <Camera className="w-6 h-6 text-[#7A6652] mx-auto" />
                                <p className="text-xs font-bold text-[#171717]">
                                  Tap here to upload receipt photo or screenshot
                                </p>
                                <p className="text-[10px] text-[#6B6259]">
                                  PNG, JPG, JPEG, or WEBP up to 12MB
                                </p>
                              </div>
                            )}
                          </label>
                        )}

                        {receiptError && (
                          <p className="text-[11px] font-semibold text-[#9B3D3D] flex items-center gap-1 mt-1">
                            <AlertCircle className="w-3.5 h-3.5" />
                            {receiptError}
                          </p>
                        )}
                      </div>

                      <div className="pt-2">
                        <label className="block text-[11px] font-bold text-[#171717] mb-1">
                          Transfer Reference / Transaction ID (Optional if screenshot attached)
                        </label>
                        <input
                          type="text"
                          value={transactionRef}
                          onChange={(e) => setTransactionRef(e.target.value)}
                          placeholder="e.g. FT2609068892"
                          className="w-full text-xs p-2.5 border border-[#E7E1D8] rounded-xl bg-[#F8F5F0]"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </label>

              {/* Option 3: JazzCash / EasyPaisa (Flat 5% OFF, No 4% Tax) */}
              <label className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                paymentMethod === "JAZZCASH" || paymentMethod === "EASYPAISA"
                  ? "border-[#7A6652] bg-[#F8F5F0] ring-1 ring-[#7A6652]"
                  : "border-[#E7E1D8] hover:border-[#C4A882]"
              }`}>
                <input
                  type="radio"
                  name="payment"
                  value="JAZZCASH"
                  checked={paymentMethod === "JAZZCASH" || paymentMethod === "EASYPAISA"}
                  onChange={() => setPaymentMethod("JAZZCASH")}
                  className="mt-1 text-[#7A6652] focus:ring-[#7A6652]"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <span className="text-xs font-bold text-[#171717] flex items-center gap-2">
                      <Smartphone className="w-4 h-4 text-[#1A6B3C]" />
                      JazzCash / EasyPaisa Mobile Wallet
                    </span>
                    <span className="text-[11px] font-bold text-[#1A6B3C] bg-[#E8F5E9] border border-[#A5D6A7] px-2 py-0.5 rounded">
                      FLAT 5% OFF + 0% COD TAX
                    </span>
                  </div>
                  <p className="text-[11px] text-[#6B6259] mt-1">
                    Send to our registered mobile account <span className="font-bold text-[#171717]">0340 0262732</span>. Enjoy <strong className="text-[#1A6B3C]">Flat 5% discount</strong> and zero COD tax!
                  </p>

                  {(paymentMethod === "JAZZCASH" || paymentMethod === "EASYPAISA") && (
                    <div id="receipt-upload-section" className="mt-3 p-4 bg-white rounded-xl border border-[#E7E1D8] text-xs space-y-3 shadow-xs">
                      <div className="flex items-center justify-between border-b border-[#E7E1D8] pb-2">
                        <span className="text-[11px] font-bold text-[#171717] uppercase tracking-wider">
                          Official Wallet Account Details
                        </span>
                        <span className="text-[10px] text-[#1A6B3C] font-semibold bg-[#E8F5E9] px-2 py-0.5 rounded">
                          Pay: Rs. {grandTotal.toLocaleString()}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-[11px] text-[#6B6259]">
                        <div className="p-2.5 bg-[#F8F5F0] rounded-lg border border-[#E7E1D8] flex items-center justify-between">
                          <div>
                            <p className="text-[10px] uppercase text-[#7A6652] font-semibold">Account Number</p>
                            <p className="font-mono font-bold text-[#171717] text-sm mt-0.5">0340 0262732</p>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              copyToClipboard("03400262732", "wallet_acc");
                            }}
                            className="p-1.5 rounded bg-white hover:bg-sand-200 border border-sand-300 text-brand-900 transition-colors"
                            title="Copy Wallet Number"
                          >
                            {copiedField === "wallet_acc" ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                        <div className="p-2.5 bg-[#F8F5F0] rounded-lg border border-[#E7E1D8]">
                          <p className="text-[10px] uppercase text-[#7A6652] font-semibold">Account Title</p>
                          <p className="font-bold text-[#171717] text-sm mt-0.5">Tauheed Textile</p>
                        </div>
                      </div>

                      {/* Mandatory Receipt Upload Box */}
                      <div className="pt-2 border-t border-[#E7E1D8] space-y-2">
                        <label className="block text-[11px] font-bold text-[#171717]">
                          Attach EasyPaisa / JazzCash Payment Screenshot <span className="text-[#9B3D3D] font-bold">* (Required)</span>
                        </label>
                        <p className="text-[10px] text-[#6B6259]">
                          Take a screenshot of the successful transaction confirmation screen from your JazzCash or EasyPaisa app and attach it below.
                        </p>

                        {receiptUrl ? (
                          <div className="p-3 bg-[#E8F5E9] border border-[#A5D6A7] rounded-xl flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-[#A5D6A7] bg-white shrink-0">
                                <Image src={receiptUrl} alt="Payment Screenshot" fill className="object-cover" />
                              </div>
                              <div className="min-w-0">
                                <p className="text-xs font-bold text-[#1A6B3C] flex items-center gap-1">
                                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                                  Screenshot Uploaded Successfully
                                </p>
                                <p className="text-[10px] text-[#2E7D32] truncate font-mono mt-0.5">
                                  {receiptFileName || "wallet-screenshot.jpg"}
                                </p>
                              </div>
                            </div>
                            <label className="shrink-0 text-[11px] font-bold text-brand-900 bg-white hover:bg-sand-100 border border-sand-300 px-3 py-1.5 rounded-lg cursor-pointer transition-colors shadow-2xs">
                              Change
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleReceiptUpload}
                                className="hidden"
                              />
                            </label>
                          </div>
                        ) : (
                          <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-[#C4A882] rounded-xl bg-[#F8F5F0] hover:bg-[#F0EBE3] cursor-pointer transition-all">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleReceiptUpload}
                              className="hidden"
                              disabled={isUploadingReceipt}
                            />
                            {isUploadingReceipt ? (
                              <div className="flex items-center gap-2 text-xs font-bold text-[#7A6652]">
                                <span className="w-4 h-4 border-2 border-[#7A6652] border-t-transparent rounded-full animate-spin" />
                                Uploading payment screenshot...
                              </div>
                            ) : (
                              <div className="text-center space-y-1">
                                <Camera className="w-6 h-6 text-[#7A6652] mx-auto" />
                                <p className="text-xs font-bold text-[#171717]">
                                  Tap here to upload transaction screenshot
                                </p>
                                <p className="text-[10px] text-[#6B6259]">
                                  PNG, JPG, JPEG, or WEBP up to 12MB
                                </p>
                              </div>
                            )}
                          </label>
                        )}

                        {receiptError && (
                          <p className="text-[11px] font-semibold text-[#9B3D3D] flex items-center gap-1 mt-1">
                            <AlertCircle className="w-3.5 h-3.5" />
                            {receiptError}
                          </p>
                        )}
                      </div>

                      <div className="pt-2">
                        <label className="block text-[11px] font-bold text-[#171717] mb-1">
                          TID (Transaction ID) Number (Optional if screenshot attached)
                        </label>
                        <input
                          type="text"
                          value={transactionRef}
                          onChange={(e) => setTransactionRef(e.target.value)}
                          placeholder="e.g. 19283746102"
                          className="w-full text-xs p-2.5 border border-[#E7E1D8] rounded-xl bg-[#F8F5F0]"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right Sidebar: Order Summary & Placement */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-[#E7E1D8] shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-[#E7E1D8] pb-3">
              <h2 className="font-serif font-bold text-lg text-[#171717]">
                Order Summary ({cart.length} item{cart.length > 1 ? "s" : ""})
              </h2>
              <span className="text-xs text-[#6B6259] flex items-center gap-1 font-mono">
                <Package className="w-3.5 h-3.5 text-[#7A6652]" />
                Parcel: {totalWeight.toFixed(1)} kg
              </span>
            </div>

            {/* Line items mini preview */}
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {cart.map((item) => (
                <div key={item.variantId} className="flex gap-3 text-xs">
                  <div className="relative w-12 h-16 rounded-lg overflow-hidden bg-[#F0EBE3] shrink-0 border border-[#E7E1D8]">
                    <Image src={item.image} alt={item.productTitle} fill className="object-cover" />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <p className="font-bold text-[#171717] line-clamp-1">{item.productTitle}</p>
                      <p className="text-[11px] text-[#6B6259]">{item.size || "Unstitched"} (Qty: {item.quantity})</p>
                    </div>
                    <p className="font-serif font-bold text-[#171717]">
                      Rs. {(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Promo Code Input */}
            <div className="pt-3 border-t border-[#E7E1D8]">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter your discount code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="flex-1 text-xs p-2.5 border border-[#E7E1D8] rounded-lg uppercase bg-[#F8F5F0]"
                />
                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  className="px-4 py-2.5 bg-[#F0EBE3] hover:bg-[#E7E1D8] text-[#171717] text-xs font-bold rounded-lg transition-colors"
                >
                  Apply
                </button>
              </div>
              {couponApplied && (
                <p className="text-[11px] text-[#1A6B3C] font-semibold mt-1 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Coupon applied successfully!
                </p>
              )}
            </div>

            {/* Financial Breakdown */}
            <div className="pt-3 border-t border-[#E7E1D8] space-y-2 text-xs text-[#6B6259]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-[#171717]">Rs. {cartSubtotal.toLocaleString()}</span>
              </div>

              <div className="flex justify-between">
                <span>
                  Delivery Charges ({city === "Karachi" ? "Karachi Flat" : `${totalWeight.toFixed(1)}kg Weight`})
                </span>
                <span className="font-bold text-[#171717]">
                  {shippingFee === 0 ? (
                    <span className="text-[#1A6B3C] font-bold">FREE (Orders &ge; 10k) 🎉</span>
                  ) : (
                    `Rs. ${grossShippingFee}`
                  )}
                </span>
              </div>

              {deliveryDiscount > 0 && shippingFee > 0 && (
                <div className="flex justify-between text-[#1A6B3C] text-[11px] font-semibold bg-[#E8F5E9] px-2 py-1 rounded">
                  <span>Delivery Subsidy Discount (Max Rs. 200)</span>
                  <span>-Rs. {deliveryDiscount}</span>
                </div>
              )}

              {shippingFee > 0 && deliveryDiscount > 0 && (
                <div className="flex justify-between text-[11px] text-brand-700 font-bold border-b border-dashed border-[#E7E1D8] pb-1">
                  <span>Net Delivery Payable</span>
                  <span>Rs. {shippingFee}</span>
                </div>
              )}

              {/* COD 4% Tax vs Advance Discount */}
              {codTax > 0 && (
                <div className="flex justify-between text-[#9B3D3D]">
                  <span>Cash on Delivery (4% Handling Fee)</span>
                  <span className="font-bold">+Rs. {codTax.toLocaleString()}</span>
                </div>
              )}

              {advanceDiscount > 0 && (
                <div className="flex justify-between text-[#1A6B3C] font-semibold bg-[#E8F5E9] px-2.5 py-1 rounded">
                  <span className="flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" /> Flat 5% Advance Payment Discount
                  </span>
                  <span>-Rs. {advanceDiscount.toLocaleString()}</span>
                </div>
              )}

              {discountAmount > 0 && (
                <div className="flex justify-between text-[#1A6B3C] font-semibold">
                  <span>Coupon Discount</span>
                  <span>-Rs. {discountAmount.toLocaleString()}</span>
                </div>
              )}

              <div className="pt-3 border-t border-[#E7E1D8] flex justify-between items-baseline font-serif font-bold text-lg text-[#171717]">
                <span>Total Payable</span>
                <span className="text-2xl text-[#171717]">Rs. {grandTotal.toLocaleString()}</span>
              </div>
            </div>

            {/* Advance Payment Receipt Required Notice */}
            {paymentMethod !== "COD" && !receiptUrl && (
              <div className="p-3.5 bg-amber-50 border border-amber-300 rounded-xl text-xs text-amber-950 flex items-start gap-2.5 shadow-xs">
                <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <p className="font-bold">Payment Receipt Screenshot Required</p>
                  <p className="text-[11px] text-amber-800 leading-snug">
                    Please attach your bank transfer or wallet payment receipt slip above before confirming this order.
                  </p>
                </div>
              </div>
            )}

            {/* Place Order CTA */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-4 text-white rounded-xl text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg transition-all ${
                isSubmitting
                  ? "bg-[#6B6259] cursor-not-allowed"
                  : paymentMethod !== "COD" && !receiptUrl
                  ? "bg-[#9B3D3D] hover:bg-[#802B2B]"
                  : "bg-[#171717] hover:bg-black"
              }`}
            >
              {isSubmitting ? (
                "Processing Secure Order..."
              ) : paymentMethod !== "COD" && !receiptUrl ? (
                <>
                  <Upload className="w-4 h-4 text-white" /> Attach Receipt Screenshot to Confirm
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 text-[#C4A882]" /> Confirm Order &amp; Dispatch
                </>
              )}
            </button>

            <div className="text-center pt-2 space-y-1">
              <p className="text-[10px] text-[#6B6259]">
                By placing this order, you agree to Tauheed Textile's 7-Day Exchange Policy (No Returns, Exchange Only).
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
