"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { Star, ChevronLeft, ChevronRight, CheckCircle, ShieldCheck } from "lucide-react";

export interface ReviewItem {
  id: string;
  customerName: string;
  reviewerCity?: string | null;
  rating: number;
  title: string;
  comment: string;
  imageUrl?: string | null;
}

interface HomeReviewsSliderProps {
  reviews: ReviewItem[];
  title?: string;
  subtitle?: string;
}

export default function HomeReviewsSlider({
  reviews,
  title = "Customer Voices & Reviews",
  subtitle = "Loved by women across Pakistan for pure Swiss lawn, ethereal dupattas, and master tailoring",
}: HomeReviewsSliderProps) {
  const sliderRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (sliderRef.current) {
      const scrollAmount = direction === "left" ? -360 : 360;
      sliderRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  if (!reviews || reviews.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 select-none">
      {/* Header with Title and Left/Right Nav Arrows */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#7A6652] block mb-1.5 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#7A6652]" />
            <span>100% Verified Customer Feedback</span>
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#171717]">
            {title}
          </h2>
          <p className="text-xs sm:text-sm text-[#6B6259] mt-1 max-w-2xl">
            {subtitle}
          </p>
        </div>

        {/* Carousel Navigation Arrows */}
        <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
          <button
            type="button"
            onClick={() => scroll("left")}
            className="w-10 h-10 rounded-full bg-white hover:bg-[#F0EBE3] border border-[#E7E1D8] text-[#171717] flex items-center justify-center transition-all shadow-xs hover:scale-105 focus:outline-none"
            aria-label="Previous Reviews"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={() => scroll("right")}
            className="w-10 h-10 rounded-full bg-white hover:bg-[#F0EBE3] border border-[#E7E1D8] text-[#171717] flex items-center justify-center transition-all shadow-xs hover:scale-105 focus:outline-none"
            aria-label="Next Reviews"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Horizontal Slidable Row (Left-to-Right Swipeable on Mobile) */}
      <div
        ref={sliderRef}
        className="flex items-stretch gap-5 overflow-x-auto pb-6 pt-1 scrollbar-thin scroll-smooth overscroll-x-contain"
        style={{ scrollSnapType: "x mandatory" }}
      >
        {reviews.map((rev) => (
          <div
            key={rev.id}
            className="w-[290px] sm:w-[350px] shrink-0 bg-white border border-[#E7E1D8] rounded-2xl p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            style={{ scrollSnapAlign: "start" }}
          >
            <div>
              {/* Star Rating & Verified Buyer Pill */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-1 text-[#D4AF37]">
                  {[...Array(rev.rating || 5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-[#E8F5E9] text-[#1A6B3C] border border-[#A5D6A7] px-2 py-0.5 rounded-full">
                  <CheckCircle className="w-3 h-3 shrink-0" />
                  <span>Verified Buyer</span>
                </span>
              </div>

              {/* Customer Unboxing Photo if present */}
              {rev.imageUrl && (
                <div className="relative h-44 w-full mb-3 rounded-xl overflow-hidden border border-[#E7E1D8] bg-[#F8F5F0]">
                  <Image
                    src={rev.imageUrl}
                    alt={rev.title || "Customer unboxing photo"}
                    fill
                    className="object-cover object-top hover:scale-105 transition-transform duration-500"
                  />
                </div>
              )}

              {/* Title & Comment */}
              <h3 className="font-serif font-bold text-sm sm:text-base text-[#171717] leading-snug">
                {rev.title || "Exquisite Luxury Quality"}
              </h3>
              <p className="text-xs sm:text-sm text-[#6B6259] italic mt-2 leading-relaxed">
                "{rev.comment}"
              </p>
            </div>

            {/* Reviewer Details & Location */}
            <div className="mt-5 pt-3.5 border-t border-[#E7E1D8] flex items-center justify-between">
              <div>
                <p className="font-bold text-[#171717] text-xs sm:text-sm">
                  {rev.customerName}
                </p>
                {rev.reviewerCity && (
                  <p className="text-[11px] text-[#7A6652] font-semibold flex items-center gap-1 mt-0.5">
                    <span>📍</span>
                    <span>{rev.reviewerCity}</span>
                  </p>
                )}
              </div>
              <span className="text-[10px] font-mono text-[#9B8C7E] bg-[#F8F5F0] px-2 py-0.5 rounded">
                PK Verified
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
