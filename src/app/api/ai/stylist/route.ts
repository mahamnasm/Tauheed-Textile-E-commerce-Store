import { NextRequest, NextResponse } from "next/server";
import { generateStylistResponse } from "@/lib/ai";
import { prisma } from "@/lib/prisma";
import { getClientIp, checkRateLimit, rateLimitResponse } from "@/lib/rateLimit";
import { internalError, jsonError, firstZodMessage } from "@/lib/http";
import { z } from "zod";

const stylistRequestSchema = z.object({
  query: z.string().min(2, "Please ask a styling question.").max(500, "Query is too long (max 500 characters).").trim().optional(),
  message: z.string().min(2).max(500).trim().optional(),
  history: z.array(z.object({
    role: z.enum(["user", "assistant"]),
    content: z.string().max(1000),
  })).max(10).optional().default([]),
}).refine((data) => Boolean(data.query || data.message), {
  message: "Query message is required.",
  path: ["query"],
});

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const rate = checkRateLimit(`stylist_${ip}`, 15, 15 * 60 * 1000);
  if (!rate.success) {
    return rateLimitResponse(rate.resetTime, "Too many styling requests. Please wait a few minutes.");
  }

  try {
    const body = await req.json();
    const validation = stylistRequestSchema.safeParse(body);
    if (!validation.success) {
      return jsonError(firstZodMessage(validation.error) || "Invalid styling request.", 400);
    }

    const { query, message, history } = validation.data;
    const finalQuery = (query || message || "").trim();

    const aiResult = await generateStylistResponse(finalQuery, history);

    // Fetch full product models for recommended IDs
    let products: unknown[] = [];
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
  } catch (error: unknown) {
    return internalError("AI Stylist API error:", error);
  }
}
