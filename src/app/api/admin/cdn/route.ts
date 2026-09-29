import { NextRequest, NextResponse } from "next/server";
import { getCdnConfig, saveCdnConfig, uploadMediaToCdn } from "@/lib/cdnService";
import { requireAdmin } from "@/lib/requireAdmin";
import { internalError, jsonError } from "@/lib/http";

export const dynamic = "force-dynamic";

// GET current CDN configuration
export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return auth.response;

  try {
    const config = await getCdnConfig();

    const isCloudinaryActive = Boolean(
      config.cloudinaryCloudName && (config.cloudinaryApiSecret || config.cloudinaryUploadPreset)
    );
    const isImgbbActive = Boolean(config.imgbbApiKey);

    let activeProvider = "DATABASE_PERSISTENT (Fallback Mode)";
    if (isCloudinaryActive) {
      activeProvider = "CLOUDINARY (Global High-Speed CDN)";
    } else if (isImgbbActive) {
      activeProvider = "IMGBB (Permanent Image CDN)";
    }

    return NextResponse.json({
      success: true,
      config: {
        provider: config.provider,
        cloudinaryCloudName: config.cloudinaryCloudName,
        cloudinaryApiKey: config.cloudinaryApiKey ? `${config.cloudinaryApiKey.slice(0, 4)}...` : "",
        hasCloudinarySecret: Boolean(config.cloudinaryApiSecret),
        cloudinaryUploadPreset: config.cloudinaryUploadPreset,
        hasImgbbKey: Boolean(config.imgbbApiKey),
      },
      status: {
        activeProvider,
        isCloudinaryActive,
        isImgbbActive,
        isDatabaseFallbackActive: !isCloudinaryActive && !isImgbbActive,
      },
    });
  } catch (error: unknown) {
    return internalError("GET /api/admin/cdn error:", error);
  }
}

// POST: Save CDN settings
export async function POST(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return auth.response;

  try {
    const body = await req.json();
    const updated = await saveCdnConfig(body);

    return NextResponse.json({
      success: true,
      message: "CDN settings saved successfully! Uploaded media will now route through your active CDN.",
      config: {
        provider: updated.provider,
        cloudinaryCloudName: updated.cloudinaryCloudName,
        cloudinaryUploadPreset: updated.cloudinaryUploadPreset,
      },
    });
  } catch (error: unknown) {
    return internalError("POST /api/admin/cdn error:", error);
  }
}

// PUT: Run 1-Click Live Test Upload
export async function PUT(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return auth.response;

  try {
    // Generate a tiny 1x1 test PNG pixel buffer
    const testPngBase64 =
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";
    const testBuffer = Buffer.from(testPngBase64, "base64");

    const result = await uploadMediaToCdn(testBuffer, {
      filename: `cdn_test_${Date.now()}.png`,
      mimeType: "image/png",
      folder: "tauheed-textile/test",
    });

    return NextResponse.json({
      success: true,
      message: `CDN test successful! Media uploaded via ${result.provider}.`,
      result,
    });
  } catch (error: any) {
    return internalError("CDN Test Error:", error?.message || error);
  }
}
