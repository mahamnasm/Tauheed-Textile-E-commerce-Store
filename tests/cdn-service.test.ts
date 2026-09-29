import { describe, it, expect, vi } from "vitest";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    setting: {
      findUnique: vi.fn().mockResolvedValue({
        value: JSON.stringify({
          provider: "CLOUDINARY",
          cloudinaryCloudName: "nidk4xo1",
          cloudinaryApiKey: "718146665431332",
          cloudinaryApiSecret: "yNIuChoRxyQM5EogD8K75VEhNn4",
        }),
      }),
      upsert: vi.fn().mockResolvedValue({}),
    },
  },
}));

import { uploadMediaToCdn, DEFAULT_CDN_CONFIG, getCdnConfig } from "../src/lib/cdnService";

describe("Permanent Media Cloudinary CDN Service", () => {
  it("should have valid Cloudinary CDN configuration defaults", () => {
    expect(DEFAULT_CDN_CONFIG.provider).toBe("CLOUDINARY");
    expect(DEFAULT_CDN_CONFIG.cloudinaryCloudName).toBe("nidk4xo1");
    expect(DEFAULT_CDN_CONFIG.cloudinaryApiKey).toBe("718146665431332");
  });

  it("should retrieve active Cloudinary configuration", async () => {
    const config = await getCdnConfig();
    expect(config.cloudinaryCloudName).toBe("nidk4xo1");
    expect(config.cloudinaryApiKey).toBe("718146665431332");
  });

  it("should upload media buffer to Cloudinary CDN and return secure HTTPS URL", async () => {
    const testPngBase64 =
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";
    const testBuffer = Buffer.from(testPngBase64, "base64");

    const result = await uploadMediaToCdn(testBuffer, {
      filename: "test-cdn-pixel.png",
      mimeType: "image/png",
      folder: "tauheed-textile/test",
    });

    expect(result.provider).toBe("CLOUDINARY");
    expect(result.url).toContain("res.cloudinary.com/nidk4xo1");
    expect(result.url).toMatch(/^https:\/\//);
  });
});
