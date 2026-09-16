"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Trash2, Plus, Minus, ArrowRight, ShieldCheck, ShoppingBag, ArrowLeft } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, cartSubtotal, clearCart } = useCart();
  const [specialInstructions, setSpecialInstructions] = useState("");

  const FREE_SHIPPING_THRESHOLD = 9999;
  const progress = Math.min(100, Math.round((cartSubtotal / FREE_SHIPPING_THRESHOLD) * 100));
  const diffToFree = FREE_SHIPPING_THRESHOLD - cartSubtotal;

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-sand-200 flex items-center justify-center mx-auto text-brand-400">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h1 className="font-serif text-3xl font-bold text-brand-950">Your Shopping Bag is Empty</h1>
        <p className="text-sm text-brand-600 max-w-md mx-auto">
          Explore our signature luxury lawn, festive chiffons, and prêt collections to find your perfect Pakistani ensemble.
        </p>
        <div>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-brand-900 hover:bg-brand-950 text-sand-50 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-lg"
          >
            Explore Collections <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      <div className="flex items-center justify-between border-b border-sand-200 pb-6 mb-8">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-brand-950">Your Shopping Bag</h1>
          <p className="text-xs text-brand-600 mt-1">Review items, customize quantities, and proceed to secure checkout</p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs text-sand-500 hover:text-maroon-700 font-semibold transition-colors"
        >
          Clear All
        </button>
      </div>

      {/* Free Shipping Meter */}
      <div className="mb-8 p-4 rounded-xl bg-sand-100 border border-sand-200">
        <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
          <span>
            {diffToFree > 0 ? (
              <>Add <span className="font-bold text-gold-700">Rs. {diffToFree.toLocaleString()}</span> more to unlock <span className="font-bold text-emerald-700">FREE Delivery across Pakistan</span></>
            ) : (
              <span className="font-bold text-emerald-700 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" /> You're eligible for FREE Nationwide Delivery!
              </span>
            )}
          </span>
          <span className="font-bold text-brand-800">{progress}%</span>
        </div>
        <div className="w-full bg-sand-300 h-2.5 rounded-full overflow-hidden">
          <div className="bg-gold-500 h-full rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
        <div className="mt-2.5 flex items-center gap-2 text-xs text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
          <span>🏷️</span>
          <span><strong>Advance Payment Perk:</strong> Get <strong>Flat 5% OFF</strong> on all orders paid via Bank Transfer, JazzCash, or EasyPaisa at checkout!</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <div
              key={item.variantId}
              className="flex gap-4 sm:gap-6 p-4 sm:p-6 bg-white rounded-2xl border border-sand-200 shadow-sm relative group"
            >
              <div className="relative w-24 sm:w-28 aspect-[3/4] rounded-xl overflow-hidden bg-sand-100 shrink-0">
                <Image src={item.image} alt={item.productTitle} fill className="object-cover" />
              </div>

              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between pr-8">
                    <Link
                      href={`/product/${item.productSlug}`}
                      className="font-serif font-bold text-base sm:text-lg text-brand-950 hover:text-gold-700 transition-colors"
                    >
                      {item.productTitle}
                    </Link>
                  </div>
                  <div className="text-xs text-brand-600 mt-1 space-y-0.5">
                    <p>Size / Option: <span className="font-semibold text-brand-900">{item.size} ({item.stitchedType})</span></p>
                    <p>Color: <span className="font-semibold text-brand-900">{item.color}</span></p>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4">
                  {/* Quantity */}
                  <div className="flex items-center border border-sand-300 rounded-lg bg-sand-50">
                    <button
                      onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                      className="p-2 text-brand-700 hover:text-gold-700 transition-colors"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 text-xs font-bold text-brand-900">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                      className="p-2 text-brand-700 hover:text-gold-700 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Price */}
                  <div className="text-right">
                    <p className="text-[11px] text-sand-500">Rs. {item.price.toLocaleString()} each</p>
                    <p className="font-serif font-bold text-base sm:text-lg text-brand-950">
                      Rs. {(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => removeFromCart(item.variantId)}
                className="absolute top-4 right-4 p-2 text-sand-400 hover:text-maroon-700 transition-colors"
                title="Remove item"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}

          {/* Order Notes */}
          <div className="p-4 bg-white rounded-2xl border border-sand-200">
            <label className="block text-xs font-bold text-brand-900 uppercase tracking-wider mb-2">
              Order Instructions & Custom Tailoring Notes (Optional)
            </label>
            <textarea
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              placeholder="e.g. Please leave package with guard if unavailable, or specify custom sleeve length..."
              rows={3}
              className="w-full text-xs p-3 border border-sand-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-gold-500 bg-sand-50/50"
            />
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-sand-200 shadow-sm space-y-4">
            <h3 className="font-serif font-bold text-lg text-brand-950 border-b border-sand-200 pb-3">
              Order Summary
            </h3>

            <div className="space-y-2.5 text-xs text-brand-700">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-brand-950">Rs. {cartSubtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Standard Delivery (Pakistan)</span>
                <span className="font-bold text-brand-950">
                  {cartSubtotal >= FREE_SHIPPING_THRESHOLD ? (
                    <span className="text-emerald-700 font-bold">FREE</span>
                  ) : (
                    "Rs. 250"
                  )}
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-sand-200 flex justify-between items-baseline">
              <span className="font-serif font-bold text-base text-brand-950">Estimated Total</span>
              <span className="font-serif font-bold text-2xl text-gold-700">
                Rs. {(cartSubtotal + (cartSubtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 250)).toLocaleString()}
              </span>
            </div>

            <Link
              href="/checkout"
              className="w-full py-4 bg-brand-900 hover:bg-brand-950 text-sand-50 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl transition-all"
            >
              Proceed to Checkout <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/shop"
              className="w-full py-2.5 text-brand-700 hover:text-brand-950 text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Continue Shopping
            </Link>
          </div>

          <div className="p-4 bg-sand-100 rounded-xl border border-sand-200 text-xs space-y-2 text-brand-700">
            <div className="flex items-center gap-2 font-bold text-brand-900">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              Tauheed Authentic Guarantee
            </div>
            <p className="text-[11px] leading-relaxed text-brand-600">
              Pay via Cash on Delivery or Direct Bank Transfer. Parcels are safely insured and dispatched via TCS, Leopards, or Trax.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
