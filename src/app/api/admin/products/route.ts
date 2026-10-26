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
          subcategory: { select: { id: true, name: true, slug: true } },
          collection: { select: { id: true, name: true, slug: true } },
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
      subcategoryId,
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
        subcategoryId: subcategoryId || null,
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

export async function PUT(req: NextRequest) {
  return handleUpdateProduct(req);
}

export async function PATCH(req: NextRequest) {
  return handleUpdateProduct(req);
}

async function handleUpdateProduct(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return auth.response;

  try {
    const body = await req.json();
    const {
      id,
      title,
      sku,
      description,
      fabric,
      workType,
      pieceCount,
      weight,
      basePrice,
      comparePrice,
      salePrice,
      costPrice,
      categoryId,
      subcategoryId,
      collectionId,
      barcode,
      videoUrl,
      packageIncludes,
      careInstructions,
      inStock,
      isFeatured,
      isBestSeller,
      isNewArrival,
      isSale,
      isPreOrder,
      preOrderDate,
      images,
      variants,
      stockQuantity,
      initialStock,
    } = body;

    if (!id || typeof id !== "string") {
      return jsonError("Product ID is required", 400);
    }

    const currentProduct = await prisma.product.findUnique({
      where: { id },
      include: { variants: true },
    });

    if (!currentProduct) {
      return jsonError("Product not found", 404);
    }

    // Check SKU collision if SKU changed
    if (sku && typeof sku === "string") {
      const cleanSku = sku.trim().toUpperCase();
      if (cleanSku !== currentProduct.sku) {
        const existingSku = await prisma.product.findFirst({
          where: {
            sku: cleanSku,
            id: { not: id },
          },
        });
        if (existingSku) {
          return jsonError(`SKU "${cleanSku}" is already taken by another product.`, 400);
        }
      }
    }

    const updateData: Record<string, unknown> = {};
    if (title && typeof title === "string") updateData.title = title.trim();
    if (sku && typeof sku === "string") updateData.sku = sku.trim().toUpperCase();
    if (description !== undefined) updateData.description = typeof description === "string" ? description.trim() : "";
    if (fabric && typeof fabric === "string") updateData.fabric = fabric.trim();
    if (workType !== undefined) updateData.workType = typeof workType === "string" ? workType.trim() : "";
    if (pieceCount !== undefined) updateData.pieceCount = parseInt(String(pieceCount), 10) || 3;
    if (weight !== undefined) updateData.weight = parseFloat(String(weight)) || 1.0;
    if (basePrice !== undefined) updateData.basePrice = parseFloat(String(basePrice));
    if (comparePrice !== undefined) updateData.comparePrice = comparePrice ? parseFloat(String(comparePrice)) : null;
    if (salePrice !== undefined) updateData.salePrice = salePrice ? parseFloat(String(salePrice)) : null;
    if (costPrice !== undefined) updateData.costPrice = costPrice ? parseFloat(String(costPrice)) : 0;
    if (categoryId !== undefined) updateData.categoryId = categoryId || null;
    if (subcategoryId !== undefined) updateData.subcategoryId = subcategoryId || null;
    if (collectionId !== undefined) updateData.collectionId = collectionId || null;
    if (barcode !== undefined) updateData.barcode = barcode ? String(barcode).trim() : null;
    if (videoUrl !== undefined) updateData.videoUrl = videoUrl ? String(videoUrl).trim() : null;
    if (packageIncludes !== undefined) updateData.packageIncludes = packageIncludes ? String(packageIncludes).trim() : null;
    if (careInstructions !== undefined) updateData.careInstructions = careInstructions ? String(careInstructions).trim() : null;
    if (inStock !== undefined) updateData.inStock = Boolean(inStock);
    if (isFeatured !== undefined) updateData.isFeatured = Boolean(isFeatured);
    if (isBestSeller !== undefined) updateData.isBestSeller = Boolean(isBestSeller);
    if (isNewArrival !== undefined) updateData.isNewArrival = Boolean(isNewArrival);
    if (isSale !== undefined) updateData.isSale = Boolean(isSale);
    if (isPreOrder !== undefined) updateData.isPreOrder = Boolean(isPreOrder);
    if (preOrderDate !== undefined) updateData.preOrderDate = preOrderDate ? String(preOrderDate).trim() : null;

    const updated = await prisma.$transaction(async (tx) => {
      // 1. Update basic product attributes
      await tx.product.update({
        where: { id },
        data: updateData,
      });

      // 2. Synchronize multi-angle image gallery if images array is supplied
      if (Array.isArray(images)) {
        const cleanImages = images
          .map((img: unknown) => (typeof img === "string" ? img.trim() : ""))
          .filter(Boolean);

        if (cleanImages.length > 0) {
          // Replace all images in order
          await tx.productImage.deleteMany({ where: { productId: id } });
          await tx.productImage.createMany({
            data: cleanImages.map((url, idx) => ({
              productId: id,
              url,
              alt: `${updateData.title || currentProduct.title} - Angle ${idx + 1}`,
              displayOrder: idx,
            })),
          });
        }
      }

      // 3. Synchronize variants (Sizes/Colors/Prices/Stock) if provided
      if (Array.isArray(variants) && variants.length > 0) {
        const existingVariants = await tx.productVariant.findMany({ where: { productId: id } });
        const existingIds = new Set(existingVariants.map((v) => v.id));
        const incomingIds = new Set(variants.filter((v: any) => v.id).map((v: any) => v.id));

        // Delete variants that were removed by admin
        for (const ev of existingVariants) {
          if (!incomingIds.has(ev.id)) {
            try {
              await tx.productVariant.delete({ where: { id: ev.id } });
            } catch {
              // In case variant is linked to historical orders, mark stock zero
              await tx.productVariant.update({
                where: { id: ev.id },
                data: { stockQuantity: 0 },
              });
            }
          }
        }

        // Upsert variants
        for (let i = 0; i < variants.length; i++) {
          const v = variants[i];
          const vSize = v.size?.trim() || "Standard";
          const vColor = v.color?.trim() || "Default";
          const vStitched = v.stitchedType?.trim() || "Unstitched";
          const baseSku = (updateData.sku as string) || currentProduct.sku;
          const vSku = v.sku?.trim() || `${baseSku}-${vSize}-${i + 1}`.replace(/\s+/g, "").toUpperCase();
          const vStock = parseInt(String(v.stockQuantity ?? 0), 10) || 0;
          const vPriceAdj = parseFloat(String(v.priceAdjustment ?? 0)) || 0;

          if (v.id && existingIds.has(v.id)) {
            await tx.productVariant.update({
              where: { id: v.id },
              data: {
                size: vSize,
                color: vColor,
                stitchedType: vStitched,
                sku: vSku,
                priceAdjustment: vPriceAdj,
                stockQuantity: Math.max(0, vStock),
              },
            });
          } else {
            await tx.productVariant.create({
              data: {
                productId: id,
                size: vSize,
                color: vColor,
                stitchedType: vStitched,
                sku: vSku,
                priceAdjustment: vPriceAdj,
                stockQuantity: Math.max(0, vStock),
              },
            });
          }
        }
      } else if (stockQuantity !== undefined || initialStock !== undefined) {
        // Simple stock update when full variant table was not submitted
        const newStock = parseInt(String(stockQuantity ?? initialStock), 10);
        if (!isNaN(newStock)) {
          const firstVariant = currentProduct.variants[0];
          if (firstVariant) {
            await tx.productVariant.update({
              where: { id: firstVariant.id },
              data: { stockQuantity: Math.max(0, newStock) },
            });
          }
        }
      }

      // Return fully hydrated product
      return tx.product.findUnique({
        where: { id },
        include: {
          category: { select: { id: true, name: true, slug: true } },
          subcategory: { select: { id: true, name: true, slug: true } },
          collection: { select: { id: true, name: true, slug: true } },
          images: { orderBy: { displayOrder: "asc" } },
          variants: true,
        },
      });
    });

    return NextResponse.json({ success: true, product: updated });
  } catch (err: unknown) {
    return internalError("PUT/PATCH /api/admin/products error:", err);
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
