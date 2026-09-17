export type VideoType = "youtube" | "instagram" | "direct";

export interface ParsedVideo {
  type: VideoType;
  rawUrl: string;
  embedUrl: string;
  videoId?: string;
  isEmbeddable: boolean;
}

export function parseVideoUrl(url?: string | null): ParsedVideo {
  if (!url || typeof url !== "string") {
    return {
      type: "direct",
      rawUrl: "",
      embedUrl: "",
      isEmbeddable: false,
    };
  }

  const trimmed = url.trim();
  if (!trimmed) {
    return {
      type: "direct",
      rawUrl: "",
      embedUrl: "",
      isEmbeddable: false,
    };
  }

  // YouTube Shorts / Watch / youtu.be
  const ytMatch = trimmed.match(
    /(?:youtube\.com\/(?:watch\?.*v=|shorts\/|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/i
  );
  if (ytMatch && ytMatch[1]) {
    const videoId = ytMatch[1];
    return {
      type: "youtube",
      rawUrl: trimmed,
      videoId,
      embedUrl: `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&playsinline=1&controls=1`,
      isEmbeddable: true,
    };
  }

  // Instagram Reels & Posts
  const instaMatch = trimmed.match(
    /instagram\.com\/(?:reel|p|tv)\/([a-zA-Z0-9_-]+)/i
  );
  if (instaMatch && instaMatch[1]) {
    const code = instaMatch[1];
    return {
      type: "instagram",
      rawUrl: trimmed,
      videoId: code,
      embedUrl: `https://www.instagram.com/reel/${code}/embed`,
      isEmbeddable: true,
    };
  }

  // Direct video file (MP4, WebM, local /uploads/ or /assets/)
  return {
    type: "direct",
    rawUrl: trimmed,
    embedUrl: trimmed,
    isEmbeddable: true,
  };
}
