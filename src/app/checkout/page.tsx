"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { 
  ShieldCheck, 
  Truck, 
  CreditCard, 
  Building2, 
  Smartphone, 
  Lock, 
  ArrowRight,
  UploadCloud,
  CheckCircle2
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
  const [city, setCity] = useState("Lahore");
  const [province, setProvince] = useState("Punjab");
  const [postalCode, setPostalCode] = useState("");
  const [notes, setNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "BANK_TRANSFER" | "JAZZCASH" | "EASYPAISA">("COD");

  // Bank Proof state
  const [bankName, setBankName] = useState("Meezan Bank");
  const [transactionRef, setTransactionRef] = useState("");
  const [proofImageUploaded, setProofImageUploaded] = useState(false);

  // Coupon code
  const [couponCode, setCouponCode] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const FREE_SHIPPING_THRESHOLD = 9999;
  const isAdvancePayment = paymentMethod === "BANK_TRANSFER" || paymentMethod === "JAZZCASH" || paymentMethod === "EASYPAISA";
  const advanceDiscount = isAdvancePayment ? Math.round(cartSubtotal * 0.05) : 0;
  const shippingFee = cartSubtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 250;
  const totalDiscount = discountAmount + advanceDiscount;
  const grandTotal = Math.max(0, cartSubtotal + shippingFee - totalDiscount);

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
      alert("Invalid coupon code. Try TAUHEED10 or EIDGIFT500");
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
        shippingFee,
        discount: totalDiscount,
        total: grandTotal,
        notes,
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
        <h2 className="font-serif text-2xl font-bold text-brand-950">Your bag is empty</h2>
        <p className="text-xs text-brand-600">Please add items to your cart before proceeding to checkout.</p>
        <Link href="/shop" className="inline-block px-6 py-2.5 bg-brand-900 text-white rounded-lg text-xs font-bold uppercase">
          Go to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      <div className="text-center max-w-xl mx-auto mb-10">
        <span className="text-xs font-bold tracking-widest uppercase text-gold-700">100% Encrypted & Safe</span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-brand-950 mt-1">
          Complete Your Order
        </h1>
        <p className="text-xs text-brand-600 mt-1">Cash on Delivery & Instant Bank Verification across Pakistan</p>
      </div>

      {errorMessage && (
        <div className="max-w-4xl mx-auto mb-6 p-4 rounded-xl bg-maroon-50 border border-maroon-200 text-maroon-800 text-xs font-medium">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Form: Customer & Shipping Details */}
        <div className="lg:col-span-7 space-y-8">
          {/* Contact Section */}
          <div className="bg-white p-6 rounded-2xl border border-sand-200 shadow-sm space-y-4">
            <h2 className="font-serif font-bold text-lg text-brand-950 border-b border-sand-200 pb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-brand-900 text-sand-50 text-xs flex items-center justify-center font-sans">
                1
              </span>
              Contact Information
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-brand-900 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Ayesha Malik"
                  className="w-full text-xs p-3 border border-sand-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-gold-500 bg-sand-50/50"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-900 mb-1">
                  Mobile Number (For Courier SMS & Call) *
                </label>
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="03400262732"
                  className="w-full text-xs p-3 border border-sand-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-gold-500 bg-sand-50/50"
                />
                <span className="text-[10px] text-brand-500">11 digits starting with 03</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-brand-900 mb-1">
                Email Address (For Order Tracking Receipt)
              </label>
              <input
                type="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                placeholder="ayesha@example.com"
                className="w-full text-xs p-3 border border-sand-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-gold-500 bg-sand-50/50"
              />
            </div>
          </div>

          {/* Shipping Address Section */}
          <div className="bg-white p-6 rounded-2xl border border-sand-200 shadow-sm space-y-4">
            <h2 className="font-serif font-bold text-lg text-brand-950 border-b border-sand-200 pb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-brand-900 text-sand-50 text-xs flex items-center justify-center font-sans">
                2
              </span>
              Shipping Destination (Pakistan)
            </h2>

            <div>
              <label className="block text-xs font-bold text-brand-900 mb-1">
                Street Address, House / Flat #, Mohallah *
              </label>
              <textarea
                required
                rows={2}
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                placeholder="House # 12, Street 4, Sector F-7/2..."
                className="w-full text-xs p-3 border border-sand-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-gold-500 bg-sand-50/50"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-brand-900 mb-1">
                  Nearest Landmark (Crucial for Rider)
                </label>
                <input
                  type="text"
                  value={nearestLandmark}
                  onChange={(e) => setNearestLandmark(e.target.value)}
                  placeholder="e.g. Near Water Tank, Opp. Jamia Masjid"
                  className="w-full text-xs p-3 border border-sand-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-gold-500 bg-sand-50/50"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-900 mb-1">
                  City *
                </label>
                <select
                  value={city}
                  onChange={(e) => handleCityChange(e.target.value)}
                  className="w-full text-xs p-3 border border-sand-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-gold-500 bg-sand-50/50 font-medium"
                >
                  {PAKISTAN_CITIES.map((c) => (
                    <option key={c.name} value={c.name}>
                      {c.name} ({c.province})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-brand-900 mb-1">
                  Province
                </label>
                <input
                  type="text"
                  readOnly
                  value={province}
                  className="w-full text-xs p-3 border border-sand-200 rounded-xl bg-sand-100 text-brand-800 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-900 mb-1">
                  Postal Code (Optional)
                </label>
                <input
                  type="text"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  placeholder="54000"
                  className="w-full text-xs p-3 border border-sand-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-gold-500 bg-sand-50/50"
                />
              </div>
            </div>
          </div>

          {/* Payment Method Section */}
          <div className="bg-white p-6 rounded-2xl border border-sand-200 shadow-sm space-y-4">
            <h2 className="font-serif font-bold text-lg text-brand-950 border-b border-sand-200 pb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-brand-900 text-sand-50 text-xs flex items-center justify-center font-sans">
                3
              </span>
              Payment Options
            </h2>

            <div className="space-y-3">
              {/* Option 1: Cash on Delivery */}
              <label className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                paymentMethod === "COD"
                  ? "border-gold-600 bg-sand-50/70 ring-1 ring-gold-600"
                  : "border-sand-200 hover:border-sand-300"
              }`}>
                <input
                  type="radio"
                  name="payment"
                  value="COD"
                  checked={paymentMethod === "COD"}
                  onChange={() => setPaymentMethod("COD")}
                  className="mt-1 text-gold-600 focus:ring-gold-500"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-brand-950 flex items-center gap-2">
                      <Truck className="w-4 h-4 text-emerald-700" />
                      Cash on Delivery (COD)
                    </span>
                    <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      Nationwide
                    </span>
                  </div>
                  <p className="text-[11px] text-brand-600 mt-1">
                    Pay safely in cash to the rider upon parcel delivery at your doorstep.
                  </p>
                </div>
              </label>

              {/* Option 2: Bank Transfer */}
              <label className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                paymentMethod === "BANK_TRANSFER"
                  ? "border-gold-600 bg-sand-50/70 ring-1 ring-gold-600"
                  : "border-sand-200 hover:border-sand-300"
              }`}>
                <input
                  type="radio"
                  name="payment"
                  value="BANK_TRANSFER"
                  checked={paymentMethod === "BANK_TRANSFER"}
                  onChange={() => setPaymentMethod("BANK_TRANSFER")}
                  className="mt-1 text-gold-600 focus:ring-gold-500"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-brand-950 flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-gold-700" />
                      Direct Bank Transfer (Meezan / HBL / Faysal)
                    </span>
                    <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded">
                      FLAT 5% OFF
                    </span>
                  </div>
                  <p className="text-[11px] text-brand-600 mt-1">
                    Transfer directly to our corporate account and get <strong className="text-emerald-700">Flat 5% Discount</strong> instantly applied!
                  </p>

                  {paymentMethod === "BANK_TRANSFER" && (
                    <div className="mt-3 p-3.5 bg-white rounded-lg border border-sand-200 text-xs space-y-2">
                      <div className="text-[11px] font-semibold text-brand-900 border-b border-sand-100 pb-1">
                        Tauheed Textile Official Bank Details:
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-[11px] text-brand-700">
                        <p><span className="font-semibold text-brand-900">Bank:</span> Meezan Bank Ltd</p>
                        <p><span className="font-semibold text-brand-900">Title:</span> Tauheed Textile (Pvt) Ltd</p>
                        <p><span className="font-semibold text-brand-900">Account #:</span> 02020108920192</p>
                        <p><span className="font-semibold text-brand-900">IBAN:</span> PK45MEZN0002020108920192</p>
                      </div>
                      <div className="pt-2">
                        <label className="block text-[11px] font-bold text-brand-900 mb-1">
                          Transfer Reference / Transaction ID *
                        </label>
                        <input
                          type="text"
                          value={transactionRef}
                          onChange={(e) => setTransactionRef(e.target.value)}
                          placeholder="e.g. FT2609068892"
                          className="w-full text-xs p-2 border border-sand-300 rounded bg-sand-50"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </label>

              {/* Option 3: JazzCash / EasyPaisa */}
              <label className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                paymentMethod === "JAZZCASH" || paymentMethod === "EASYPAISA"
                  ? "border-gold-600 bg-sand-50/70 ring-1 ring-gold-600"
                  : "border-sand-200 hover:border-sand-300"
              }`}>
                <input
                  type="radio"
                  name="payment"
                  value="JAZZCASH"
                  checked={paymentMethod === "JAZZCASH" || paymentMethod === "EASYPAISA"}
                  onChange={() => setPaymentMethod("JAZZCASH")}
                  className="mt-1 text-gold-600 focus:ring-gold-500"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-brand-950 flex items-center gap-2">
                      <Smartphone className="w-4 h-4 text-maroon-700" />
                      JazzCash / EasyPaisa Wallet
                    </span>
                    <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded">
                      FLAT 5% OFF
                    </span>
                  </div>
                  <p className="text-[11px] text-brand-600 mt-1">
                    Send to our registered mobile till <span className="font-bold text-brand-900">0340 0262732</span> and save <strong className="text-emerald-700">Flat 5%</strong>!
                  </p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right Sidebar: Order Summary & Placement */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-sand-200 shadow-sm space-y-4">
            <h2 className="font-serif font-bold text-lg text-brand-950 border-b border-sand-200 pb-3">
              Order Summary ({cart.length} item{cart.length > 1 ? "s" : ""})
            </h2>

            {/* Line items mini preview */}
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {cart.map((item) => (
                <div key={item.variantId} className="flex gap-3 text-xs">
                  <div className="relative w-12 h-16 rounded-lg overflow-hidden bg-sand-100 shrink-0">
                    <Image src={item.image} alt={item.productTitle} fill className="object-cover" />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <p className="font-bold text-brand-950 line-clamp-1">{item.productTitle}</p>
                      <p className="text-[11px] text-brand-500">{item.size} • {item.stitchedType} (Qty: {item.quantity})</p>
                    </div>
                    <p className="font-serif font-bold text-brand-900">
                      Rs. {(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Promo Code Input */}
            <div className="pt-3 border-t border-sand-100">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Promo Code (TAUHEED10)"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="flex-1 text-xs p-2.5 border border-sand-300 rounded-lg uppercase"
                />
                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  className="px-4 py-2.5 bg-sand-200 hover:bg-sand-300 text-brand-900 text-xs font-bold rounded-lg transition-colors"
                >
                  Apply
                </button>
              </div>
              {couponApplied && (
                <p className="text-[11px] text-emerald-700 font-semibold mt-1 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Coupon applied successfully!
                </p>
              )}
            </div>

            {/* Financial Breakdown */}
            <div className="pt-3 border-t border-sand-200 space-y-2 text-xs text-brand-700">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-brand-950">Rs. {cartSubtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Nationwide Shipping</span>
                <span className="font-bold text-brand-950">
                  {shippingFee === 0 ? <span className="text-emerald-700">FREE</span> : `Rs. ${shippingFee}`}
                </span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Promo Discount</span>
                  <span>-Rs. {discountAmount.toLocaleString()}</span>
                </div>
              )}
              {advanceDiscount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold bg-emerald-50 px-2 py-1 rounded">
                  <span className="flex items-center gap-1">
                    <span>🏷️</span> Flat 5% Advance Payment Discount
                  </span>
                  <span>-Rs. {advanceDiscount.toLocaleString()}</span>
                </div>
              )}
              <div className="pt-3 border-t border-sand-200 flex justify-between items-baseline font-serif font-bold text-lg text-brand-950">
                <span>Total Payable</span>
                <span className="text-2xl text-gold-700">Rs. {grandTotal.toLocaleString()}</span>
              </div>
            </div>

            {/* Place Order CTA */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-4 text-sand-50 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl transition-all ${
                isSubmitting
                  ? "bg-sand-400 cursor-not-allowed"
                  : "bg-brand-900 hover:bg-brand-950"
              }`}
            >
              {isSubmitting ? (
                "Processing Secure Order..."
              ) : (
                <>
                  <Lock className="w-4 h-4 text-gold-400" /> Confirm Order & Dispatch
                </>
              )}
            </button>

            <div className="text-center pt-2 space-y-1">
              <p className="text-[10px] text-brand-500">
                By placing this order, you agree to Tauheed Textile's Terms of Service and 7-Day Return Policy.
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
