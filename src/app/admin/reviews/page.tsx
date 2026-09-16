import React from "react";
import { prisma } from "@/lib/prisma";
import AdminReviewsClientView from "@/components/admin/AdminReviewsClientView";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  title: "Customer Reviews Moderation | Tauheed Textile Operations",
  description: "Moderate and feature customer reviews and photos",
};

export default async function AdminReviewsPage() {
  let reviews: any[] = [];
  try {
    reviews = await prisma.review.findMany({
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
  } catch (err) {
    console.error("Failed to load reviews from DB:", err);
  }

  // Serialize dates for client view
  const serialized = reviews.map((r) => ({
    ...r,
    createdAt: r.createdAt ? new Date(r.createdAt).toISOString() : new Date().toISOString(),
  }));

  return <AdminReviewsClientView initialReviews={serialized} />;
}
