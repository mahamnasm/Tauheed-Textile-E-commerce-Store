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
      className="group relative flex flex-col bg-white rounded-xl overflow-hidden border border-[#E7E1D8] hover:shadow-lg transition-all duration-200"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Media Aspect Container */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#F5F0EB]">
        <Link href={`/product/${slug}`} className="block w-full h-full">
          <Image
            src={isHovered ? hoverImage : primaryImage}
            alt={title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover object-top transition-transform duration-500 ease-out group-hover:scale-105"
          />
        </Link>

        {/* Badges Overlay */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
          {isSale && (
            <span className="px-2 py-0.5 rounded bg-[#9B3D3D] text-white text-[10px] font-semibold">
              Sale
            </span>
          )}
          {isNewArrival && !isSale && (
            <span className="px-2 py-0.5 rounded bg-[#171717] text-white text-[10px] font-semibold">
              New In
            </span>
          )}
          {isBestSeller && !isSale && (
            <span className="px-2 py-0.5 rounded bg-[#7A6652] text-white text-[10px] font-semibold">
              Bestseller
            </span>
          )}
          {isPreOrder && (
            <span className="px-2 py-0.5 rounded bg-[#E7E1D8] text-[#171717] text-[10px] font-semibold">
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
          className={`absolute top-2 right-2 p-2 rounded-full transition-all duration-200 shadow-sm z-10 ${
            wishlisted
              ? "bg-[#9B3D3D] text-white"
              : "bg-white/90 text-[#6B6259] hover:text-[#9B3D3D]"
          }`}
          aria-label="Wishlist"
        >
          <Heart className={`w-4 h-4 ${wishlisted ? "fill-current" : ""}`} />
        </button>

        {/* Quick View & Quick Add Floating Pill on Hover (Desktop) */}
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
              className="flex-1 py-1.5 px-3 bg-white text-[#171717] border border-[#E7E1D8] rounded-full text-xs font-semibold shadow-sm flex items-center justify-center gap-1.5 transition-colors"
            >
              <Eye className="w-3.5 h-3.5" />
              Quick View
            </button>
          )}

          <button
            onClick={handleQuickAdd}
            className={`flex-1 py-1.5 px-3 rounded-full text-xs font-semibold shadow-sm flex items-center justify-center gap-1.5 transition-all ${
              justAdded
                ? "bg-[#2D6A4F] text-white"
                : "bg-[#171717] text-white hover:bg-black"
            }`}
          >
            {justAdded ? (
              <>
                <Check className="w-3.5 h-3.5" /> Added
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" /> + Add
              </>
            )}
          </button>
        </div>
      </div>

      {/* Content Details */}
      <div className="p-3 bg-white flex-1 flex flex-col justify-between">
        <div>
          <span className="text-[10px] uppercase tracking-wider text-[#7A6652] font-semibold">
            {fabric}
          </span>
          <Link href={`/product/${slug}`} className="block transition-colors">
            <h3 className="font-serif font-semibold text-sm text-[#171717] line-clamp-2 mt-0.5 leading-snug">
              {title}
            </h3>
          </Link>

          {/* Pricing */}
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-serif font-bold text-base text-[#171717]">
              Rs. {effectivePrice.toLocaleString()}
            </span>
            {hasDiscount && (
              <>
                <span className="text-xs text-[#9B9289] line-through">
                  Rs. {comparePrice.toLocaleString()}
                </span>
                <span className="text-[10px] font-bold text-[#9B3D3D] bg-[#FEF2F2] px-1.5 py-0.5 rounded">
                  -{discountPercent}%
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Quick Add Button */}
      <button
        onClick={handleQuickAdd}
        className={`sm:hidden w-full py-2.5 text-xs font-semibold rounded-b-xl flex items-center justify-center gap-1.5 ${
          justAdded ? "bg-[#2D6A4F] text-white" : "bg-[#171717] text-white"
        }`}
      >
        {justAdded ? (
          <Check className="w-4 h-4" />
        ) : (
          <ShoppingBag className="w-4 h-4" />
        )}
        {justAdded ? "Added" : "Quick Add"}
      </button>
    </div>
  );
}
