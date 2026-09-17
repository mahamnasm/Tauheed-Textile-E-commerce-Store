import { NextRequest, NextResponse } from "next/server";
import { getSiteSettings, updateSiteSettings } from "@/lib/settings";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/requireAdmin";
import { internalError } from "@/lib/http";

export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return auth.response;

  try {
    const settings = await getSiteSettings();
    const videos = await prisma.watchBuyVideo.findMany({
      include: { product: true },
      orderBy: { displayOrder: "asc" },
    });
    const products = await prisma.product.findMany({
      select: { id: true, title: true, sku: true, videoUrl: true },
      orderBy: { title: "asc" },
    });

    return NextResponse.json({ settings, videos, products });
  } catch (err: unknown) {
    return internalError("GET /api/admin/layout error:", err);
  }
}

export async function POST(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return auth.response;

  try {
    const body = await req.json();
    const { settings, newVideo, deleteVideoId, updateProductVideo } = body;

    let updatedSettings = null;
    if (settings) {
      updatedSettings = await updateSiteSettings(settings);
    }

    // Add new watch & buy video reel if requested
    if (newVideo && newVideo.title && newVideo.videoUrl && newVideo.productId) {
      await prisma.watchBuyVideo.create({
        data: {
          title: newVideo.title,
          videoUrl: newVideo.videoUrl,
          productId: newVideo.productId,
          displayOrder: parseInt(newVideo.displayOrder || "0", 10),
          isActive: true,
        },
      });
    }

    // Delete video if requested
    if (deleteVideoId) {
      await prisma.watchBuyVideo.delete({
        where: { id: deleteVideoId },
      });
    }

    // Direct product video update
    if (updateProductVideo && updateProductVideo.productId) {
      await prisma.product.update({
        where: { id: updateProductVideo.productId },
        data: { videoUrl: updateProductVideo.videoUrl || null },
      });
    }

    const currentSettings = await getSiteSettings();
    const videos = await prisma.watchBuyVideo.findMany({
      include: { product: true },
      orderBy: { displayOrder: "asc" },
    });

    return NextResponse.json({
      success: true,
      settings: currentSettings,
      videos,
    });
  } catch (err: unknown) {
    return internalError("POST /api/admin/layout error:", err);
  }
}
