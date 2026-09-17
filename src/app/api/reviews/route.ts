import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET: Fetch reviews
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("productId");
    const status = searchParams.get("status"); // "all", "pending", "approved", "featured"

    const whereClause: any = {};
    if (productId) {
      whereClause.productId = productId;
    }
    if (status === "approved") {
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
    });

    return NextResponse.json({ success: true, reviews });
  } catch (error: any) {
    console.error("GET /api/reviews error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}

// POST: Submit a new customer review (Supports PC & Mobile photo upload)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      productId,
      customerName,
      reviewerCity,
      rating,
      title,
      comment,
      imageUrl,
    } = body;

    if (!customerName || !comment) {
      return NextResponse.json(
        { success: false, error: "Customer name and review comment are required." },
        { status: 400 }
      );
    }

    // Resolve productId or find first fallback
    let targetProductId = productId;
    if (!targetProductId) {
      const first = await prisma.product.findFirst({ select: { id: true } });
      targetProductId = first?.id;
    }

    if (!targetProductId) {
      return NextResponse.json(
        { success: false, error: "Product not found to attach review." },
        { status: 404 }
      );
    }

    const isApprovedByAdmin = Boolean(body.isAdmin) || Boolean(body.isApproved);

    const review = await prisma.review.create({
      data: {
        productId: targetProductId,
        customerName: customerName.trim(),
        reviewerCity: reviewerCity?.trim() || null,
        rating: Math.max(1, Math.min(5, Number(rating) || 5)),
        title: title?.trim() || "Verified Buyer Review",
        comment: comment.trim(),
        imageUrl: imageUrl || null,
        isApproved: isApprovedByAdmin, // Requires admin approval before appearing on website
        isFeatured: Boolean(body.isFeatured),
      },
    });

    return NextResponse.json({
      success: true,
      message: isApprovedByAdmin
        ? "Review published successfully!"
        : "Thank you! Your review has been submitted for approval and will appear on the website shortly.",
      review,
    });
  } catch (error: any) {
    console.error("POST /api/reviews error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to submit review" },
      { status: 500 }
    );
  }
}

// PATCH: Update review (Approve/Reject, Like/Feature, Edit text)
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, isApproved, isFeatured, title, comment, rating } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Review ID is required" },
        { status: 400 }
      );
    }

    const updateData: any = {};
    if (typeof isApproved === "boolean") updateData.isApproved = isApproved;
    if (typeof isFeatured === "boolean") updateData.isFeatured = isFeatured;
    if (typeof title === "string") updateData.title = title.trim();
    if (typeof comment === "string") updateData.comment = comment.trim();
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
  } catch (error: any) {
    console.error("PATCH /api/reviews error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update review" },
      { status: 500 }
    );
  }
}

// DELETE: Remove a review
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Review ID is required" },
        { status: 400 }
      );
    }

    await prisma.review.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error: any) {
    console.error("DELETE /api/reviews error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete review" },
      { status: 500 }
    );
  }
}
