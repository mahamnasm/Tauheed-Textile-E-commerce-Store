import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/requireAdmin";
import { internalError, jsonError } from "@/lib/http";

function toSlug(name: string, slug?: string) {
  return (slug || name)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
    .slice(0, 100);
}

export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return auth.response;

  try {
    const collections = await prisma.collection.findMany({
      include: {
        _count: {
          select: { products: true },
        },
        products: {
          select: {
            id: true,
            title: true,
            sku: true,
            basePrice: true,
            images: {
              take: 1,
              orderBy: { displayOrder: "asc" },
            },
          },
        },
      },
      orderBy: { name: "asc" },
    });

    return NextResponse.json({ success: true, collections });
  } catch (error: unknown) {
    return internalError("GET /api/admin/collections error:", error);
  }
}

export async function POST(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return auth.response;

  try {
    const body = await req.json();
    const { name, slug, description, bannerImage, productIds, isSeasonal, isActive } = body;

    if (!name || typeof name !== "string" || !name.trim()) {
      return jsonError("Collection name is required", 400);
    }

    const generatedSlug = toSlug(name, slug);
    const existing = await prisma.collection.findUnique({ where: { slug: generatedSlug } });
    const finalSlug = existing ? `${generatedSlug}-${Math.floor(100 + Math.random() * 900)}` : generatedSlug;

    const collection = await prisma.$transaction(async (tx) => {
      const created = await tx.collection.create({
        data: {
          name: name.trim(),
          slug: finalSlug,
          description: description?.trim() || null,
          bannerImage: bannerImage?.trim() || null,
          isSeasonal: Boolean(isSeasonal),
          isActive: isActive !== undefined ? Boolean(isActive) : true,
        },
      });

      if (Array.isArray(productIds) && productIds.length > 0) {
        await tx.product.updateMany({
          where: { id: { in: productIds } },
          data: { collectionId: created.id },
        });
      }

      return tx.collection.findUnique({
        where: { id: created.id },
        include: {
          _count: { select: { products: true } },
          products: {
            select: {
              id: true,
              title: true,
              sku: true,
              basePrice: true,
              images: { take: 1, orderBy: { displayOrder: "asc" } },
            },
          },
        },
      });
    });

    return NextResponse.json({ success: true, collection });
  } catch (error: unknown) {
    return internalError("POST /api/admin/collections error:", error);
  }
}

export async function PUT(req: NextRequest) {
  return handleUpdateCollection(req);
}

export async function PATCH(req: NextRequest) {
  return handleUpdateCollection(req);
}

async function handleUpdateCollection(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return auth.response;

  try {
    const body = await req.json();
    const { id, name, slug, description, bannerImage, productIds, isSeasonal, isActive } = body;

    if (!id || typeof id !== "string") {
      return jsonError("Collection ID is required", 400);
    }

    const existing = await prisma.collection.findUnique({ where: { id } });
    if (!existing) {
      return jsonError("Collection not found", 404);
    }

    const updateData: Record<string, unknown> = {};
    if (name && typeof name === "string") {
      updateData.name = name.trim();
    }
    if (slug) {
      updateData.slug = toSlug(name || existing.name, slug);
    }
    if (description !== undefined) {
      updateData.description = description ? description.trim() : null;
    }
    if (bannerImage !== undefined) {
      updateData.bannerImage = bannerImage ? bannerImage.trim() : null;
    }
    if (isSeasonal !== undefined) {
      updateData.isSeasonal = Boolean(isSeasonal);
    }
    if (isActive !== undefined) {
      updateData.isActive = Boolean(isActive);
    }

    const updated = await prisma.$transaction(async (tx) => {
      await tx.collection.update({
        where: { id },
        data: updateData,
      });

      // Synchronize assigned products if productIds array is provided
      if (Array.isArray(productIds)) {
        // 1. Remove collectionId from any product currently in this collection that is NOT in productIds
        await tx.product.updateMany({
          where: {
            collectionId: id,
            id: { notIn: productIds },
          },
          data: { collectionId: null },
        });

        // 2. Assign this collectionId to all selected productIds
        if (productIds.length > 0) {
          await tx.product.updateMany({
            where: { id: { in: productIds } },
            data: { collectionId: id },
          });
        }
      }

      return tx.collection.findUnique({
        where: { id },
        include: {
          _count: { select: { products: true } },
          products: {
            select: {
              id: true,
              title: true,
              sku: true,
              basePrice: true,
              images: { take: 1, orderBy: { displayOrder: "asc" } },
            },
          },
        },
      });
    });

    return NextResponse.json({ success: true, collection: updated });
  } catch (error: unknown) {
    return internalError("PUT/PATCH /api/admin/collections error:", error);
  }
}

export async function DELETE(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return auth.response;

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return jsonError("Collection ID is required", 400);
    }

    await prisma.$transaction(async (tx) => {
      // Unlink products before deleting collection
      await tx.product.updateMany({
        where: { collectionId: id },
        data: { collectionId: null },
      });

      await tx.collection.delete({
        where: { id },
      });
    });

    return NextResponse.json({ success: true, message: "Collection deleted successfully" });
  } catch (error: unknown) {
    return internalError("DELETE /api/admin/collections error:", error);
  }
}
