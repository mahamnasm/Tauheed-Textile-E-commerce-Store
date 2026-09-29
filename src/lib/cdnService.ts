import crypto from "crypto";
import { prisma } from "@/lib/prisma";

export interface CdnConfig {
  provider: "CLOUDINARY" | "IMGBB" | "AUTO";
  cloudinaryCloudName: string;
  cloudinaryApiKey: string;
  cloudinaryApiSecret: string;
  cloudinaryUploadPreset: string;
  imgbbApiKey: string;
}

export const DEFAULT_CDN_CONFIG: CdnConfig = {
  provider: "AUTO",
  cloudinaryCloudName: "",
  cloudinaryApiKey: "",
  cloudinaryApiSecret: "",
  cloudinaryUploadPreset: "",
  imgbbApiKey: "",
};

/**
 * Retrieve current CDN Configuration (DB settings prioritized, falling back to process.env)
 */
export async function getCdnConfig(): Promise<CdnConfig> {
  let dbConfig: Partial<CdnConfig> = {};
  try {
    const record = await Promise.race([
      prisma.setting.findUnique({
        where: { key: "admin_cdn_config" },
      }),
      new Promise<null>((resolve) => setTimeout(() => resolve(null), 1500)),
    ]);
    if (record?.value) {
      dbConfig = JSON.parse(record.value);
    }
  } catch (err) {
    console.warn("Could not load admin_cdn_config from DB:", err);
  }

  // Parse CLOUDINARY_URL if provided in format: cloudinary://api_key:api_secret@cloud_name
  let envCloudName = process.env.CLOUDINARY_CLOUD_NAME || "";
  let envApiKey = process.env.CLOUDINARY_API_KEY || "";
  let envApiSecret = process.env.CLOUDINARY_API_SECRET || "";

  if (process.env.CLOUDINARY_URL) {
    try {
      const url = new URL(process.env.CLOUDINARY_URL);
      envCloudName = url.host;
      envApiKey = url.username;
      envApiSecret = url.password;
    } catch {
      // Ignore URL parse error
    }
  }

  return {
    provider: dbConfig.provider || (process.env.CDN_PROVIDER as any) || "AUTO",
    cloudinaryCloudName: dbConfig.cloudinaryCloudName || envCloudName,
    cloudinaryApiKey: dbConfig.cloudinaryApiKey || envApiKey,
    cloudinaryApiSecret: dbConfig.cloudinaryApiSecret || envApiSecret,
    cloudinaryUploadPreset: dbConfig.cloudinaryUploadPreset || process.env.CLOUDINARY_UPLOAD_PRESET || "",
    imgbbApiKey: dbConfig.imgbbApiKey || process.env.IMGBB_API_KEY || "",
  };
}

/**
 * Save CDN configuration to Database
 */
export async function saveCdnConfig(config: Partial<CdnConfig>): Promise<CdnConfig> {
  const current = await getCdnConfig();
  const updated: CdnConfig = { ...current, ...config };

  await prisma.setting.upsert({
    where: { key: "admin_cdn_config" },
    update: { value: JSON.stringify(updated) },
    create: {
      key: "admin_cdn_config",
      value: JSON.stringify(updated),
      description: "Tauheed Textile Permanent Media CDN Configuration",
    },
  });

  return updated;
}

/**
 * Upload a binary image or video buffer to Cloudinary CDN via REST API
 */
async function uploadToCloudinary(
  buffer: Buffer,
  config: CdnConfig,
  options: { filename: string; mimeType: string; folder?: string }
): Promise<string> {
  const cloudName = config.cloudinaryCloudName.trim();
  const apiKey = config.cloudinaryApiKey.trim();
  const apiSecret = config.cloudinaryApiSecret.trim();
  const preset = config.cloudinaryUploadPreset.trim();
  const isVideo = options.mimeType.startsWith("video/") || options.filename.endsWith(".mp4");
  const resourceType = isVideo ? "video" : "image";
  const folder = options.folder || "tauheed-textile";

  const endpoint = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;
  const base64Data = `data:${options.mimeType};base64,${buffer.toString("base64")}`;

  const formData = new FormData();
  formData.append("file", base64Data);
  formData.append("folder", folder);

  if (apiKey && apiSecret) {
    // Signed upload: compute SHA-1 signature of parameters
    const timestamp = Math.floor(Date.now() / 1000).toString();
    const paramsToSign = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;
    const signature = crypto.createHash("sha1").update(paramsToSign).digest("hex");

    formData.append("api_key", apiKey);
    formData.append("timestamp", timestamp);
    formData.append("signature", signature);
  } else if (preset) {
    // Unsigned upload via preset
    formData.append("upload_preset", preset);
  } else {
    throw new Error("Cloudinary requires either (API Key + Secret) or an Upload Preset.");
  }

  const res = await fetch(endpoint, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Cloudinary upload failed (${res.status}): ${errorText}`);
  }

  const data = await res.json();
  if (!data.secure_url) {
    throw new Error("Cloudinary response missing secure_url");
  }

  return data.secure_url as string;
}

/**
 * Upload an image buffer to ImgBB Free CDN via REST API
 */
async function uploadToImgBB(
  buffer: Buffer,
  apiKey: string,
  options: { filename: string }
): Promise<string> {
  const endpoint = `https://api.imgbb.com/1/upload?key=${encodeURIComponent(apiKey.trim())}`;
  const formData = new FormData();
  formData.append("image", buffer.toString("base64"));
  formData.append("name", options.filename.replace(/\.[^/.]+$/, ""));

  const res = await fetch(endpoint, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`ImgBB upload failed (${res.status}): ${errorText}`);
  }

  const data = await res.json();
  if (data?.data?.url) {
    return data.data.url as string;
  }
  throw new Error("ImgBB response missing image URL");
}

/**
 * Main Upload Function: Uploads media buffer to the active permanent CDN.
 * Prioritizes: Cloudinary -> ImgBB -> Permanent Database Base64 URI fallback.
 */
export async function uploadMediaToCdn(
  buffer: Buffer,
  options: {
    filename: string;
    mimeType: string;
    folder?: string;
  }
): Promise<{
  url: string;
  provider: "CLOUDINARY" | "IMGBB" | "DATABASE_PERSISTENT";
  size: number;
}> {
  const config = await getCdnConfig();

  // 1. Try Cloudinary if configured
  if (config.cloudinaryCloudName && (config.cloudinaryApiSecret || config.cloudinaryUploadPreset)) {
    try {
      const cdnUrl = await uploadToCloudinary(buffer, config, options);
      console.log(`[CDN] File uploaded successfully to Cloudinary: ${cdnUrl}`);
      return {
        url: cdnUrl,
        provider: "CLOUDINARY",
        size: buffer.length,
      };
    } catch (err: any) {
      console.error("[CDN] Cloudinary upload failed, checking fallback:", err?.message || err);
    }
  }

  // 2. Try ImgBB if configured
  if (config.imgbbApiKey && !options.mimeType.startsWith("video/")) {
    try {
      const imgbbUrl = await uploadToImgBB(buffer, config.imgbbApiKey, options);
      console.log(`[CDN] File uploaded successfully to ImgBB: ${imgbbUrl}`);
      return {
        url: imgbbUrl,
        provider: "IMGBB",
        size: buffer.length,
      };
    } catch (err: any) {
      console.error("[CDN] ImgBB upload failed, falling back to database persistence:", err?.message || err);
    }
  }

  // 3. Resilient Database Persistence Fallback (Data URI)
  // Ensures products and payment proofs NEVER 404 or disappear across serverless restarts
  const fallbackDataUrl = `data:${options.mimeType};base64,${buffer.toString("base64")}`;
  console.log(`[CDN] No external CDN configured. Using permanent PostgreSQL-safe Data URI for ${options.filename}`);

  return {
    url: fallbackDataUrl,
    provider: "DATABASE_PERSISTENT",
    size: buffer.length,
  };
}
