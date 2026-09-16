"use client";

import React, { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  image?: string | null;
}

interface HomeCategoriesSectionProps {
  categories: CategoryItem[];
  title?: string;
  subtitle?: string;
}

const CATEGORY_IMAGES: Record<string, string> = {
  "lawn-summer": "/assets/banners/banner-lawn.jpg",
  "lawn-formals": "/assets/products/prod-bano-printed.jpg",
  "chiffon-formal": "/assets/banners/banner-chiffon.jpg",
  "silk": "/assets/banners/banner-festive.jpg",
  "net-formals": "/assets/products/prod-noor-bridal.jpg",
  "organza-formals": "/assets/products/prod-zehra-chiffon.jpg",
  "bridal-maxies": "/assets/products/prod-bridal.jpg",
  "saries": "/assets/products/prod-nafasat.jpg",
  "winter-collection": "/assets/products/prod-aira-velvet.jpg",
  "sale": "/assets/banners/banner-sale.jpg",
};

export default function HomeCategoriesSection({
  categories,
  title,
  subtitle,
}: HomeCategoriesSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const offset = direction === "left" ? -300 : 300;
      scrollRef.current.scrollBy({ left: offset, behavior: "smooth" });
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#7A6652] block mb-2">
            Explore Collections
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#171717]">
            {title || "Curated Designer Collections"}
          </h2>
          <p className="text-xs sm:text-sm text-[#6B6259] mt-1 max-w-xl">
            {subtitle || "Swipe left to right to explore our unstitched lawn, chiffons, silks, and bridal couture."}
          </p>
        </div>

        {/* Action Controls & Navigation Arrows */}
        <div className="flex items-center gap-3">
          <Link
            href="/shop"
            className="text-xs uppercase tracking-wider font-bold text-[#171717] hover:text-[#7A6652] transition-colors underline mr-2"
          >
            View All
          </Link>
          <button
            onClick={() => scroll("left")}
            className="w-9 h-9 rounded-full bg-white hover:bg-[#F0EBE3] text-[#171717] flex items-center justify-center transition-all border border-[#E7E1D8] shadow-sm active:scale-95"
            aria-label="Previous Category"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scroll("right")}
            className="w-9 h-9 rounded-full bg-white hover:bg-[#F0EBE3] text-[#171717] flex items-center justify-center transition-all border border-[#E7E1D8] shadow-sm active:scale-95"
            aria-label="Next Category"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Horizontal Scrollable Row (Left-to-Right) */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-4 scroll-smooth scrollbar-thin snap-x snap-mandatory"
      >
        {categories.map((cat) => {
          const catImg =
            cat.image && !cat.image.endsWith(".png")
              ? cat.image
              : CATEGORY_IMAGES[cat.slug] || "/assets/banners/banner-lawn.jpg";

          return (
            <Link
              key={cat.id}
              href={`/shop?category=${cat.slug}`}
              className="group w-[210px] sm:w-[240px] shrink-0 snap-start relative rounded-2xl overflow-hidden aspect-[3/4] bg-[#EDE8E1] block shadow-sm hover:shadow-xl transition-all duration-300"
            >
              <Image
                src={catImg}
                alt={cat.name}
                fill
                className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
                sizes="240px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />

              <div className="absolute bottom-4 inset-x-3 text-center">
                <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-[#E7E1D8] block mb-0.5 opacity-90">
                  Collection
                </span>
                <h3 className="font-serif font-bold text-white text-sm sm:text-base tracking-wide drop-shadow">
                  {cat.name}
                </h3>
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-white/80 group-hover:text-white mt-1">
                  Explore <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
