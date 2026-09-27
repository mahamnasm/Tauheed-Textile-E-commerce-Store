"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { Star, ChevronLeft, ChevronRight, CheckCircle, ShieldCheck, Maximize2, X } from "lucide-react";

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
  const [selectedReview, setSelectedReview] = useState<ReviewItem | null>(null);

  const scroll = (direction: "left" | "right") => {
    if (sliderRef.current) {
      const scrollAmount = direction === "left" ? -360 : 360;
      sliderRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const currentIndex = selectedReview
    ? reviews.findIndex((r) => r.id === selectedReview.id)
    : -1;

  const handlePrevReview = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (reviews.length === 0) return;
    const prevIdx = (currentIndex - 1 + reviews.length) % reviews.length;
    setSelectedReview(reviews[prevIdx]);
  };

  const handleNextReview = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (reviews.length === 0) return;
    const nextIdx = (currentIndex + 1) % reviews.length;
    setSelectedReview(reviews[nextIdx]);
  };

  // Keyboard navigation & body scroll lock for lightbox
  useEffect(() => {
    if (!selectedReview) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedReview(null);
      } else if (e.key === "ArrowLeft") {
        handlePrevReview();
      } else if (e.key === "ArrowRight") {
        handleNextReview();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedReview, currentIndex, reviews]);

  if (!reviews || reviews.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 select-none">
      {/* Header with Title and Left/Right Nav Arrows */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#7A6652] mb-1.5 flex items-center gap-1.5">
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
            onClick={() => setSelectedReview(rev)}
            className="w-[280px] sm:w-[340px] shrink-0 bg-white border border-[#E7E1D8] rounded-2xl p-5 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer group hover:-translate-y-1"
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

              {/* Full Portrait Customer Dress Photo (3:4 ratio showing entire dress) */}
              {rev.imageUrl && (
                <div className="relative aspect-[3/4] w-full mb-3.5 rounded-xl overflow-hidden border border-[#E7E1D8] bg-[#F8F5F0]">
                  <Image
                    src={rev.imageUrl}
                    alt={rev.title || "Customer dress review"}
                    fill
                    sizes="(max-width: 640px) 280px, 340px"
                    className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Subtle expand badge overlay on hover */}
                  <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-black/80 backdrop-blur-md text-white text-xs font-medium rounded-full shadow-lg transform translate-y-1 group-hover:translate-y-0 transition-transform">
                      <Maximize2 className="w-3.5 h-3.5" />
                      <span>View Full Dress</span>
                    </span>
                  </div>
                  {/* Expand icon pill */}
                  <div className="absolute top-2.5 right-2.5 p-1.5 bg-black/40 backdrop-blur-md text-white rounded-full opacity-80 group-hover:opacity-100 transition-opacity">
                    <Maximize2 className="w-3.5 h-3.5" />
                  </div>
                </div>
              )}

              {/* Title & Comment */}
              <h3 className="font-serif font-bold text-sm sm:text-base text-[#171717] leading-snug line-clamp-2 group-hover:text-[#7A6652] transition-colors">
                {rev.title || "Exquisite Luxury Quality"}
              </h3>
              <p className="text-xs sm:text-sm text-[#6B6259] italic mt-2 leading-relaxed line-clamp-3">
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
              <span className="text-[10px] font-mono text-[#9B8C7E] bg-[#F8F5F0] px-2 py-0.5 rounded border border-[#E7E1D8]">
                PK Verified
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* REVIEW LIGHTBOX MODAL (OPENS FULL PORTRAIT REVIEW & DRESS) */}
      {selectedReview && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6"
          onClick={() => setSelectedReview(null)}
          role="dialog"
          aria-modal="true"
        >
          {/* Modal Container */}
          <div
            className="relative max-w-4xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[92vh] border border-[#E7E1D8]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setSelectedReview(null)}
              className="absolute top-3 right-3 z-30 w-10 h-10 rounded-full bg-white/95 hover:bg-[#F0EBE3] text-[#171717] shadow-lg flex items-center justify-center transition-all hover:scale-105 border border-[#E7E1D8] focus:outline-none"
              aria-label="Close review modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Left Column: Full Portrait Dress Image (Contain ratio so complete dress shows) */}
            <div className="md:w-1/2 bg-[#0E0D0C] relative flex items-center justify-center p-3 sm:p-4 min-h-[340px] md:min-h-[560px] max-h-[50vh] md:max-h-[92vh] overflow-hidden">
              {selectedReview.imageUrl ? (
                <div className="relative w-full h-full min-h-[320px] md:min-h-[520px] flex items-center justify-center">
                  <Image
                    src={selectedReview.imageUrl}
                    alt={selectedReview.title || "Full dress review image"}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-contain drop-shadow-2xl"
                    priority
                  />
                  <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 px-3 py-1 bg-black/75 backdrop-blur-md text-white text-[11px] font-medium rounded-full border border-white/20">
                    <CheckCircle className="w-3.5 h-3.5 text-[#10B981]" />
                    <span>Verified Customer Photo</span>
                  </span>
                </div>
              ) : (
                <div className="text-center p-8 text-white/80">
                  <ShieldCheck className="w-16 h-16 text-[#D4AF37] mx-auto mb-3" />
                  <p className="font-serif text-lg font-bold">Verified Customer Review</p>
                  <p className="text-xs text-white/60 mt-1">Direct feedback from verified buyer</p>
                </div>
              )}
            </div>

            {/* Right Column: Review Details & Customer Verification */}
            <div className="md:w-1/2 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto bg-white max-h-[42vh] md:max-h-[92vh]">
              <div>
                {/* Stars & Verified Pill */}
                <div className="flex items-center justify-between gap-3 mb-3 flex-wrap">
                  <div className="flex items-center gap-1 text-[#D4AF37]">
                    {[...Array(selectedReview.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-current" />
                    ))}
                    <span className="ml-1.5 text-xs font-bold text-[#171717]">
                      {selectedReview.rating || 5}.0 / 5.0
                    </span>
                  </div>
                  <span className="inline-flex items-center gap-1 text-xs font-bold bg-[#E8F5E9] text-[#1A6B3C] border border-[#A5D6A7] px-2.5 py-1 rounded-full">
                    <CheckCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>Verified Purchase</span>
                  </span>
                </div>

                {/* Review Title */}
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#171717] leading-snug">
                  {selectedReview.title}
                </h3>

                {/* Review Comment Quote */}
                <div className="my-4 p-4 rounded-xl bg-[#F8F5F0] border border-[#E7E1D8]">
                  <p className="text-sm sm:text-base text-[#3A332C] italic leading-relaxed font-serif">
                    "{selectedReview.comment}"
                  </p>
                </div>

                {/* Customer Info */}
                <div className="pt-1">
                  <p className="font-bold text-[#171717] text-base">
                    {selectedReview.customerName}
                  </p>
                  {selectedReview.reviewerCity && (
                    <p className="text-xs sm:text-sm text-[#7A6652] font-semibold flex items-center gap-1.5 mt-1">
                      <span>📍</span>
                      <span>{selectedReview.reviewerCity}</span>
                    </p>
                  )}
                  <p className="text-xs text-[#8A7E72] mt-3 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-[#1A6B3C] shrink-0" />
                    <span>Dispatched & delivered by Tauheed Textile nationwide network</span>
                  </p>
                </div>
              </div>

              {/* Bottom Navigation: Prev / Next & Counter */}
              <div className="mt-6 pt-4 border-t border-[#E7E1D8]">
                <div className="flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={handlePrevReview}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[#E7E1D8] text-xs font-semibold text-[#171717] hover:bg-[#F0EBE3] transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Previous</span>
                  </button>

                  <span className="text-xs text-[#8A7E72] font-mono">
                    {currentIndex + 1} of {reviews.length}
                  </span>

                  <button
                    type="button"
                    onClick={handleNextReview}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[#E7E1D8] text-xs font-semibold text-[#171717] hover:bg-[#F0EBE3] transition-colors"
                  >
                    <span>Next</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
