"use client";

import React, { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ArrowRight, Sparkles } from "lucide-react";

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  image?: string | null;
  href?: string;
}

interface HomeCategoriesSectionProps {
  categories?: CategoryItem[];
  title?: string;
  subtitle?: string;
}

export const STORE_FEATURED_COLLECTIONS = [
  {
    id: "col-new-in",
    name: "New In 2026",
    slug: "new-in-2026",
    href: "/shop?isNewArrival=true",
    image: "/assets/hero-model.jpg",
    badge: "Just Arrived",
  },
  {
    id: "col-lawn-summer",
    name: "Lawn & Summer",
    slug: "lawn-summer",
    href: "/shop?category=lawn-summer",
    image: "/assets/banners/banner-lawn.jpg",
    badge: "Pure Cotton",
  },
  {
    id: "col-lawn-formals",
    name: "Lawn Formals",
    slug: "lawn-formals",
    href: "/shop?category=lawn-formals",
    image: "/assets/products/prod-bano-printed.jpg",
    badge: "Festive Lawn",
  },
  {
    id: "col-chiffon-formal",
    name: "Chiffon & Formal",
    slug: "chiffon-formal",
    href: "/shop?category=chiffon-formal",
    image: "/assets/banners/banner-chiffon.jpg",
    badge: "Hand Embellished",
  },
  {
    id: "col-silk",
    name: "Silk Collection",
    slug: "silk",
    href: "/shop?category=silk",
    image: "/assets/banners/banner-festive.jpg",
    badge: "Raw & Medium Silk",
  },
  {
    id: "col-net-formals",
    name: "Net Formals",
    slug: "net-formals",
    href: "/shop?category=net-formals",
    image: "/assets/products/prod-noor-bridal.jpg",
    badge: "Luxury Net",
  },
  {
    id: "col-organza-formals",
    name: "Organza Formals",
    slug: "organza-formals",
    href: "/shop?category=organza-formals",
    image: "/assets/products/prod-zehra-chiffon.jpg",
    badge: "Zardozi Work",
  },
  {
    id: "col-bridal-maxies",
    name: "Bridal Maxies",
    slug: "bridal-maxies",
    href: "/shop?category=bridal-maxies",
    image: "/assets/prod-bridal.jpg",
    badge: "Royal Couture",
  },
  {
    id: "col-saries",
    name: "Saries",
    slug: "saries",
    href: "/shop?category=saries",
    image: "/assets/prod-nafasat.jpg",
    badge: "Graceful Drapes",
  },
  {
    id: "col-winter-collection",
    name: "Winter Collection",
    slug: "winter-collection",
    href: "/shop?category=winter-collection",
    image: "/assets/products/prod-aira-velvet.jpg",
    badge: "Velvet & Pashmina",
  },
  {
    id: "col-sale",
    name: "Sale & Clearance",
    slug: "sale",
    href: "/shop?category=sale",
    image: "/assets/banners/banner-sale.jpg",
    badge: "Up to 50% Off",
    isSale: true,
  },
];

export default function HomeCategoriesSection({
  categories,
  title,
  subtitle,
}: HomeCategoriesSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const offset = direction === "left" ? -320 : 320;
      scrollRef.current.scrollBy({ left: offset, behavior: "smooth" });
    }
  };

  // Combine default 11 curated collections with any custom overrides from DB
  const displayCollections = STORE_FEATURED_COLLECTIONS.map((def) => {
    const dbMatch = categories?.find((c) => c.slug === def.slug);
    return {
      ...def,
      image: dbMatch?.image && !dbMatch.image.endsWith(".png") ? dbMatch.image : def.image,
    };
  });

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 select-none">
      {/* Section Header */}
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
            View All ({displayCollections.length})
          </Link>
          <button
            onClick={() => scroll("left")}
            className="w-10 h-10 rounded-full bg-white hover:bg-[#F0EBE3] text-[#171717] flex items-center justify-center transition-all border border-[#E7E1D8] shadow-sm active:scale-95"
            aria-label="Previous Collection"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => scroll("right")}
            className="w-10 h-10 rounded-full bg-white hover:bg-[#F0EBE3] text-[#171717] flex items-center justify-center transition-all border border-[#E7E1D8] shadow-sm active:scale-95"
            aria-label="Next Collection"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Horizontal Scrollable Row (Left-to-Right) */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-4 scroll-smooth scrollbar-thin snap-x snap-mandatory"
      >
        {displayCollections.map((cat) => (
          <Link
            key={cat.id}
            href={cat.href}
            className="group w-[210px] sm:w-[240px] shrink-0 snap-start relative rounded-2xl overflow-hidden aspect-[3/4] bg-[#EDE8E1] block shadow-sm hover:shadow-xl transition-all duration-300 border border-[#E7E1D8]/60"
          >
            {/* Background Collection Image */}
            <Image
              src={cat.image}
              alt={cat.name}
              fill
              className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
              sizes="240px"
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />

            {/* Top Badge */}
            <div className="absolute top-3 left-3 z-10">
              <span
                className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full backdrop-blur-md ${
                  cat.isSale
                    ? "bg-rose-950/80 text-rose-200 border border-rose-700/60"
                    : "bg-black/50 text-sand-100 border border-white/20"
                }`}
              >
                {cat.badge}
              </span>
            </div>

            {/* Bottom Content */}
            <div className="absolute bottom-4 inset-x-3 text-center z-10">
              <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-[#E7E1D8] block mb-0.5 opacity-90">
                Collection
              </span>
              <h3 className="font-serif font-bold text-white text-sm sm:text-base tracking-wide drop-shadow leading-snug">
                {cat.name}
              </h3>
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-white/80 group-hover:text-white mt-1 transition-colors">
                Explore <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform text-gold-400" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
