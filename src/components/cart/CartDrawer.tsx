"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function CartDrawer() {
  const { 
    cart, 
    isCartOpen, 
    closeCart, 
    updateQuantity, 
    removeFromCart, 
    cartSubtotal, 
    cartCount 
  } = useCart();

  if (!isCartOpen) return null;

  const FREE_SHIPPING_THRESHOLD = 4999;
  const progress = Math.min(100, Math.round((cartSubtotal / FREE_SHIPPING_THRESHOLD) * 100));
  const diffToFree = FREE_SHIPPING_THRESHOLD - cartSubtotal;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-brand-950/60 backdrop-blur-sm transition-opacity" 
        onClick={closeCart} 
      />

      <div className="fixed inset-y-0 right-0 max-w-md w-full bg-sand-50 shadow-2xl flex flex-col z-10 animate-slideLeft">
        {/* Header */}
        <div className="p-5 border-b border-sand-200 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-gold-600" />
            <h2 className="font-serif font-bold text-lg text-brand-900">Your Shopping Bag</h2>
            <span className="text-xs bg-sand-200 text-brand-800 font-bold px-2 py-0.5 rounded-full">
              {cartCount}
            </span>
          </div>
          <button 
            onClick={closeCart} 
            className="p-1 rounded-full text-brand-600 hover:bg-sand-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress Bar */}
        <div className="bg-sand-100/70 px-5 py-3 border-b border-sand-200">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-medium text-brand-800">
              {diffToFree > 0 ? (
                <>Add <span className="font-bold text-gold-700">Rs. {diffToFree.toLocaleString()}</span> more for <span className="font-bold text-emerald-700">FREE Delivery</span></>
              ) : (
                <span className="font-bold text-emerald-700 flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4" /> You have unlocked FREE Nationwide Delivery!
                </span>
              )}
            </span>
            <span className="text-[11px] font-semibold text-brand-600">{progress}%</span>
          </div>
          <div className="w-full bg-sand-300 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-gold-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {cart.length === 0 ? (
            <div className="text-center py-16 space-y-4">
              <div className="w-16 h-16 rounded-full bg-sand-200 flex items-center justify-center mx-auto text-brand-400">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-lg font-bold text-brand-900">Your Bag is Empty</h3>
              <p className="text-xs text-brand-600 max-w-xs mx-auto">
                Explore our exquisite Lawn, Chiffon, and Pret collections to find your perfect ensemble.
              </p>
              <button
                onClick={closeCart}
                className="inline-block mt-2 px-6 py-2.5 bg-brand-900 hover:bg-brand-800 text-sand-50 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors"
              >
                Browse Collections
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div 
                key={item.variantId} 
                className="flex gap-4 p-3 bg-white rounded-xl border border-sand-200 shadow-sm relative group"
              >
                <div className="relative w-20 h-24 rounded-lg overflow-hidden bg-sand-100 shrink-0">
                  <Image 
                    src={item.image || "/assets/1.png"} 
                    alt={item.productTitle} 
                    fill 
                    className="object-cover" 
                  />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between pr-5">
                      <Link 
                        href={`/product/${item.productSlug}`} 
                        onClick={closeCart}
                        className="text-xs font-bold text-brand-900 hover:text-gold-700 line-clamp-2"
                      >
                        {item.productTitle}
                      </Link>
                    </div>
                    <p className="text-[11px] text-brand-600 mt-1">
                      Option: <span className="font-semibold text-brand-800">{item.size} • {item.stitchedType}</span>
                    </p>
                    <p className="text-[11px] text-brand-500">Color: {item.color}</p>
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    {/* Quantity Selector */}
                    <div className="flex items-center border border-sand-300 rounded bg-sand-50">
                      <button 
                        onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                        className="p-1 text-brand-700 hover:bg-sand-200 transition-colors"
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2 text-xs font-bold text-brand-900">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                        className="p-1 text-brand-700 hover:bg-sand-200 transition-colors"
                        disabled={item.quantity >= item.maxStock}
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Price */}
                    <div className="text-right">
                      <span className="font-serif font-bold text-sm text-brand-950">
                        Rs. {(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Delete button */}
                <button 
                  onClick={() => removeFromCart(item.variantId)} 
                  className="absolute top-2 right-2 text-sand-400 hover:text-maroon-600 transition-colors p-1"
                  title="Remove item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer / Checkout CTA */}
        {cart.length > 0 && (
          <div className="p-5 border-t border-sand-200 bg-white space-y-4">
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-brand-600">
                <span>Subtotal</span>
                <span className="font-semibold text-brand-900">Rs. {cartSubtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs text-brand-600">
                <span>Estimated Shipping</span>
                <span className="font-semibold text-brand-900">
                  {cartSubtotal >= FREE_SHIPPING_THRESHOLD ? (
                    <span className="text-emerald-700 font-bold">FREE</span>
                  ) : (
                    "Calculated at checkout"
                  )}
                </span>
              </div>
              <div className="flex justify-between text-base font-serif font-bold text-brand-950 pt-2 border-t border-sand-100">
                <span>Estimated Total</span>
                <span className="text-gold-700">Rs. {cartSubtotal.toLocaleString()}</span>
              </div>
            </div>

            <div className="space-y-2">
              <Link
                href="/checkout"
                onClick={closeCart}
                className="w-full py-3.5 bg-brand-900 hover:bg-brand-950 text-sand-50 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all"
              >
                Proceed to Checkout <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/cart"
                onClick={closeCart}
                className="w-full py-2.5 bg-sand-100 hover:bg-sand-200 text-brand-900 rounded-xl text-xs font-semibold tracking-wider flex items-center justify-center transition-all"
              >
                View Full Bag & Special Notes
              </Link>
            </div>

            <p className="text-[10px] text-center text-brand-500">
              Tax included. 100% Secure Checkout via COD, Meezan Bank, or JazzCash.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
