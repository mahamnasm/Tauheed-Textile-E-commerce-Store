"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Play, X, Sparkles, Film } from "lucide-react";
import UniversalVideoPlayer from "@/components/common/UniversalVideoPlayer";
import { parseVideoUrl } from "@/lib/videoUtils";

interface FloatingRunwayReelProps {
  videoUrl?: string | null;
  productTitle?: string;
  thumbnailUrl?: string;
}

export default function FloatingRunwayReel({
  videoUrl,
  productTitle = "Luxury Runway Showcase",
  thumbnailUrl,
}: FloatingRunwayReelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  // 1. CONDITIONAL RENDERING: Strict check — completely hidden if no video is linked
  if (!videoUrl || isDismissed) {
    return null;
  }

  const parsed = parseVideoUrl(videoUrl);
  const isDirectVideo = parsed.type === "direct";

  return (
    <>
      {/* ============================================================ */}
      {/* 2. FLOATING SQUARE PREVIEW CONTAINER                         */}
      {/* CRUCIAL PLACEMENT: bottom-24 on mobile floats safely above    */}
      {/* the sticky "Add to Bag" & "WhatsApp" taskbar (height ~75px). */}
      {/* ============================================================ */}
      <div
        className="fixed bottom-24 sm:bottom-8 right-4 sm:right-6 z-40 animate-fadeIn"
        role="region"
        aria-label="Floating Runway Reel"
      >
        <div className="relative group">
          {/* Dismiss Button (Mini 'X' on top corner) */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsDismissed(true);
            }}
            className="absolute -top-2 -left-2 z-10 w-5 h-5 rounded-full bg-brand-950/90 text-sand-200 hover:text-white hover:bg-black border border-gold-400/50 flex items-center justify-center text-[10px] shadow-md transition-all opacity-80 group-hover:opacity-100 cursor-pointer"
            title="Dismiss video preview"
            aria-label="Close floating video"
          >
            <X className="w-3 h-3" />
          </button>

          {/* Square Thumbnail Trigger */}
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="relative w-20 h-20 sm:w-24 sm:h-24 aspect-square rounded-2xl overflow-hidden bg-brand-950 border-2 border-gold-400/90 shadow-[0_8px_30px_rgba(0,0,0,0.35)] ring-2 ring-gold-400/30 hover:scale-105 active:scale-95 transition-all duration-300 flex flex-col justify-between p-1.5 cursor-pointer text-left focus:outline-none focus:ring-4 focus:ring-gold-500/50"
            title="Watch Model Runway Reel"
          >
            {/* Background Media (Silent loop video if direct MP4, or model photo) */}
            <div className="absolute inset-0 z-0">
              {isDirectVideo ? (
                <video
                  src={parsed.rawUrl}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover opacity-75 group-hover:opacity-95 group-hover:scale-110 transition-all duration-500"
                />
              ) : thumbnailUrl ? (
                <Image
                  src={thumbnailUrl}
                  alt={productTitle}
                  fill
                  className="object-cover opacity-75 group-hover:opacity-95 group-hover:scale-110 transition-all duration-500"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-brand-900 via-brand-950 to-black" />
              )}
              {/* Dark luxury gradient scrim */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40" />
            </div>

            {/* Top Live Badge */}
            <div className="relative z-10 flex items-center justify-between w-full">
              <span className="px-1.5 py-0.5 rounded-full bg-brand-950/80 backdrop-blur-xs border border-gold-400/40 text-[9px] font-black uppercase tracking-wider text-gold-300 flex items-center gap-1 shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                Runway
              </span>
            </div>

            {/* Center Play Icon Overlay */}
            <div className="relative z-10 self-center my-auto">
              <div className="relative flex items-center justify-center">
                {/* Subtle pulsing gold ring */}
                <span className="absolute w-8 h-8 rounded-full bg-gold-400/40 animate-ping" />
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gold-500 hover:bg-gold-400 text-brand-950 flex items-center justify-center shadow-md transition-transform group-hover:scale-110">
                  <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-brand-950 ml-0.5" />
                </div>
              </div>
            </div>

            {/* Bottom Caption */}
            <div className="relative z-10 w-full text-center">
              <span className="block text-[9px] font-bold uppercase tracking-wider text-sand-100 truncate drop-shadow-md">
                Model Reel
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 3. FULL-SCREEN RUNWAY REEL VIDEO MODAL                       */}
      {/* ============================================================ */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="relative w-full max-w-lg bg-brand-950 rounded-3xl overflow-hidden shadow-2xl border border-gold-500/30 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Top Header */}
            <div className="p-3.5 sm:p-4 bg-brand-900/90 border-b border-sand-800/60 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-gold-500/10 text-gold-400 border border-gold-500/20">
                  <Film className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="font-serif font-bold text-xs sm:text-sm text-sand-50 truncate max-w-xs">
                    {productTitle}
                  </h3>
                  <p className="text-[10px] text-gold-400 font-mono">Runway Model Showcase • Live Motion</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Video Player Canvas */}
            <div className="relative w-full aspect-[9/16] max-h-[75vh] bg-black flex items-center justify-center overflow-hidden">
              <UniversalVideoPlayer
                src={videoUrl}
                poster={thumbnailUrl}
                autoPlay={true}
                controls={true}
                muted={false}
                loop={true}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Modal Bottom Banner */}
            <div className="p-3 bg-brand-950 border-t border-sand-800/60 flex items-center justify-between text-xs">
              <span className="text-[11px] text-sand-400 font-serif italic">
                Authentic Pakistani Designer Piece
              </span>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-3 py-1 bg-gold-600 hover:bg-gold-500 text-brand-950 font-bold uppercase tracking-wider text-[10px] rounded-lg cursor-pointer"
              >
                Close Reel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
