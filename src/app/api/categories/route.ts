import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/requireAdmin";
import { categoryMutationSchema } from "@/lib/validation";
import { firstZodMessage, internalError, jsonError } from "@/lib/http";

function toSlug(name: string, slug?: string) {
  return (slug || name)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
    .slice(0, 100);
}

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        subcategories: true,
        _count: {
          select: { products: true },
        },
      },
      orderBy: { name: "asc" },
    });

    return NextResponse.json({ success: true, categories });
  } catch (error: unknown) {
    return internalError("GET /api/categories error:", error);
  }
}

export async function POST(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return auth.response;

  try {
    const body = await req.json();
    const parsed = categoryMutationSchema.safeParse(body);
    if (!parsed.success) {
      return jsonError(firstZodMessage(parsed.error), 400);
    }

    const { type, name, slug, description, image, categoryId } = parsed.data;
    const generatedSlug = toSlug(name, slug);

    if (type === "subcategory") {
      if (!categoryId) {
        return jsonError("Parent category ID is required for subcategory", 400);
      }

      const sub = await prisma.subcategory.create({
        data: {
          name: name.trim(),
          slug: generatedSlug,
          categoryId,
        },
      });

      return NextResponse.json({ success: true, subcategory: sub });
    }

    const cat = await prisma.category.create({
      data: {
        name: name.trim(),
        slug: generatedSlug,
        description: description || null,
        image: image || "/assets/banners/banner-lawn.jpg",
      },
    });

    return NextResponse.json({ success: true, category: cat });
  } catch (error: unknown) {
    return internalError("POST /api/categories error:", error);
  }
}

export async function PATCH(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return auth.response;

  try {
    const body = await req.json();
    const parsed = categoryMutationSchema.safeParse(body);
    if (!parsed.success || !parsed.data.id) {
      return jsonError("ID and name are required", 400);
    }

    const { type, id, name, slug, description, image } = parsed.data;

    if (type === "subcategory") {
      const updatedSub = await prisma.subcategory.update({
        where: { id },
        data: {
          name: name.trim(),
          ...(slug ? { slug: toSlug(name, slug) } : {}),
        },
      });
      return NextResponse.json({ success: true, subcategory: updatedSub });
    }

    const updatedCat = await prisma.category.update({
      where: { id },
      data: {
        name: name.trim(),
        ...(slug ? { slug: toSlug(name, slug) } : {}),
        ...(description !== undefined ? { description } : {}),
        ...(image ? { image } : {}),
      },
    });

    return NextResponse.json({ success: true, category: updatedCat });
  } catch (error: unknown) {
    return internalError("PATCH /api/categories error:", error);
  }
}

export async function DELETE(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return auth.response;

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const type = searchParams.get("type");

    if (!id) {
      return jsonError("ID is required", 400);
    }

    if (type === "subcategory") {
      const subProductCount = await prisma.product.count({ where: { subcategoryId: id } });
      if (subProductCount > 0) {
        return jsonError(
          `Cannot delete this subcategory because ${subProductCount} active product(s) are assigned to it.`,
          400
        );
      }
      await prisma.subcategory.delete({ where: { id } });
      return NextResponse.json({ success: true, message: "Subcategory deleted" });
    }

    const productCount = await prisma.product.count({ where: { categoryId: id } });
    if (productCount > 0) {
      return jsonError(
        `Cannot delete this category because ${productCount} active product(s) are assigned to it. Please reassign or delete the products first.`,
        400
      );
    }

    await prisma.subcategory.deleteMany({ where: { categoryId: id } });
    await prisma.category.delete({ where: { id } });

    return NextResponse.json({ success: true, message: "Category deleted" });
  } catch (error: unknown) {
    return internalError("DELETE /api/categories error:", error);
  }
}
