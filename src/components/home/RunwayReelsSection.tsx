"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { Film, Play, Pause, Volume2, VolumeX, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import { parseVideoUrl } from "@/lib/videoUtils";

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
  const [videoSources, setVideoSources] = useState<Record<string, string>>({});

  const videoRefs = useRef<Map<string, HTMLVideoElement>>(new Map());
  const cardRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const playPromiseRef = useRef<Map<string, Promise<void> | null>>(new Map());
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const activeVideoIdRef = useRef<string | null>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === "left" ? -320 : 320;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

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

  // Safely play a specific video and pause all others
  const playSingleVideo = useCallback((targetId: string, unmutedOverride?: boolean) => {
    activeVideoIdRef.current = targetId;
    setActiveVideoId(targetId);

    // Pause all other videos first
    videoRefs.current.forEach((video, id) => {
      if (id !== targetId && !video.paused) {
        try {
          video.pause();
        } catch (_) {}
      }
    });

    // Play target video
    const targetVideo = videoRefs.current.get(targetId);
    if (targetVideo) {
      const shouldMute = unmutedOverride !== undefined ? !unmutedOverride : isMuted;
      targetVideo.muted = shouldMute;

      const promise = targetVideo.play();
      if (promise !== undefined) {
        playPromiseRef.current.set(targetId, promise);
        promise
          .then(() => {
            setIsPlaying((prev) => ({ ...prev, [targetId]: true }));
          })
          .catch((err) => {
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
    if (targetVideo && !targetVideo.paused) {
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
    videoRefs.current.forEach((video) => {
      if (!video.paused) {
        try {
          video.pause();
        } catch (_) {}
      }
    });
    activeVideoIdRef.current = null;
    setActiveVideoId(null);
  }, []);

  // Toggle Play / Pause on user click
  const handleTogglePlay = (id: string) => {
    const video = videoRefs.current.get(id);
    if (!video) return;

    if (video.paused) {
      playSingleVideo(id);
    } else {
      pauseVideo(id);
    }
  };

  // Toggle sound for active / clicked video
  const handleToggleVolume = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const newMuted = !isMuted;
    setIsMuted(newMuted);

    const video = videoRefs.current.get(id);
    if (video) {
      video.muted = newMuted;
      if (video.paused) {
        playSingleVideo(id, !newMuted);
      }
    }
  };

  const playSingleVideoRef = useRef(playSingleVideo);
  playSingleVideoRef.current = playSingleVideo;
  const pauseAllVideosRef = useRef(pauseAllVideos);
  pauseAllVideosRef.current = pauseAllVideos;

  // Auto-play in viewport without recursive re-render loops
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

        let bestId: string | null = null;
        let maxRatio = 0.45;

        visibleRatios.forEach((ratio, id) => {
          if (ratio > maxRatio) {
            maxRatio = ratio;
            bestId = id;
          }
        });

        if (bestId && bestId !== activeVideoIdRef.current) {
          playSingleVideoRef.current(bestId);
        } else if (!bestId && activeVideoIdRef.current) {
          pauseAllVideosRef.current();
        }
      },
      {
        threshold: [0, 0.5, 1.0],
      }
    );

    cardRefs.current.forEach((el) => {
      observer.observe(el);
    });

    return () => {
      observer.disconnect();
    };
  }, [videos]);

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

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 text-xs text-[#A89F91] mr-2">
              <Sparkles className="w-3.5 h-3.5 text-[#C4A882]" />
              <span>Scroll left-to-right</span>
            </div>
            {/* Scroll Navigation Arrows */}
            <button
              onClick={() => scroll("left")}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all border border-white/20 shadow-md"
              aria-label="Scroll reels left"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll("right")}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all border border-white/20 shadow-md"
              aria-label="Scroll reels right"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Video Reels Horizontal Scrollable Track */}
        <div
          ref={scrollContainerRef}
          className="flex gap-5 overflow-x-auto pb-4 scroll-smooth scrollbar-thin snap-x snap-mandatory"
        >
          {videos.map((v) => {
            const isActive = activeVideoId === v.id;
            const playing = !!isPlaying[v.id];

            return (
              <div
                key={v.id}
                ref={(el) => setCardRef(v.id, el)}
                data-video-id={v.id}
                className={`w-[260px] sm:w-[280px] lg:w-[300px] shrink-0 snap-start relative rounded-2xl overflow-hidden bg-[#222222] border transition-all duration-300 group ${
                  isActive && playing
                    ? "border-[#C4A882] shadow-2xl shadow-black/60 ring-1 ring-[#C4A882]/40"
                    : "border-[#333333] hover:border-[#555555]"
                }`}
              >
                {/* 9:16 Vertical Video Frame */}
                {(() => {
                  const parsed = parseVideoUrl(v.videoUrl);
                  const isExternal = parsed.type === "youtube" || parsed.type === "instagram";
                  return (
                    <div
                      className="relative aspect-[9/16] w-full cursor-pointer overflow-hidden bg-black"
                      onClick={() => !isExternal && handleTogglePlay(v.id)}
                    >
                      {isExternal ? (
                        <iframe
                          src={parsed.embedUrl}
                          title={v.title}
                          className="w-full h-full border-0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                          loading="lazy"
                        />
                      ) : (
                        <video
                          ref={(el) => setVideoRef(v.id, el)}
                          src={videoSources[v.id] || v.videoUrl}
                          loop
                          muted={isMuted}
                          playsInline
                          preload="auto"
                          poster={v.product?.images?.[0]?.url || "/assets/products/prod-bano-printed.jpg"}
                          className="w-full h-full object-cover select-none"
                          onPlay={() => setIsPlaying((prev) => ({ ...prev, [v.id]: true }))}
                          onPause={() => setIsPlaying((prev) => ({ ...prev, [v.id]: false }))}
                          onError={() => {
                            setVideoSources((prev) => ({
                              ...prev,
                              [v.id]: "/assets/runway-walk-1.mp4",
                            }));
                          }}
                        />
                      )}

                  {/* Gradient overlays */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-auto">
                    <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 border border-white/20">
                      <span className={`w-2 h-2 rounded-full ${playing ? "bg-emerald-400 animate-pulse" : "bg-neutral-400"}`} />
                      Runway Reel
                    </span>

                    {/* Top Right Controls: Mute toggle for native video, or Platform badge for YouTube/Instagram */}
                    {!isExternal ? (
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
                    ) : (
                      <span className="px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-white text-[10px] font-bold border border-white/20 flex items-center gap-1">
                        {parsed.type === "youtube" ? "▶️ YouTube" : "📸 Instagram"}
                      </span>
                    )}
                  </div>

                  {/* Center Play/Pause Overlay Indicator on Click (Native MP4 only) */}
                  {!isExternal && (
                    <div
                      className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
                        !playing ? "opacity-100 bg-black/30" : "opacity-0 group-hover:opacity-80"
                      }`}
                    >
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTogglePlay(v.id);
                        }}
                        className="w-16 h-16 rounded-full bg-black/70 hover:bg-black/90 backdrop-blur-md border-2 border-white/40 flex items-center justify-center text-white shadow-2xl transition-all duration-200 transform hover:scale-110 pointer-events-auto cursor-pointer"
                        aria-label={playing ? "Pause runway reel" : "Play runway reel"}
                      >
                        {playing ? (
                          <Pause className="w-7 h-7 text-white" />
                        ) : (
                          <Play className="w-7 h-7 text-white fill-white ml-1" />
                        )}
                      </button>
                    </div>
                  )}

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
              );
            })()}

                {/* Footer Shop Look Card — Strictly In-Store Internal Landing */}
                <div className="p-3.5 bg-[#1F1F1F] border-t border-[#2F2F2F] flex items-center justify-between gap-3">
                  <div className="truncate flex-1">
                    {v.product ? (
                      <Link href={`/product/${v.product.slug}`} className="hover:underline block truncate">
                        <h4 className="font-serif font-bold text-xs text-white truncate">
                          {v.product.title}
                        </h4>
                        <p className="text-[#C4A882] text-xs font-bold mt-0.5">
                          Rs. {v.product.basePrice.toLocaleString()}
                        </p>
                      </Link>
                    ) : (
                      <Link href="/shop" className="hover:underline block truncate">
                        <h4 className="font-serif font-bold text-xs text-white truncate">
                          {v.title}
                        </h4>
                        <p className="text-[#C4A882] text-xs font-bold mt-0.5">
                          Exclusive Ensemble
                        </p>
                      </Link>
                    )}
                  </div>

                  <Link
                    href={v.product ? `/product/${v.product.slug}` : "/shop"}
                    className="shrink-0 px-4 py-2 rounded-full bg-white hover:bg-[#F8F5F0] text-[#171717] text-[11px] font-bold uppercase tracking-wider transition-all duration-200 shadow hover:scale-105"
                  >
                    Shop Look
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
