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
  Info
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

  // Bank Proof state
  const [bankName, setBankName] = useState("Meezan Bank");
  const [transactionRef, setTransactionRef] = useState("");

  // Coupon code
  const [couponCode, setCouponCode] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);

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
  // Free over Rs. 10,000.
  // Karachi: Flat Rs. 350 for all weights.
  // Outside Karachi: 1kg = 350, 2-3kg = 450, 4-5kg = 550, >5kg = 550 + 100/kg.
  let shippingFee = 0;
  if (isFreeShipping) {
    shippingFee = 0;
  } else if (city.toLowerCase() === "karachi") {
    shippingFee = 350;
  } else {
    if (totalWeight <= 1.0) {
      shippingFee = 350;
    } else if (totalWeight <= 3.0) {
      shippingFee = 450;
    } else if (totalWeight <= 5.0) {
      shippingFee = 550;
    } else {
      shippingFee = 550 + Math.ceil(totalWeight - 5.0) * 100;
    }
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

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponCode.toUpperCase() === "TAUHEED10") {
      const discount = Math.round(cartSubtotal * 0.1);
      setDiscountAmount(discount);
      setCouponApplied(true);
    } else if (couponCode.toUpperCase() === "EIDGIFT500") {
      setDiscountAmount(500);
      setCouponApplied(true);
    } else {
      alert("Invalid discount code. Please check and try again.");
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
        notes: `${notes || ""}${codTax > 0 ? ` [Includes 4% COD Tax: Rs. ${codTax}]` : ""} [Parcel Weight: ${totalWeight.toFixed(1)}kg]`.trim(),
        items: cart,
        ...(paymentMethod === "BANK_TRANSFER"
          ? {
              bankTransferDetails: {
                bankName,
                transactionRef: transactionRef || "FT-ONLINE-PENDING",
                proofImage: "/assets/1.png",
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
                    <div className="mt-3 p-3.5 bg-white rounded-lg border border-[#E7E1D8] text-xs space-y-2">
                      <div className="text-[11px] font-semibold text-[#171717] border-b border-[#E7E1D8] pb-1">
                        Tauheed Textile Official Bank Details:
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-[11px] text-[#6B6259]">
                        <p><span className="font-semibold text-[#171717]">Bank:</span> Meezan Bank Ltd</p>
                        <p><span className="font-semibold text-[#171717]">Title:</span> Tauheed Textile</p>
                        <p><span className="font-semibold text-[#171717]">Account #:</span> 02020108920192</p>
                        <p><span className="font-semibold text-[#171717]">IBAN:</span> PK45MEZN0002020108920192</p>
                      </div>
                      <div className="pt-2">
                        <label className="block text-[11px] font-bold text-[#171717] mb-1">
                          Transfer Reference / Transaction ID *
                        </label>
                        <input
                          type="text"
                          value={transactionRef}
                          onChange={(e) => setTransactionRef(e.target.value)}
                          placeholder="e.g. FT2609068892"
                          className="w-full text-xs p-2 border border-[#E7E1D8] rounded bg-[#F8F5F0]"
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
                      JazzCash / EasyPaisa Wallet
                    </span>
                    <span className="text-[11px] font-bold text-[#1A6B3C] bg-[#E8F5E9] border border-[#A5D6A7] px-2 py-0.5 rounded">
                      FLAT 5% OFF + 0% COD TAX
                    </span>
                  </div>
                  <p className="text-[11px] text-[#6B6259] mt-1">
                    Send to our registered mobile account <span className="font-bold text-[#171717]">0340 0262732</span>. Enjoy <strong className="text-[#1A6B3C]">Flat 5% discount</strong> and zero COD tax!
                  </p>
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
                  Shipping ({city === "Karachi" ? "Karachi Flat" : `${totalWeight.toFixed(1)}kg Nationwide`})
                </span>
                <span className="font-bold text-[#171717]">
                  {shippingFee === 0 ? (
                    <span className="text-[#1A6B3C] font-bold">FREE (Orders &ge; 10k)</span>
                  ) : (
                    `Rs. ${shippingFee}`
                  )}
                </span>
              </div>

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

            {/* Place Order CTA */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-4 text-white rounded-xl text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg transition-all ${
                isSubmitting
                  ? "bg-[#6B6259] cursor-not-allowed"
                  : "bg-[#171717] hover:bg-black"
              }`}
            >
              {isSubmitting ? (
                "Processing Secure Order..."
              ) : (
                <>
                  <Lock className="w-4 h-4 text-[#C4A882]" /> Confirm Order & Dispatch
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
