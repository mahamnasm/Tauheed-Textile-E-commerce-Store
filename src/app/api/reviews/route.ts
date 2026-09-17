import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createReviewSchema } from "@/lib/validation";
import { getAdminSession, requireAdmin } from "@/lib/requireAdmin";
import { firstZodMessage, internalError, jsonError } from "@/lib/http";
import { getClientIp, checkRateLimit, rateLimitResponse } from "@/lib/rateLimit";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("productId");
    const status = searchParams.get("status");
    const session = await getAdminSession(req);

    const whereClause: Record<string, unknown> = {};
    if (productId) {
      whereClause.productId = productId;
    }

    if (!session) {
      whereClause.isApproved = true;
      if (!productId) {
        return jsonError("Product is required", 400);
      }
    } else if (status === "approved") {
      whereClause.isApproved = true;
    } else if (status === "pending") {
      whereClause.isApproved = false;
    } else if (status === "featured") {
      whereClause.isFeatured = true;
    }

    const reviews = await prisma.review.findMany({
      where: whereClause,
      include: {
        product: {
          select: {
            id: true,
            title: true,
            slug: true,
            images: { take: 1, select: { url: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 100,
    });

    return NextResponse.json({ success: true, reviews });
  } catch (error: unknown) {
    return internalError("GET /api/reviews error:", error);
  }
}

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const rate = checkRateLimit(`review_${ip}`, 8, 15 * 60 * 1000);
  if (!rate.success) {
    return rateLimitResponse(rate.resetTime, "Too many reviews submitted. Please wait a few minutes.");
  }

  try {
    const body = await req.json();
    const session = await getAdminSession(req);
    const validation = createReviewSchema.safeParse(body);

    if (!validation.success) {
      return jsonError(firstZodMessage(validation.error), 400);
    }

    const { productId, customerName, reviewerCity, rating, title, comment, imageUrl } = validation.data;

    const product = await prisma.product.findUnique({ where: { id: productId }, select: { id: true } });
    if (!product) {
      return jsonError("Product not found.", 404);
    }

    const review = await prisma.review.create({
      data: {
        productId,
        customerName,
        reviewerCity: reviewerCity?.trim() || null,
        rating: rating || 5,
        title: title?.trim() || "Customer Review",
        comment,
        imageUrl: imageUrl || null,
        isApproved: session ? Boolean(body.isApproved) : false,
        isFeatured: session ? Boolean(body.isFeatured) : false,
      },
    });

    return NextResponse.json({
      success: true,
      message: session && body.isApproved
        ? "Review published successfully!"
        : "Thank you! Your review has been submitted for approval.",
      review: session ? review : { id: review.id, isApproved: false },
    });
  } catch (error: unknown) {
    return internalError("POST /api/reviews error:", error);
  }
}

export async function PATCH(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return auth.response;

  try {
    const body = await req.json();
    const { id, isApproved, isFeatured, title, comment, rating } = body;

    if (!id || typeof id !== "string") {
      return jsonError("Review ID is required", 400);
    }

    const updateData: Record<string, unknown> = {};
    if (typeof isApproved === "boolean") updateData.isApproved = isApproved;
    if (typeof isFeatured === "boolean") updateData.isFeatured = isFeatured;
    if (typeof title === "string") updateData.title = title.trim().slice(0, 120);
    if (typeof comment === "string") updateData.comment = comment.trim().slice(0, 2000);
    if (typeof rating === "number") updateData.rating = Math.max(1, Math.min(5, rating));

    const updated = await prisma.review.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      message: "Review updated successfully",
      review: updated,
    });
  } catch (error: unknown) {
    return internalError("PATCH /api/reviews error:", error);
  }
}

export async function DELETE(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return auth.response;

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const deleteAll = searchParams.get("all") === "true";

    if (deleteAll) {
      const deleted = await prisma.review.deleteMany({});
      return NextResponse.json({
        success: true,
        message: `Deleted ${deleted.count} reviews successfully.`,
      });
    }

    if (!id) {
      return jsonError("Review ID is required", 400);
    }

    await prisma.review.delete({ where: { id } });
    return NextResponse.json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error: unknown) {
    return internalError("DELETE /api/reviews error:", error);
  }
}
