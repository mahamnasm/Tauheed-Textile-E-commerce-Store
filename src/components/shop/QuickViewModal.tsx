"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, Check, ShoppingBag, ShieldCheck, ArrowRight } from "lucide-react";
import { useCart } from "@/context/CartContext";

interface QuickViewModalProps {
  product: any | null;
  onClose: () => void;
}

export default function QuickViewModal({ product, onClose }: QuickViewModalProps) {
  const { addToCart } = useCart();
  const [selectedVariantId, setSelectedVariantId] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  if (!product) return null;

  const variants = product.variants || [];
  const selectedVariant = variants.find((v: any) => v.id === selectedVariantId) || variants[0];
  const effectivePrice = (product.salePrice || product.basePrice) + (selectedVariant?.priceAdjustment || 0);

  const handleAddToCart = () => {
    if (!selectedVariant) return;
    addToCart(
      {
        variantId: selectedVariant.id,
        productId: product.id,
        productTitle: product.title,
        productSlug: product.slug,
        image: product.images?.[0]?.url || "/assets/1.png",
        size: selectedVariant.size,
        color: selectedVariant.color,
        stitchedType: selectedVariant.stitchedType,
        price: effectivePrice,
        maxStock: selectedVariant.stockQuantity || 10,
        weight: (product as any).weight || (product.pieceCount === 2 ? 0.8 : (product.pieceCount === 1 ? 0.5 : 1.0)),
      },
      quantity
    );
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-brand-950/70 backdrop-blur-sm transition-opacity"
        onClick={onClose} 
      />

      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden z-10 animate-fadeIn">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-sand-100 hover:bg-sand-200 text-brand-700"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Image */}
          <div className="relative aspect-[3/4] md:aspect-auto h-72 md:h-full bg-sand-100">
            <Image
              src={product.images?.[0]?.url || "/assets/1.png"}
              alt={product.title}
              fill
              className="object-cover"
            />
          </div>

          {/* Details */}
          <div className="p-6 flex flex-col justify-between space-y-4">
            <div>
              <span className="text-xs uppercase tracking-wider text-gold-700 font-semibold">
                {product.fabric}
              </span>
              <h2 className="font-serif font-bold text-xl text-brand-950 mt-1">
                {product.title}
              </h2>

              <div className="mt-2 flex items-baseline gap-3">
                <span className="font-serif font-bold text-xl text-brand-900">
                  Rs. {effectivePrice.toLocaleString()}
                </span>
                {product.comparePrice && product.comparePrice > effectivePrice && (
                  <span className="text-sm text-sand-400 line-through">
                    Rs. {product.comparePrice.toLocaleString()}
                  </span>
                )}
              </div>
            </div>

            {/* Variant / Size Options */}
            {variants.length > 0 && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-brand-900 uppercase tracking-wider block">
                  Select Option & Stitching
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {variants.map((v: any) => {
                    const isSelected = (selectedVariant?.id === v.id);
                    return (
                      <button
                        key={v.id}
                        onClick={() => setSelectedVariantId(v.id)}
                        className={`px-3 py-2 rounded-lg text-xs font-medium border text-left flex flex-col justify-center transition-all ${
                          isSelected
                            ? "border-gold-600 bg-sand-50 text-gold-900 ring-1 ring-gold-600"
                            : "border-sand-300 hover:border-gold-400 text-brand-800"
                        }`}
                      >
                        <span className="font-bold">{v.size} ({v.stitchedType})</span>
                        <span className="text-[10px] text-brand-500">
                          {v.priceAdjustment > 0 ? `+Rs. ${v.priceAdjustment}` : "Included"}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quantity and Add to Cart */}
            <div className="space-y-3 pt-2">
              <div className="flex gap-3">
                <div className="flex items-center border border-sand-300 rounded-lg px-2 bg-sand-50">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-2 py-1 text-brand-700 hover:text-gold-700 font-bold"
                  >
                    -
                  </button>
                  <span className="px-3 text-xs font-bold text-brand-900">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-2 py-1 text-brand-700 hover:text-gold-700 font-bold"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all ${
                    added
                      ? "bg-emerald-600 text-white"
                      : "bg-brand-900 hover:bg-brand-950 text-sand-50"
                  }`}
                >
                  {added ? (
                    <>
                      <Check className="w-4 h-4" /> Added to Bag
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4 text-gold-400" /> Add to Bag
                    </>
                  )}
                </button>
              </div>

              <div className="flex items-center justify-between text-xs pt-2 border-t border-sand-200">
                <div className="flex items-center gap-1.5 text-brand-600">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Cash on Delivery Available</span>
                </div>
                <Link
                  href={`/product/${product.slug}`}
                  onClick={onClose}
                  className="text-gold-700 hover:text-gold-800 font-semibold flex items-center gap-1"
                >
                  Full Details <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
