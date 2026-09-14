import { NextRequest, NextResponse } from "next/server";
import { generateProductCopy } from "@/lib/ai";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const title = body.title || "";
    const categoryName = body.categoryName || "";
    const fabricHint = body.fabricHint || "";
    const workHint = body.workHint || "";

    if (!title || typeof title !== "string") {
      return NextResponse.json({ error: "Product title is required" }, { status: 400 });
    }

    const result = await generateProductCopy({
      title,
      categoryName,
      fabricHint,
      workHint,
    });

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.error("AI Copywriter API error:", error);
    return NextResponse.json({ error: "Failed to generate product copy" }, { status: 500 });
  }
}
