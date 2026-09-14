"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, Eye, ShoppingBag, Check } from "lucide-react";
import { useCart } from "@/context/CartContext";

export interface ProductCardProps {
  id: string;
  slug: string;
  title: string;
  fabric: string;
  basePrice: number;
  comparePrice?: number | null;
  salePrice?: number | null;
  images: { url: string; alt?: string | null }[];
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  isSale?: boolean;
  isPreOrder?: boolean;
  variants?: {
    id: string;
    size: string;
    color: string;
    stitchedType: string;
    priceAdjustment: number;
    stockQuantity: number;
  }[];
  onQuickView?: (product: any) => void;
}

export default function ProductCard({
  id,
  slug,
  title,
  fabric,
  basePrice,
  comparePrice,
  salePrice,
  images,
  isNewArrival,
  isBestSeller,
  isSale,
  isPreOrder,
  variants = [],
  onQuickView,
}: ProductCardProps) {
  const { toggleWishlist, isInWishlist, addToCart } = useCart();
  const [isHovered, setIsHovered] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const primaryImage = images[0]?.url || "/assets/reel-2.jpg";
  const hoverImage = images[1]?.url || primaryImage;
  const wishlisted = isInWishlist(id);

  const effectivePrice = salePrice || basePrice;
  const hasDiscount = comparePrice && comparePrice > effectivePrice;
  const discountPercent = hasDiscount
    ? Math.round(((comparePrice - effectivePrice) / comparePrice) * 100)
    : 0;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const defaultVariant = variants[0] || {
      id: `${id}-def`,
      size: "Unstitched",
      color: "Default",
      stitchedType: "Unstitched",
      priceAdjustment: 0,
      stockQuantity: 10,
    };

    addToCart(
      {
        variantId: defaultVariant.id,
        productId: id,
        productTitle: title,
        productSlug: slug,
        image: primaryImage,
        size: defaultVariant.size,
        color: defaultVariant.color,
        stitchedType: defaultVariant.stitchedType,
        price: effectivePrice + defaultVariant.priceAdjustment,
        maxStock: defaultVariant.stockQuantity,
      },
      1
    );

    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  return (
    <div 
      className="group relative flex flex-col bg-brand-900/90 rounded-2xl overflow-hidden border border-sand-900 hover:border-gold-500/50 shadow-xl hover:shadow-2xl transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Media Aspect Container with AI Cinematic Motion on Model */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-brand-950">
        <Link href={`/product/${slug}`} className="block w-full h-full">
          <Image
            src={isHovered ? hoverImage : primaryImage}
            alt={title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className={`object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105 ${
              isHovered ? "" : "animate-cinematic"
            }`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-950/60 via-transparent to-transparent pointer-events-none" />
        </Link>

        {/* Badges Overlay */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
          {isSale && (
            <span className="px-2 py-0.5 rounded bg-rose-700 text-white text-[10px] font-bold uppercase tracking-wider shadow">
              Sale -{discountPercent}%
            </span>
          )}
          {isNewArrival && !isSale && (
            <span className="px-2 py-0.5 rounded bg-gold-500 text-ink-black text-[10px] font-bold uppercase tracking-wider shadow">
              New In
            </span>
          )}
          {isBestSeller && !isSale && (
            <span className="px-2 py-0.5 rounded bg-deep-olive text-sand-100 text-[10px] font-bold uppercase tracking-wider shadow">
              Bestseller
            </span>
          )}
          {isPreOrder && (
            <span className="px-2 py-0.5 rounded bg-brand-950 text-gold-300 text-[10px] font-bold uppercase tracking-wider shadow border border-gold-400">
              Pre-Order
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(id);
          }}
          className={`absolute top-2.5 right-2.5 p-2 rounded-full backdrop-blur-md transition-all duration-200 shadow-sm z-10 ${
            wishlisted
              ? "bg-rose-600 text-white"
              : "bg-black/60 text-sand-200 hover:bg-black hover:text-rose-400 border border-sand-800"
          }`}
          aria-label="Wishlist"
        >
          <Heart className={`w-4 h-4 ${wishlisted ? "fill-current" : ""}`} />
        </button>

        {/* Quick View & Quick Add Floating Pill on Hover */}
        <div className="absolute bottom-3 inset-x-3 hidden sm:flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
          {onQuickView && (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onQuickView({
                  id,
                  slug,
                  title,
                  fabric,
                  basePrice,
                  comparePrice,
                  salePrice,
                  images,
                  variants,
                });
              }}
              className="flex-1 py-2 px-3 bg-ink-black/90 hover:bg-ink-black text-sand-100 rounded-xl text-xs font-semibold backdrop-blur shadow-md flex items-center justify-center gap-1.5 border border-sand-800 transition-colors"
            >
              <Eye className="w-3.5 h-3.5 text-gold-400" />
              Quick View
            </button>
          )}

          <button
            onClick={handleQuickAdd}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold backdrop-blur shadow-md flex items-center justify-center gap-1.5 transition-all ${
              justAdded
                ? "bg-emerald-600 text-white"
                : "bg-gold-500 hover:bg-gold-600 text-ink-black font-bold"
            }`}
          >
            {justAdded ? (
              <>
                <Check className="w-3.5 h-3.5" /> Added
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5 text-ink-black" /> + Add
              </>
            )}
          </button>
        </div>
      </div>

      {/* Content Details */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-2.5 bg-brand-900/60">
        <div>
          <span className="text-[10px] uppercase tracking-widest text-gold-400 font-bold">
            {fabric}
          </span>
          <Link href={`/product/${slug}`} className="block group-hover:text-gold-300 transition-colors">
            <h3 className="font-serif font-semibold text-sm sm:text-base text-sand-50 line-clamp-1 mt-0.5">
              {title}
            </h3>
          </Link>
        </div>

        {/* Pricing */}
        <div className="pt-1 flex items-baseline gap-2">
          <span className="font-serif font-bold text-base sm:text-lg text-gold-300">
            Rs. {effectivePrice.toLocaleString()}
          </span>
          {hasDiscount && (
            <span className="text-xs text-sand-500 line-through">
              Rs. {comparePrice.toLocaleString()}
            </span>
          )}
        </div>

        {/* Mobile Quick Add Button */}
        <button
          onClick={handleQuickAdd}
          className="sm:hidden w-full py-2 mt-1 bg-gold-500 text-ink-black font-bold rounded-lg text-xs flex items-center justify-center gap-1"
        >
          {justAdded ? <Check className="w-3.5 h-3.5" /> : <ShoppingBag className="w-3.5 h-3.5 text-ink-black" />}
          {justAdded ? "Added" : "Quick Add"}
        </button>
      </div>
    </div>
  );
}
