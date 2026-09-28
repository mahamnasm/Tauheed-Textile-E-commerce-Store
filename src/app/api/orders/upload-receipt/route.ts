import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { getClientIp, checkRateLimit, rateLimitResponse } from "@/lib/rateLimit";

export const dynamic = "force-dynamic";

const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "application/pdf",
]);

const ALLOWED_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".pdf"]);

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);

  // Rate Limiting: max 10 uploads per 15 minutes
  const rate = checkRateLimit(`upload_receipt_${ip}`, 10, 15 * 60 * 1000);
  if (!rate.success) {
    return rateLimitResponse(rate.resetTime, "Too many file upload attempts. Please wait a few minutes.");
  }

  try {
    const formData = await req.formData();
    const file = (formData.get("file") || formData.get("receipt")) as File | null;

    if (!file || typeof file.arrayBuffer !== "function") {
      return NextResponse.json({ error: "No receipt file uploaded." }, { status: 400 });
    }

    // Check size limit: 10MB max
    const MAX_FILE_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "Receipt image exceeds 10MB limit. Please upload a smaller photo." },
        { status: 400 }
      );
    }

    // Validate MIME type
    if (file.type && !ALLOWED_MIME_TYPES.has(file.type.toLowerCase())) {
      return NextResponse.json(
        { error: "Invalid file type. Only JPG, PNG, WEBP images, or PDF documents are accepted." },
        { status: 400 }
      );
    }

    // Validate file extension strictly
    const rawExt = path.extname(file.name || "").toLowerCase();
    const ext = ALLOWED_EXTENSIONS.has(rawExt) ? rawExt : ".jpg";

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const mime = file.type || "image/jpeg";
    const dataUrl = `data:${mime};base64,${buffer.toString("base64")}`;

    // Guarantee persistence on serverless Vercel: use dataUrl in production, local file in dev
    let fileUrl = dataUrl;
    let filename = `receipt_${Date.now()}_${crypto.randomUUID()}${ext}`;

    try {
      const uploadDir = path.join(process.cwd(), "public", "uploads", "receipts");
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      const filePath = path.join(uploadDir, filename);
      fs.writeFileSync(filePath, buffer);
      if (process.env.NODE_ENV !== "production") {
        fileUrl = `/uploads/receipts/${filename}`;
      }
    } catch (fsErr) {
      // Ephemeral or read-only container: persistent dataUrl ensures receipt is never lost
      fileUrl = dataUrl;
    }

    return NextResponse.json({
      success: true,
      url: fileUrl,
      filename,
    });
  } catch (error: any) {
    console.error("Receipt upload error:", error);
    return NextResponse.json(
      { error: "Failed to process receipt upload. Please try again." },
      { status: 500 }
    );
  }
}
