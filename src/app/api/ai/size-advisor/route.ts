import { NextRequest, NextResponse } from "next/server";
import { calculateFitRecommendation } from "@/lib/ai";
import { getClientIp, checkRateLimit, rateLimitResponse } from "@/lib/rateLimit";
import { internalError, jsonError, firstZodMessage } from "@/lib/http";
import { z } from "zod";

const sizeAdvisorSchema = z.object({
  heightFeet: z.coerce.number().min(3).max(7).default(5),
  heightInches: z.coerce.number().min(0).max(11).default(5),
  chestInches: z.coerce.number().min(20).max(70).default(36),
  waistInches: z.coerce.number().min(18).max(65).default(30),
  hipsInches: z.coerce.number().min(20).max(70).default(38),
  fitPreference: z
    .enum(["tailored", "regular", "modest_loose", "SLIM", "REGULAR", "LOOSE"])
    .default("regular")
    .transform((val): "tailored" | "regular" | "modest_loose" => {
      if (val === "SLIM" || val === "tailored") return "tailored";
      if (val === "LOOSE" || val === "modest_loose") return "modest_loose";
      return "regular";
    }),
  productType: z.string().max(80).default("Kameez Shalwar"),
});

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const rate = checkRateLimit(`size_${ip}`, 30, 15 * 60 * 1000);
  if (!rate.success) {
    return rateLimitResponse(rate.resetTime, "Too many sizing requests. Please wait a moment.");
  }

  try {
    const body = await req.json();
    const validation = sizeAdvisorSchema.safeParse(body);
    if (!validation.success) {
      return jsonError(firstZodMessage(validation.error) || "Invalid sizing parameters.", 400);
    }

    const { heightFeet, heightInches, chestInches, waistInches, hipsInches, fitPreference, productType } = validation.data;

    const result = calculateFitRecommendation({
      heightFeet,
      heightInches,
      chestInches,
      waistInches,
      hipsInches,
      fitPreference,
      productType,
    });

    return NextResponse.json({
      success: true,
      recommendation: result,
    });
  } catch (error: unknown) {
    return internalError("AI Size Advisor API error:", error);
  }
}
