"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { Film, Play, Pause, Volume2, VolumeX, Sparkles } from "lucide-react";

export interface RunwayVideoItem {
  id: string;
  title: string;
  videoUrl: string;
  product?: {
    id: string;
    title: string;
    slug: string;
    basePrice: number;
    images?: { url: string }[];
  } | null;
}

interface RunwayReelsSectionProps {
  videos: RunwayVideoItem[];
  title?: string;
}

export default function RunwayReelsSection({ videos, title }: RunwayReelsSectionProps) {
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [isPlaying, setIsPlaying] = useState<Record<string, boolean>>({});

  const videoRefs = useRef<Map<string, HTMLVideoElement>>(new Map());
  const cardRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const playPromiseRef = useRef<Map<string, Promise<void> | null>>(new Map());

  // Register video ref
  const setVideoRef = (id: string, el: HTMLVideoElement | null) => {
    if (el) {
      videoRefs.current.set(id, el);
    } else {
      videoRefs.current.delete(id);
    }
  };

  // Register card ref for IntersectionObserver
  const setCardRef = (id: string, el: HTMLDivElement | null) => {
    if (el) {
      cardRefs.current.set(id, el);
    } else {
      cardRefs.current.delete(id);
    }
  };

  // Safely play a specific video and pause all others (STRICT 1-VIDEO ONLY)
  const playSingleVideo = useCallback((targetId: string, unmutedOverride?: boolean) => {
    setActiveVideoId(targetId);

    // Pause all other videos first
    videoRefs.current.forEach((video, id) => {
      if (id !== targetId) {
        try {
          video.pause();
        } catch (_) {}
        setIsPlaying((prev) => ({ ...prev, [id]: false }));
      }
    });

    // Play target video
    const targetVideo = videoRefs.current.get(targetId);
    if (targetVideo) {
      targetVideo.muted = unmutedOverride !== undefined ? !unmutedOverride : isMuted;

      const promise = targetVideo.play();
      if (promise !== undefined) {
        playPromiseRef.current.set(targetId, promise);
        promise
          .then(() => {
            setIsPlaying((prev) => ({ ...prev, [targetId]: true }));
          })
          .catch((err) => {
            // Browser autoplay policy or interruption - handle gracefully
            if (err.name !== "AbortError") {
              targetVideo.muted = true;
              setIsMuted(true);
              targetVideo.play().catch(() => {});
            }
          });
      }
    }
  }, [isMuted]);

  // Pause a video safely
  const pauseVideo = useCallback((targetId: string) => {
    const targetVideo = videoRefs.current.get(targetId);
    if (targetVideo) {
      const existingPromise = playPromiseRef.current.get(targetId);
      if (existingPromise) {
        existingPromise
          .then(() => {
            targetVideo.pause();
            setIsPlaying((prev) => ({ ...prev, [targetId]: false }));
          })
          .catch(() => {
            targetVideo.pause();
            setIsPlaying((prev) => ({ ...prev, [targetId]: false }));
          });
      } else {
        targetVideo.pause();
        setIsPlaying((prev) => ({ ...prev, [targetId]: false }));
      }
    }
  }, []);

  // Pause ALL videos (e.g., when whole section scrolled out of view)
  const pauseAllVideos = useCallback(() => {
    videoRefs.current.forEach((video, id) => {
      try {
        video.pause();
      } catch (_) {}
      setIsPlaying((prev) => ({ ...prev, [id]: false }));
    });
    setActiveVideoId(null);
  }, []);

  // Toggle Play / Pause on user click
  const handleTogglePlay = (id: string) => {
    const video = videoRefs.current.get(id);
    if (!video) return;

    if (activeVideoId === id && isPlaying[id]) {
      pauseVideo(id);
    } else {
      playSingleVideo(id);
    }
  };

  // Toggle sound for active / clicked video
  const handleToggleVolume = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const newMuted = !isMuted;
    setIsMuted(newMuted);

    // Apply to current active video
    const video = videoRefs.current.get(id);
    if (video) {
      video.muted = newMuted;
      if (video.paused) {
        playSingleVideo(id, !newMuted);
      }
    }
  };

  // Auto-run on scroll: IntersectionObserver detects which video is currently in view
  useEffect(() => {
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) return;

    const visibleRatios = new Map<string, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const videoId = entry.target.getAttribute("data-video-id");
          if (videoId) {
            visibleRatios.set(videoId, entry.isIntersecting ? entry.intersectionRatio : 0);
          }
        });

        // Find the video card with the highest visible ratio
        let bestId: string | null = null;
        let maxRatio = 0.35; // Minimum 35% visible to auto-play

        visibleRatios.forEach((ratio, id) => {
          if (ratio > maxRatio) {
            maxRatio = ratio;
            bestId = id;
          }
        });

        if (bestId) {
          if (bestId !== activeVideoId) {
            playSingleVideo(bestId);
          }
        } else {
          // No video sufficiently in view -> pause all to conserve resources & avoid glitches
          pauseAllVideos();
        }
      },
      {
        threshold: [0, 0.25, 0.5, 0.75, 1.0],
      }
    );

    // Observe each video card
    cardRefs.current.forEach((el) => {
      observer.observe(el);
    });

    return () => {
      observer.disconnect();
    };
  }, [videos, activeVideoId, playSingleVideo, pauseAllVideos]);

  return (
    <section className="bg-[#171717] py-16 sm:py-20 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10 text-center sm:text-left flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-[#C4A882] flex items-center justify-center sm:justify-start gap-2 mb-2">
              <Film className="w-4 h-4 text-[#C4A882]" /> Runway Watch & Buy
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-white tracking-tight">
              {title || "Watch. Fall in Love. Shop."}
            </h2>
            <p className="text-xs sm:text-sm text-[#D4CFC9] mt-1">
              Tap any video to play or pause. Auto-runs muted on scroll — tap speaker to unmute.
            </p>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs text-[#A89F91]">
            <Sparkles className="w-3.5 h-3.5 text-[#C4A882]" />
            <span>1 Video at a Time (Glitch-Free Smooth Play)</span>
          </div>
        </div>

        {/* Video Reels Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {videos.map((v) => {
            const isActive = activeVideoId === v.id;
            const playing = !!isPlaying[v.id];

            return (
              <div
                key={v.id}
                ref={(el) => setCardRef(v.id, el)}
                data-video-id={v.id}
                className={`relative rounded-2xl overflow-hidden bg-[#222222] border transition-all duration-300 group ${
                  isActive && playing
                    ? "border-[#C4A882] shadow-2xl shadow-black/60 ring-1 ring-[#C4A882]/40"
                    : "border-[#333333] hover:border-[#555555]"
                }`}
              >
                {/* 9:16 Vertical Video Frame */}
                <div
                  className="relative aspect-[9/16] w-full cursor-pointer overflow-hidden bg-black"
                  onClick={() => handleTogglePlay(v.id)}
                >
                  <video
                    ref={(el) => setVideoRef(v.id, el)}
                    src={v.videoUrl}
                    loop
                    muted={isMuted}
                    playsInline
                    preload="metadata"
                    poster={v.product?.images?.[0]?.url || "/assets/reel-1.jpg"}
                    className="w-full h-full object-cover select-none pointer-events-none"
                  />

                  {/* Gradient overlays */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-auto">
                    <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 border border-white/20">
                      <span className={`w-2 h-2 rounded-full ${playing ? "bg-emerald-400 animate-pulse" : "bg-neutral-400"}`} />
                      Runway Reel
                    </span>

                    {/* Sound Mute / Unmute Button */}
                    <button
                      type="button"
                      onClick={(e) => handleToggleVolume(e, v.id)}
                      className={`p-2 rounded-full backdrop-blur-md transition-all shadow-lg flex items-center gap-1 text-[10px] font-bold ${
                        isMuted
                          ? "bg-black/60 hover:bg-black/80 text-white/90 border border-white/20"
                          : "bg-[#C4A882] text-black border border-[#D4AF37] shadow-gold-500/20"
                      }`}
                      aria-label={isMuted ? "Unmute Video" : "Mute Video"}
                    >
                      {isMuted ? (
                        <>
                          <VolumeX className="w-3.5 h-3.5 text-white" />
                          <span className="hidden sm:inline pr-1 text-[9px] uppercase tracking-wider">Unmute</span>
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-3.5 h-3.5 text-black" />
                          <span className="hidden sm:inline pr-1 text-[9px] uppercase tracking-wider">Sound On</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Center Play/Pause Overlay Indicator on Click */}
                  <div
                    className={`absolute inset-0 flex items-center justify-center transition-opacity duration-200 pointer-events-none ${
                      !playing ? "opacity-100 bg-black/30" : "opacity-0 group-hover:opacity-60"
                    }`}
                  >
                    <div className="w-14 h-14 rounded-full bg-black/60 backdrop-blur-md border border-white/30 flex items-center justify-center text-white shadow-xl transform transition-transform group-hover:scale-110">
                      {playing ? (
                        <Pause className="w-6 h-6 text-white" />
                      ) : (
                        <Play className="w-6 h-6 text-white fill-white ml-1" />
                      )}
                    </div>
                  </div>

                  {/* Bottom Caption Overlay */}
                  <div className="absolute bottom-3 left-3 right-3 pointer-events-none">
                    <p className="text-white text-xs font-serif font-bold drop-shadow truncate">
                      {v.title}
                    </p>
                    {v.product && (
                      <p className="text-emerald-300 text-[11px] font-semibold drop-shadow mt-0.5">
                        Rs. {v.product.basePrice.toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>

                {/* Footer Shop Look Card */}
                <div className="p-3.5 bg-[#1F1F1F] border-t border-[#2F2F2F] flex items-center justify-between gap-3">
                  <div className="truncate flex-1">
                    <h4 className="font-serif font-bold text-xs text-white truncate">
                      {v.product?.title || v.title}
                    </h4>
                    {v.product && (
                      <p className="text-[#C4A882] text-xs font-bold mt-0.5">
                        Rs. {v.product.basePrice.toLocaleString()}
                      </p>
                    )}
                  </div>

                  {v.product && (
                    <Link
                      href={`/product/${v.product.slug}`}
                      className="shrink-0 px-4 py-2 rounded-full bg-white hover:bg-[#F8F5F0] text-[#171717] text-[11px] font-bold uppercase tracking-wider transition-all duration-200 shadow hover:scale-105"
                    >
                      Shop Look
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
