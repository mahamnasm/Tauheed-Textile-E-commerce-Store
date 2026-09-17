"use client";

import React from "react";
import { parseVideoUrl } from "@/lib/videoUtils";

interface UniversalVideoPlayerProps {
  src?: string | null;
  poster?: string;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  controls?: boolean;
  playsInline?: boolean;
  className?: string;
}

export default function UniversalVideoPlayer({
  src,
  poster,
  autoPlay = true,
  loop = true,
  muted = true,
  controls = true,
  playsInline = true,
  className = "w-full h-full object-cover",
}: UniversalVideoPlayerProps) {
  if (!src) return null;

  const parsed = parseVideoUrl(src);

  if (parsed.type === "youtube") {
    // YouTube Embed
    return (
      <div className="relative w-full h-full overflow-hidden bg-black flex items-center justify-center">
        <iframe
          src={parsed.embedUrl}
          title="YouTube Video Player"
          className="w-full h-full border-0 rounded-2xl"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          loading="lazy"
        />
      </div>
    );
  }

  if (parsed.type === "instagram") {
    // Instagram Embed
    return (
      <div className="relative w-full h-full overflow-hidden bg-black flex items-center justify-center">
        <iframe
          src={parsed.embedUrl}
          title="Instagram Reel Player"
          className="w-full h-full border-0 rounded-2xl"
          allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
          allowFullScreen
          loading="lazy"
        />
      </div>
    );
  }

  // Direct MP4 / WebM / local video file
  return (
    <video
      src={parsed.rawUrl}
      poster={poster}
      autoPlay={autoPlay}
      loop={loop}
      muted={muted}
      controls={controls}
      playsInline={playsInline}
      className={className}
    />
  );
}
