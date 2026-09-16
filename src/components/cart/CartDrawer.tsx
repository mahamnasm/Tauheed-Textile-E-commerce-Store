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

  const FREE_SHIPPING_THRESHOLD = 9999;
  const progress = Math.min(100, Math.round((cartSubtotal / FREE_SHIPPING_THRESHOLD) * 100));
  const diffToFree = FREE_SHIPPING_THRESHOLD - cartSubtotal;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" 
        onClick={closeCart} 
      />

      <div className="fixed inset-y-0 right-0 max-w-md w-full bg-white shadow-2xl flex flex-col z-10 animate-slideLeft">
        {/* Header */}
        <div className="p-5 border-b border-[#E7E1D8] flex items-center justify-between bg-white">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-gold-600" />
            <h2 className="font-serif font-bold text-lg text-[#171717]">Your Shopping Bag</h2>
            <span className="text-xs bg-sand-200 text-[#171717] font-bold px-2 py-0.5 rounded-full">
              {cartCount}
            </span>
          </div>
          <button 
            onClick={closeCart} 
            className="p-1 rounded-full text-[#6B6259] hover:text-[#171717] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress Bar */}
        <div className="bg-[#F8F5F0] px-5 py-3 border-b border-[#E7E1D8]">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-medium text-[#171717]">
              {diffToFree > 0 ? (
                <>Add <span className="font-bold text-gold-700">Rs. {diffToFree.toLocaleString()}</span> more for <span className="font-bold text-emerald-700">FREE Delivery</span></>
              ) : (
                <span className="font-bold text-emerald-700 flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4" /> You have unlocked FREE Nationwide Delivery!
                </span>
              )}
            </span>
            <span className="text-[11px] font-semibold text-[#171717]">{progress}%</span>
          </div>
          <div className="w-full bg-[#E7E1D8] h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-emerald-600 h-full transition-all duration-300 rounded-full" 
              style={{ width: `${progress}%` }} 
            />
          </div>
          <div className="text-[11px] text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-100 flex items-center gap-1.5 mt-2 font-medium">
            <span>🏷️</span>
            <span>Advance Payment: Get <strong>Flat 5% OFF</strong> via Bank Transfer or Wallet!</span>
          </div>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {cart.length === 0 ? (
            <div className="text-center py-16 space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#F8F5F0] flex items-center justify-center mx-auto text-[#6B6259]">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-lg font-bold text-[#171717]">Your Bag is Empty</h3>
              <p className="text-xs text-[#6B6259] max-w-xs mx-auto">
                Explore our exquisite Lawn, Chiffon, and Pret collections to find your perfect ensemble.
              </p>
              <button
                onClick={closeCart}
                className="inline-block mt-2 px-6 py-2.5 bg-[#171717] hover:bg-[#2A2626] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors"
              >
                Browse Collections
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div 
                key={item.variantId} 
                className="flex gap-4 p-3 bg-[#F8F5F0] rounded-xl border border-[#E7E1D8] shadow-sm relative group"
              >
                <div className="relative w-20 h-24 rounded-lg overflow-hidden bg-white shrink-0">
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
                        className="text-xs font-bold text-[#171717] hover:text-gold-700 line-clamp-2"
                      >
                        {item.productTitle}
                      </Link>
                    </div>
                    <p className="text-[11px] text-[#6B6259] mt-1">
                      Option: <span className="font-semibold text-[#171717]">{item.size} • {item.stitchedType}</span>
                    </p>
                    <p className="text-[11px] text-[#6B6259]">Color: {item.color}</p>
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    {/* Quantity Selector */}
                    <div className="flex items-center border border-[#E7E1D8] rounded bg-white">
                      <button 
                        onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                        className="p-1 text-[#171717] hover:bg-sand-100 transition-colors"
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2 text-xs font-bold text-[#171717]">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                        className="p-1 text-[#171717] hover:bg-sand-100 transition-colors"
                        disabled={item.quantity >= item.maxStock}
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Price */}
                    <div className="text-right">
                      <span className="font-serif font-bold text-sm text-[#171717]">
                        Rs. {(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Delete button */}
                <button 
                  onClick={() => removeFromCart(item.variantId)} 
                  className="absolute top-2 right-2 text-[#9B3D3D] transition-colors p-1"
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
          <div className="p-5 border-t border-[#E7E1D8] bg-white space-y-4">
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-[#6B6259]">
                <span>Subtotal</span>
                <span className="font-semibold text-[#171717]">Rs. {cartSubtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs text-[#6B6259]">
                <span>Estimated Shipping</span>
                <span className="font-semibold text-[#171717]">
                  {cartSubtotal >= FREE_SHIPPING_THRESHOLD ? (
                    <span className="text-emerald-700 font-bold">FREE</span>
                  ) : (
                    "Calculated at checkout"
                  )}
                </span>
              </div>
              <div className="flex justify-between text-base font-serif font-bold text-[#171717] pt-2 border-t border-[#E7E1D8]">
                <span>Estimated Total</span>
                <span className="text-[#171717]">Rs. {cartSubtotal.toLocaleString()}</span>
              </div>
            </div>

            <div className="space-y-2">
              <Link
                href="/checkout"
                onClick={closeCart}
                className="w-full py-3.5 bg-[#171717] hover:bg-[#2A2626] text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all"
              >
                Proceed to Checkout <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/cart"
                onClick={closeCart}
                className="w-full py-2.5 bg-white border border-[#E7E1D8] hover:bg-[#F8F5F0] text-[#6B6259] rounded-xl text-xs font-semibold tracking-wider flex items-center justify-center transition-all"
              >
                View Full Bag & Special Notes
              </Link>
            </div>

            <p className="text-[10px] text-center text-[#6B6259]">
              Tax included. 100% Secure Checkout via COD, Meezan Bank, or JazzCash.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
