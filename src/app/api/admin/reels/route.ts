import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { parseVideoUrl } from "@/lib/videoUtils";
import { requireAdmin } from "@/lib/requireAdmin";
import { internalError, jsonError } from "@/lib/http";

// GET: List all runway reels with product details
export async function GET(request: NextRequest) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;

  try {
    const reels = await prisma.watchBuyVideo.findMany({
      orderBy: { displayOrder: "asc" },
      include: {
        product: {
          select: {
            id: true,
            title: true,
            slug: true,
            fabric: true,
            basePrice: true,
            images: { take: 1, select: { url: true } },
          },
        },
      },
    });

    const products = await prisma.product.findMany({
      orderBy: { title: "asc" },
      select: {
        id: true,
        title: true,
        slug: true,
        fabric: true,
        basePrice: true,
        videoUrl: true,
        images: { take: 1, select: { url: true } },
      },
    });

    return NextResponse.json({ success: true, reels, products });
  } catch (error: unknown) {
    return internalError("Fetch reels error:", error);
  }
}

// POST: Add new runway reel or attach video to product
export async function POST(request: NextRequest) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;

  try {
    const body = await request.json();
    const { title, videoUrl, productId, displayOrder, makeReel = true } = body;

    if (!videoUrl || !productId) {
      return jsonError("Video URL and Associated Product are required.", 400);
    }

    const videoInfo = parseVideoUrl(videoUrl);
    if (!videoInfo.rawUrl || !videoInfo.isEmbeddable) {
      return jsonError("Invalid video URL. Please provide a valid direct MP4, YouTube, or Instagram video link.", 400);
    }

    const product = await prisma.product.update({
      where: { id: productId },
      data: { videoUrl: videoUrl.trim() },
      include: { images: { take: 1 } },
    });

    let reel = null;
    if (makeReel) {
      reel = await prisma.watchBuyVideo.create({
        data: {
          title: title ? title.trim() : `${product.title} - Runway Reel`,
          videoUrl: videoUrl.trim(),
          productId: product.id,
          displayOrder: displayOrder ? parseInt(displayOrder, 10) : 0,
          isActive: true,
        },
        include: {
          product: {
            select: {
              id: true,
              title: true,
              slug: true,
              fabric: true,
              basePrice: true,
              images: { take: 1, select: { url: true } },
            },
          },
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: "Runway video successfully attached to product and storefront reels!",
      product,
      reel,
    });
  } catch (error: unknown) {
    return internalError("Create reel error:", error);
  }
}

// DELETE: Remove runway reel
export async function DELETE(request: NextRequest) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return jsonError("Reel ID is required", 400);
    }

    const existing = await prisma.watchBuyVideo.findUnique({ where: { id } });
    if (!existing) {
      return jsonError("Reel not found", 404);
    }

    await prisma.watchBuyVideo.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Runway reel deleted successfully." });
  } catch (error: unknown) {
    return internalError("Delete reel error:", error);
  }
}
