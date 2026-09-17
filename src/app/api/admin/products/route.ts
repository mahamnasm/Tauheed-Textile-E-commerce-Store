import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/requireAdmin";
import { internalError, jsonError } from "@/lib/http";

export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return auth.response;

  try {
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "50", 10) || 50));
    const search = searchParams.get("search")?.trim();
    const categoryId = searchParams.get("categoryId");

    const where: Record<string, unknown> = {};
    if (categoryId) where.categoryId = categoryId;
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { sku: { contains: search, mode: "insensitive" } },
        { fabric: { contains: search, mode: "insensitive" } },
      ];
    }

    const [total, products] = await Promise.all([
      prisma.product.count({ where }),
      prisma.product.findMany({
        where,
        include: {
          category: { select: { id: true, name: true, slug: true } },
          images: { orderBy: { displayOrder: "asc" } },
          variants: true,
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
    ]);

    return NextResponse.json({
      success: true,
      products,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1,
      },
    });
  } catch (err: unknown) {
    return internalError("GET /api/admin/products error:", err);
  }
}

export async function POST(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return auth.response;

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
      weight,
    } = body;

    if (!title || !sku || !basePrice || !fabric) {
      return jsonError("Title, SKU, Base Price, and Fabric are required fields.", 400);
    }

    // Process image list (supports 1 to unlimited images, e.g. 6, 8, 10+ images)
    let processedImages: string[] = [];
    if (Array.isArray(images) && images.length > 0) {
      processedImages = images.map((u: unknown) => (typeof u === "string" ? u.trim() : "")).filter(Boolean);
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
        weight: weight ? parseFloat(weight) : (parseInt(pieceCount || "3", 10) === 2 ? 0.8 : (parseInt(pieceCount || "3", 10) === 1 ? 0.5 : 1.0)),
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
  } catch (err: unknown) {
    return internalError("POST /api/admin/products error:", err);
  }
}

export async function PATCH(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return auth.response;

  try {
    const body = await req.json();
    const { id, title, basePrice, comparePrice, salePrice, inStock, isFeatured, isBestSeller, isNewArrival, isSale } = body;

    if (!id || typeof id !== "string") {
      return jsonError("Product ID is required", 400);
    }

    const updateData: Record<string, unknown> = {};
    if (title && typeof title === "string") updateData.title = title.trim();
    if (basePrice !== undefined) updateData.basePrice = parseFloat(basePrice);
    if (comparePrice !== undefined) updateData.comparePrice = comparePrice ? parseFloat(comparePrice) : null;
    if (salePrice !== undefined) updateData.salePrice = salePrice ? parseFloat(salePrice) : null;
    if (inStock !== undefined) updateData.inStock = Boolean(inStock);
    if (isFeatured !== undefined) updateData.isFeatured = Boolean(isFeatured);
    if (isBestSeller !== undefined) updateData.isBestSeller = Boolean(isBestSeller);
    if (isNewArrival !== undefined) updateData.isNewArrival = Boolean(isNewArrival);
    if (isSale !== undefined) updateData.isSale = Boolean(isSale);

    const updated = await prisma.product.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ success: true, product: updated });
  } catch (err: unknown) {
    return internalError("PATCH /api/admin/products error:", err);
  }
}

export async function DELETE(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return auth.response;

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return jsonError("Product ID is required", 400);
    }

    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Product deleted successfully" });
  } catch (err: unknown) {
    return internalError("DELETE /api/admin/products error:", err);
  }
}
