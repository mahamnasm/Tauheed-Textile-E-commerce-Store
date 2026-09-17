import { NextRequest, NextResponse } from "next/server";
import { prisma, isDatabaseConfigured } from "@/lib/prisma";
import { requireAdmin } from "@/lib/requireAdmin";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return auth.response;

  if (!isDatabaseConfigured()) {
    return NextResponse.json({
      success: true,
      pendingOrdersCount: 0,
      pendingReviewsCount: 0,
      pendingBankProofsCount: 0,
      totalNotifications: 0,
      recentOrders: [],
      recentReviews: [],
      databaseConnected: false,
    });
  }

  try {
    const [pendingOrdersCount, pendingReviewsCount, pendingBankProofsCount, recentOrders, recentReviews] =
      await Promise.all([
        prisma.order.count({
          where: { orderStatus: "PENDING" },
        }),
        prisma.review.count({
          where: { isApproved: false },
        }),
        prisma.bankTransferProof.count({
          where: { status: "PENDING" },
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
      pendingBankProofsCount,
      totalNotifications: pendingOrdersCount + pendingReviewsCount + pendingBankProofsCount,
      recentOrders,
      recentReviews,
      databaseConnected: true,
    });
  } catch (error: any) {
    console.warn("Notifications route - database query bypassed or unavailable:", error?.message || error);
    return NextResponse.json({
      success: true,
      pendingOrdersCount: 0,
      pendingReviewsCount: 0,
      pendingBankProofsCount: 0,
      totalNotifications: 0,
      recentOrders: [],
      recentReviews: [],
      databaseConnected: false,
    });
  }
}

