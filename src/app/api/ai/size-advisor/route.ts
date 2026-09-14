import { NextRequest, NextResponse } from "next/server";
import { calculateFitRecommendation } from "@/lib/ai";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { heightFeet = 5, heightInches = 5, chestInches = 36, waistInches = 30, hipsInches = 38, fitPreference = "regular", productType = "suit" } = body;

    const result = calculateFitRecommendation({
      heightFeet: Number(heightFeet),
      heightInches: Number(heightInches),
      chestInches: Number(chestInches),
      waistInches: Number(waistInches),
      hipsInches: Number(hipsInches),
      fitPreference,
      productType,
    });

    return NextResponse.json({
      success: true,
      recommendation: result,
    });
  } catch (error: any) {
    console.error("AI Size Advisor API error:", error);
    return NextResponse.json({ error: "Failed to calculate sizing recommendation" }, { status: 500 });
  }
}
