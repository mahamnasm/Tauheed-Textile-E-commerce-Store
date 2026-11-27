import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/requireAdmin";
import { internalError, jsonError } from "@/lib/http";
import { generateProductSeoAeo } from "@/lib/seoAeo";

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
      runwayReelUrl,
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
      slug,
      metaTitle,
      metaDesc,
      searchTags,
      dimensions,
      lowStockThreshold,
      status,
      isLimitedEdition,
      modelSpecs,
      crossSellIds,
    } = body;

    if (!title || !fabric) {
      return jsonError("Title and Fabric are required fields.", 400);
    }

    // Auto-generate Article SKU if omitted
    const cleanSku =
      typeof sku === "string" && sku.trim()
        ? sku.trim().toUpperCase()
        : `TT-${Date.now().toString().slice(-4)}-${Math.floor(100 + Math.random() * 900)}`;

    const parsedBasePrice =
      basePrice !== undefined && basePrice !== null && String(basePrice).trim() !== ""
        ? parseFloat(String(basePrice))
        : 0;
    const safeBasePrice = Number.isFinite(parsedBasePrice) && parsedBasePrice >= 0 ? parsedBasePrice : 0;

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

    // Determine slug (custom slug if provided, else generated from title)
    let finalSlug: string;
    if (slug && typeof slug === "string" && slug.trim()) {
      finalSlug = slug
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_-]+/g, "-")
        .replace(/^-+|-+$/g, "");
      const existing = await prisma.product.findUnique({ where: { slug: finalSlug } });
      if (existing) {
        finalSlug = `${finalSlug}-${Math.floor(100 + Math.random() * 900)}`;
      }
    } else {
      finalSlug = title
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_-]+/g, "-")
        .replace(/^-+|-+$/g, "") + `-${Math.floor(100 + Math.random() * 900)}`;
    }

    // Auto-generate SEO & AEO metadata if omitted
    const categoryRecord = categoryId
      ? await prisma.category.findUnique({ where: { id: categoryId }, select: { name: true } })
      : null;
    const subcategoryRecord = subcategoryId
      ? await prisma.subcategory.findUnique({ where: { id: subcategoryId }, select: { name: true } })
      : null;
    const autoSeo = generateProductSeoAeo({
      title,
      fabric,
      categoryName: categoryRecord?.name,
      subcategoryName: subcategoryRecord?.name,
      pieceCount,
      basePrice: safeBasePrice,
    });

    const product = await prisma.product.create({
      data: {
        title,
        slug: finalSlug,
        sku: cleanSku,
        barcode: barcode || null,
        videoUrl: (runwayReelUrl || videoUrl || null) ? String(runwayReelUrl || videoUrl).trim() : null,
        runwayReelUrl: (runwayReelUrl || videoUrl || null) ? String(runwayReelUrl || videoUrl).trim() : null,
        fabric,
        workType: workType || "Signature Craft",
        pieceCount: parseInt(pieceCount || "3", 10),
        weight: weight ? parseFloat(weight) : (parseInt(pieceCount || "3", 10) === 2 ? 0.8 : (parseInt(pieceCount || "3", 10) === 1 ? 0.5 : 1.0)),
        basePrice: safeBasePrice,
        comparePrice: comparePrice ? parseFloat(comparePrice) : null,
        costPrice: costPrice ? parseFloat(costPrice) : 0,
        categoryId: categoryId || null,
        subcategoryId: subcategoryId || null,
        collectionId: collectionId || null,
        description: (description && String(description).trim()) ? String(description).trim() : autoSeo.description,
        packageIncludes: packageIncludes || "Complete shirt fabric, pure dupatta, and dyed trouser.",
        careInstructions: careInstructions || "Dry clean recommended. Gentle hand wash in cold water.",
        metaTitle: (metaTitle && String(metaTitle).trim()) ? String(metaTitle).trim() : autoSeo.metaTitle,
        metaDesc: (metaDesc && String(metaDesc).trim()) ? String(metaDesc).trim() : autoSeo.metaDesc,
        searchTags: Array.isArray(searchTags) ? searchTags.join(", ") : ((searchTags && String(searchTags).trim()) ? String(searchTags).trim() : autoSeo.searchTags),
        dimensions: dimensions ? String(dimensions).trim() : null,
        lowStockThreshold: lowStockThreshold !== undefined ? parseInt(String(lowStockThreshold), 10) || 5 : 5,
        status: status ? String(status).trim().toUpperCase() : "ACTIVE",
        isLimitedEdition: Boolean(isLimitedEdition),
        modelSpecs: modelSpecs ? String(modelSpecs).trim() : null,
        crossSellIds: Array.isArray(crossSellIds) ? crossSellIds.join(", ") : (crossSellIds ? String(crossSellIds).trim() : null),
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
              sku: `${cleanSku}-UN`,
              size: "Unstitched",
              color: "Default",
              stitchedType: "Unstitched",
              priceAdjustment: 0,
              stockQuantity: parseInt(initialStock || "25", 10),
            },
            {
              sku: `${cleanSku}-SM`,
              size: "S",
              color: "Default",
              stitchedType: "Stitched",
              priceAdjustment: 2500,
              stockQuantity: Math.max(5, Math.floor(parseInt(initialStock || "25", 10) / 3)),
            },
            {
              sku: `${cleanSku}-MD`,
              size: "M",
              color: "Default",
              stitchedType: "Stitched",
              priceAdjustment: 2500,
              stockQuantity: Math.max(5, Math.floor(parseInt(initialStock || "25", 10) / 3)),
            },
            {
              sku: `${cleanSku}-LG`,
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
      runwayReelUrl,
      packageIncludes,
      careInstructions,
      inStock,
      isFeatured,
      isBestSeller,
      isNewArrival,
      isSale,
      isPreOrder,
      preOrderDate,
      slug,
      metaTitle,
      metaDesc,
      searchTags,
      dimensions,
      lowStockThreshold,
      status,
      isLimitedEdition,
      modelSpecs,
      crossSellIds,
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

    // Check Slug collision if Slug changed
    if (slug && typeof slug === "string") {
      const cleanSlug = slug
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_-]+/g, "-")
        .replace(/^-+|-+$/g, "");
      if (cleanSlug && cleanSlug !== currentProduct.slug) {
        const existingSlug = await prisma.product.findFirst({
          where: {
            slug: cleanSlug,
            id: { not: id },
          },
        });
        if (existingSlug) {
          return jsonError(`Slug "${cleanSlug}" is already taken by another product.`, 400);
        }
        updateData.slug = cleanSlug;
      }
    }
    if (title && typeof title === "string") updateData.title = title.trim();
    if (sku && typeof sku === "string") updateData.sku = sku.trim().toUpperCase();
    if (description !== undefined) updateData.description = typeof description === "string" ? description.trim() : "";
    if (fabric && typeof fabric === "string") updateData.fabric = fabric.trim();
    if (workType !== undefined) updateData.workType = typeof workType === "string" ? workType.trim() : "";
    if (pieceCount !== undefined) updateData.pieceCount = parseInt(String(pieceCount), 10) || 3;
    if (weight !== undefined) updateData.weight = parseFloat(String(weight)) || 1.0;
    if (basePrice !== undefined) {
      const parsedEditPrice = String(basePrice).trim() === "" ? 0 : parseFloat(String(basePrice));
      updateData.basePrice = Number.isFinite(parsedEditPrice) && parsedEditPrice >= 0 ? parsedEditPrice : 0;
    }
    if (comparePrice !== undefined) updateData.comparePrice = comparePrice ? parseFloat(String(comparePrice)) : null;
    if (salePrice !== undefined) updateData.salePrice = salePrice ? parseFloat(String(salePrice)) : null;
    if (costPrice !== undefined) updateData.costPrice = costPrice ? parseFloat(String(costPrice)) : 0;
    if (categoryId !== undefined) updateData.categoryId = categoryId || null;
    if (subcategoryId !== undefined) updateData.subcategoryId = subcategoryId || null;
    if (collectionId !== undefined) updateData.collectionId = collectionId || null;
    if (barcode !== undefined) updateData.barcode = barcode ? String(barcode).trim() : null;
    if (runwayReelUrl !== undefined || videoUrl !== undefined) {
      const v = runwayReelUrl !== undefined ? runwayReelUrl : videoUrl;
      const cleanV = v ? String(v).trim() : null;
      updateData.videoUrl = cleanV;
      updateData.runwayReelUrl = cleanV;
    }
    if (packageIncludes !== undefined) updateData.packageIncludes = packageIncludes ? String(packageIncludes).trim() : null;
    if (careInstructions !== undefined) updateData.careInstructions = careInstructions ? String(careInstructions).trim() : null;
    if (metaTitle !== undefined) updateData.metaTitle = metaTitle ? String(metaTitle).trim() : null;
    if (metaDesc !== undefined) updateData.metaDesc = metaDesc ? String(metaDesc).trim() : null;
    if (searchTags !== undefined) {
      updateData.searchTags = Array.isArray(searchTags) ? searchTags.join(", ") : (searchTags ? String(searchTags).trim() : null);
    }
    if (dimensions !== undefined) updateData.dimensions = dimensions ? String(dimensions).trim() : null;
    if (lowStockThreshold !== undefined) updateData.lowStockThreshold = parseInt(String(lowStockThreshold), 10) || 5;
    if (status !== undefined) updateData.status = String(status).trim().toUpperCase() || "ACTIVE";
    if (isLimitedEdition !== undefined) updateData.isLimitedEdition = Boolean(isLimitedEdition);
    if (modelSpecs !== undefined) updateData.modelSpecs = modelSpecs ? String(modelSpecs).trim() : null;
    if (crossSellIds !== undefined) {
      updateData.crossSellIds = Array.isArray(crossSellIds) ? crossSellIds.join(", ") : (crossSellIds ? String(crossSellIds).trim() : null);
    }
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
