import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      title,
      sku,
      fabric,
      workType,
      pieceCount,
      basePrice,
      comparePrice,
      costPrice,
      categoryId,
      collectionId,
      barcode,
      videoUrl,
      description,
      packageIncludes,
      careInstructions,
      imageUrl,
      images,
      isNewArrival,
      isBestSeller,
      isFeatured,
      isSale,
      isPreOrder,
      preOrderDate,
      initialStock,
    } = body;

    if (!title || !sku || !basePrice || !fabric) {
      return NextResponse.json(
        { error: "Title, SKU, Base Price, and Fabric are required fields." },
        { status: 400 }
      );
    }

    // Process image list (supports 1 to unlimited images, e.g. 6, 8, 10+ images)
    let processedImages: string[] = [];
    if (Array.isArray(images) && images.length > 0) {
      processedImages = images.map((u: any) => (typeof u === "string" ? u.trim() : "")).filter(Boolean);
    }
    if (processedImages.length === 0 && imageUrl) {
      processedImages = [imageUrl.trim()];
    }
    if (processedImages.length === 0) {
      processedImages = ["/assets/hero-model.jpg"];
    }

    // Generate slug from title
    const slug = title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "") + `-${Math.floor(100 + Math.random() * 900)}`;

    const product = await prisma.product.create({
      data: {
        title,
        slug,
        sku,
        barcode: barcode || null,
        videoUrl: videoUrl || null,
        fabric,
        workType: workType || "Handcrafted Embroidery",
        pieceCount: parseInt(pieceCount || "3", 10),
        basePrice: parseFloat(basePrice),
        comparePrice: comparePrice ? parseFloat(comparePrice) : null,
        costPrice: costPrice ? parseFloat(costPrice) : 0,
        categoryId: categoryId || null,
        collectionId: collectionId || null,
        description: description || `Premium Pakistani creation by Tauheed Textile crafted in ${fabric}.`,
        packageIncludes: packageIncludes || "Complete shirt fabric, pure dupatta, and dyed trouser.",
        careInstructions: careInstructions || "Dry clean recommended. Gentle hand wash in cold water.",
        isNewArrival: Boolean(isNewArrival),
        isBestSeller: Boolean(isBestSeller),
        isFeatured: Boolean(isFeatured),
        isSale: Boolean(isSale),
        isPreOrder: Boolean(isPreOrder),
        preOrderDate: isPreOrder && preOrderDate ? preOrderDate : null,
        images: {
          create: processedImages.map((url, idx) => ({
            url,
            alt: `${title} - View ${idx + 1}`,
            displayOrder: idx,
          })),
        },
        variants: {
          create: [
            {
              sku: `${sku}-UN`,
              size: "Unstitched",
              color: "Default",
              stitchedType: "Unstitched",
              priceAdjustment: 0,
              stockQuantity: parseInt(initialStock || "25", 10),
            },
            {
              sku: `${sku}-SM`,
              size: "S",
              color: "Default",
              stitchedType: "Stitched",
              priceAdjustment: 2500,
              stockQuantity: Math.max(5, Math.floor(parseInt(initialStock || "25", 10) / 3)),
            },
            {
              sku: `${sku}-MD`,
              size: "M",
              color: "Default",
              stitchedType: "Stitched",
              priceAdjustment: 2500,
              stockQuantity: Math.max(5, Math.floor(parseInt(initialStock || "25", 10) / 3)),
            },
            {
              sku: `${sku}-LG`,
              size: "L",
              color: "Default",
              stitchedType: "Stitched",
              priceAdjustment: 2500,
              stockQuantity: Math.max(5, Math.floor(parseInt(initialStock || "25", 10) / 3)),
            },
          ],
        },
      },
    });

    return NextResponse.json({ success: true, product });
  } catch (err: any) {
    console.error("Admin Product Creation Error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to create product" },
      { status: 500 }
    );
  }
}
