import { NextRequest, NextResponse } from "next/server";
import { generateStylistResponse } from "@/lib/ai";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const query = body.query || body.message || "";
    const history = body.history || [];

    if (!query || typeof query !== "string") {
      return NextResponse.json({ error: "Query message is required" }, { status: 400 });
    }

    const aiResult = await generateStylistResponse(query, history);

    // Fetch full product models for recommended IDs
    let products: any[] = [];
    if (aiResult.recommendedProductIds && aiResult.recommendedProductIds.length > 0) {
      products = await prisma.product.findMany({
        where: { id: { in: aiResult.recommendedProductIds } },
        include: {
          images: { take: 1, orderBy: { displayOrder: "asc" } },
          category: true,
          variants: true,
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: aiResult.message,
      recommendedProducts: products,
      stylingTips: aiResult.stylingTips || [],
      occasionMatch: aiResult.occasionMatch || "Luxury Couture",
    });
  } catch (error: any) {
    console.error("AI Stylist API error:", error);
    return NextResponse.json({ error: "Failed to generate styling advice" }, { status: 500 });
  }
}
