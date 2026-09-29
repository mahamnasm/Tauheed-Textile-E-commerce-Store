import { describe, it, expect, vi } from "vitest";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    setting: {
      findUnique: vi.fn().mockResolvedValue(null),
      upsert: vi.fn().mockResolvedValue({}),
    },
  },
}));

import { uploadMediaToCdn, DEFAULT_CDN_CONFIG } from "../src/lib/cdnService";

describe("Permanent Media CDN Service", () => {
  it("should have valid default CDN configuration structure", () => {
    expect(DEFAULT_CDN_CONFIG.provider).toBe("AUTO");
    expect(DEFAULT_CDN_CONFIG.cloudinaryCloudName).toBe("");
  });

  it("should generate resilient persistent Data URI when no external CDN credentials are set", async () => {
    const testPngBase64 =
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";
    const testBuffer = Buffer.from(testPngBase64, "base64");

    const result = await uploadMediaToCdn(testBuffer, {
      filename: "test-dress.png",
      mimeType: "image/png",
    });

    expect(result.provider).toBe("DATABASE_PERSISTENT");
    expect(result.url).toMatch(/^data:image\/png;base64,/);
    expect(result.size).toBeGreaterThan(0);
  });
});
