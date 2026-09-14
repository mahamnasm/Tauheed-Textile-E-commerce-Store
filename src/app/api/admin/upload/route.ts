import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const files = formData.getAll("files") as File[];
    
    // Also support single file field
    if (files.length === 0) {
      const singleFile = formData.get("file") as File | null;
      if (singleFile) files.push(singleFile);
    }

    if (files.length === 0) {
      return NextResponse.json({ error: "No files uploaded" }, { status: 400 });
    }

    const uploadDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const savedUrls: string[] = [];

    for (const file of files) {
      if (!file || typeof file.arrayBuffer !== "function") continue;
      
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Extract extension and clean base name
      const ext = path.extname(file.name || "image.jpg") || ".jpg";
      const cleanName = path.basename(file.name || "item", ext)
        .replace(/[^a-zA-Z0-9_-]/g, "_")
        .toLowerCase()
        .substring(0, 30);
      
      const filename = `img-${Date.now()}-${Math.floor(Math.random() * 1000)}-${cleanName}${ext}`;
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
    return NextResponse.json({ error: error.message || "Failed to upload image from PC" }, { status: 500 });
  }
}
