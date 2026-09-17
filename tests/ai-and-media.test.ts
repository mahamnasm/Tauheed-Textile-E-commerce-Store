import { describe, it, expect } from "vitest";
import { parseVideoUrl } from "../src/lib/videoUtils";
import { calculateFitRecommendation } from "../src/lib/ai";

describe("Phase 1 [UNIT-MEDIA]: Universal Video & Reels URL Parser", () => {
  it("should extract YouTube video ID and build privacy-preserving embed URL", () => {
    // Standard watch URL
    const standard = parseVideoUrl("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
    expect(standard.type).toBe("youtube");
    expect(standard.videoId).toBe("dQw4w9WgXcQ");
    expect(standard.isEmbeddable).toBe(true);
    expect(standard.embedUrl).toContain("youtube-nocookie.com/embed/dQw4w9WgXcQ");

    // YouTube Shorts
    const shorts = parseVideoUrl("https://youtube.com/shorts/abcdefghijk");
    expect(shorts.type).toBe("youtube");
    expect(shorts.videoId).toBe("abcdefghijk");
    expect(shorts.isEmbeddable).toBe(true);

    // Shortened youtu.be URL
    const shortLink = parseVideoUrl("https://youtu.be/12345678901");
    expect(shortLink.type).toBe("youtube");
    expect(shortLink.videoId).toBe("12345678901");
  });

  it("should parse Instagram Reel and Post URLs into embed links", () => {
    const reel = parseVideoUrl("https://www.instagram.com/reel/C1234567890/");
    expect(reel.type).toBe("instagram");
    expect(reel.videoId).toBe("C1234567890");
    expect(reel.isEmbeddable).toBe(true);
    expect(reel.embedUrl).toBe("https://www.instagram.com/reel/C1234567890/embed/captioned/");

    const post = parseVideoUrl("https://instagram.com/p/B987654321/");
    expect(post.type).toBe("instagram");
    expect(post.videoId).toBe("B987654321");
  });

  it("should treat direct MP4 links as direct video type", () => {
    const direct = parseVideoUrl("https://cdn.tauheedtextile.com/videos/lawn-reel-1.mp4");
    expect(direct.type).toBe("direct");
    expect(direct.rawUrl).toBe("https://cdn.tauheedtextile.com/videos/lawn-reel-1.mp4");
    expect(direct.isEmbeddable).toBe(true);
  });

  it("should safely handle null, undefined, empty, and invalid inputs", () => {
    expect(parseVideoUrl(null).isEmbeddable).toBe(false);
    expect(parseVideoUrl("").isEmbeddable).toBe(false);
    expect(parseVideoUrl("   ").isEmbeddable).toBe(false);
  });
});

describe("Phase 1 [UNIT-AI]: Sizing Recommendation Engine (calculateFitRecommendation)", () => {
  it("should recommend XS with correct ease for chest <= 34", () => {
    const result = calculateFitRecommendation({
      heightFeet: 5,
      heightInches: 4,
      chestInches: 33,
      waistInches: 26,
      fitPreference: "regular",
    });

    expect(result.recommendedSize).toBe("XS");
    expect(result.easeInches).toBe(2.5);
    expect(result.finishedChest).toBe(35.5); // 33 + 2.5
    expect(result.customTailoringAvailable).toBe(true);
  });

  it("should calculate modest_loose fit with extra 3.5 inches ease", () => {
    const result = calculateFitRecommendation({
      heightFeet: 5,
      heightInches: 6,
      chestInches: 39,
      waistInches: 32,
      fitPreference: "modest_loose",
    });

    expect(result.recommendedSize).toBe("M");
    expect(result.easeInches).toBe(3.5);
    expect(result.finishedChest).toBe(42.5); // 39 + 3.5
    expect(result.tailoringAdvice).toContain("modest flowing drape");
  });

  it("should calculate tailored contoured fit with 1.5 inches ease", () => {
    const result = calculateFitRecommendation({
      heightFeet: 5,
      heightInches: 2,
      chestInches: 36,
      waistInches: 28,
      fitPreference: "tailored",
    });

    expect(result.recommendedSize).toBe("S");
    expect(result.easeInches).toBe(1.5);
    expect(result.finishedChest).toBe(37.5); // 36 + 1.5
    expect(result.tailoringAdvice).toContain("royal silhouette");
  });

  it("should step through boundary sizes accurately (M, L, XL, XXL)", () => {
    // 40 -> M
    expect(calculateFitRecommendation({ heightFeet: 5, heightInches: 5, chestInches: 40, waistInches: 34, fitPreference: "regular" }).recommendedSize).toBe("M");
    // 42 -> L
    expect(calculateFitRecommendation({ heightFeet: 5, heightInches: 5, chestInches: 42, waistInches: 36, fitPreference: "regular" }).recommendedSize).toBe("L");
    // 45 -> XL
    expect(calculateFitRecommendation({ heightFeet: 5, heightInches: 5, chestInches: 45, waistInches: 38, fitPreference: "regular" }).recommendedSize).toBe("XL");
    // 50 -> XXL
    expect(calculateFitRecommendation({ heightFeet: 5, heightInches: 5, chestInches: 50, waistInches: 42, fitPreference: "regular" }).recommendedSize).toBe("XXL");
  });
});
