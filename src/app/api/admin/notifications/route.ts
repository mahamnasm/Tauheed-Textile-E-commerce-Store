import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const [pendingOrdersCount, pendingReviewsCount, recentOrders, recentReviews] =
      await Promise.all([
        prisma.order.count({
          where: { orderStatus: "PENDING" },
        }),
        prisma.review.count({
          where: { isApproved: false },
        }),
        prisma.order.findMany({
          where: { orderStatus: "PENDING" },
          take: 5,
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            orderNumber: true,
            customerName: true,
            total: true,
            createdAt: true,
          },
        }),
        prisma.review.findMany({
          where: { isApproved: false },
          take: 5,
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            customerName: true,
            title: true,
            rating: true,
            createdAt: true,
          },
        }),
      ]);

    return NextResponse.json({
      success: true,
      pendingOrdersCount,
      pendingReviewsCount,
      totalNotifications: pendingOrdersCount + pendingReviewsCount,
      recentOrders,
      recentReviews,
    });
  } catch (error: any) {
    console.error("GET /api/admin/notifications error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch notifications" },
      { status: 500 }
    );
  }
}
