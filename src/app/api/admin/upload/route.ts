import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { getClientIp, checkRateLimit, rateLimitResponse } from "@/lib/rateLimit";

const ALLOWED_ADMIN_EXTENSIONS = new Set([
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".avif",
  ".mp4",
]);

const ALLOWED_ADMIN_MIME_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/avif",
  "video/mp4",
]);

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);

  // Rate Limiting
  const rate = checkRateLimit(`admin_upload_${ip}`, 50, 15 * 60 * 1000);
  if (!rate.success) {
    return rateLimitResponse(rate.resetTime, "Upload rate limit exceeded. Please wait a moment.");
  }

  try {
    const formData = await req.formData();
    const files = formData.getAll("files") as File[];

    if (files.length === 0) {
      const singleFile = formData.get("file") as File | null;
      if (singleFile) files.push(singleFile);
    }

    if (files.length === 0) {
      return NextResponse.json({ error: "No files provided for upload" }, { status: 400 });
    }

    const uploadDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const savedUrls: string[] = [];

    for (const file of files) {
      if (!file || typeof file.arrayBuffer !== "function") continue;

      // Max file size: 50MB for video, 15MB for images
      if (file.size > 50 * 1024 * 1024) {
        return NextResponse.json(
          { error: `File ${file.name || ""} exceeds maximum allowable size (50MB).` },
          { status: 400 }
        );
      }

      const rawExt = path.extname(file.name || "").toLowerCase();
      if (!ALLOWED_ADMIN_EXTENSIONS.has(rawExt)) {
        return NextResponse.json(
          { error: `File extension '${rawExt}' is not permitted. Only JPG, PNG, WEBP, AVIF, and MP4 files are allowed.` },
          { status: 400 }
        );
      }

      if (file.type && !ALLOWED_ADMIN_MIME_TYPES.has(file.type.toLowerCase())) {
        return NextResponse.json(
          { error: `File MIME type '${file.type}' is invalid.` },
          { status: 400 }
        );
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const randomHex = Math.random().toString(36).substring(2, 10);
      const filename = `media_${Date.now()}_${randomHex}${rawExt}`;
      const filePath = path.join(uploadDir, filename);

      fs.writeFileSync(filePath, buffer);
      savedUrls.push(`/uploads/${filename}`);
    }

    return NextResponse.json({
      success: true,
      urls: savedUrls,
      url: savedUrls[0],
    });
  } catch (error: any) {
    console.error("Admin file upload error:", error);
    return NextResponse.json({ error: "File upload failed. Please try again." }, { status: 500 });
  }
}
