"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { SiteLayoutSettings } from "@/lib/settings";

export interface HeroBanner {
  id: string;
  image: string;
  tag: string;
  title: string;
  subtitle: string;
  btnText: string;
  link: string;
  saleBadge?: string;
  alignment?: "left" | "right" | "center";
}

interface HeroBannerSliderProps {
  settings?: SiteLayoutSettings;
}

export default function HeroBannerSlider({ settings }: HeroBannerSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const banners: HeroBanner[] = [
    {
      id: "banner-1",
      image: settings?.banner1Image || "/assets/banners/banner-sale.jpg",
      tag: settings?.banner1Tag || "FESTIVE SALE",
      title: settings?.banner1Title || "UP TO 50% OFF",
      subtitle: settings?.banner1Subtitle || "Exclusive seasonal markdowns on luxury stitched & unstitched",
      btnText: settings?.banner1BtnText || "SHOP SALE",
      link: settings?.banner1Link || "/shop?category=sale",
      saleBadge: settings?.banner1SaleBadge || "SPECIAL DISCOUNT",
      alignment: "left",
    },
    {
      id: "banner-2",
      image: settings?.banner2Image || "/assets/banners/banner-lawn.jpg",
      tag: settings?.banner2Tag || "NEW ARRIVALS 2026",
      title: settings?.banner2Title || "SUMMER LAWN '26",
      subtitle: settings?.banner2Subtitle || "Breathable pure Egyptian cotton lawn with handcrafted dupattas",
      btnText: settings?.banner2BtnText || "EXPLORE LAWN",
      link: settings?.banner2Link || "/shop?category=lawn-summer",
      alignment: "left",
    },
    {
      id: "banner-3",
      image: settings?.banner3Image || "/assets/banners/banner-chiffon.jpg",
      tag: settings?.banner3Tag || "LUXURY FORMALS",
      title: settings?.banner3Title || "ROYAL CHIFFON EDIT",
      subtitle: settings?.banner3Subtitle || "Hand-embellished tilla, sequins and master-tailored silhouettes",
      btnText: settings?.banner3BtnText || "SHOP FORMALS",
      link: settings?.banner3Link || "/shop?category=chiffon-formal",
      alignment: "left",
    },
    {
      id: "banner-4",
      image: settings?.banner4Image || "/assets/banners/banner-festive.jpg",
      tag: settings?.banner4Tag || "SIGNATURE COUTURE",
      title: settings?.banner4Title || "EVERYDAY ELEGANCE",
      subtitle: settings?.banner4Subtitle || "Timeless ivory & antique gold ensembles for weddings and soirees",
      btnText: settings?.banner4BtnText || "SHOP COLLECTION",
      link: settings?.banner4Link || "/shop?category=silk",
      alignment: "left",
    },
  ];

  // Auto-play interval (4.5 seconds like Limelight / Sapphire)
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 4500);

    return () => clearInterval(timer);
  }, [isPaused, banners.length]);

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  };

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  // Mobile Touch Swipe Handling
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const diff = touchStartX.current - touchEndX.current;
    if (diff > 50) {
      goToNext();
    } else if (diff < -50) {
      goToPrev();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <section
      className="relative w-full overflow-hidden bg-[#171717] select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="relative w-full h-[65vh] sm:h-[75vh] lg:h-[84vh] min-h-[460px]">
        {banners.map((banner, index) => {
          const isActive = index === currentIndex;
          return (
            <div
              key={banner.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
              }`}
            >
              {/* Background Model Photo - Crisp and clearly visible! */}
              <Image
                src={banner.image}
                alt={banner.title}
                fill
                priority={index === 0}
                className="object-cover object-top sm:object-center"
                sizes="100vw"
              />

              {/* Minimal subtle gradient on bottom-left only, preserving model's face and dress clarity */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent sm:bg-gradient-to-r sm:from-black/70 sm:via-black/15 sm:to-transparent" />

              {/* Clean Minimal Text Overlay - Limelight style */}
              <div className="absolute inset-0 flex items-end sm:items-center pb-12 sm:pb-0">
                <div className="max-w-7xl w-full mx-auto px-6 sm:px-10 lg:px-16">
                  <div className="max-w-lg space-y-3 sm:space-y-4">
                    {/* Badge / Tag */}
                    <div className="inline-flex items-center gap-2">
                      <span className="px-3 py-1 text-[11px] font-semibold tracking-widest uppercase rounded-full bg-white/20 backdrop-blur-md text-white border border-white/30">
                        {banner.tag}
                      </span>
                      {banner.saleBadge && (
                        <span className="px-2.5 py-1 text-[11px] font-bold tracking-widest uppercase rounded-full bg-[#9B3D3D] text-white">
                          {banner.saleBadge}
                        </span>
                      )}
                    </div>

                    {/* Headline */}
                    <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-tight drop-shadow-md">
                      {banner.title}
                    </h2>

                    {/* Minimal Subtitle */}
                    <p className="text-white/90 text-xs sm:text-sm font-sans max-w-sm drop-shadow line-clamp-2">
                      {banner.subtitle}
                    </p>

                    {/* CTA Button */}
                    <div className="pt-2">
                      <Link
                        href={banner.link}
                        className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-white text-[#171717] hover:bg-[#F8F5F0] text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-lg hover:scale-105"
                      >
                        <span>{banner.btnText}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Prev / Next Arrows (Limelight style) */}
        <button
          onClick={goToPrev}
          className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur-md flex items-center justify-center transition-all duration-200 border border-white/20 shadow-md focus:outline-none"
          aria-label="Previous Slide"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
        <button
          onClick={goToNext}
          className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur-md flex items-center justify-center transition-all duration-200 border border-white/20 shadow-md focus:outline-none"
          aria-label="Next Slide"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* Slide Indicators / Dots */}
        <div className="absolute bottom-5 left-0 right-0 z-20 flex items-center justify-center gap-2.5">
          {banners.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-2 rounded-full transition-all duration-300 focus:outline-none ${
                currentIndex === idx
                  ? "w-8 bg-white shadow-md"
                  : "w-2 bg-white/40 hover:bg-white/70"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
