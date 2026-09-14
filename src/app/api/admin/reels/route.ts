import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAdminSessionToken, ADMIN_COOKIE_NAME } from "@/lib/adminSession";

async function verifyAuth(request: NextRequest) {
  const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
  return await verifyAdminSessionToken(token);
}

// GET: List all runway reels with product details
export async function GET(request: NextRequest) {
  try {
    const session = await verifyAuth(request);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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
  } catch (error: any) {
    console.error("Fetch reels error:", error);
    return NextResponse.json({ error: error.message || "Failed to load reels" }, { status: 500 });
  }
}

// POST: Add new runway reel or attach video to product
export async function POST(request: NextRequest) {
  try {
    const session = await verifyAuth(request);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, videoUrl, productId, displayOrder, isActive, attachToProduct } = body;

    if (!videoUrl || !productId) {
      return NextResponse.json(
        { error: "Video URL and Target Product are required." },
        { status: 400 }
      );
    }

    // 1. Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!existingProduct) {
      return NextResponse.json(
        { error: `Product with ID '${productId}' does not exist.` },
        { status: 404 }
      );
    }

    const product = await prisma.product.update({
      where: { id: productId },
      data: { videoUrl },
    });

    let reel = null;
    // 2. If attaching to storefront Watch & Buy reels
    if (attachToProduct !== false) {
      const order = typeof displayOrder === "number" ? displayOrder : 0;
      reel = await prisma.watchBuyVideo.create({
        data: {
          title: title || `${product.title} Runway Reel`,
          videoUrl,
          productId,
          displayOrder: order,
          isActive: isActive !== false,
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
  } catch (error: any) {
    console.error("Create reel error:", error);
    return NextResponse.json({ error: error.message || "Failed to save runway reel" }, { status: 500 });
  }
}

// DELETE: Remove runway reel
export async function DELETE(request: NextRequest) {
  try {
    const session = await verifyAuth(request);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Reel ID is required" }, { status: 400 });
    }

    await prisma.watchBuyVideo.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Runway reel deleted successfully." });
  } catch (error: any) {
    console.error("Delete reel error:", error);
    return NextResponse.json({ error: error.message || "Failed to delete reel" }, { status: 500 });
  }
}
