import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = (formData.get("file") || formData.get("receipt")) as File | null;

    if (!file || typeof file.arrayBuffer !== "function") {
      return NextResponse.json({ error: "No receipt file uploaded" }, { status: 400 });
    }

    // Check size limit: 12MB max
    if (file.size > 12 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Receipt image exceeds 12MB limit. Please upload a smaller photo." },
        { status: 400 }
      );
    }

    const uploadDir = path.join(process.cwd(), "public", "uploads", "receipts");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const ext = path.extname(file.name || "receipt.jpg") || ".jpg";
    const cleanName = path
      .basename(file.name || "receipt", ext)
      .replace(/[^a-zA-Z0-9_-]/g, "_")
      .toLowerCase()
      .substring(0, 25);

    const filename = `receipt-${Date.now()}-${cleanName}${ext}`;
    const filePath = path.join(uploadDir, filename);

    fs.writeFileSync(filePath, buffer);

    const publicUrl = `/uploads/receipts/${filename}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename,
    });
  } catch (error: any) {
    console.error("Receipt upload error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to upload payment receipt" },
      { status: 500 }
    );
  }
}
