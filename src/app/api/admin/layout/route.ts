import { NextRequest, NextResponse } from "next/server";
import { getSiteSettings, updateSiteSettings } from "@/lib/settings";
import { prisma } from "@/lib/prisma";

export async function GET() {
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
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
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
  } catch (err: any) {
    console.error("Layout API Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
